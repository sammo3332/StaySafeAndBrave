import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ImpressumPage() {
  return (
    <div className="container mx-auto px-4">
      <div className="space-y-8 max-w-3xl mx-auto">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Impressum
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Rechtliche Informationen zu Stay Safe &amp; Brave.
          </p>
        </header>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-primary">
              <FileText className="w-6 h-6 text-accent" />
              Angaben gemäß § 5 TMG
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              <strong>Stay Safe &amp; Brave</strong><br />
              [Max Mustermann / Musterfirma UG (haftungsbeschränkt)]<br />
              Musterstraße 1<br />
              12345 Musterstadt<br />
              Deutschland
            </p>
            <p>
              <strong>Vertreten durch:</strong><br />
              [Max Mustermann]
            </p>
            <p>
              <strong>Kontakt:</strong><br />
              Telefon: [Deine Telefonnummer (optional)]<br />
              E-Mail: info@staysafeandbrave.de (Beispiel)
            </p>
            <p>
              <strong>Registereintrag:</strong><br />
              [Eintragung im Handelsregister / Genossenschaftsregister / Partnerschaftsregister (falls zutreffend)]<br />
              [Registernummer]<br />
              [Registergericht]
            </p>
            <p>
              <strong>Umsatzsteuer-ID:</strong><br />
              Umsatzsteuer-Identifikationsnummer gemäß §27a Umsatzsteuergesetz:<br />
              [Deine Umsatzsteuer-ID (falls vorhanden)]
            </p>
            <p>
              <strong>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</strong><br />
              [Max Mustermann]<br />
              [Musterstraße 1]<br />
              [12345 Musterstadt]
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2 text-primary">
              Haftungsausschluss (Disclaimer)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              <strong>Haftung für Inhalte</strong><br />
              Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
            <p>
              <strong>Haftung für Links</strong><br />
              Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
            <p>
              <strong>Urheberrecht</strong><br />
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
