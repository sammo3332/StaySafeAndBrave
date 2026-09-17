'use client';

import { Suspense, useContext, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc } from 'firebase/firestore';
import { useFirestore, useMemoFirebase } from '@/firebase';
import { usePublicDocument } from '@/hooks/use-public-document';
import { publicMentor } from '@/components/content/public-data';
import { getPackages } from '@/lib/packages';
import { CartContext } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

function Packages() {
  const params = useSearchParams();
  const router = useRouter();
  const mentorId = params.get('mentor');
  const db = useFirestore();
  const ref = useMemoFirebase(() => db && mentorId ? doc(db, 'mentors', mentorId) : null, [db, mentorId]);
  const { data, isLoading, error } = usePublicDocument<unknown>(ref);
  const mentor = publicMentor(data);
  const available = mentor && mentor.active !== false;
  const { cart, addToCart } = useContext(CartContext);
  const [selected, setSelected] = useState(cart?.packageId || '');
  const packages = getPackages();

  function proceed() {
    const pkg = packages.find(p => p.id === selected);
    if (!pkg || !available || !mentorId) return;
    addToCart({ packageId: pkg.id, packageName: pkg.name, mentorId,
      mentorName: [mentor.firstName, mentor.lastName].filter(Boolean).join(' '),
      priceAmount: pkg.priceAmount, priceLabel: pkg.priceLabel || 'In Abstimmung' });
    router.push('/booking');
  }

  return <div className="page-shell py-12 max-w-5xl">
    <header className="max-w-3xl">
      <p className="eyebrow mb-4">Persönliche Begleitung</p>
      <h1 className="editorial-title page-title">Unterstützung für<br />deine Südafrika-Reise.</h1>
      <p className="mt-6 text-lg text-muted-foreground leading-relaxed">Unsere Unterstützungsoptionen werden noch abgestimmt. Leistungen und Preise sind derzeit nicht verbindlich definiert. Deine Anfrage beschreibt zunächst, was du dir für deine Reise wünschst.</p>
    </header>
    <section className="my-8 rounded-3xl border bg-secondary/60 p-6 sm:p-8" aria-labelledby="demo-packages-title">
      <p className="eyebrow">Interaktiv ausprobieren</p><h2 id="demo-packages-title" className="editorial-title mt-3 text-3xl">Deine Reise. Vom Paket bis zur Bestätigung.</h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">Entdecke Basis, Standard und Premium mit fiktiven Preisen ab 95 €. Spiele eine vollständige Buchung durch – mit Warenkorb, Demo-Zahlung und deiner persönlichen Reiseübersicht.</p>
      <Button asChild size="lg" className="mt-5"><Link href="/demo">Pakete in der Demo vergleichen<ArrowRight aria-hidden="true" /></Link></Button><p className="mt-3 text-xs text-muted-foreground">Ohne Anmeldung. Keine echte Buchung oder Abbuchung.</p>
    </section>
    <ol className="grid gap-6 md:grid-cols-3 my-10">
      {[
        ['Kennenlernen', 'Entdecke verfügbare Local-Mentor-Profile und ihre lokalen Perspektiven.'],
        ['Wünsche teilen', 'Beschreibe deinen Zeitraum, deine Interessen und deine Fragen.'],
        ['Details klären', 'Umfang und Konditionen werden vor einer Bestätigung abgestimmt.'],
      ].map(([title, description], index) => <li key={title} className="border-t pt-5">
        <span className="eyebrow">0{index + 1}</span><h2 className="text-lg mt-3">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </li>)}
    </ol>
    <section className="rounded-2xl bg-muted/60 p-6 sm:p-8">
      {mentorId ? (!db || isLoading ? <p role="status">Dein ausgewähltes Profil wird geladen …</p>
        : error ? <p role="alert">Das ausgewählte Profil konnte nicht geladen werden. Bitte versuche es später erneut.</p>
        : !available ? <p>Dieses Profil ist gerade nicht verfügbar. Entdecke andere Local Mentoren.</p>
        : <>
          <h2 className="text-xl">Anfrage an {mentor.firstName || mentor.lastName}</h2>
          <p className="mt-3 text-sm text-muted-foreground">Wähle ein Paket als Ausgangspunkt für deine Anfrage. Welche Leistungen es umfasst und was sie kosten, muss vor einer Buchung persönlich vereinbart werden.</p>
          <fieldset className="mt-5">
            <legend className="font-medium text-sm mb-3">Paket für deine Anfrage</legend>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              {packages.map(pkg => <label key={pkg.id} className="flex items-center gap-3 rounded-xl border bg-background p-4 cursor-pointer">
                <input className="h-4 w-4 accent-[hsl(var(--primary))]" type="radio" name="package" value={pkg.id} checked={selected === pkg.id} onChange={() => setSelected(pkg.id)} />{pkg.name}
              </label>)}
            </div>
          </fieldset>
          <Button className="mt-6 w-full sm:w-auto" size="lg" disabled={!selected} onClick={proceed}>Zeitraum & Wünsche angeben<ArrowRight /></Button>
        </>) : <>
        <h2 className="text-xl">Wähle zuerst einen Local Mentor.</h2>
        <p className="mt-3 text-sm text-muted-foreground">Bei einem verfügbaren Profil kannst du deine Anfrage starten. Wenn noch kein passendes Profil dabei ist, erreichst du uns über die Kontaktseite.</p>
      </>}
      <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-4">
        {(!mentorId || !available) && <Button asChild><Link href="/mentors">Local Mentor finden</Link></Button>}
        <Link className="quiet-link text-sm min-h-11" href="/angebote">Freigegebene Angebote & Buchungen</Link>
        <Link className="quiet-link text-sm min-h-11" href="/kontakt">Fragen zur Begleitung</Link>
      </div>
      <p className="mt-6 border-t pt-4 text-sm text-muted-foreground">Eine Anfrage ist noch keine bestätigte Buchung. Online-Zahlungen sind derzeit nicht verfügbar.</p>
    </section>
  </div>;
}

export default function Page() {
  return <Suspense fallback={<div className="page-shell py-16" role="status">Angebotsstand wird geladen …</div>}><Packages /></Suspense>;
}
