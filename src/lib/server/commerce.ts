import { createHash } from 'node:crypto';
import { admin, ApiError, serverReady, siteURL, rateLimit } from './admin';
import { checkoutPaymentMethods } from '../payment-methods';
import { getStripe } from '../stripe';
import { bookingSchema, checkoutSchema, offerSchema, datesForStay } from '../commerce/model';
import type { DecodedIdToken } from 'firebase-admin/auth';
export function commerceReady() { return process.env.SSB_COMMERCE_ENABLED === 'true' && serverReady() && !!process.env.STRIPE_SECRET_KEY && !!process.env.STRIPE_WEBHOOK_SECRET && !!process.env.SSB_SITE_URL; }
export function requireCommerce() {
  if (!commerceReady()) throw new ApiError(503, 'Echte Buchungen sind noch nicht freigeschaltet. Du kannst die Demo ausprobieren.');
  if (/^[sr]k_live_/.test(process.env.STRIPE_SECRET_KEY!) && process.env.SSB_LIVE_PAYMENTS_APPROVED !== 'true') throw new ApiError(503, 'Live-Zahlungen sind noch nicht freigegeben.');
}
export function configuredPaymentMethods() {
  try { return checkoutPaymentMethods(process.env.SSB_STRIPE_PAYMENT_METHODS); }
  catch { throw new ApiError(503, 'Die Zahlungsmethoden werden gerade eingerichtet. Bitte versuche es später erneut.'); }
}
export async function createCheckout(user: DecodedIdToken, body: unknown) {
  requireCommerce(); const parsed = checkoutSchema.safeParse(body); if (!parsed.success) throw new ApiError(400,'Ungültige Auswahl.');
  const input = parsed.data; const db = admin().db; const stripe = getStripe();
  const bookingId = createHash('sha256').update(`${user.uid}:${input.requestId}`).digest('hex');
  const ref = db.collection('commerceBookings').doc(bookingId);
  // Repeated request IDs re-use the same reservation and Stripe idempotency key.
  await db.runTransaction(async tx => {
    const existing = await tx.get(ref);
    if (existing.exists) {
      const data = bookingSchema.parse(existing.data());
      if (data.userId !== user.uid || data.offerId !== input.offerId || data.slotId !== input.slotId || data.offer.termsVersion !== input.acceptedTermsVersion) throw new ApiError(409,'Diese Anfrage-ID gehört zu einer anderen Auswahl.');
      return;
    }
    const paymentMethods = configuredPaymentMethods();
    const offerRef = db.collection('commerceOffers').doc(input.offerId); const slotRef = db.collection('commerceSlots').doc(input.slotId);
    const [offerDoc, slotDoc] = await Promise.all([tx.get(offerRef),tx.get(slotRef)]);
    const validated = offerSchema.safeParse(offerDoc.data()); const slot = slotDoc.data();
    if (!validated.success || !slot || slot.offerId !== input.offerId || slot.available !== true || slot.bookingId || typeof slot.arrival !== 'string' || typeof slot.departure !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(slot.arrival) || !/^\d{4}-\d{2}-\d{2}$/.test(slot.departure) || slot.arrival < new Date().toISOString().slice(0,10) || slot.departure < slot.arrival) throw new ApiError(409,'Dieses Angebot oder dieser Zeitraum ist nicht verfügbar.');
    if (input.acceptedTermsVersion !== validated.data.termsVersion) throw new ApiError(409,'Bitte die aktuellen Leistungsbedingungen erneut prüfen.');
    let days:string[];try{days=datesForStay(slot.arrival,slot.departure);}catch{throw new ApiError(409,'Zeitraum nicht buchbar.');}
    const calendarRefs=days.map(day=>db.collection('commerceCalendar').doc(`${validated.data.mentorId}-${day}`));
    const held=await Promise.all(calendarRefs.map(r=>tx.get(r)));
    if(held.some(d=>d.data()?.bookingId))throw new ApiError(409,'Die Begleitung ist an diesen Tagen bereits reserviert.');
    calendarRefs.forEach(r=>tx.set(r,{bookingId}));
    tx.create(ref, {paymentMethods,userId:user.uid,email:user.email!,requestId:input.requestId,offerId:input.offerId,slotId:input.slotId,offer:validated.data,arrival:slot.arrival,departure:slot.departure,status:'creating',createdAt:Date.now()});
    tx.update(slotRef,{bookingId,available:false});
  });
  const booking = bookingSchema.parse((await ref.get()).data());
  if (!['creating','checkout'].includes(booking.status)) throw new ApiError(409,'Diese Buchung wurde bereits verarbeitet.');
  if (Date.now() - booking.createdAt > 23*3600000 && !booking.sessionId) throw new ApiError(409,'Diese Reservierung muss vom Team geprüft werden. Bitte keinen zweiten Zahlungsversuch starten.');
  const session = booking.sessionId ? await stripe.checkout.sessions.retrieve(booking.sessionId) : await stripe.checkout.sessions.create({
    mode:'payment',payment_method_types:booking.paymentMethods ?? ['card'],customer_email:booking.email,
    line_items:[{price_data:{currency:'eur',unit_amount:booking.offer.amount,product_data:{name:booking.offer.title}},quantity:1}],
    metadata:{bookingId}, payment_intent_data:{metadata:{bookingId}},
    success_url:`${siteURL()}/angebote?booking=${bookingId}`,cancel_url:`${siteURL()}/angebote?booking=${bookingId}&cancelled=1`,
    expires_at:Math.floor(booking.createdAt/1000)+86400,
  },{idempotencyKey:`checkout-${bookingId}`});
  await db.runTransaction(async tx => { const current=bookingSchema.parse((await tx.get(ref)).data()); if (current.status==='creating') tx.update(ref,{sessionId:session.id,status:'checkout'}); });
  if (session.status !== 'open' || !session.url) throw new ApiError(409,'Diese Zahlungssitzung ist nicht mehr offen. Bitte den Buchungsstatus prüfen.');
  return {bookingId,url:session.url};
}
export async function requestRefund(user: DecodedIdToken, bookingId: string) {
  requireCommerce(); const db=admin().db; const ref=db.collection('commerceBookings').doc(bookingId);
  const isAdmin=(await db.collection('adminAuth').doc(user.uid).get()).data()?.role==='admin';
  if (!isAdmin) throw new ApiError(403,'Erstattungen müssen vom zuständigen Team freigegeben werden.');
  const booking=bookingSchema.parse((await ref.get()).data());
  if (!booking.paymentIntent || !['paid','refund_pending'].includes(booking.status)) throw new ApiError(409,'Diese Buchung kann aktuell nicht erstattet werden.');
  const refund=await getStripe().refunds.create({payment_intent:booking.paymentIntent,amount:booking.offer.amount,metadata:{bookingId}},{idempotencyKey:`full-refund-${bookingId}`});
  await db.runTransaction(async tx=>{const current=(await tx.get(ref)).data();if(current?.status!=='refunded')tx.update(ref,{status:'refund_pending',refundId:refund.id});});
  return {status:'refund_pending',refundId:refund.id};
}
