import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { bookingId } = body;

    if (!bookingId || typeof bookingId !== 'string') {
      return NextResponse.json(
        { error: 'bookingId is required' },
        { status: 400 }
      );
    }

    // TODO: Future activation requires:
    // - Firebase ID token verification server-side
    // - trusted Firestore booking lookup
    // - booking ownership verification
    // - booking status verification
    // - canonical package resolution from the booking
    // - canonical server-side priceAmount

    // Fail closed: Server-side Firebase Admin / token verification is not yet configured.
    return NextResponse.json(
      {
        error: 'Der sichere Zahlungsprozess ist serverseitig noch nicht vollständig konfiguriert.',
        code: 'PAYMENT_BACKEND_NOT_READY',
      },
      { status: 503 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Interner Serverfehler beim Verarbeiten der Anfrage.' },
      { status: 500 }
    );
  }
}

