import { createHmac } from 'node:crypto';
import { ApiError, rateLimit, serverReady, siteURL } from './admin';
import { emailReady } from './email';
export function engagementReady() { return process.env.SSB_ENGAGEMENT_ENABLED==='true' && serverReady() && emailReady() && !!process.env.TURNSTILE_SECRET_KEY && !!process.env.SSB_FORM_HASH_SECRET && !!process.env.SSB_SITE_URL; }
export function emailKey(email:string) {if(!process.env.SSB_FORM_HASH_SECRET)throw new ApiError(503,'Formulare noch nicht eingerichtet.');return createHmac('sha256',process.env.SSB_FORM_HASH_SECRET).update(email.trim().toLowerCase()).digest('hex');}
export async function checkPublicForm(token:unknown,email:string) {
 if(!engagementReady())throw new ApiError(503,'Der Versand ist noch nicht freigeschaltet. Die Demo ist weiterhin verfügbar.');
 if(typeof token!=='string'||token.length>2048||!token)throw new ApiError(400,'Bitte die Sicherheitsprüfung abschließen.');
 const result=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:process.env.TURNSTILE_SECRET_KEY,response:token}),signal:AbortSignal.timeout(10000)});
 const data=await result.json();if(!result.ok||!data.success||data.hostname!==new URL(siteURL()).hostname)throw new ApiError(400,'Sicherheitsprüfung fehlgeschlagen. Bitte erneut versuchen.');
 await rateLimit(`form-${emailKey(email)}`,3);
}
