import { Metadata } from 'next';
import { TravelChat } from '@/components/travel-assistant/travel-chat';
import { Sparkles, HeartHandshake, Compass, CheckCircle2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'AI Travel Assistant',
  description: 'Dein digitaler Reisebegleiter für die Vorbereitung – dein Local Mentor bleibt dein persönlicher Ansprechpartner vor Ort.',
};

export default function TravelAssistantPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl space-y-10">
      {/* 1. Header & Positioning */}
      <header className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vorbereitung &amp; Reiseplanung</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
          AI Travel Assistant
        </h1>
        
        <p className="text-lg text-muted-foreground font-medium">
          Unterstützung bei deiner Reisevorbereitung
        </p>
        
        <div className="p-3.5 rounded-xl bg-muted/50 border border-border text-sm text-foreground/90 max-w-2xl mx-auto shadow-2xs">
          <p className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium">
            <HeartHandshake className="w-4 h-4 text-primary shrink-0" />
            <span>
              Dein digitaler Reisebegleiter für die Vorbereitung – dein Local Mentor bleibt dein persönlicher Ansprechpartner vor Ort.
            </span>
          </p>
        </div>
      </header>

      {/* 2. Visual Distinction: AI Travel Assistant vs. Local Mentor */}
      <section 
        id="product-positioning-comparison" 
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto"
        aria-label="Vergleich: AI Travel Assistant vs. Local Mentor"
      >
        {/* Card 1: AI Travel Assistant */}
        <div className="p-5 rounded-xl bg-card border border-border/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-base text-foreground">AI Travel Assistant</h2>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
              Digitales Tool
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Unterstützt dich bei der eigenständigen Planung vor deiner Abreise:
          </p>

          <ul className="space-y-1.5 text-xs text-foreground/85">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>Routen-Inspiration &amp; grobe Reisedauern</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>Packlisten, Adapter &amp; Klima-Check</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>Vorbereitung wichtiger Fragen an deine Mentorin</span>
            </li>
          </ul>
        </div>

        {/* Card 2: Local Mentor */}
        <div className="p-5 rounded-xl bg-primary/5 border border-primary/20 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <h2 className="font-semibold text-base text-primary">Dein Local Mentor</h2>
            </div>
            <span className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md">
              Mensch vor Ort
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Deine persönliche, geprüfte Vertrauensperson in Südafrika:
          </p>

          <ul className="space-y-1.5 text-xs text-foreground/85">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>Tagesaktuelle Sicherheitslage &amp; Stadtteil-Tipps</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>Persönliche Begleitung &amp; Ansprechpartnerin</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>Authentische Empfehlungen abseits der Massen</span>
            </li>
          </ul>

          <div className="pt-1">
            <Button asChild variant="outline" size="sm" className="w-full text-xs h-7.5 border-primary/30 text-primary hover:bg-primary/10">
              <Link href="/mentors">
                <Compass className="w-3.5 h-3.5 mr-1.5" />
                Geprüfte Local Mentoren entdecken
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Interactive Conversation Area */}
      <main className="w-full">
        <TravelChat />
      </main>

      {/* 4. Secondary Navigation */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t text-xs text-muted-foreground max-w-4xl mx-auto">
        <Link href="/dashboard" className="hover:text-primary transition-colors underline">
          &larr; Zurück zum Reise-Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/sicherheitsrichtlinien" className="hover:text-primary transition-colors underline">
            Sicherheitsrichtlinien
          </Link>
          <Link href="/kontakt" className="hover:text-primary transition-colors underline">
            Kontakt &amp; Support
          </Link>
        </div>
      </footer>
    </div>
  );
}
