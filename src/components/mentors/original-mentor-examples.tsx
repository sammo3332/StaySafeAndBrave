'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { originalMentors } from '@/components/content/original-mentors';
import { ContentImage } from '@/components/ui/content-image';

export function OriginalMentorExamples({ preview = false, initialCity = '' }: { preview?: boolean; initialCity?: string }) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const cities = ['Kapstadt', 'Johannesburg', 'Durban'];
  const activeCity = selectedCity ?? (cities.includes(initialCity) ? initialCity : '');
  const profiles = preview
    ? originalMentors.filter((_, index) => [0, 3, 6].includes(index))
    : originalMentors.filter(profile => !activeCity || profile.city === activeCity);
  const titleId = preview ? 'original-mentors-preview-title' : 'original-mentors-title';

  return <section id={preview ? 'original-mentors-preview' : 'beispielprofile'} aria-labelledby={titleId} className="mt-12 border-t pt-10">
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div className="max-w-2xl"><p className="eyebrow mb-3">Menschen & Perspektiven</p>
        <h2 id={titleId} className="editorial-title section-title">Lerne die Profile kennen.</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Entdecke persönliche Vorstellungen, Sprachen und Interessen. Diese <strong className="font-semibold text-foreground">fiktiven Beispielprofile</strong> veranschaulichen lokale Begleitung und sind nicht buchbar.</p>
      </div>
      {preview ? <Link href="/mentors#beispielprofile" className="quiet-link min-h-11 shrink-0 text-sm">Alle neun Beispiele ansehen<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link>
        : <div className="shrink-0"><label htmlFor="original-mentor-city" className="mb-2 block text-sm font-medium">Beispielprofile nach Stadt</label>
          <select id="original-mentor-city" value={activeCity} onChange={event => setSelectedCity(event.target.value)} className="min-h-11 w-full rounded-xl border bg-background px-4 py-3 text-sm sm:w-56">
            <option value="">Alle Städte</option>{cities.map(city => <option key={city} value={city}>{city}</option>)}
          </select>
        </div>}
    </div>
    {!preview && <p role="status" className="mt-5 text-sm text-muted-foreground">{profiles.length} fiktive Beispielprofile{activeCity ? ` · ${activeCity}` : ''}</p>}
    <div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {profiles.map(profile => <article key={profile.id} className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div className="relative">
          <Link href={`/mentors/profil/${profile.id}`} aria-label={`Profil von ${profile.name} ansehen`}><ContentImage src={profile.image} alt={`Bild zum fiktiven Beispielprofil ${profile.name}`} fallback={`Profilbild zu ${profile.name} gerade nicht verfügbar`} className="aspect-[4/3] w-full object-top" /></Link>
          <span className="absolute left-3 top-3 rounded-full bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">Beispielprofil · fiktiv</span>
        </div>
        <div className="p-5"><h3 className="text-xl"><Link href={`/mentors/profil/${profile.id}`}>{profile.name}</Link></h3>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin aria-hidden="true" className="h-4 w-4" />{profile.city}</p>
          <p className="mt-3 text-sm text-muted-foreground">{profile.languages.join(' · ')}</p>
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{profile.bio[0]}</p>
          <div className="mt-4 flex flex-wrap gap-2">{profile.interests.slice(0, 2).map(interest => <span key={interest} className="rounded-full border px-2.5 py-1 text-xs">{interest}</span>)}</div>
          <Link href={`/mentors/profil/${profile.id}`} className="quiet-link mt-4 min-h-11 text-sm">Profil ansehen<ArrowUpRight aria-hidden="true" className="h-4 w-4" /><span className="sr-only">: {profile.name}</span></Link>
        </div>
      </article>)}
    </div>
  </section>;
}
