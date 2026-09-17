import {NextResponse} from 'next/server';
import {admin,ApiError,fail,identity} from '@/lib/server/admin';
export const dynamic='force-dynamic';
export async function GET(req:Request){try{const u=await identity(req);const db=admin().db;const mapping=(await db.collection('mentorAuth').doc(u.uid).get()).data();if(!mapping?.mentorId)throw new ApiError(403,'Kein Mentor-Zugang.');const docs=await db.collection('commerceBookings').where('offer.mentorId','==',mapping.mentorId).limit(50).get();return NextResponse.json({bookings:docs.docs.map(d=>({id:d.id,title:d.data().offer.title,arrival:d.data().arrival,departure:d.data().departure,status:d.data().status}))},{headers:{'Cache-Control':'no-store'}});}catch(e){return fail(e);}}
