import Link from 'next/link';
import { ArrowUpRight, Compass, MessageCircle, Route, Sparkles } from 'lucide-react';
import { OriginalTeamPortrait } from '@/components/content/original-team-portrait';
import { Button } from '@/components/ui/button';

export function TravelBenefits() {
  return <section className="page-shell pb-8" aria-labelledby="travel-benefits-title">
    <div className="rounded-3xl bg-accent/30 px-6 py-10 sm:p-12">
      <h2 id="travel-benefits-title" className="text-center text-2xl">Du planst die Reise. Ein Local Mentor unterstützt dich.</h2>
      <div className="mt-9 grid gap-9 md:grid-cols-3">
        {[
          { icon: Compass, title: 'Dein eigener Reiseplan', text: 'Du entscheidest über Orte, Tempo und Erlebnisse. Die Reise bleibt in deiner Hand.' },
          { icon: MessageCircle, title: 'Eine lokale Perspektive', text: 'Besprich deine Fragen und Interessen mit einem Local Mentor, wenn ein passendes Profil verfügbar ist.' },
          { icon: Route, title: 'Gemeinsam abgestimmt', text: 'Kläre Zeitraum, Umfang und Konditionen persönlich. Eine Anfrage ist noch keine bestätigte Buchung.' },
        ].map(({ icon: Icon, title, text }) => <div key={title} className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon aria-hidden="true" className="h-6 w-6" /></span>
          <h3 className="mt-4 text-lg">{title}</h3><p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{text}</p>
        </div>)}
      </div>
    </div>
  </section>;
}

export function TeamInvitation() {
  return <section className="page-shell py-8" aria-labelledby="team-invitation-title">
    <div className="team-invitation">
      <div className="grid grid-cols-3 items-start gap-3 sm:gap-5">
        {(['Laura', 'Niklas', 'Houssam'] as const).map((name, index) => <figure key={name} className={index === 1 ? 'pt-8' : ''}>
          <OriginalTeamPortrait name={name} /><figcaption className="text-center text-sm font-semibold">{name}</figcaption>
        </figure>)}
      </div>
      <div><p className="eyebrow mb-3">Das Gründungsteam</p><h2 id="team-invitation-title" className="editorial-title section-title">Eine Reiseidee.<br />Drei Menschen dahinter.</h2>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Wir entwickeln Stay Safe &amp; Brave, damit Individualreisende und Local Mentoren zusammenfinden können. Lerne die Menschen hinter der Plattform kennen.</p>
        <Button asChild className="mt-6"><Link href="/ueber-uns">Das Team kennenlernen<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link></Button>
      </div>
    </div>
  </section>;
}

export function PlanningInvitation() {
  return <section className="page-shell pb-14" aria-labelledby="planning-invitation-title">
    <div className="rounded-3xl bg-foreground p-7 text-background sm:p-12">
      <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div><Sparkles aria-hidden="true" className="mb-5 h-7 w-7 text-background/70" /><p className="mb-3 text-xs font-semibold uppercase tracking-widest text-background/70">Vom Entdecken zum Planen</p>
          <h2 id="planning-invitation-title" className="editorial-title section-title">Was möchtest du<br />über Südafrika wissen?</h2>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-background/80">Stelle dem Reiseassistenten deine Fragen oder lies Eindrücke anderer Reisender.</p>
        </div>
        <div className="grid gap-3"><Link href="/travel-assistant" className="flex min-h-16 items-center justify-between gap-4 rounded-2xl bg-background px-5 py-4 font-medium text-foreground">Reiseassistent öffnen<ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0" /></Link><Link href="/stories" className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-background/40 px-5 py-4 font-medium">Reiseberichte lesen<ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0" /></Link></div>
      </div>
    </div>
  </section>;
}
