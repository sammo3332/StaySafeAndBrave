'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Check, CheckCircle2, Download, MapPin, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { originalMentors } from '@/components/content/original-mentors';
import { checklistItems, demoFeatures, demoPackages, money, today, tripError, type DemoTrip } from '@/lib/demo-booking';
import { PaymentMethodPicker } from './payment-method-picker';
import { paymentMethodLabel } from '@/lib/payment-methods';
import { useDemo } from './demo-provider';
import { DemoServices, DemoManagement, DemoTrips } from './demo-services';

export type DemoStep = 'pakete' | 'reisedaten' | 'warenkorb' | 'bezahlen' | 'bestaetigung' | 'meine-reise';
const steps: [DemoStep, string][] = [['pakete', 'Paket'], ['reisedaten', 'Reisedaten'], ['warenkorb', 'Warenkorb'], ['bezahlen', 'Bezahlen'], ['bestaetigung', 'Bestätigung'], ['meine-reise', 'Meine Reise']];
const input = 'mt-2 block w-full min-w-0 rounded-xl border bg-background px-4 py-3 text-base';
const panel = 'rounded-3xl border bg-card p-5 sm:p-8';
function dateLabel(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }); }
function Title({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <header className="mb-9 max-w-3xl"><p className="eyebrow mb-4">{eyebrow}</p><h1 className="editorial-title page-title">{title}</h1>{children && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{children}</p>}</header>;
}
function Go({ to, children, outline = false }: { to: DemoStep; children: ReactNode; outline?: boolean }) {
  return <Button asChild size="lg" variant={outline ? 'outline' : 'default'} className="h-auto min-h-12 whitespace-normal text-center"><Link href={`/demo/${to}`}>{children}</Link></Button>;
}
function Empty({ paid = false }: { paid?: boolean }) {
  return <div className={`${panel} mx-auto max-w-2xl text-center`}><ShoppingBag className="mx-auto mb-5 h-9 w-9 text-primary" aria-hidden="true" /><h1 className="editorial-title text-4xl">{paid ? 'Deine Reise beginnt mit einer Auswahl.' : 'Dein Warenkorb wartet auf dich.'}</h1><p className="my-6 text-muted-foreground">{paid ? 'Hier erscheint deine Reise nach einer erfolgreichen Demo-Zahlung.' : 'Wähle ein Paket und ergänze deine Reisedaten, bevor du weitergehst.'}</p><Go to="pakete">Pakete entdecken <ArrowRight aria-hidden="true" /></Go></div>;
}
export function DemoFlow({ step }: { step: DemoStep }) {
  const { state, dispatch, ready, storageWarning } = useDemo();
  const query = useSearchParams();
  const router = useRouter();
  const mentor = query.get('mentor');
  useEffect(() => { if (ready && mentor && step === 'pakete') dispatch({ type: 'choose', mentorId: mentor }); }, [ready, mentor, step, dispatch]);
  if (!ready) return <div className="page-shell py-16" role="status">Deine Demo-Reise wird vorbereitet …</div>;
  const index = steps.findIndex(([key]) => key === step);
  const canVisit = (key: DemoStep) => key === 'pakete' || (key === 'reisedaten' && !!state.packageId && !state.receipt) || (key === 'warenkorb' && !state.receipt) || (key === 'bezahlen' && state.inCart) || ((key === 'bestaetigung' || key === 'meine-reise') && !!state.receipt);
  return <div className="page-shell py-6 sm:py-10">
    <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-secondary px-5 py-4 text-sm">
      <p><strong className="mr-2">Interaktive Demo</strong>Fiktive Profile & Preise. Keine Abbuchung, keine echte Buchung.</p>
      <details className="text-sm"><summary className="cursor-pointer underline underline-offset-4">Neu beginnen</summary><p className="mt-3 max-w-sm">Dadurch löschst du deine bisherige Demo-Reise auf diesem Gerät.</p><Button variant="outline" className="mt-3" onClick={() => { dispatch({ type: 'reset' }); router.push('/demo'); }}>Demo zurücksetzen</Button></details>
    </div>
    {storageWarning && <p className="mb-5 rounded-xl border p-4 text-sm" role="status">Dein Browser erlaubt das Speichern nicht. Die Demo funktioniert, kann aber nach dem Neuladen verloren gehen.</p>}
    <nav aria-label="Schritte deiner Demo-Reise" className="mb-10"><ol className="grid grid-cols-3 gap-2 md:grid-cols-6">{steps.map(([key, label], i) => <li key={key} className={`min-w-0 border-b-2 pb-3 ${step === key ? 'border-primary' : 'border-border'}`}>
      {canVisit(key) ? <Link href={`/demo/${key}`} aria-current={step === key ? 'step' : undefined} className={`flex min-h-11 items-center gap-2 text-xs sm:text-sm ${step === key ? 'font-semibold text-primary' : ''}`}><span aria-hidden="true" className="font-semibold">0{i + 1}</span>{label}</Link> : <span className="flex min-h-11 items-center gap-2 text-xs text-muted-foreground sm:text-sm"><span aria-hidden="true">0{i + 1}</span>{label}</span>}
    </li>)}</ol><p className="sr-only">Schritt {index + 1} von 6</p></nav>
    {step === 'pakete' && <Packages />}
    {step === 'reisedaten' && (state.receipt ? <AlreadyPaid /> : state.packageId ? <TripForm /> : <Empty />)}
    {step === 'warenkorb' && (state.receipt ? <AlreadyPaid /> : state.inCart ? <Cart /> : <Empty />)}
    {step === 'bezahlen' && (state.receipt ? <AlreadyPaid /> : state.inCart ? <Payment /> : <Empty />)}
    {step === 'bestaetigung' && (state.receipt ? <Confirmation /> : <Empty paid />)}
    {step === 'meine-reise' && (state.receipt ? <Journey key={state.receipt.reference} /> : <Empty paid />)}
    <p className="mt-10 border-t pt-5 text-xs leading-relaxed text-muted-foreground">Deine Eingaben bleiben im Demo-Speicher dieses Browsers. Verwende Beispieldaten. Bestätigungen, Nachrichten und Termine werden ausschließlich simuliert. <Link href="/faq" className="underline underline-offset-4">Fragen zur Demo</Link></p>
  </div>;
}
function Packages() {
  const { state, dispatch } = useDemo();
  const mentor = originalMentors.find(m => m.id === state.mentorId)!;
  return <>
    <DemoTrips /><Title eyebrow="Dein erster Schritt" title="Wähle die Begleitung für deine Reise.">Probiere aus, wie sich persönliche Begleitung anfühlt: Wähle ein Beispielprofil und das Paket für deine Demo-Reise.</Title>
    {state.receipt ? <div className={`${panel} mb-8`}><p className="mb-4">Du hast bereits eine bestätigte Demo-Reise. Öffne sie oder wähle „Neu beginnen“, um einen weiteren Durchlauf zu starten.</p><Go to="meine-reise">Meine Demo-Reise öffnen</Go></div> : <section className={`${panel} mb-8 grid items-center gap-6 sm:grid-cols-[auto_1fr_1fr]`} aria-labelledby="demo-mentor-title">
      <img src={mentor.image} alt={`Fiktives Beispielprofil: ${mentor.name}`} width={96} height={112} className="h-28 w-24 rounded-2xl object-cover object-top" />
      <div><h2 id="demo-mentor-title" className="text-xl">{mentor.name}</h2><p className="mt-2 flex items-center gap-2 text-sm"><MapPin className="h-4 w-4" aria-hidden="true" />{mentor.city}</p><p className="mt-2 text-xs text-muted-foreground">Beispielprofil · fiktiv · {mentor.languages.join(', ')}</p></div>
      <label className="min-w-0 text-sm font-medium">Dein Local Mentor in der Demo<select className={input} value={state.mentorId} onChange={e => dispatch({ type: 'choose', mentorId: e.target.value })}>{originalMentors.map(m => <option key={m.id} value={m.id}>{m.name} · {m.city}</option>)}</select></label>
    </section>}
    <div className="grid gap-5 lg:grid-cols-3">{demoPackages.map(pkg => <article key={pkg.id} className={`${panel} flex flex-col ${state.packageId === pkg.id ? 'border-primary ring-1 ring-primary' : ''}`}>
      <div className="mb-4 min-h-6">{pkg.id === 'standard' && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">Für Annas Beispielreise</span>}</div>
      <h2 className="text-2xl">{pkg.name}</h2><p className="mt-2 text-sm text-muted-foreground">{pkg.intro}</p><p className="mt-6 text-4xl font-semibold tracking-tight">{money(pkg.amount)}</p><p className="mt-1 text-xs text-muted-foreground">Fiktiver Gesamtpreis · 1 Reisende · einmalig</p>
      <ul className="my-7 flex-1 space-y-3">{demoFeatures.filter(([id]) => (pkg.features as readonly string[]).includes(id)).map(([id, title]) => <li key={id} className="flex gap-2 text-sm"><Check aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />{title}</li>)}</ul>
      <Button size="lg" variant={state.packageId === pkg.id ? 'default' : 'outline'} aria-pressed={state.packageId === pkg.id} disabled={!!state.receipt} onClick={() => dispatch({ type: 'choose', packageId: pkg.id })}>{state.packageId === pkg.id ? `${pkg.name} ausgewählt` : `${pkg.name} auswählen`}</Button>
    </article>)}</div>
    {!state.receipt && <div className="my-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-secondary/60 p-5"><p role="status" className="text-sm">{state.packageId ? `${demoPackages.find(p => p.id === state.packageId)!.name} für ${mentor.city} ausgewählt.` : 'Wähle zuerst eines der drei Pakete.'}</p>{state.packageId && <Go to="reisedaten">Reisedaten ergänzen <ArrowRight aria-hidden="true" /></Go>}</div>}
    <section className="mt-12"><h2 className="editorial-title section-title">Was steckt in den Paketen?</h2><p className="mt-3 text-sm text-muted-foreground">Leistungsmodell für die Demo. Diese Übersicht ist kein verbindliches Angebot.</p>
      <div className="mt-6 overflow-x-auto rounded-2xl border" role="region" aria-label="Paketvergleich, horizontal scrollbar" tabIndex={0}><table className="w-full min-w-[540px] text-left text-sm"><caption className="sr-only">Leistungsumfang der drei Demo-Pakete</caption><thead className="bg-secondary"><tr><th scope="col" className="p-4">Leistung</th>{demoPackages.map(p => <th scope="col" key={p.id} className="p-4 text-center">{p.name}</th>)}</tr></thead><tbody>{demoFeatures.map(([id, title]) => <tr key={id} className="border-t"><th scope="row" className="p-4 font-normal">{title}</th>{demoPackages.map(p => <td key={p.id} className="p-4 text-center">{(p.features as readonly string[]).includes(id) ? <><Check className="mx-auto h-4 w-4 text-primary" aria-hidden="true" /><span className="sr-only">Enthalten</span></> : <span aria-label="Nicht enthalten">—</span>}</td>)}</tr>)}</tbody></table></div>
      <div className="mt-6 grid gap-x-8 md:grid-cols-2">{demoFeatures.map(([id, title, description]) => <details key={id} className="border-b py-4"><summary className="cursor-pointer font-medium">{title}</summary><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p></details>)}</div>
    </section>
  </>;
}
function Summary() {
  const { state } = useDemo();
  const pkg = demoPackages.find(p => p.id === state.packageId)!;
  const mentor = originalMentors.find(m => m.id === state.mentorId)!;
  return <aside className={`${panel} h-fit`} aria-label="Deine Auswahl"><p className="eyebrow mb-5">Deine Demo-Reise</p><div className="flex items-center gap-4"><img src={mentor.image} alt={`Fiktives Beispielprofil ${mentor.name}`} width={64} height={72} className="h-[72px] w-16 rounded-xl object-cover object-top" /><div><h2 className="text-lg">{mentor.name}</h2><p className="text-sm text-muted-foreground">{mentor.city} · Beispielprofil</p></div></div><dl className="mt-6 space-y-4 text-sm"><div className="flex justify-between gap-4"><dt>Paket</dt><dd className="font-medium">{pkg.name}</dd></div><div className="flex justify-between gap-4"><dt>Reisende</dt><dd className="text-right">{state.trip.name} · allein unterwegs</dd></div><div><dt className="text-muted-foreground">Reisezeit</dt><dd className="mt-1">{dateLabel(state.trip.arrival)} – {dateLabel(state.trip.departure)}</dd></div><div className="flex justify-between gap-4 border-t pt-5 text-lg"><dt>Demo-Gesamtpreis</dt><dd className="font-semibold">{money(pkg.amount)}</dd></div>{state.receipt && <div className="border-t pt-4"><dt className="text-muted-foreground">Simulierte Zahlungsmethode</dt><dd className="mt-1 font-medium">{paymentMethodLabel(state.receipt.paymentMethod)}</dd></div>}</dl><p className="mt-3 text-xs text-muted-foreground">Heute tatsächlich zu zahlen: 0,00 €. Kein Geldtransfer.</p></aside>;
}
function TripForm() {
  const { state, dispatch } = useDemo();
  const [trip, setTrip] = useState<DemoTrip>(state.trip);
  const [error, setError] = useState('');
  const router = useRouter();
  function submit(event: FormEvent) { event.preventDefault(); const issue = tripError(trip); setError(issue); if (issue) return; dispatch({ type: 'cart', trip }); router.push('/demo/warenkorb'); }
  return <><Title eyebrow="Persönlich geplant" title="Wie sieht deine Reise aus?">Anna reist allein nach Südafrika. Du kannst die Beispieldaten anpassen und deinen eigenen Demo-Durchlauf gestalten.</Title><div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]"><form onSubmit={submit} className={panel}>
    <label className="block text-sm font-medium">Dein Vorname (Beispieldaten)<input className={input} value={trip.name} required maxLength={60} autoComplete="off" onChange={e => setTrip({ ...trip, name: e.target.value })} /></label>
    <div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="min-w-0 text-sm font-medium">Ankunft<input className={input} type="date" required min={today()} value={trip.arrival} onChange={e => setTrip({ ...trip, arrival: e.target.value })} /></label><label className="min-w-0 text-sm font-medium">Abreise<input className={input} type="date" required min={trip.arrival || today()} value={trip.departure} onChange={e => setTrip({ ...trip, departure: e.target.value })} /></label></div>
    <p className="mt-3 text-xs text-muted-foreground">Für diese Demo: eine alleinreisende Person, höchstens 28 Reisetage.</p>
    <label className="mt-6 block text-sm font-medium">Was wünschst du dir? (optional)<textarea className={`${input} min-h-28`} maxLength={500} value={trip.note} onChange={e => setTrip({ ...trip, note: e.target.value })} /></label>
    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
    <div className="mt-7 flex flex-wrap gap-3"><Button type="submit" size="lg">{state.inCart ? 'Warenkorb aktualisieren' : 'In den Demo-Warenkorb'}<ShoppingBag aria-hidden="true" className="h-4 w-4" /></Button><Go to="pakete" outline>Auswahl ändern</Go></div>
  </form><div className={`${panel} bg-secondary/40`}><Sparkles aria-hidden="true" className="mb-5 h-7 w-7 text-primary" /><h2 className="text-xl">So geht es weiter.</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Die nächsten Schritte zeigen dir, wie eine Buchung aussehen könnte. Du brauchst weder ein Konto noch eine E-Mail-Adresse oder Zahlungsdaten.</p><p className="mt-5 text-sm">Ausgewählt: {demoPackages.find(p => p.id === state.packageId)!.name} · {originalMentors.find(m => m.id === state.mentorId)!.city}</p></div></div></>;
}
function Cart() {
  const { state, dispatch } = useDemo();
  const issue = tripError(state.trip);
  return <><Title eyebrow="Deine Auswahl" title="Deine Auswahl im Überblick.">Prüfe Paket, Profil und Reisedaten, bevor du die Zahlung ausprobierst.</Title><div className="grid gap-6 lg:grid-cols-2"><Summary /><section className={panel}><h2 className="text-2xl">Bereit für den nächsten Schritt?</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Im nächsten Schritt kannst du eine erfolgreiche oder abgelehnte Zahlung simulieren. Deine Auswahl ist noch nicht bestätigt.</p>{state.trip.note && <blockquote className="mt-6 rounded-xl bg-muted p-4 text-sm leading-relaxed">{state.trip.note}</blockquote>}{state.paymentError && <p role="status" className="mt-4 text-sm">{state.paymentError}</p>}{issue && <p role="alert" className="mt-4 text-sm text-destructive">{issue} Bitte korrigiere deine Reisedaten.</p>}<div className="mt-7 flex flex-wrap gap-3">{!issue && <Go to="bezahlen">Zur Demo-Zahlung <ArrowRight aria-hidden="true" /></Go>}<Go to="reisedaten" outline>Reisedaten ändern</Go></div><div className="mt-6 flex flex-wrap gap-5 text-sm"><Link className="quiet-link" href="/demo/pakete">Paket oder Profil wechseln</Link><button className="quiet-link min-h-11" onClick={() => dispatch({ type: 'remove' })}>Paket entfernen</button></div></section></div></>;
}
function AlreadyPaid() { return <div className={`${panel} max-w-2xl`}><CheckCircle2 className="mb-5 h-9 w-9 text-primary" aria-hidden="true" /><h1 className="editorial-title text-4xl">Deine Demo-Reise ist bestätigt.</h1><p className="my-5">Du musst nicht erneut bezahlen. Deine Bestätigung und Reiseübersicht sind bereit.</p><Go to="meine-reise">Meine Demo-Reise öffnen</Go></div>; }
function Payment() {
  const { state, dispatch } = useDemo();
  const [outcome, setOutcome] = useState<'success' | 'declined'>('success');
  const [consent, setConsent] = useState(false);
  const [processing, setProcessing] = useState(false);
  const locked = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const router = useRouter();
  useEffect(() => () => clearTimeout(timer.current), []);
  const issue = tripError(state.trip);
  function pay(event: FormEvent) {
    event.preventDefault(); if (!consent || locked.current || issue) return;
    locked.current = true; setProcessing(true);
    timer.current = setTimeout(() => {
      dispatch({ type: 'payment', outcome, reference: `DEMO-${crypto.randomUUID().slice(0, 13).toUpperCase()}`, createdAt: new Date().toISOString() });
      locked.current = false; setProcessing(false);
      if (outcome === 'success') router.push('/demo/bestaetigung');
    }, 650);
  }
  return <><Title eyebrow="Ohne echtes Geld" title="Probiere die Zahlung aus.">Hier entscheidest du selbst, wie der Test ausgeht. Es werden keine Karten- oder Bankdaten abgefragt.</Title><div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]"><form className={panel} onSubmit={pay}>
    <PaymentMethodPicker value={state.paymentMethod} disabled={processing} onChange={method => { dispatch({ type: 'payment-method', method }); setConsent(false); }} />
    <fieldset disabled={processing}><legend className="mb-3 text-sm font-medium">Welchen Fall möchtest du testen?</legend><div className="space-y-3">{([['success', 'Zahlung erfolgreich'], ['declined', 'Zahlung abgelehnt']] as const).map(([value, label]) => <label key={value} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm"><input className="h-4 w-4 accent-[hsl(var(--primary))]" type="radio" name="outcome" checked={outcome === value} onChange={() => setOutcome(value)} />{label}</label>)}</div></fieldset>
    <label className="mt-6 flex items-start gap-3 text-sm leading-relaxed"><input className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]" type="checkbox" required disabled={processing} checked={consent} onChange={e => setConsent(e.target.checked)} />Ich möchte eine fiktive Buchung simulieren. Es entstehen keine Kosten und kein Anspruch auf Leistungen.</label>
    <div aria-live="polite" className="mt-4 text-sm">{processing ? 'Demo-Zahlung wird simuliert …' : state.paymentError && <p className="rounded-xl bg-destructive/5 p-4 text-destructive">{state.paymentError}</p>}</div>
    {issue && <p role="alert" className="mt-4 text-sm text-destructive">{issue} <Link className="underline" href="/demo/reisedaten">Reisedaten ändern</Link></p>}
    <Button size="lg" className="mt-5 h-auto min-h-12 w-full whitespace-normal" type="submit" disabled={!consent || processing || !!issue}>{processing ? 'Einen Moment …' : state.paymentError ? 'Demo-Zahlung erneut versuchen' : `${paymentMethodLabel(state.paymentMethod)} simulieren`}</Button>
    <button type="button" disabled={processing} className="mt-4 min-h-11 text-sm underline underline-offset-4 disabled:opacity-50" onClick={() => { dispatch({ type: 'payment', outcome: 'cancelled', reference: '', createdAt: '' }); router.push('/demo/warenkorb'); }}>Abbrechen und zum Warenkorb</button>
  </form><Summary /></div></>;
}
function Confirmation() {
  const { state } = useDemo();
  const mentor = originalMentors.find(m => m.id === state.mentorId)!;
  const pkg = demoPackages.find(p => p.id === state.packageId)!;
  const receipt = state.receipt!;
  if (state.cancelled) return <><Title eyebrow="Demo-Storno" title="Diese Demo-Reise wurde storniert." /><DemoManagement /><DemoTrips /></>;
  function download() {
    const text = `STAY SAFE & BRAVE – DEMO-BESTÄTIGUNG\nKeine echte Buchung, keine Rechnung, kein Geldtransfer.\n\n${receipt.reference}\nErstellt: ${new Date(receipt.createdAt).toLocaleString('de-DE')}\nReisende: ${state.trip.name}\nBeispielprofil: ${mentor.name} (fiktiv), ${mentor.city}\nPaket: ${pkg.name}\nReise: ${dateLabel(state.trip.arrival)} bis ${dateLabel(state.trip.departure)}\nFiktiver Gesamtpreis: ${money(receipt.amount)}\nSimulierte Zahlungsmethode: ${paymentMethodLabel(receipt.paymentMethod)}\nTatsächlich gezahlt: 0,00 €\n\nNur eine lokale Simulation. Keine Nachricht wurde versendet.`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${receipt.reference}.txt`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <><div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-secondary"><CheckCircle2 className="h-7 w-7 text-primary" aria-hidden="true" /></div><Title eyebrow="Demo-Zahlung erfolgreich" title={`${state.trip.name}, deine Demo-Reise steht.`}>Deine Auswahl ist gespeichert. Du kannst jetzt den Beleg herunterladen und deine Reise vorbereiten.</Title><div className="mb-8 flex flex-wrap gap-3"><Go to="meine-reise">Meine Reise entdecken <ArrowRight aria-hidden="true" /></Go><Button variant="outline" size="lg" onClick={download}><Download className="h-4 w-4" aria-hidden="true" />Demo-Beleg herunterladen</Button></div><div className="grid gap-6 lg:grid-cols-2"><Summary /><section className={panel}><p className="eyebrow">Demo-Posteingang</p><h2 className="mt-4 text-2xl">Deine Reise nach {mentor.city}</h2><p className="mt-2 text-xs text-muted-foreground">Nachrichtenvorschau · keine E-Mail versendet</p><div className="mt-6 space-y-4 text-sm leading-relaxed"><p>Hallo {state.trip.name},</p><p>deine simulierte Auswahl ist bestätigt: {pkg.name} mit dem Beispielprofil {mentor.name}. In deiner Reiseübersicht kannst du jetzt eine Checkliste abhaken, einen Kennenlerntermin auswählen und den Demo-Chat ausprobieren.</p><p className="rounded-xl bg-muted p-4 font-mono text-xs">{receipt.reference}</p><p className="text-muted-foreground">Erstellt am {new Date(receipt.createdAt).toLocaleString('de-DE')}. Diese Bestätigung existiert nur in deinem Browser.</p></div></section></div></>;
}
function Journey() {
  const { state, dispatch } = useDemo();
  const [message, setMessage] = useState('');
  const [time, setTime] = useState<typeof state.appointment>(state.appointment || '10:00');
  const mentor = originalMentors.find(m => m.id === state.mentorId)!;
  const pkg = demoPackages.find(p => p.id === state.packageId)!;
  const beforeArrival = new Date(`${state.trip.arrival}T12:00:00`); beforeArrival.setDate(beforeArrival.getDate() - 7);
  const earliestCall = new Date(`${today()}T12:00:00`);
  if (beforeArrival < earliestCall) beforeArrival.setTime(earliestCall.getTime());
  const callDay = beforeArrival.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  function send(event: FormEvent) { event.preventDefault(); if (!message.trim()) return; dispatch({ type: 'message', text: message }); setMessage(''); }
  if (state.cancelled) return <><Title eyebrow="Demo-Storno" title="Deine stornierte Reise" /><DemoManagement /><DemoTrips /></>;
  return <><DemoTrips /><Title eyebrow="Meine Demo-Reise" title={`Willkommen in deinem Reiseplan, ${state.trip.name}.`}>Dein persönlicher Überblick für {mentor.city}. Von der ersten Frage bis zum Ankommen – probiere die nächsten Schritte aus.</Title><div className="mb-8 flex flex-wrap gap-3"><Go to="bestaetigung" outline>Bestätigung ansehen</Go><a href="#demo-chat" className="quiet-link min-h-12 text-sm">Zum Demo-Chat <ArrowRight className="h-4 w-4" aria-hidden="true" /></a></div>
    <DemoServices /><DemoManagement /><div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]"><div className="space-y-6">
      <section className={panel}><div className="flex items-start justify-between gap-3"><h2 className="text-2xl">Deine Reisecheckliste</h2><span className="text-sm">{state.checklist.length}/{checklistItems.length}</span></div><progress className="my-5 h-2 w-full accent-[hsl(var(--primary))]" aria-label="Fortschritt der Reisecheckliste" max={4} value={state.checklist.length} /><ul className="space-y-2">{checklistItems.map((label, index) => <li key={label}><label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl bg-muted/50 p-3 text-sm"><input type="checkbox" className="h-5 w-5 shrink-0 accent-[hsl(var(--primary))]" checked={state.checklist.includes(index)} onChange={() => dispatch({ type: 'check', index })} /><span className={state.checklist.includes(index) ? 'text-muted-foreground line-through' : ''}>{label}</span></label></li>)}</ul><p className="mt-4 text-xs text-muted-foreground">Demo-Vorbereitungshilfe. Ein vollständiges Reise-Infopaket ist noch nicht hinterlegt.</p></section>
      <section className={panel}><h2 className="text-2xl">Ein erstes Kennenlernen</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Wähle eine fiktive Uhrzeit für ein Videogespräch mit {mentor.name.split(' ')[0]}. Es wird kein Termin verschickt und kein Videoraum erstellt.</p><p className="mt-5 font-medium">{callDay} · 30 Minuten</p><p className="mt-1 text-xs text-muted-foreground">Beispieltermin vor der Reise (bei kurzfristiger Ankunft heute) · Uhrzeit Südafrika (UTC+2)</p><form onSubmit={e => { e.preventDefault(); dispatch({ type: 'appointment', time }); }} className="mt-4"><label className="text-sm">Uhrzeit<select className={input} value={time} onChange={e => setTime(e.target.value as typeof time)}>{['10:00', '14:00', '17:00'].map(t => <option key={t}>{t}</option>)}</select></label><Button type="submit" variant="outline" className="mt-4">{state.appointment ? 'Demo-Termin ändern' : 'Demo-Termin vormerken'}</Button></form><div role="status">{state.appointment && <p className="mt-4 rounded-xl bg-secondary p-4 text-sm">In deiner Demo vorgemerkt: {callDay}, {state.appointment} Uhr.</p>}</div></section>
      <section id="demo-chat" className={`${panel} scroll-mt-28`}><h2 className="text-2xl">Dein Kontakt vor Ort</h2><p className="mt-3 text-sm text-muted-foreground">Chat-Simulation mit {mentor.name.split(' ')[0]}. Antworten sind vorformuliert; niemand erhält diese Nachrichten.</p><div role="log" aria-label="Demo-Chatverlauf" aria-live="polite" className="mt-5 max-h-80 space-y-4 overflow-y-auto rounded-xl bg-muted/40 p-4">
        <p className="rounded-xl bg-background p-4 text-sm leading-relaxed"><strong className="mb-1 block">Demo-Assistent</strong>Hallo {state.trip.name}! Hier kannst du ausprobieren, wie du Fragen vor deiner Reise stellen würdest.</p>
        {state.messages.map((text, i) => <div key={i} className="space-y-3"><p className="ml-4 rounded-xl bg-foreground p-4 text-sm text-background"><strong className="mb-1 block">Du</strong>{text}</p><p className="mr-4 rounded-xl bg-background p-4 text-sm leading-relaxed"><strong className="mb-1 block">Automatische Demo-Antwort</strong>Danke für deine Nachricht! In einer echten Begleitung würde dein Local Mentor persönlich auf deine Frage eingehen. Für den Test kannst du als Nächstes einen Kennenlerntermin vormerken.</p></div>)}
      </div><form onSubmit={send} className="mt-4"><label className="text-sm font-medium">Deine Demo-Nachricht<textarea className={`${input} min-h-24`} maxLength={500} value={message} onChange={e => setMessage(e.target.value)} placeholder="Zum Beispiel: Wie läuft unser erstes Kennenlernen ab?" disabled={state.messages.length >= 20} /></label><Button className="mt-3" type="submit" disabled={!message.trim() || state.messages.length >= 20}>Nachricht simulieren</Button>{state.messages.length >= 20 && <p className="mt-3 text-xs">20 Nachrichten erreicht. Starte die Demo neu für einen weiteren Durchlauf.</p>}</form></section>
    </div><div className="space-y-6"><Summary /><section className={panel}><h2 className="text-xl">In deinem {pkg.name}-Paket</h2><ul className="mt-5 space-y-4">{demoFeatures.filter(([id]) => (pkg.features as readonly string[]).includes(id)).map(([id, title, description]) => <li key={id} className="border-b pb-4 last:border-0"><h3 className="text-sm">{title}</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p></li>)}</ul><p className="text-xs text-muted-foreground">Diese Liste beschreibt das Demo-Paket. Reale Leistungen werden hier nicht erbracht. Weitere Service-Simulationen findest du oberhalb dieser Übersicht.</p></section></div></div>
  </>;
}
