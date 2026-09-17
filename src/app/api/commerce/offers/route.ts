import { NextResponse } from 'next/server';
import { admin, fail } from '@/lib/server/admin';
import { commerceReady, configuredPaymentMethods } from '@/lib/server/commerce';
import { offerSchema } from '@/lib/commerce/model';
export const dynamic='force-dynamic';
export async function GET(){try{
  if(!commerceReady())return NextResponse.json({enabled:false,offers:[],paymentMethods:[]});
  const paymentMethods=configuredPaymentMethods();
  const db=admin().db;const docs=await db.collection('commerceOffers').where('approved','==',true).limit(30).get();
  const slots=await db.collection('commerceSlots').where('available','==',true).limit(200).get();
  const offers=docs.docs.flatMap(doc=>{const p=offerSchema.safeParse(doc.data());if(!p.success)return[];return[{id:doc.id,...p.data,slots:slots.docs.filter(s=>s.data().offerId===doc.id && !s.data().bookingId && s.data().arrival>=new Date().toISOString().slice(0,10)).map(s=>({id:s.id,arrival:s.data().arrival,departure:s.data().departure}))}];});
  return NextResponse.json({enabled:true,offers,paymentMethods},{headers:{'Cache-Control':'no-store'}});
}catch(e){return fail(e);}}
