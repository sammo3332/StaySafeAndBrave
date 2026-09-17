import {NextResponse} from 'next/server';
import {admin,fail,identity,jsonBody,ApiError,rateLimit} from '@/lib/server/admin';
import {bookingAccess} from '@/lib/server/booking-access';
import {deliverOutbox} from '@/lib/server/outbox';
export async function POST(req:Request){try{const user=await identity(req);await rateLimit(`booking-mail-${user.uid}`,3);const d=await jsonBody(req);const {booking,role}=await bookingAccess(user,d.bookingId);if(role!=='traveler'||booking.status!=='paid')throw new ApiError(403,'Keine versendbare Bestätigung vorhanden.');await deliverOutbox(`paid-${d.bookingId}`);const out=(await admin().db.collection('serviceOutbox').doc(`paid-${d.bookingId}`).get()).data();return NextResponse.json({success:out?.status==='accepted',message:out?.status==='accepted'?'Bestätigung wurde vom Versanddienst angenommen.':'Bestätigung wartet auf den Versanddienst.'});}catch(e){return fail(e);}}
