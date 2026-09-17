import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createHash, randomBytes } from 'node:crypto';
import { admin, ApiError, fail, jsonBody, siteURL } from '@/lib/server/admin';
import { checkPublicForm, emailKey, engagementReady } from '@/lib/server/engagement';
import { sendTransactionalEmail } from '@/lib/server/email';
const schema=z.object({kind:z.enum(['mentor','newsletter']),email:z.string().trim().email().max(254),name:z.string().trim().max(100).default(''),city:z.string().trim().max(100).default(''),languages:z.string().trim().max(200).default(''),message:z.string().trim().max(2000).default(''),consent:z.literal(true),token:z.string().max(2048),website:z.string().max(0).default('')});
export const dynamic='force-dynamic';
export async function GET(){return NextResponse.json({enabled:engagementReady()});}
export async function POST(req:Request){try{
 const input=schema.safeParse(await jsonBody(req));if(!input.success)throw new ApiError(400,'Bitte Eingaben und Zustimmung prüfen.');const d=input.data;
 if(d.kind==='mentor'&&(d.name.length<2||d.city.length<2||d.languages.length<2||d.message.length<20))throw new ApiError(400,'Bitte Name, Stadt, Sprachen und eine kurze Vorstellung ergänzen.');
 await checkPublicForm(d.token,d.email);const db=admin().db;const key=emailKey(d.email);
 if(d.kind==='mentor'){
   const ref=db.collection('mentorApplications').doc(key);await db.runTransaction(async tx=>{const previous=(await tx.get(ref)).data();if(previous?.status==='approved')throw new ApiError(409,'Für diese Adresse liegt bereits eine freigegebene Bewerbung vor.');tx.set(ref,{email:d.email,name:d.name,city:d.city,languages:d.languages,message:d.message,status:'pending',consentVersion:'mentor-2026-09',createdAt:previous?.createdAt||Date.now(),updatedAt:Date.now()});});
   return NextResponse.json({message:'Deine Bewerbung wurde gespeichert. Sie wird vom Team geprüft; ein öffentliches Profil wurde noch nicht erstellt.'});
 }
 const ref=db.collection('newsletterSubscriptions').doc(key);const existing=(await ref.get()).data();
 if(existing?.status==='subscribed')return NextResponse.json({message:'Falls eine Bestätigung erforderlich ist, erhältst du eine E-Mail. Bitte prüfe dein Postfach.'});
 const token=randomBytes(32).toString('hex');const hash=createHash('sha256').update(token).digest('hex');
 await ref.set({email:d.email,status:'pending',tokenHash:hash,expiresAt:Date.now()+48*3600000,requestedAt:Date.now(),consentVersion:'newsletter-2026-09'});
 const url=`${siteURL()}/newsletter/bestaetigen#id=${key}&token=${token}&action=confirm`;
 const sent=await sendTransactionalEmail({to:d.email,subject:'Bitte bestätige deine Newsletter-Anmeldung',text:`Du hast den Newsletter von Stay Safe & Brave angefragt.\nÖffne diesen Link und bestätige dort ausdrücklich deine Anmeldung:\n${url}\nDer Link gilt 48 Stunden. Ohne Bestätigung wirst du nicht angemeldet. Wenn die Anfrage nicht von dir stammt, ignoriere diese Nachricht.`,idempotencyKey:`newsletter-${hash}`});
 if(!sent.success)throw new ApiError(503,'Die Bestätigungs-E-Mail konnte nicht an den Versanddienst übergeben werden. Bitte später erneut versuchen.');
 return NextResponse.json({message:'Die Bestätigungs-E-Mail wurde an den Versanddienst übergeben. Bitte klicke den Link und bestätige deine Anmeldung.'});
}catch(e){return fail(e);}}
