import { NextRequest, NextResponse } from 'next/server';
import { askTravelAssistant } from '@/ai/flows/travel-assistant';
import { isAIConfigured } from '@/ai/genkit';

export async function POST(req: NextRequest) {
  try {
    // 1. Fail-closed check if server credentials are not configured
    if (!isAIConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Der KI-Reiseassistent ist serverseitig zurzeit nicht konfiguriert (fehlender API-Schlüssel). Bitte wende dich an deine Local Mentorin.',
        },
        { status: 503 }
      );
    }

    // 2. Parse request
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Ungültiges JSON-Format in der Anfrage.' },
        { status: 400 }
      );
    }

    const { message, history } = body || {};

    if (!message || typeof message !== 'string' || message.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Bitte gib eine gültige Frage mit mindestens 2 Zeichen ein.' },
        { status: 400 }
      );
    }

    if (message.trim().length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Deine Nachricht überschreitet das Limit von 1.000 Zeichen.' },
        { status: 400 }
      );
    }

    // 3. Delegate to server action logic
    const result = await askTravelAssistant({ message, history });

    if (!result.success) {
      return NextResponse.json(result, { status: 500 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error: unknown) {
    console.error('API Error in /api/travel-assistant:', error instanceof Error ? error.message : error);
    return NextResponse.json(
      {
        success: false,
        error: 'Ein interner Serverfehler ist aufgetreten. Bitte versuche es später erneut.',
      },
      { status: 500 }
    );
  }
}
