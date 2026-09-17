import Link from 'next/link';
import { Compass, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MentorEmptyState() {
  return (
    <section className="rounded-2xl bg-muted/60 p-6 sm:p-10 grid gap-6 md:grid-cols-[auto_1fr]" aria-labelledby="mentor-discovery-title">
      <Compass className="h-10 w-10 text-primary" aria-hidden="true" />
      <div className="max-w-2xl">
        <p className="eyebrow mb-3">Lokal verbunden</p>
        <h2 id="mentor-discovery-title" className="editorial-title section-title">Deine Reise beginnt mit Neugier.</h2>
        <p className="mt-4 text-muted-foreground leading-relaxed">Aktuell sind keine aktiven Local-Mentor-Profile verfügbar. Erfahre, wie persönliche Begleitung gedacht ist, oder sammle erste Ideen für deine Reise.</p>
        <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
          <Button asChild variant="outline"><Link href="/#so-funktionierts">So funktioniert’s</Link></Button>
          <Link className="quiet-link min-h-11" href="/travel-assistant">Reiseassistent ausprobieren<ArrowUpRight className="h-4 w-4" /></Link>
          <Link className="quiet-link min-h-11" href="/kontakt">Kontakt</Link>
        </div>
      </div>
    </section>
  );
}
