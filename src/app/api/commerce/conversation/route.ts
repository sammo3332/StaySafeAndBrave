import { NextResponse } from 'next/server';
import { z } from 'zod';
import { admin,ApiError,fail,identity,jsonBody,rateLimit } from '@/lib/server/admin';
import { deliverOutbox } from '@/lib/server/outbox';
import { bookingAccess } from '@/lib/server/booking-access';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{const u=await identity(req);const {ref}=await bookingAccess(u,new URL(req.url).searchParams.get('bookingId'));const messages=await ref.collection('messages').orderBy('createdAt','desc').limit(50).get();const appointment=(await ref.collection('private').doc('appointment').get()).data()||null;return NextResponse.json({messages:messages.docs.map(d=>({id:d.id,...d.data()})).reverse(),appointment},{headers:{'Cache-Control':'no-store'}});}catch(e){return fail(e);}}
const schema=z.object({bookingId:z.string(),action:z.enum(['message','propose','confirm']),text:z.string().trim().max(2000).default(''),date:z.string().datetime().optional(),requestId:z.string().uuid()});
export async function POST(req:Request){try{
 const u=await identity(req);await rateLimit(`conversation-${u.uid}`,40);const p=schema.safeParse(await jsonBody(req));if(!p.success)throw new ApiError(400,'Eingabe prüfen.');const d=p.data;
 const {booking,ref,role}=await bookingAccess(u,d.bookingId);if(booking.status!=='paid')throw new ApiError(409,'Diese Buchung ist nicht aktiv.');
 if(d.action==='message'&&d.text.length<1)throw new ApiError(400,'Nachricht fehlt.');if(d.action==='propose'&&(!d.date||Date.parse(d.date)<Date.now()))throw new ApiError(400,'Bitte einen zukünftigen Zeitpunkt wählen.');
 const db=admin().db;const operationRef=ref.collection('operations').doc(`${u.uid}-${d.requestId}`);const appointmentRef=ref.collection('private').doc('appointment');
 const mentorContact=(await db.collection('commerceMentorContacts').doc(booking.offer.mentorId).get()).data();const to=role==='mentor'?booking.email:mentorContact?.email;
 await db.runTransaction(async tx=>{
  const [existing,appointment,current]=await Promise.all([tx.get(operationRef),tx.get(appointmentRef),tx.get(ref)]);if(existing.exists)return;if(current.data()?.status!=='paid')throw new ApiError(409,'Buchung nicht mehr aktiv.');
  if(d.action==='message')tx.create(ref.collection('messages').doc(d.requestId),{text:d.text,role,senderId:u.uid,createdAt:Date.now()});
  if(d.action==='propose')tx.set(appointmentRef,{date:d.date,proposedBy:u.uid,status:'proposed'});
  if(d.action==='confirm'){const a=appointment.data();if(!a||a.status!=='proposed'||a.proposedBy===u.uid||Date.parse(a.date)<Date.now())throw new ApiError(409,'Kein bestätigbarer Terminvorschlag.');tx.update(appointmentRef,{status:'confirmed',confirmedBy:u.uid});}
  tx.create(operationRef,{action:d.action,createdAt:Date.now()});
  if(typeof to==='string')tx.create(db.collection('serviceOutbox').doc(`notice-${d.bookingId}-${d.requestId}`),{to,subject:'Neuigkeit zu deiner Reisebegleitung',text:`Es gibt eine neue Nachricht oder Terminaktualisierung zu Buchung ${d.bookingId}. Bitte melde dich in deinem Reisebereich an.`,status:'pending',createdAt:Date.now()});
 });if(typeof to==='string')await deliverOutbox(`notice-${d.bookingId}-${d.requestId}`).catch(()=>{});return NextResponse.json({message:'Gespeichert. Eine E-Mail-Benachrichtigung hängt vom Versandstatus ab.'});
}catch(e){return fail(e);}}
