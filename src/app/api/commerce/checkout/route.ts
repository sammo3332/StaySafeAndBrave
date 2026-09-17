import { NextResponse } from 'next/server';
import { fail, identity, jsonBody, rateLimit } from '@/lib/server/admin';
import { createCheckout, requireCommerce } from '@/lib/server/commerce';
export async function POST(req: Request) { try { requireCommerce(); const user=await identity(req); await rateLimit(`checkout-${user.uid}`,10); return NextResponse.json(await createCheckout(user,await jsonBody(req))); } catch(e){return fail(e);} }
