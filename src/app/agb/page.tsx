import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollText } from "lucide-react";

export default function AGBPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 max-w-3xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Unsere Vertragsbedingungen für die Nutzung von Stay Safe and Brave.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-primary">
              <ScrollText className="w-6 h-6 text-accent" />
              § 1 Geltungsbereich
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              (1) Diese Allgemeinen Geschäftsbedingungen (nachfolgend "AGB") der [Musterfirma UG (haftungsbeschränkt) / Max Mustermann] (nachfolgend "Anbieter") gelten für alle Verträge über die Nutzung der Plattform "Stay Safe and Brave" (nachfolgend "Plattform") durch den Nutzer (nachfolgend "Nutzer").
            </p>
            <p>
              (2) Abweichende Bedingungen des Nutzers werden nicht anerkannt, es sei denn, der Anbieter stimmt ihrer Geltung ausdrücklich schriftlich zu.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">§ 2 Leistungsgegenstand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              (1) Der Anbieter stellt eine Online-Plattform zur Verfügung, über die Nutzer (insbesondere alleinreisende Frauen) Kontakt zu lokalen Mentoren in Südafrika aufnehmen und geführte Touren oder Begleitungen (nachfolgend "Mentor-Dienste") buchen können.
            </p>
            <p>
              (2) Der Anbieter tritt lediglich als Vermittler zwischen Nutzern und Mentoren auf. Verträge über Mentor-Dienste kommen ausschließlich zwischen dem Nutzer und dem jeweiligen Mentor zustande. Der Anbieter ist nicht Partei dieser Verträge und übernimmt keine Haftung für die Durchführung oder Qualität der Mentor-Dienste.
            </p>
            <p>
              (3) Die Nutzung der Plattform zur Registrierung und Suche nach Mentoren ist grundsätzlich kostenlos. Kosten für die Buchung von Mentor-Diensten werden gesondert ausgewiesen.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">§ 3 Registrierung und Nutzerkonto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              (1) Die Nutzung bestimmter Funktionen der Plattform, insbesondere die Buchung von Mentor-Diensten, erfordert eine Registrierung.
            </p>
            <p>
              (2) Der Nutzer ist verpflichtet, bei der Registrierung wahrheitsgemäße und vollständige Angaben zu machen und diese aktuell zu halten.
            </p>
            <p>
              (3) Der Nutzer ist für die Geheimhaltung seiner Zugangsdaten verantwortlich.
            </p>
          </CardContent>
        </Card>
        
        {/* Weitere Paragraphen nach Bedarf einfügen, z.B.: */}
        {/* § 4 Zustandekommen von Verträgen über Mentor-Dienste */}
        {/* § 5 Zahlungsbedingungen (ggf. in Verbindung mit Stripe) */}
        {/* § 6 Stornierungsbedingungen */}
        {/* § 7 Pflichten und Verantwortlichkeiten der Nutzer und Mentoren */}
        {/* § 8 Haftung des Anbieters */}
        {/* § 9 Datenschutz (Verweis auf separate Datenschutzerklärung) */}
        {/* § 10 Änderungen der AGB */}
        {/* § 11 Schlussbestimmungen */}

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">§ X Haftungsbeschränkung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
             <p>
              Der Anbieter haftet für Vorsatz und grobe Fahrlässigkeit. Ferner haftet der Anbieter für die fahrlässige Verletzung von Pflichten, deren Erfüllung die ordnungsgemäße Durchführung des Vertrages überhaupt erst ermöglicht, deren Verletzung die Erreichung des Vertragszwecks gefährdet und auf deren Einhaltung Sie als Kunde regelmäßig vertrauen dürfen. Im letztgenannten Fall haftet der Anbieter jedoch nur für den vorhersehbaren, vertragstypischen Schaden. Der Anbieter haftet nicht für die leicht fahrlässige Verletzung anderer als der in den vorstehenden Sätzen genannten Pflichten.
            </p>
            <p>Die vorstehenden Haftungsausschlüsse gelten nicht bei Verletzung von Leben, Körper und Gesundheit. Die Haftung nach Produkthaftungsgesetz bleibt unberührt.</p>
          </CardContent>
        </Card>

         <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl text-primary">§ Y Schlussbestimmungen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
            </p>
            <p>
              (2) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
             <p>
              (3) Gerichtsstand für alle Streitigkeiten aus Vertragsverhältnissen zwischen dem Kunden und dem Anbieter ist der Sitz des Anbieters, sofern es sich bei dem Kunden um einen Kaufmann, eine juristische Person des öffentlichen Rechts oder ein öffentlich-rechtliches Sondervermögen handelt.
            </p>
            <p>Stand: [Datum der letzten Aktualisierung]</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
