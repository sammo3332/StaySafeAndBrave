import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendTransactionalEmail } from "@/lib/server/email";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name muss mindestens 2 Zeichen lang sein.").max(100, "Name darf maximal 100 Zeichen lang sein."),
  email: z.string().trim().email("Ungültige E-Mail-Adresse.").max(254, "E-Mail darf maximal 254 Zeichen lang sein."),
  subject: z.string().trim().min(3, "Betreff muss mindestens 3 Zeichen lang sein.").max(150, "Betreff darf maximal 150 Zeichen lang sein."),
  message: z.string().trim().min(10, "Nachricht muss mindestens 10 Zeichen lang sein.").max(2000, "Nachricht darf maximal 2000 Zeichen lang sein."),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = contactSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.errors[0]?.message || "Ungültige Eingabedaten.",
        },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parseResult.data;

    // Destination comes strictly from server configuration (CONTACT_EMAIL_TO), never from client
    const operationalRecipient = process.env.CONTACT_EMAIL_TO;

    if (!operationalRecipient || !operationalRecipient.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "E-Mail-Dienst ist derzeit nicht betriebsbereit (Empfängeradresse CONTACT_EMAIL_TO nicht konfiguriert).",
        },
        { status: 503 }
      );
    }

    const emailSubject = `[Kontaktformular] ${subject}`;
    const emailText = `Neue Kontaktanfrage über Stay Safe & Brave:

Absender: ${name}
E-Mail: ${email}
Betreff: ${subject}

Nachricht:
${message}
`;

    const emailHtml = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #0f172a; margin-bottom: 1rem;">Neue Kontaktanfrage</h2>
        <p><strong>Absender:</strong> ${encodeHtml(name)}</p>
        <p><strong>E-Mail:</strong> <a href="mailto:${encodeHtml(email)}">${encodeHtml(email)}</a></p>
        <p><strong>Betreff:</strong> ${encodeHtml(subject)}</p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 1.5rem 0;" />
        <h4 style="margin-bottom: 0.5rem;">Nachricht:</h4>
        <div style="white-space: pre-wrap; background-color: #f8fafc; padding: 1rem; border-radius: 6px; border: 1px solid #e2e8f0;">${encodeHtml(message)}</div>
      </div>
    `;

    const dispatchResult = await sendTransactionalEmail({
      to: operationalRecipient.trim(),
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
    });

    if (!dispatchResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: dispatchResult.error || "E-Mail-Dienst ist nicht konfiguriert oder Nachricht konnte nicht zugestellt werden.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Deine Nachricht wurde erfolgreich übermittelt. Wir melden uns so schnell wie möglich bei dir.",
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error processing contact form submission:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Ein interner Serverfehler ist aufgetreten. Bitte versuche es später erneut.",
      },
      { status: 500 }
    );
  }
}

function encodeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
