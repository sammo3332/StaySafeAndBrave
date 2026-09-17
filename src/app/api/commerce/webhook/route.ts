import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { admin, ApiError, fail } from '@/lib/server/admin';
import { requireCommerce } from '@/lib/server/commerce';
import { getStripe } from '@/lib/stripe';
import { bookingSchema, matchesPayment, datesForStay } from '@/lib/commerce/model';
import { deliverOutbox } from '@/lib/server/outbox';
export async function POST(req:Request){try{
 requireCommerce();const signature=req.headers.get('stripe-signature');if(!signature)throw new ApiError(400,'Signatur fehlt.');
 let event:Stripe.Event;try{event=getStripe().webhooks.constructEvent(await req.text(),signature,process.env.STRIPE_WEBHOOK_SECRET!);}catch{throw new ApiError(400,'Ungültige Signatur.');}
 if(event.livemode !== /^[sr]k_live_/.test(process.env.STRIPE_SECRET_KEY!))throw new ApiError(400,'Zahlungsumgebung stimmt nicht überein.');
 const relevant=['checkout.session.completed','checkout.session.expired','refund.created','refund.updated','refund.failed'];
 if(!relevant.includes(event.type))return NextResponse.json({received:true});
 const object=event.data.object as Stripe.Checkout.Session|Stripe.Refund;
 const bookingId=object.metadata?.bookingId;
 if(!bookingId||!/^[a-f0-9]{64}$/.test(bookingId))return NextResponse.json({received:true});
 const db=admin().db;const ref=db.collection('commerceBookings').doc(bookingId);const eventRef=db.collection('commerceEvents').doc(event.id);
 await db.runTransaction(async tx=>{
  const [seen,snapshot]=await Promise.all([tx.get(eventRef),tx.get(ref)]);if(seen.exists)return;
  if(!snapshot.exists)throw new ApiError(503,'Buchung noch nicht verfügbar.');const b=bookingSchema.parse(snapshot.data());
  const calendarRefs=datesForStay(b.arrival,b.departure).map(day=>db.collection('commerceCalendar').doc(`${b.offer.mentorId}-${day}`));
  const calendar=event.type==='checkout.session.expired'?await Promise.all(calendarRefs.map(r=>tx.get(r))):[];
  let status=b.status;
  if(event.type==='checkout.session.completed'){
   const session=object as Stripe.Checkout.Session;
   if(!b.sessionId)throw new ApiError(503,'Zahlungssitzung noch nicht zugeordnet.');
   if(!matchesPayment(b,session,bookingId))throw new ApiError(409,'Zahlung passt nicht zur Buchung.');
   if(['creating','checkout'].includes(b.status)){
    status='paid';tx.update(ref,{status,paymentIntent:typeof session.payment_intent==='string'?session.payment_intent:session.payment_intent?.id});
    tx.set(db.collection('serviceOutbox').doc(`paid-${bookingId}`),{to:b.email,subject:'Deine Buchung bei Stay Safe & Brave',text:`Deine Zahlung wurde bestätigt.\n${b.offer.title}\n${b.arrival} bis ${b.departure}\nBuchungsnummer: ${bookingId}`,status:'pending',createdAt:Date.now()});
   }
  }else if(event.type==='checkout.session.expired'){
   if(object.id!==b.sessionId)throw new ApiError(409,'Unbekannte Sitzung.');
   if(b.status==='checkout') { status='expired';tx.update(ref,{status});tx.update(db.collection('commerceSlots').doc(b.slotId),{available:true,bookingId:null});calendar.forEach((doc,i)=>{if(doc.data()?.bookingId===bookingId)tx.set(calendarRefs[i],{bookingId:null});}); }
  }else{
   const refund=object as Stripe.Refund;
   if(refund.status==='failed' && !b.refundId)throw new ApiError(503,'Erstattung noch nicht zugeordnet.');
   if(refund.status==='failed' && b.refundId===refund.id && b.status==='refund_pending')tx.update(ref,{status:'refund_failed'});
   if(refund.status==='succeeded'){
    const pi=typeof refund.payment_intent==='string'?refund.payment_intent:refund.payment_intent?.id;
    if(pi!==b.paymentIntent||refund.amount!==b.offer.amount||refund.currency!==b.offer.currency)throw new ApiError(409,'Erstattung passt nicht zur Buchung.');
    if(b.status!=='refunded'){status='refunded';tx.update(ref,{status,refundId:refund.id});tx.set(db.collection('serviceOutbox').doc(`refunded-${bookingId}`),{to:b.email,subject:'Erstattung deiner Buchung',text:`Die vollständige Erstattung für Buchung ${bookingId} wurde vom Zahlungsdienst bestätigt. Bis zur Gutschrift kann weitere Zeit vergehen.`,status:'pending',createdAt:Date.now()});}
   }
  }
  tx.create(eventRef,{bookingId,type:event.type,createdAt:Date.now()});
 });
 // Retry-safe provider dispatch; a failure leaves the durable outbox pending for operations.
 await deliverOutbox(`paid-${bookingId}`).catch(()=>{});await deliverOutbox(`refunded-${bookingId}`).catch(()=>{});
 return NextResponse.json({received:true});
}catch(e){return fail(e);}}
