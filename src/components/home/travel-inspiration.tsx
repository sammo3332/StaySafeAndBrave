'use client';

import { useState } from 'react';
import { ArrowUpRight, Camera, MapPin, Mountain, Waves } from 'lucide-react';
import { originalAssets } from '@/components/content/original-assets';

const categories = [
  { id: 'all', label: 'Alle Eindrücke', icon: Camera },
  { id: 'city', label: 'Stadt & Kultur', icon: MapPin },
  { id: 'coast', label: 'Küste & Meer', icon: Waves },
  { id: 'nature', label: 'Natur entdecken', icon: Mountain },
] as const;
type Category = typeof categories[number]['id'];
const impressions = [
  { title: 'Farbe in jeder Gasse.', place: 'Bo-Kaap · Kapstadt', category: 'city', image: originalAssets.boKaap, width: 768, height: 1024, alt: 'Eine Reisende vor den bunten Häusern von Bo-Kaap', description: 'Ein Spaziergang durch Bo-Kaap – festgehalten in Lauras Südafrika-Reisebericht.' },
  { title: 'Zeit für den Ozean.', place: 'Clifton Beach · Kapstadt', category: 'coast', image: originalAssets.clifton, width: 768, height: 1024, alt: 'Menschen am Clifton Beach vor der Bergkulisse von Kapstadt', description: 'Ein Strandnachmittag zwischen Stadtleben und Atlantik.' },
  { title: 'Kleine Begegnungen am Kap.', place: 'Boulders Beach · Kaphalbinsel', category: 'nature', image: originalAssets.boulders, width: 1024, height: 768, alt: 'Pinguine zwischen Felsen und Meer am Boulders Beach', description: 'Lauras Besuch bei den Pinguinen an der Kaphalbinsel.' },
  { title: 'Raum für neue Perspektiven.', place: 'Curiocity · Johannesburg', category: 'city', image: originalAssets.johannesburg, width: 768, height: 1024, alt: 'Ein Klavier vor einer farbenfrohen Wand bei Curiocity in Johannesburg', description: 'Ein kreativer Ort aus dem Johannesburg-Kapitel der Reise.' },
  { title: 'Den Blick schweifen lassen.', place: 'Küste bei Durban', category: 'coast', image: originalAssets.durban, width: 768, height: 1024, alt: 'Treibholz am Strand an der Küste bei Durban', description: 'Ein Moment am Indischen Ozean aus Lauras Reiseaufzeichnungen.' },
];

export function TravelInspiration() {
  const [category, setCategory] = useState<Category>('all');
  const visible = impressions.filter(item => category === 'all' || item.category === category);
  return <section id="reiseinspiration" className="page-shell section-space" aria-labelledby="inspiration-title">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl"><p className="eyebrow mb-3">Ideen für deine Reise</p>
        <h2 id="inspiration-title" className="editorial-title section-title">Was zieht dich nach draußen?</h2>
        <p className="mt-4 text-muted-foreground">Stadt, Küste oder Natur: Entdecke persönliche Eindrücke aus Lauras Südafrika-Reise von 2024.</p>
      </div>
      <a href={originalAssets.storyUrl} target="_blank" rel="noopener noreferrer" className="quiet-link min-h-11 shrink-0 text-sm">Lauras Reisebericht lesen<ArrowUpRight className="h-4 w-4" aria-hidden="true" /><span className="sr-only"> (öffnet einen neuen Tab)</span></a>
    </div>
    <div role="group" aria-label="Reiseimpressionen nach Thema filtern" className="my-7 flex flex-wrap gap-2">
      {categories.map(({ id, label, icon: Icon }) => <button key={id} type="button" aria-pressed={category === id} aria-controls="inspiration-grid" onClick={() => setCategory(id)} className="inspiration-filter"><Icon className="h-4 w-4" aria-hidden="true" />{label}</button>)}
    </div>
    <p role="status" className="sr-only">{visible.length} Reiseimpressionen · {categories.find(item => item.id === category)?.label}</p>
    <div id="inspiration-grid" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {visible.map((item, index) => <article key={item.title} className={`inspiration-card ${category === 'all' && index === 0 ? 'inspiration-card-featured' : ''}`}>
        <img src={item.image} alt={item.alt} width={item.width} height={item.height} loading="lazy" className="inspiration-card-image" />
        <div className="flex flex-col p-5 sm:p-6"><p className="text-xs font-medium text-primary">{item.place}</p>
          <h3 className="mt-3 text-xl leading-snug">{item.title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          <p className="mt-auto pt-5 text-xs text-muted-foreground">Original-Reiseaufnahme · 2024</p>
        </div>
      </article>)}
    </div>
    <p className="mt-5 text-xs text-muted-foreground">Aus dem Markenarchiv. Diese Impressionen sind keine buchbaren Touren. Community-Berichte findest du bei den <a href="/stories" className="underline underline-offset-4">Travel Stories</a>.</p>
  </section>;
}
