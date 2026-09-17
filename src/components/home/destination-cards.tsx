import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { originalAssets } from '@/components/content/original-assets';

const destinations = [
  { name: 'Kapstadt', text: 'Zwischen bunten Straßen, Bergen und Meer.', image: originalAssets.boKaap, alt: 'Bo-Kaap in Kapstadt aus Lauras Reisebericht', caption: 'Bo-Kaap · 2024' },
  { name: 'Johannesburg', text: 'Kreative Orte und neue Perspektiven.', image: originalAssets.johannesburg, alt: 'Farbenfroher Innenraum mit Klavier und Curiocity-Schriftzug in Johannesburg', caption: 'Curiocity, Johannesburg · 2024' },
  { name: 'Durban', text: 'Ankommen am Indischen Ozean.', image: originalAssets.durban, alt: 'Strand an der Küste bei Durban aus Lauras Reisebericht', caption: 'Küste bei Durban · 2024' },
];

export function DestinationCards() {
  return <section className="section-space page-shell">
    <div className="mb-9 max-w-2xl"><p className="eyebrow mb-3">Südafrika entdecken</p>
      <h2 className="editorial-title section-title">Wo beginnt deine Reise?</h2>
      <p className="mt-4 text-muted-foreground">Drei Ausgangspunkte für deine eigenen Entdeckungen. Finde heraus, ob ein passender Local Mentor vor Ort ist.</p>
    </div>
    <div className="grid gap-8 md:grid-cols-3">
      {destinations.map(city => <article key={city.name} className="min-w-0 overflow-hidden rounded-2xl border bg-accent/30 shadow-sm">
        <Link className="group block" href={`/mentors?location=${encodeURIComponent(city.name)}`}>
          <div className="relative overflow-hidden bg-muted"><img src={city.image} alt={city.alt} width={768} height={1024} loading="lazy" className="aspect-[16/10] w-full object-cover object-[50%_65%] transition-transform duration-300 group-hover:scale-[1.03]" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-5 pb-4 pt-14 text-white"><p className="text-xs font-medium uppercase tracking-widest">Entdecke</p><h3 className="mt-1 text-2xl">{city.name}</h3></div>
          </div>
          <div className="p-5"><p className="text-sm leading-relaxed text-muted-foreground">{city.text}</p>
            <span className="mt-5 inline-flex min-h-11 items-center gap-3 rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground">Local Mentoren entdecken<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" /></span>
          </div>
        </Link>
        <p className="px-5 pb-5 text-xs text-muted-foreground">{city.caption} · Original-Reiseaufnahme</p>
      </article>)}
    </div>
  </section>;
}
