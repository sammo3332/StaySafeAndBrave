import { NextRequest, NextResponse } from "next/server";

/**
 * Server endpoint for transactional emails related to bookings.
 *
 * ARCHITECTURAL & SECURITY REQUIREMENTS:
 * - Trusted Firebase ID-token verification and trusted Firestore lookup must be implemented
 *   (via a securely configured Firebase Admin SDK on the server) before this endpoint can
 *   send booking transactional emails.
 * - Client-supplied recipient emails MUST NEVER be trusted to prevent open relay / spam attacks.
 * - Because firebase-admin is currently NOT installed or configured in this environment,
 *   we do not inspect FIREBASE_SERVICE_ACCOUNT_KEY or pretend that any environment variable
 *   would make Firebase Admin available.
 * - This endpoint strictly rejects privileged requests and fails closed with HTTP 503
 *   and code "FIREBASE_ADMIN_UNCONFIGURED".
 */
export async function POST(_request: NextRequest) {
  // Fail-closed: Firebase Admin is not installed/configured on this server.
  // No privileged client requests or unverified email dispatches are accepted.
  return NextResponse.json(
    {
      success: false,
      code: "FIREBASE_ADMIN_UNCONFIGURED",
      message:
        "Das Firebase Admin SDK ist auf dem Server nicht installiert oder konfiguriert. Server-seitige ID-Token-Verifikation und vertrauenswürdige Firestore-Abfragen müssen implementiert werden, bevor Buchungs-E-Mails versendet werden können. Der Aufruf schlägt kontrolliert fehl (Fail-Closed).",
    },
    { status: 503 }
  );
}
