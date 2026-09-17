import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash, timingSafeEqual } from 'node:crypto';
import { admin, ApiError, fail, jsonBody } from '@/lib/server/admin';
import { serverReady } from '@/lib/server/admin';
const schema=z.object({id:z.string().regex(/^[a-f0-9]{64}$/),token:z.string().regex(/^[a-f0-9]{64}$/),action:z.enum(['confirm','unsubscribe'])});
export async function POST(req:Request){try{
 if(!serverReady()||process.env.SSB_ENGAGEMENT_ENABLED!=='true')throw new ApiError(503,'Newsletter noch nicht freigeschaltet.');
 const parsed=schema.safeParse(await jsonBody(req));if(!parsed.success)throw new ApiError(400,'Ungültiger Link.');const {id,token,action}=parsed.data;
 const db=admin().db;const ref=db.collection('newsletterSubscriptions').doc(id);
 await db.runTransaction(async tx=>{
  const data=(await tx.get(ref)).data();const hash=createHash('sha256').update(token).digest('hex');
  const expected=action==='confirm'?data?.tokenHash:data?.unsubscribeHash;
  if(!data||typeof expected!=='string'||expected.length!==64||!timingSafeEqual(Buffer.from(hash),Buffer.from(expected))||(action==='confirm'&&data.expiresAt<Date.now()))throw new ApiError(400,'Dieser Link ist ungültig oder abgelaufen.');
  if(action==='confirm') { if(data.status==='unsubscribed')throw new ApiError(409,'Bitte die Anmeldung erneut anfordern.'); tx.update(ref,{status:'subscribed',confirmedAt:data.confirmedAt||Date.now(),unsubscribeHash:hash}); }
  else tx.update(ref,{status:'unsubscribed',unsubscribedAt:Date.now(),tokenHash:null});
 });
 return NextResponse.json({message:action==='confirm'?'Deine Newsletter-Anmeldung ist bestätigt.':'Du bist vom Newsletter abgemeldet.'});
}catch(e){return fail(e);}}
