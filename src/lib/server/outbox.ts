import { admin } from './admin';
import { sendTransactionalEmail } from './email';
export async function deliverOutbox(id: string) {
  const ref=admin().db.collection('serviceOutbox').doc(id);
  const message=await admin().db.runTransaction(async tx=>{
    const d=(await tx.get(ref)).data(); if(!d || d.status==='accepted')return null;
    // Provider idempotency retention is finite: ambiguous old sends require review.
    if(d.firstAttempt && Date.now()-d.firstAttempt>23*3600000)return null;
    tx.update(ref,{firstAttempt:d.firstAttempt || Date.now()}); return d;
  });
  if(!message)return;
  const result=await sendTransactionalEmail({to:message.to,subject:message.subject,text:message.text,idempotencyKey:`outbox-${id}`});
  await admin().db.runTransaction(async tx=>{const current=(await tx.get(ref)).data();if(current?.status==='accepted')return;tx.update(ref,{status:result.success?'accepted':'pending',...(result.providerId?{providerId:result.providerId}:{})});});
}
