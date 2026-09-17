import { ArrowUpRight } from 'lucide-react';
import { originalAssets } from '@/components/content/original-assets';

/** Editorial brand archive: never used as the photo of an unrelated user story. */
export function OriginalStoryTeaser() {
  return <figure className="my-8 overflow-hidden rounded-2xl border bg-card text-left sm:grid sm:grid-cols-[180px_1fr]">
    <img src={originalAssets.boKaap} alt="Bunte Häuser in Bo-Kaap, Kapstadt, aus Lauras Reisebericht von 2024" width={768} height={1024} loading="lazy"
      className="w-full aspect-[4/3] object-cover object-[50%_72%] sm:aspect-auto sm:h-full" />
    <figcaption className="p-6 flex flex-col justify-center">
      <p className="eyebrow mb-3">Aus dem Markenarchiv · 2024</p>
      <p className="text-xl font-semibold">Unterwegs in Kapstadt.</p>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">Laura erzählt von ihrer Reise durch Südafrika und ihren Eindrücken vor Ort.</p>
      <a className="quiet-link mt-4 text-sm min-h-11" href={originalAssets.storyUrl} target="_blank" rel="noopener noreferrer">Lauras Reisebericht lesen<span className="sr-only"> (öffnet einen neuen Tab)</span><ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
    </figcaption>
  </figure>;
}
