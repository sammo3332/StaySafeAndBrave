import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import type Stripe from 'stripe';

export async function POST(req: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'STRIPE_SECRET_KEY ist auf dem Server nicht konfiguriert.' },
      { status: 500 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'STRIPE_WEBHOOK_SECRET ist auf dem Server nicht konfiguriert.' },
      { status: 500 }
    );
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json(
      { error: 'Fehlende Stripe-Signatur im Request-Header.' },
      { status: 400 }
    );
  }

  let stripe: Stripe;
  try {
    stripe = getStripe();
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'STRIPE_SECRET_KEY ist auf dem Server nicht konfiguriert.' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook-Signaturprüfung fehlgeschlagen: ${err.message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      // Recognized and validated checkout.session.completed.
      // Note: Booking state transitions are not yet finalized in the current business model.
      // Furthermore, secure server-side mutation of Firestore booking documents requires
      // Firebase Admin SDK credentials, which are not configured in this client environment.
      // Therefore, the event is acknowledged safely without performing unverified state mutations.
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
