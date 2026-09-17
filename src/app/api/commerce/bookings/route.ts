import { NextResponse } from 'next/server';
import { admin, fail, identity, jsonBody, ApiError } from '@/lib/server/admin';
import { idSchema } from '@/lib/commerce/model';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{const user=await identity(req);const docs=await admin().db.collection('commerceBookings').where('userId','==',user.uid).limit(50).get();return NextResponse.json({bookings:docs.docs.map(d=>({id:d.id,...d.data()}))},{headers:{'Cache-Control':'no-store'}});}catch(e){return fail(e);}}
export async function POST(req:Request){try{
 const user=await identity(req);const body=await jsonBody(req);const id=idSchema.safeParse(body.bookingId);
 if(!id.success||!['cancel-request','change-request'].includes(body.action)||typeof body.message!=='string'||body.message.trim().length<5||body.message.length>1000)throw new ApiError(400,'Bitte Wunsch und Buchung prüfen.');
 const db=admin().db;const ref=db.collection('commerceBookings').doc(id.data);await db.runTransaction(async tx=>{const b=(await tx.get(ref)).data();if(!b||b.userId!==user.uid)throw new ApiError(404,'Buchung nicht gefunden.');if(b.status!=='paid')throw new ApiError(409,'Nur bezahlte Buchungen können angefragt werden.');tx.update(ref,{customerRequest:{action:body.action,message:body.message.trim(),createdAt:Date.now(),status:'pending'}});});
 return NextResponse.json({message:'Dein Wunsch ist gespeichert und wird vom Team geprüft. Noch keine Änderung oder Erstattung erfolgt.'});
}catch(e){return fail(e);}}
