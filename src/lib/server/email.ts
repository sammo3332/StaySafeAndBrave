export interface TransactionalEmailOptions { to: string; subject: string; text: string; html?: string; idempotencyKey?: string; }
export interface EmailDispatchResult { success: boolean; providerConfigured: boolean; error?: string; providerId?: string; }
export function emailReady() { return process.env.EMAIL_TRANSPORT_ENABLED === 'true' && !!process.env.EMAIL_PROVIDER_API_KEY && !!process.env.EMAIL_FROM; }
/** Server-only Resend transport. Success means provider acceptance, not mailbox delivery. */
export async function sendTransactionalEmail(options: TransactionalEmailOptions): Promise<EmailDispatchResult> {
  if (!emailReady()) return { success:false, providerConfigured:false, error:'E-Mail-Versand ist noch nicht freigeschaltet.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(options.to) || options.to.length > 254) return { success:false,providerConfigured:true,error:'Ungültige Empfängeradresse.' };
  try {
    const result = await fetch('https://api.resend.com/emails', { method:'POST', headers:{ Authorization:`Bearer ${process.env.EMAIL_PROVIDER_API_KEY}`, 'Content-Type':'application/json', ...(options.idempotencyKey ? {'Idempotency-Key':options.idempotencyKey} : {}) }, body:JSON.stringify({ from:process.env.EMAIL_FROM, to:[options.to], subject:options.subject, text:options.text, ...(options.html ? {html:options.html} : {}) }), signal:AbortSignal.timeout(10000) });
    if (!result.ok) return {success:false,providerConfigured:true,error:'Der Versanddienst hat die Nachricht nicht angenommen.'};
    const data = await result.json(); return typeof data.id === 'string' ? {success:true,providerConfigured:true,providerId:data.id} : {success:false,providerConfigured:true,error:'Unklare Antwort des Versanddienstes.'};
  } catch { return {success:false,providerConfigured:true,error:'Versanddienst momentan nicht erreichbar.'}; }
}
