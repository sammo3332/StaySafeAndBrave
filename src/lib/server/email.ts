export interface TransactionalEmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  providerConfigured: boolean;
  error?: string;
}

/**
 * Provider-neutral, server-only foundation for transactional email dispatch.
 *
 * ARCHITECTURAL & SECURITY INVARIANTS:
 * - Runs only in server-side execution contexts (API routes / server actions).
 * - Provider-agnostic interface: no vendor-specific SDK (e.g. SendGrid, Postmark, Resend) is coupled.
 * - Recognizes standard environment variable names:
 *     - EMAIL_PROVIDER_API_KEY
 *     - EMAIL_FROM
 *     - CONTACT_EMAIL_TO
 * - Currently, no specific delivery transport is implemented in this environment.
 * - NEVER fakes delivery or returns simulated success.
 * - Always fails closed with a clear explanation when called without an active provider integration.
 * - Never leaks secrets or API keys in return values or error logs.
 */
export async function sendTransactionalEmail({
  to,
  subject,
  text,
  html,
}: TransactionalEmailOptions): Promise<EmailDispatchResult> {
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY;
  const fromEmail = process.env.EMAIL_FROM;

  // Basic sanity check on recipient address format
  if (!to || !to.includes("@") || to.length > 254) {
    return {
      success: false,
      providerConfigured: false,
      error: "Ungültige Empfängeradresse.",
    };
  }

  // Fail-closed: No email provider transport is currently configured or implemented
  if (!apiKey || !apiKey.trim() || !fromEmail || !fromEmail.trim()) {
    return {
      success: false,
      providerConfigured: false,
      error:
        "E-Mail-Dienst ist serverseitig nicht konfiguriert (EMAIL_PROVIDER_API_KEY oder EMAIL_FROM fehlt).",
    };
  }

  // Fail-closed: Even if environment variables exist, no concrete delivery transport is wired yet
  return {
    success: false,
    providerConfigured: false,
    error:
      "Kein aktiver E-Mail-Transportanbieter angebunden. Der Versand schlägt kontrolliert fehl (Fail-Closed).",
  };
}

