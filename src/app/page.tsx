import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck, MapPin, Search, CalendarCheck, Smile, Star, MessageCircle, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import images from "@/lib/placeholder-images.json";

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card border-transparent hover:border-primary/50 group">
    <CardHeader className="items-center text-center">
      <div className="p-4 rounded-full bg-primary/10 mb-4 transition-colors group-hover:bg-primary/20">
        <Icon className="w-10 h-10 text-primary transition-transform group-hover:scale-110" />
      </div>
      <CardTitle className="text-xl text-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent className="text-center">
      <CardDescription className="text-muted-foreground">{description}</CardDescription>
    </CardContent>
  </Card>
);

const HowItWorksStep = ({ icon: Icon, title, description, stepNumber }: { icon: React.ElementType, title: string, description: string, stepNumber: string }) => (
  <div className="flex flex-col items-center text-center p-4 group">
    <div className="relative mb-6">
      <div className="p-5 rounded-full bg-secondary group-hover:bg-secondary/80 mb-2 ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 transform group-hover:scale-105">
        <Icon className="w-10 h-10 text-primary transition-colors duration-300 group-hover:text-primary/80" />
      </div>
      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
        {stepNumber}
      </span>
    </div>
    <h3 className="text-xl font-semibold mb-2 text-foreground">{title}</h3>
    <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const TestimonialCard = ({ quote, author, location, avatar, dataAiHint }: { quote: string, author: string, location: string, avatar: string, dataAiHint: string }) => (
  <Card className="shadow-lg bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
    <CardContent className="pt-6 flex-grow flex flex-col">
      <div className="flex items-center mb-4">
        <Image src={avatar} alt={author} data-ai-hint={dataAiHint} width={56} height={56} className="rounded-full mr-4 border-2 border-accent/50" />
        <div>
          <p className="font-semibold text-lg text-foreground">{author}</p>
          <p className="text-sm text-muted-foreground">{location}</p>
        </div>
      </div>
      <blockquote className="text-muted-foreground italic border-l-4 border-primary pl-4 my-4 text-base leading-relaxed flex-grow">
        "{quote}"
      </blockquote>
      <div className="flex mt-auto pt-2">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-secondary fill-secondary" />
        ))}
      </div>
    </CardContent>
  </Card>
);

export default function HomePage() {
  return (
    <>
      {/* Banner Image Section - Full Viewport Width */}
      <section className="w-full">
        <Image
          src="https://wetraveltheworld.de/wp-content/uploads/2019/10/suedafrika-sehenswuerdigkeiten.jpg"
          alt="Panoramaansicht der südafrikanischen Landschaft für Stay Safe and Brave"
          width={1200}
          height={400}
          className="w-full h-auto object-cover shadow-lg"
          priority
        />
      </section>

      {/* Content sections wrapped for consistent spacing */}
      <div className="flex flex-col items-center"> {/* Removed space-y, handled by section py */}
        {/* Hero Section - Revamped */}
        <section className="relative w-full h-[calc(90vh-10rem)] min-h-[450px] md:h-[calc(85vh-8rem)] flex items-center justify-center text-center overflow-hidden">
          {/* Background Image */}
          <Image
            src={images.home.hero.src}
            alt="Abenteuer in Südafrika mit Stay Safe and Brave"
            data-ai-hint={images.home.hero.dataAiHint}
            fill
            className="object-cover z-0"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60 z-10"></div>

          {/* Content */}
          <div className="relative z-20 container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none text-white drop-shadow-md">
                Authentisch & Sicher: Dein Südafrika mit <span className="text-primary">Stay Safe and Brave</span>
              </h1>
              <p className="max-w-[700px] text-gray-200 md:text-xl leading-relaxed drop-shadow-sm">
                Verbinde dich mit lokalen Mentorinnen in Kapstadt, Johannesburg und Durban. Erlebe das echte Südafrika – selbstbewusst und mit Insiderwissen.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  <Link href="/mentors">Finde deine Mentorin</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10 hover:text-white text-lg px-10 py-7 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <Link href="/ueber-uns">Mehr Erfahren</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section ("Why Choose Us") */}
        <section className="w-full py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl mb-16 text-foreground">
              Warum <span className="text-primary">Stay Safe and Brave</span>?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <FeatureCard
                icon={Users}
                title="Lokale Expertinnen"
                description="Unsere Mentorinnen sind geprüfte Einheimische, die ihre Stadt lieben und dir einzigartige, sichere Einblicke gewähren."
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Sicherheit & Vertrauen"
                description="Wir legen höchsten Wert auf deine Sicherheit. Reise sorgenfrei und selbstbewusst mit unseren vertrauenswürdigen Guides."
              />
              <FeatureCard
                icon={Award}
                title="Authentische Erlebnisse"
                description="Entdecke Südafrika abseits der Touristenpfade und erlebe die Kultur und Gastfreundschaft hautnah und persönlich."
              />
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="w-full py-16 md:py-24 bg-muted/40">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl mb-16 text-foreground">
              So einfach startest du dein Abenteuer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
              <HowItWorksStep
                icon={Search}
                stepNumber="1"
                title="Mentorin Finden"
                description="Durchsuche Profile von lokalen Mentorinnen basierend auf deinen Interessen, Reisezielen und gewünschtem Sicherheitslevel."
              />
              <HowItWorksStep
                icon={CalendarCheck}
                stepNumber="2"
                title="Tour Buchen"
                description="Wähle deinen Wunschtermin und buche deine personalisierte Tour oder Begleitung direkt und sicher über unsere Plattform."
              />
              <HowItWorksStep
                icon={Smile}
                stepNumber="3"
                title="Abenteuer Erleben"
                description="Triff deine Mentorin und entdecke die Schönheit und Kultur Südafrikas – sicher, authentisch und unvergesslich."
              />
            </div>
          </div>
        </section>

        {/* Popular Destinations Teaser */}
        <section className="w-full py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl mb-16 text-foreground">
              Entdecke Südafrikas Vielfalt
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Kapstadt", image: images.locations.capeTown.src, dataAiHint: images.locations.capeTown.dataAiHint, description: "Atemberaubende Natur & pulsierendes Stadtleben am Kap." },
                { name: "Johannesburg", image: images.locations.johannesburg.src, dataAiHint: images.locations.johannesburg.dataAiHint, description: "Kultureller Schmelztiegel & historische Einblicke in Gauteng." },
                { name: "Durban", image: images.locations.durban.src, dataAiHint: images.locations.durban.dataAiHint, description: "Goldene Strände & entspannte Atmosphäre in KwaZulu-Natal." },
              ].map(dest => (
                <Card key={dest.name} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow group bg-card border-transparent hover:border-primary/30">
                  <Image src={dest.image} alt={dest.name} data-ai-hint={dest.dataAiHint} width={600} height={400} className="object-cover w-full h-56 transition-transform duration-300 group-hover:scale-105" />
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">{dest.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{dest.description}</p>
                    <Button asChild variant="link" className="px-0 text-primary group-hover:underline">
                      <Link href={`/mentors?location=${dest.name}`}>Mentorinnen in {dest.name} finden</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-16 md:py-24 bg-secondary/20">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl mb-16 text-foreground">
              Stimmen unserer <span className="text-primary">mutigen Reisenden</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                avatar={images.avatars.womanTraveler.src} dataAiHint={images.avatars.womanTraveler.dataAiHint}
                quote="Dank meiner Mentorin Sarah habe ich Kapstadt von einer ganz neuen, sicheren Seite kennengelernt. Unvergesslich und absolut empfehlenswert!"
                author="Lena M."
                location="Berlin, Deutschland"
              />
              <TestimonialCard
                avatar={images.avatars.soloFemaleTraveler.src} dataAiHint={images.avatars.soloFemaleTraveler.dataAiHint}
                quote="Die Sicherheit und die lokalen Tipps waren Gold wert. Ich habe mich jederzeit gut aufgehoben und empowered gefühlt. Stay Safe and Brave ist top!"
                author="Sophie K."
                location="Zürich, Schweiz"
              />
              <TestimonialCard
                avatar={images.avatars.womanReview.src} dataAiHint={images.avatars.womanReview.dataAiHint}
                quote="Eine fantastische Erfahrung! Mein Guide in Johannesburg war super kompetent, freundlich und hat mir Orte gezeigt, die ich alleine nie gefunden hätte."
                author="Maria P."
                location="Wien, Österreich"
              />
            </div>
          </div>
        </section>

        {/* Final Call to Action Section */}
        <section className="w-full py-20 md:py-32 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 grid items-center justify-center gap-6 text-center">
            <ShieldCheck className="h-16 w-16 text-white/80 mx-auto" />
            <h2 className="text-4xl font-bold tracking-tighter md:text-5xl/tight">
              Bereit für dein sicheres Abenteuer?
            </h2>
            <p className="mx-auto max-w-[700px] text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-primary-foreground/90">
              Entdecke verborgene Schätze Südafrikas und reise selbstbewusst und wie ein Local. Finde noch heute deine perfekte Mentorin und starte in ein unvergessliches Erlebnis.
            </p>
            <div className="mx-auto w-full max-w-sm">
               <Button asChild size="lg" className="w-full bg-white hover:bg-gray-100 text-primary text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Link href="/mentors">Jetzt alle Mentorinnen entdecken</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
