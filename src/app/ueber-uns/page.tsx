import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ShieldCheck, Heart, MapPin, Award, HeartHandshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import images from "@/lib/placeholder-images.json";

const teamMembers = [
  {
    name: "Houssam",
    role: "CTO",
    imageUrl: images.team.houssam.src,
    dataAiHint: images.team.houssam.dataAiHint,
    bio: "technische Entwicklung & Innovation",
  },
  {
    name: "Laura",
    role: "CEO & Visionary ",
    imageUrl: images.team.laura.src,
    dataAiHint: images.team.laura.dataAiHint,
    bio: "Gesamtstrategie, Vision & sozialer Impact",
  },
  {
    name: "Niklas",
    role: " COO & CMO ",
    imageUrl: images.team.niklas.src,
    dataAiHint: images.team.niklas.dataAiHint,
    bio: "Business Development, Sales & Marketing (Geschäftsentwicklung, Vertrieb & Marketing)",
  },
];

export default function UeberUnsPage() {
  return (
    <>
      {/* Hero Section - Full Width Background */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        <div className="absolute inset-0">
            <Image
                src={images.general.aboutUsHero.src}
                alt="Südafrikanische Landschaft"
                data-ai-hint={images.general.aboutUsHero.dataAiHint}
                fill
                className="object-cover opacity-20"
                priority
            />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
            Über Stay Safe and Brave
          </h1>
          <p className="mt-6 text-xl leading-8 text-foreground max-w-3xl mx-auto">
            Unsere Mission: Authentische, sichere und unvergessliche Reiseerlebnisse in Südafrika durch die Verbindung mit lokalen Mentoren.
          </p>
        </div>
      </section>

      {/* Our Story Section - Containerized Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl mb-6">Unsere Geschichte</h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  Stay Safe and Brave wurde aus einer tiefen Liebe zu Südafrika und dem Wunsch geboren, die Schönheit und Vielfalt des Landes auf eine sichere und authentische Weise zugänglich zu machen.
                </p>
                <p>
                  Wir glauben, dass die besten Reiseerlebnisse durch echte Verbindungen zu lokalen Menschen entstehen. Unsere Mentoren sind nicht nur Guides, sondern Botschafter ihrer Kultur und leidenschaftliche Erzähler.
                </p>
                <p>
                  Sicherheit ist dabei unser oberstes Gebot. Wir wählen unsere Mentoren sorgfältig aus und legen Wert auf umfassende Briefings, damit du dein Abenteuer unbeschwert genießen kannst.
                </p>
              </div>
            </div>
            <Image
              src={images.general.aboutUsCollaboration.src}
              alt="Team arbeitet zusammen"
              data-ai-hint={images.general.aboutUsCollaboration.dataAiHint}
              width={600}
              height={450}
              className="rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Our Values Section - Full Width Background */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center text-primary sm:text-4xl mb-12">Unsere Werte</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <HeartHandshake className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Sicherheit & Vertrauen</h3>
              <p className="text-muted-foreground">Deine Sicherheit ist unser Fundament. Wir sorgen für geprüfte Mentoren und klare Richtlinien.</p>
            </div>
            <div className="p-6">
              <Users className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Authentizität</h3>
              <p className="text-muted-foreground">Erlebe Südafrika durch die Augen von Einheimischen und entdecke verborgene Schätze.</p>
            </div>
            <div className="p-6">
              <Heart className="w-16 h-16 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Leidenschaft</h3>
              <p className="text-muted-foreground">Unsere Mentoren und wir lieben Südafrika und teilen diese Begeisterung gerne mit dir.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet The Team Section - Containerized Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-center text-primary sm:text-4xl mb-12">Lerne unser Team kennen</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.name} className="text-center shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    data-ai-hint={member.dataAiHint}
                    width={150}
                    height={150}
                    className="rounded-full mx-auto mb-4 border-2 border-primary"
                  />
                  <CardTitle className="text-xl text-foreground">{member.name}</CardTitle>
                  <CardDescription className="text-accent">{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action - Full Width Background */}
      <section className="bg-primary py-16 md:py-24 text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            Bereit, dein eigenes Abenteuer zu starten?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Finde deinen perfekten lokalen Mentor und erlebe Südafrika auf eine Weise, die du nie vergessen wirst.
          </p>
          <Button asChild size="lg" className="bg-background hover:bg-muted text-primary text-lg px-8 py-6">
            <Link href="/mentors">Finde deinen Mentor</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
