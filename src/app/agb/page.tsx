import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Allgemeine Geschäftsbedingungen (AGB)",
  description: "Nutzungs- und Rahmenbedingungen für die Plattform Stay Safe & Brave.",
};

export default function AGBPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 max-w-3xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Rahmenbedingungen zur Nutzung der Plattform Stay Safe &amp; Brave.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-primary">
              <ScrollText className="w-6 h-6 text-accent" />
              § 1 Plattformkonzept &amp; Geltungsbereich
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              (1) Stay Safe &amp; Brave verbindet selbstbestimmte Reisende mit Interesse an Südafrika mit vertrauenswürdigen Local Mentors.
            </p>
            <p>
              (2) Diese Bedingungen regeln die Nutzung der Webanwendung und der bereitgestellten digitalen Funktionen der Plattform.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">§ 2 Leistungsgegenstand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              (1) Die Plattform stellt Informationsprofile von Local Mentors, Orientierungs- und Begleitpakete, Kontaktmöglichkeiten sowie begleitende digitale Werkzeuge (wie den KI-Reiseassistenten und das persönliche Reisetagebuch) zur Verfügung.
            </p>
            <p>
              (2) Stay Safe &amp; Brave ist kein Pauschalreiseveranstalter und bietet keine eigenen Beförderungsleistungen an.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">§ 3 Registrierung und Nutzerkonto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              (1) Die Nutzung bestimmter Funktionen (wie das Absenden von Anfragen, das Führen eines Reisetagebuchs oder die Einsicht in den Buchungsstatus) erfordert ein registriertes Nutzerkonto.
            </p>
            <p>
              (2) Der Nutzer ist verpflichtet, bei der Registrierung zutreffende Angaben zu machen und die Zugangsdaten vor unbefugtem Zugriff Dritter zu schützen.
            </p>
          </CardContent>
        </Card>

        {/* Status notice */}
        <div className="rounded-xl border bg-muted/30 p-4 text-xs text-muted-foreground flex items-start gap-2.5">
          <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Die AGB befinden sich vor einem öffentlichen kommerziellen Betrieb noch in rechtlicher Prüfung.
          </p>
        </div>
      </div>
    </div>
  );
}
