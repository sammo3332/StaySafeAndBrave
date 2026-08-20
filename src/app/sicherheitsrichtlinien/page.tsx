import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake, UserCheck, MessageSquareHeart, MapPin, Users } from "lucide-react";
import Image from "next/image";
import images from "@/lib/placeholder-images.json";

export default function SicherheitsrichtlinienPage() {
  return (
    <>
    <section className="w-full mb-12">
        <Image
          src={images.general.safetyHeader.src}
          alt="Sicherheit und Vertrauen bei Stay Safe and Brave"
          data-ai-hint={images.general.safetyHeader.dataAiHint}
          width={1200}
          height={400}
          className="w-full h-auto object-cover shadow-lg"
        />
      </section>
    <div className="container mx-auto px-4">
      <div className="space-y-12">
        <header className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Deine Sicherheit – Unsere Priorität
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            Bei "Stay Safe and Brave" setzen wir alles daran, dir ein sicheres und zugleich authentisches Reiseerlebnis in Südafrika zu ermöglichen. Erfahre mehr über unsere Sicherheitsmaßnahmen und wie du selbst zu einer sicheren Reise beitragen kannst.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <UserCheck className="w-7 h-7 text-accent" />
                Verifizierte Mentoren
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Jeder Mentor auf unserer Plattform durchläuft einen sorgfältigen Verifizierungsprozess. Wir prüfen:
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Persönliche Identität und Referenzen.</li>
                <li>Lokales Wissen und Expertise für die angebotenen Regionen.</li>
                <li>Commitment zu unseren Sicherheits- und Ethikstandards.</li>
                <li>Positive Bewertungen und Feedback von früheren Reisenden (sofern vorhanden).</li>
              </ul>
              <p>
                Wir fördern eine Community, in der Vertrauen und Respekt an erster Stelle stehen.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <HeartHandshake className="w-7 h-7 text-accent" />
                Sicherheits-Briefings & Kommunikation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
              <p>
                Vor jeder Tour oder Aktivität erhältst du von deinem Mentor spezifische Sicherheitshinweise für die jeweilige Umgebung und Unternehmung.
              </p>
              <ul className="list-disc list-inside pl-4 space-y-1">
                <li>Klare Kommunikation über Treffpunkte und Routen.</li>
                <li>Informationen zu lokalen Gegebenheiten und potenziellen Risiken.</li>
                <li>Empfehlungen für angemessene Kleidung und Ausrüstung.</li>
                <li>Notfallkontaktmöglichkeiten (lokal und über die Plattform).</li>
              </ul>
              <p>
                Nutze die Chatfunktion der Plattform, um vorab Fragen zu klären und dich mit deinem Mentor abzustimmen.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-xl bg-secondary/30 border-secondary">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <MessageSquareHeart className="w-7 h-7 text-accent" />
              Deine Rolle für eine sichere Reise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>
              Auch du kannst maßgeblich zu deiner Sicherheit beitragen:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-2">
              <li>
                <strong>Informiere dich:</strong> Recherchiere vorab über deine Reiseziele und sei dir kultureller Unterschiede bewusst. Das Auswärtige Amt bietet aktuelle Reise- und Sicherheitshinweise für Südafrika.
              </li>
              <li>
                <strong>Höre auf deinen Mentor:</strong> Unsere Mentoren kennen sich vor Ort aus. Befolge ihre Anweisungen und Ratschläge.
              </li>
              <li>
                <strong>Sei achtsam:</strong> Achte auf deine Umgebung und deine Wertsachen, besonders in belebten Gegenden oder öffentlichen Verkehrsmitteln.
              </li>
              <li>
                <strong>Kommuniziere klar:</strong> Teile deinem Mentor deine Bedürfnisse, Bedenken oder eventuelle gesundheitliche Einschränkungen mit.
              </li>
              <li>
                <strong>Notfallplan:</strong> Speichere wichtige Notfallnummern (lokale Polizei, Ambulanz, deine Botschaft) in deinem Telefon. Informiere Freunde oder Familie über deine Reiseroute.
              </li>
              <li>
                <strong>Versicherung:</strong> Stelle sicher, dass du eine gültige Auslandskrankenversicherung und ggf. eine Reiserücktrittsversicherung hast.
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center py-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Gemeinsam für unvergessliche und sichere Abenteuer.</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Wir glauben, dass authentisches Reisen und Sicherheit Hand in Hand gehen. Wenn du Fragen zu unseren Sicherheitsmaßnahmen hast, kontaktiere uns gerne.
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
