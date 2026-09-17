import Link from 'next/link';
import { ArrowUpRight, ChevronDown, MapPin, Search } from 'lucide-react';
import { originalAssets } from '@/components/content/original-assets';

const destinations = ['Kapstadt', 'Johannesburg', 'Durban'];

export function DestinationHero() {
  return (
    <section className="destination-hero" aria-labelledby="destination-hero-title">
      <div className="destination-hero-inner">
        <div className="destination-hero-copy">
          <p className="eyebrow mb-6">Südafrika. Auf deine Weise.</p>
          <h1 id="destination-hero-title" className="destination-hero-title">
            Besondere Orte.<br />
            <span>Persönlich verbunden.</span>
          </h1>
          <p className="destination-hero-intro">
            Entdecke Südafrika mit lokalen Perspektiven und einem persönlichen Kontakt vor Ort.
          </p>
          <form action="/mentors" method="get" role="search" aria-label="Local Mentoren nach Reiseziel suchen" className="destination-search">
            <div className="destination-search-field">
              <MapPin aria-hidden="true" className="h-5 w-5 shrink-0" />
              <label htmlFor="hero-destination" className="sr-only">Dein Reiseziel</label>
              <select id="hero-destination" name="location" defaultValue="">
                <option value="">Wohin möchtest du reisen?</option>
                {destinations.map(city => <option key={city} value={city}>{city}</option>)}
              </select>
              <ChevronDown aria-hidden="true" className="pointer-events-none h-4 w-4 shrink-0" />
            </div>
            <button type="submit"><Search aria-hidden="true" className="h-5 w-5" />Suchen</button>
          </form>
          <div className="destination-shortcuts" aria-label="Reiseziele direkt entdecken">
            {destinations.map(city => <Link key={city} href={`/mentors?location=${encodeURIComponent(city)}`}>{city}<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></Link>)}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Wähle einen Ort und lerne die Profile der Local Mentoren kennen.</p>
        </div>
        <figure className="destination-hero-figure">
          <div className="destination-mosaic">
            <img className="mosaic-mountain" src={originalAssets.hero} width={1024} height={831} alt="Eine Reisende genießt den Blick vom Tafelberg auf Kapstadt, 2018" />
            <img className="mosaic-street" src={originalAssets.boKaap} width={768} height={1024} fetchPriority="high" alt="Unterwegs zwischen den bunten Häusern von Bo-Kaap, 2024" />
            <img className="mosaic-sunset" src={originalAssets.sunset} width={768} height={1024} alt="Sonnenuntergang an der Küste bei Kapstadt aus Lauras Reisebericht" />
            <img className="mosaic-beach" src={originalAssets.clifton} width={768} height={1024} alt="Strandleben am Clifton 4th Beach in Kapstadt, 2024" />
            <img className="mosaic-penguins" src={originalAssets.boulders} width={1024} height={768} alt="Pinguine am Boulders Beach auf der Kaphalbinsel, 2024" />
          </div>
          <figcaption className="destination-mosaic-caption">
            <span className="inline-flex items-center gap-2 font-medium"><MapPin aria-hidden="true" className="h-4 w-4" />Kapstadt &amp; Kaphalbinsel</span>
            <Link href="/stories" className="inline-flex items-center gap-1 underline underline-offset-4">Reisegeschichten entdecken<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
