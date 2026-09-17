import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Languages, MapPin, MessageCircle, Check } from 'lucide-react';
import { originalMentors, exampleSupport } from '@/components/content/original-mentors';
import { Button } from '@/components/ui/button';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return originalMentors.map(profile => ({ slug: profile.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = originalMentors.find(item => item.id === slug);
  if (!profile) notFound();
  return {
    title: `${profile.name} · ${profile.city}`,
    description: `Lerne das fiktive Beispielprofil von ${profile.name} kennen: persönliche Vorstellung, Sprachen und Interessen.`,
    robots: { index: false, follow: true },
  };
}

export default async function MentorExampleProfile({ params }: Props) {
  const { slug } = await params;
  const profile = originalMentors.find(item => item.id === slug);
  if (!profile) notFound();
  const firstName = profile.name.split(' ')[0];
  const nearby = originalMentors.filter(item => item.city === profile.city && item.id !== profile.id);

  return <div className="page-shell py-8 sm:py-12">
    <Link href={`/mentors?location=${encodeURIComponent(profile.city)}#beispielprofile`} className="quiet-link mb-8 min-h-11 text-sm"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Zurück zu den Profilen in {profile.city}</Link>
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)] lg:gap-14">
      <aside className="min-w-0">
        <figure className="overflow-hidden rounded-3xl bg-muted">
          <img src={profile.image} alt={`Bild des fiktiven Beispielprofils ${profile.name}`} className="aspect-[4/5] w-full object-cover object-top" width={800} height={1000} fetchPriority="high" />
        </figure>
        <div className="mt-5 rounded-2xl border bg-card p-6">
          <h2 className="text-lg">Auf einen Blick</h2>
          <dl className="mt-5 space-y-5 text-sm">
            <div><dt className="mb-1 flex items-center gap-2 text-muted-foreground"><MapPin aria-hidden="true" className="h-4 w-4" />Stadt</dt><dd className="font-medium">{profile.city}, Südafrika</dd></div>
            <div><dt className="mb-1 flex items-center gap-2 text-muted-foreground"><Languages aria-hidden="true" className="h-4 w-4" />Sprachen</dt><dd className="font-medium leading-relaxed">{profile.languages.join(', ')}</dd></div>
            <div><dt className="mb-1 text-muted-foreground">Alter im Beispielprofil</dt><dd className="font-medium">{profile.age} Jahre</dd></div>
          </dl>
        </div>
      </aside>
      <div className="min-w-0">
        <header><span className="inline-flex rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">Beispielprofil · fiktiv</span>
          <h1 className="editorial-title page-title mt-5">{profile.name}</h1><p className="mt-4 text-lg text-muted-foreground">Lokale Perspektiven aus {profile.city}</p>
        </header>
        <section className="mt-9 border-t pt-8" aria-labelledby="profile-about-title">
          <h2 id="profile-about-title" className="text-2xl">Über {firstName}</h2>
          <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">{profile.bio.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
        </section>
        <section className="mt-9" aria-labelledby="profile-interests-title"><h2 id="profile-interests-title" className="text-xl">Interessen &amp; Schwerpunkte</h2>
          <ul className="mt-4 flex flex-wrap gap-2">{profile.interests.map(interest => <li key={interest} className="rounded-full border bg-card px-4 py-2 text-sm">{interest}</li>)}</ul>
        </section>
        <section className="mt-9 rounded-2xl bg-accent/30 p-6 sm:p-8" aria-labelledby="profile-support-title">
          <h2 id="profile-support-title" className="text-2xl">Begleitung im Überblick</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Diese Leistungsbeispiele gehören zum fiktiven Profilkonzept. Sie sind kein buchbares Angebot; Umfang und Preise sind noch nicht verbindlich festgelegt.</p>
          <ul className="mt-6 space-y-4">{exampleSupport.map(support => <li key={support} className="flex items-start gap-3 text-sm leading-relaxed"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span>{support}</span></li>)}</ul>
        </section>
        <section className="mt-8 rounded-2xl bg-secondary/60 p-6">
          <h2 className="text-xl">Mit {firstName} eine Demo-Reise planen</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Probiere mit diesem fiktiven Profil die Paketauswahl, den Warenkorb und eine simulierte Zahlung aus. Es entstehen keine Kosten und keine echte Buchung.</p>
          <Button asChild className="mt-5"><Link href={`/demo?mentor=${profile.id}`}>Demo mit {firstName} starten<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link></Button>
        </section>
        <div className="mt-8 rounded-2xl border p-6">
          <p className="font-medium">Du hast Fragen zur persönlichen Begleitung?</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Dieses Beispielprofil ist nicht buchbar. Unser Team beantwortet dir gern allgemeine Fragen zum Angebot.</p>
          <Button asChild className="mt-5"><Link href="/kontakt"><MessageCircle aria-hidden="true" className="h-4 w-4" />Fragen an unser Team</Link></Button>
        </div>
      </div>
    </div>
    <section className="mt-16 border-t pt-10" aria-labelledby="more-profiles-title">
      <h2 id="more-profiles-title" className="editorial-title section-title">Weitere Beispielprofile aus {profile.city}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{nearby.map(item => <Link key={item.id} href={`/mentors/profil/${item.id}`} className="flex items-center gap-4 rounded-2xl border bg-card p-4 hover:border-primary">
        <img src={item.image} alt={`Bild des fiktiven Beispielprofils ${item.name}`} width={72} height={72} loading="lazy" className="h-16 w-16 shrink-0 rounded-xl object-cover object-top" />
        <span className="min-w-0"><span className="block font-semibold">{item.name}</span><span className="mt-1 block text-xs text-muted-foreground">Beispielprofil · fiktiv</span></span><ArrowUpRight aria-hidden="true" className="ml-auto h-4 w-4 shrink-0" />
      </Link>)}</div>
    </section>
  </div>;
}
