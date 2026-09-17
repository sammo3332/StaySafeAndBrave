import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';
export class ApiError extends Error { constructor(public status: number, message: string) { super(message); } }
export function serverReady() { return !!(process.env.FIREBASE_ADMIN_PROJECT_ID && process.env.FIREBASE_ADMIN_CLIENT_EMAIL && process.env.FIREBASE_ADMIN_PRIVATE_KEY); }
export function admin() {
  if (!serverReady()) throw new ApiError(503, 'Server-Verbindung noch nicht eingerichtet.');
  const name = 'ssb-server';
  const app = getApps().find(a => a.name === name) || initializeApp({ credential: cert({ projectId: process.env.FIREBASE_ADMIN_PROJECT_ID, clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL, privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n') }) }, name);
  return { db: getFirestore(app), auth: getAuth(app) };
}
export async function identity(req: Request) {
  const match = req.headers.get('authorization')?.match(/^Bearer (.+)$/);
  if (!match) throw new ApiError(401, 'Bitte anmelden.');
  try { const token = await admin().auth.verifyIdToken(match[1], true); if (!token.email_verified || !token.email) throw new ApiError(403, 'Bitte zuerst die E-Mail-Adresse bestätigen.'); return token; }
  catch (e) { if (e instanceof ApiError) throw e; throw new ApiError(401, 'Anmeldung abgelaufen oder ungültig.'); }
}
export function siteURL() {
  const value = process.env.SSB_SITE_URL;
  if (!value) throw new ApiError(503, 'Website-Adresse fehlt in der Server-Konfiguration.');
  const url = new URL(value);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && ['localhost','127.0.0.1'].includes(url.hostname))) throw new ApiError(503, 'Ungültige Website-Konfiguration.');
  return url.origin;
}
export async function jsonBody(req: Request) {
  const raw = await req.text(); if (Buffer.byteLength(raw) > 16000) throw new ApiError(413, 'Eingabe zu groß.');
  try { return JSON.parse(raw); } catch { throw new ApiError(400, 'Ungültige Eingabe.'); }
}
export function fail(e: unknown) { return NextResponse.json({ error: e instanceof ApiError ? e.message : 'Die Anfrage konnte nicht verarbeitet werden. Bitte später erneut versuchen.' }, { status: e instanceof ApiError ? e.status : 500 }); }
export async function rateLimit(key: string, limit = 5, windowMs = 3600000) {
  const ref = admin().db.collection('serviceLimits').doc(key);
  await admin().db.runTransaction(async tx => {
    const data = (await tx.get(ref)).data(); const now = Date.now();
    const active = data && Number(data.until) > now;
    if (active && data.count >= limit) throw new ApiError(429, 'Zu viele Versuche. Bitte später erneut versuchen.');
    tx.set(ref, { count: active ? data.count + 1 : 1, until: active ? data.until : now + windowMs });
  });
}
