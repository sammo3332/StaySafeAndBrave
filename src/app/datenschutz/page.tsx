import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Informationen zur Erhebung, Verarbeitung und zum Schutz personenbezogener Daten auf Stay Safe & Brave.",
};

export default function DatenschutzPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 max-w-3xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Datenschutzerklärung
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Informationen zum Umgang mit Ihren persönlichen Daten auf Stay Safe &amp; Brave.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-primary">
              <ShieldCheck className="w-6 h-6 text-accent" />
              Verantwortliche Stelle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p>
              <strong>Laura Schrimpf</strong><br />
              Josephstraße 12<br />
              44137 Dortmund<br />
              Deutschland<br />
              E-Mail: info@staysafeandbrave.com
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Bereitstellung der Webanwendung &amp; Server-Infrastruktur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Diese Anwendung wird technisch auf Basis moderner Webtechnologien (Next.js) bereitgestellt. Beim Aufruf der Seiten erfassen die Server standardmäßig technische Verbindungsinformationen (wie IP-Adresse, Datum und Uhrzeit des Zugriffs, Browsertyp und Betriebssystem), um die Auslieferung der Website, die Stabilität und die Systemsicherheit zu gewährleisten.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Eingesetzte Plattformdienste &amp; technische Komponenten</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Die Plattform befindet sich im Status eines technisch entwickelten Produktes / Portfolioprojektes. Folgende Dienste und Module sind im System integriert bzw. grundlegend angelegt:
            </p>
            <div className="space-y-3 pl-1">
              <div>
                <strong>Firebase Authentication:</strong>
                <p className="mt-0.5">
                  Für die Registrierung und Anmeldung von Nutzerkonten wird Firebase Authentication genutzt. Dabei werden Anmeldedaten (z. B. E-Mail-Adresse und verschlüsseltes Passwort) zur sicheren Identitätsprüfung verarbeitet.
                </p>
              </div>

              <div>
                <strong>Cloud Firestore:</strong>
                <p className="mt-0.5">
                  Zur Speicherung von Nutzerprofilen, Mentor-Informationen, Buchungsanfragen und Reisetagebucheinträgen wird eine Firestore-NoSQL-Datenbank betrieben. Der Datenzugriff ist über rollen- und besitzbasierte Sicherheitsregeln reglementiert.
                </p>
              </div>

              <div>
                <strong>Google / Gemini API (AI Travel Assistant):</strong>
                <p className="mt-0.5">
                  Für den integrierten KI-Reiseassistenten werden vom Nutzer eingegebene Textanfragen serverseitig an die Google Gemini API übermittelt, um kontextbezogene Empfehlungen zu generieren. Bitte geben Sie in den Chat keine vertraulichen oder hochsensiblen persönlichen Daten ein.
                </p>
              </div>

              <div>
                <strong>Zahlungsabwicklung (Stripe):</strong>
                <p className="mt-0.5">
                  Die technische Grundlage für eine Zahlungsabwicklung via Stripe ist vorbereitet, jedoch derzeit für Live-Zahlungen nicht aktiviert (fail-closed). Es werden im aktuellen Entwicklungsstand keine echten Zahlungs- oder Kreditkartendaten verarbeitet.
                </p>
              </div>

              <div>
                <strong>Transaktions-E-Mails:</strong>
                <p className="mt-0.5">
                  Die serverseitigen Schnittstellen für Benachrichtigungs- und Kontakt-E-Mails sind vorbereitet, derzeit jedoch nicht an einen aktiven produktiven E-Mail-Provider angebunden.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">Rechte der betroffenen Personen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Sie haben nach den maßgeblichen gesetzlichen Bestimmungen das Recht auf Auskunft über Ihre gespeicherten personenbezogenen Daten, Berichtigung, Löschung oder Einschränkung der Verarbeitung sowie ein Recht auf Datenübertragbarkeit und Widerspruch.
            </p>
            <p>
              Für Anfragen zu Ihren Daten oder zur Ausübung Ihrer Rechte können Sie sich jederzeit an folgende Adresse wenden:
            </p>
            <p>
              E-Mail: <a href="mailto:info@staysafeandbrave.com" className="text-primary hover:underline">info@staysafeandbrave.com</a>
            </p>
          </CardContent>
        </Card>

        {/* Status notice */}
        <div className="rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground flex items-start gap-2.5">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Diese Datenschutzerklärung wird vor einem öffentlichen kommerziellen Betrieb abschließend rechtlich geprüft und an die final eingesetzten Dienste angepasst.
          </p>
        </div>
      </div>
    </div>
  );
}
