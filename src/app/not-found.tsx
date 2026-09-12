import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, ArrowLeft, Users, BookOpen, Mail } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 sm:py-24 max-w-2xl text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
        <Compass className="w-8 h-8" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Fehler 404
      </span>

      <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
        Seite nicht gefunden
      </h1>

      <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
        Die von dir aufgerufene Seite existiert leider nicht, wurde verschoben oder die Webadresse ist unvollständig.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Button asChild size="lg">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zur Startseite
          </Link>
        </Button>
        <Button variant="outline" asChild size="lg">
          <Link href="/mentors">
            <Users className="w-4 h-4 mr-2" />
            Local Mentoren finden
          </Link>
        </Button>
      </div>

      <div className="mt-12 pt-8 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        <Link
          href="/stories"
          className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors flex items-start gap-3"
        >
          <BookOpen className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-foreground">Travel Stories</div>
            <div className="text-xs text-muted-foreground">Echte Reiseberichte und Erlebnisse aus Südafrika lesen</div>
          </div>
        </Link>

        <Link
          href="/kontakt"
          className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors flex items-start gap-3"
        >
          <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-foreground">Hilfe &amp; Kontakt</div>
            <div className="text-xs text-muted-foreground">Fragen zu deiner Reise oder Plattform? Schreib uns</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
