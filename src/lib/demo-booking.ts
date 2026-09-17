import { z } from 'zod';
import { demoPaymentMethods, type DemoPaymentMethod } from './payment-methods';
import { originalMentors } from '../components/content/original-mentors';

// Presentation-only catalog. Never pass these IDs/prices to production checkout.
export const DEMO_STORAGE_KEY = 'ssb_demo_journey_v1';
export const demoFeatures = [
  ['infopaket', 'Reisevorbereitung', 'Infos und eine Checkliste für deinen Start.'],
  ['ki', 'KI Local Mentor', 'Ein digitaler Gesprächseinstieg für deine Fragen.'],
  ['kennenlernen', 'Kennenlern-Videocall', '30–45 Minuten für einen ersten persönlichen Austausch.'],
  ['kontakt', 'Comfort-Contact', 'Chatbegleitung vor und während deiner Reise.'],
  ['getready', 'Get-Ready-Videocall', 'Ein kurzer Austausch am Tag vor der Anreise.'],
  ['ankunft', 'Willkommen am Flughafen', 'Orientierung bei deiner Ankunft.'],
  ['treffen', 'Persönliches Treffen', 'Gemeinsam ankommen und erste Fragen besprechen.'],
  ['tour', 'Sightseeing-Tour', 'Eine persönliche Einführung in die Stadt.'],
  ['austausch', 'Intensiver Austausch', 'Tägliche Reise-Updates in der ersten Woche.'],
] as const;
export const demoPackages = [
  { id: 'basis', name: 'Basis', amount: 9500, intro: 'Gut vorbereitet losreisen.', features: ['infopaket', 'ki', 'kennenlernen', 'kontakt'] },
  { id: 'standard', name: 'Standard', amount: 19500, intro: 'Persönlich ankommen.', features: ['infopaket', 'ki', 'kennenlernen', 'kontakt', 'ankunft', 'treffen'] },
  { id: 'premium', name: 'Premium', amount: 29500, intro: 'Noch mehr gemeinsame Zeit.', features: demoFeatures.map(([id]) => id) },
] as const;
export type DemoPackageId = typeof demoPackages[number]['id'];
export const money = (cents: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
export const today = () => { const d = new Date(); return dateOnly(d); };
function dateOnly(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function futureDate(days: number) { const d = new Date(); d.setDate(d.getDate() + days); return dateOnly(d); }
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v => { const d = new Date(`${v}T12:00:00Z`); return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v; });
const tripSchema = z.object({ name: z.string().max(60), arrival: z.string().max(10), departure: z.string().max(10), note: z.string().max(500) });
export type DemoTrip = z.infer<typeof tripSchema>;
export const checklistItems = ['Reisedaten geprüft', 'Fragen fürs Kennenlernen notiert', 'Unterkunft und Ankunft geplant', 'Persönliche Packliste vorbereitet'] as const;
const journeySchema = z.object({
  version: z.literal(1), mentorId: z.string().refine(id => originalMentors.some(m => m.id === id)),
  packageId: z.enum(['basis', 'standard', 'premium']).nullable(), trip: tripSchema, inCart: z.boolean(),
  paymentMethod: z.enum(demoPaymentMethods).default('card'),
  receipt: z.object({ paymentMethod: z.enum(demoPaymentMethods).optional(), reference: z.string().regex(/^DEMO-[A-Z0-9-]{6,40}$/), createdAt: z.string().datetime(), amount: z.number().int() }).nullable(),
  paymentError: z.string().max(160), checklist: z.array(z.number().int().min(0).max(3)).max(4),
  appointment: z.enum(['', '10:00', '14:00', '17:00']), messages: z.array(z.string().min(1).max(500)).max(20),
  cancelled: z.boolean().default(false), refundAmount: z.number().int().min(0).default(0),
  services: z.object({ ready: z.enum(['none','scheduled','completed']).default('none'), arrival: z.enum(['planned','landed','met','arrived']).default('planned'), tour: z.enum(['none','culture','nature']).default('none'), tourDone: z.boolean().default(false), mentorAccepted: z.boolean().default(false) }).default({}),
  notifications: z.array(z.string().max(300)).max(50).default([]), mentorReplies: z.array(z.string().max(500)).max(20).default([]),

});
const stateSchema = journeySchema.extend({ trips: z.array(journeySchema).max(10).default([]) });
export type DemoState = z.infer<typeof stateSchema>;
export function initialDemo(): DemoState {
  return stateSchema.parse({ version: 1, mentorId: 'nomusa-ndlela', packageId: null, trip: { name: 'Anna', arrival: futureDate(21), departure: futureDate(31), note: 'Ich reise zum ersten Mal allein nach Südafrika und möchte entspannt ankommen.' }, inCart: false, receipt: null, paymentError: '', checklist: [], appointment: '', messages: [] });
}
export function tripError(trip: DemoTrip, minDate = today()): string {
  if (!trip.name.trim()) return 'Bitte gib einen Vornamen für deine Demo-Reise ein.';
  if (!date.safeParse(trip.arrival).success || !date.safeParse(trip.departure).success) return 'Bitte wähle gültige Ankunfts- und Abreisedaten.';
  if (trip.arrival < minDate) return 'Deine Ankunft muss heute oder in der Zukunft liegen.';
  if (trip.departure < trip.arrival) return 'Die Abreise darf nicht vor der Ankunft liegen.';
  if ((Date.parse(trip.departure) - Date.parse(trip.arrival)) / 86400000 > 28) return 'Wähle für diese Demo eine Reise von höchstens 28 Tagen.';
  return '';
}
export function restoreDemo(raw: string | null): DemoState {
  try {
    if (!raw) return initialDemo();
    const s = stateSchema.parse(JSON.parse(raw));
    const pkg = demoPackages.find(p => p.id === s.packageId);
    if ((s.inCart || s.receipt) && (!pkg || tripError(s.trip, '0000-00-00'))) return initialDemo();
    if (s.receipt && (s.inCart || s.receipt.amount !== pkg?.amount)) return initialDemo();
    if (s.refundAmount && (!s.cancelled || s.refundAmount !== s.receipt?.amount)) return initialDemo();
    for (const archived of s.trips) {
      const p = demoPackages.find(p => p.id === archived.packageId);
      if (!archived.receipt || archived.inCart || archived.receipt.amount !== p?.amount || tripError(archived.trip, '0000-00-00') || (archived.refundAmount && (!archived.cancelled || archived.refundAmount !== archived.receipt.amount))) return initialDemo();
    }
    if (!s.receipt && (s.checklist.length || s.messages.length || s.appointment)) return initialDemo();
    return s;
  } catch { return initialDemo(); }
}
export type DemoAction =
  | { type: 'restore'; state: DemoState }
  | { type: 'reset' }
  | { type: 'choose'; packageId?: DemoPackageId; mentorId?: string }
  | { type: 'cart'; trip: DemoTrip }
  | { type: 'remove' }
  | { type: 'payment-method'; method: DemoPaymentMethod }
  | { type: 'payment'; outcome: 'success' | 'declined' | 'cancelled'; reference: string; createdAt: string }
  | { type: 'check'; index: number }
  | { type: 'appointment'; time: DemoState['appointment'] }
  | { type: 'message'; text: string }
  | { type: 'service'; service: 'ready' | 'arrival' | 'tour' | 'tourDone' | 'mentorAccepted'; value: string | boolean }
  | { type: 'new-trip' }
  | { type: 'open-trip'; reference: string }
  | { type: 'change-trip'; trip: DemoTrip }
  | { type: 'cancel-trip' }
  | { type: 'mentor-reply'; text: string };
export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'restore': return action.state;
    case 'reset': return initialDemo();
    case 'choose': {
      if (action.mentorId && !originalMentors.some(m => m.id === action.mentorId)) return state;
      if (action.packageId && !demoPackages.some(p => p.id === action.packageId)) return state;
      const mentorId = action.mentorId ?? state.mentorId;
      const packageId = action.packageId ?? state.packageId;
      if (mentorId === state.mentorId && packageId === state.packageId) return state;
      if (state.receipt && state.trips.length >= 10) return state;
      return { ...initialDemo(), trips: state.receipt ? [...state.trips, journeySchema.parse(state)] : state.trips, trip: state.trip, mentorId, packageId };
    }
    case 'cart': {
      const parsed = tripSchema.safeParse(action.trip);
      if (!state.packageId || !parsed.success || tripError(parsed.data) || state.receipt) return state;
      return { ...state, trip: { ...parsed.data, name: parsed.data.name.trim(), note: parsed.data.note.trim() }, inCart: true, paymentError: '' };
    }
    case 'remove': return state.receipt ? state : { ...state, inCart: false, paymentError: '' };
    case 'payment-method': return state.receipt || !z.enum(demoPaymentMethods).safeParse(action.method).success ? state : { ...state, paymentMethod: action.method, paymentError: '' };
    case 'payment': {
      const pkg = demoPackages.find(p => p.id === state.packageId);
      if (state.receipt || !state.inCart || !pkg || tripError(state.trip)) return state;
      if (action.outcome !== 'success') return { ...state, paymentError: action.outcome === 'declined' ? 'Demo-Zahlung abgelehnt. Deine Auswahl bleibt erhalten. Du kannst es erneut versuchen.' : 'Demo-Zahlung abgebrochen. Es wurde nichts bestätigt.' };
      const receipt = { paymentMethod: state.paymentMethod, reference: action.reference, createdAt: action.createdAt, amount: pkg.amount };
      if (!stateSchema.shape.receipt.safeParse(receipt).success) return state;
      return { ...state, receipt, inCart: false, paymentError: '', notifications: ['Demo-Buchung bestätigt. Dein Reiseplan ist bereit.'] };
    }
    case 'check': return !state.receipt || state.cancelled || !Number.isInteger(action.index) || action.index < 0 || action.index >= checklistItems.length ? state : { ...state, checklist: state.checklist.includes(action.index) ? state.checklist.filter(i => i !== action.index) : [...state.checklist, action.index] };
    case 'appointment': return !state.receipt || state.cancelled || !stateSchema.shape.appointment.safeParse(action.time).success ? state : { ...state, appointment: action.time, notifications: [...state.notifications, 'Kennenlerntermin in der Demo aktualisiert.'].slice(-50) };
    case 'message': return !state.receipt || state.cancelled || !action.text.trim() || action.text.length > 500 || state.messages.length >= 20 ? state : { ...state, messages: [...state.messages, action.text.trim()] };
    case 'new-trip': {
      if (state.trips.length >= 10) return state;
      return { ...initialDemo(), trips: state.receipt ? [...state.trips.filter(t => t.receipt?.reference !== state.receipt!.reference), journeySchema.parse(state)] : state.trips };
    }
    case 'open-trip': {
      const selected = state.trips.find(t => t.receipt?.reference === action.reference);
      if (!selected) return state;
      const trips = state.trips.filter(t => t !== selected);
      if (state.receipt) trips.push(journeySchema.parse(state));
      return { ...selected, trips };
    }
    case 'change-trip': {
      const parsed = tripSchema.safeParse(action.trip);
      if (!state.receipt || state.cancelled || !parsed.success || tripError(parsed.data)) return state;
      return { ...state, trip: parsed.data, appointment: '', services: initialDemo().services, notifications: [...state.notifications, 'Reisedaten geändert. Termine und Serviceplanung bitte neu abstimmen.'].slice(-50) };
    }
    case 'cancel-trip': return !state.receipt || state.cancelled ? state : { ...state, cancelled: true, refundAmount: state.receipt.amount, notifications: [...state.notifications, 'Demo-Reise storniert. Vollständige Erstattung simuliert; kein Geldtransfer.'].slice(-50) };
    case 'mentor-reply': return !state.receipt || state.cancelled || !action.text.trim() || action.text.length > 500 || state.mentorReplies.length >= 20 ? state : { ...state, mentorReplies: [...state.mentorReplies, action.text.trim()], notifications: [...state.notifications, 'Neue Antwort aus der Mentor-Gegenansicht.'].slice(-50) };
    case 'service': {
      if (!state.receipt || state.cancelled) return state;
      const allowed = demoPackages.find(p => p.id === state.packageId)!.features as readonly string[];
      const feature = { ready: 'getready', arrival: 'ankunft', tour: 'tour', tourDone: 'tour', mentorAccepted: 'kennenlernen' }[action.service];
      if (!allowed.includes(feature)) return state;
      if (action.service === 'ready' && !((state.services.ready === 'none' && action.value === 'scheduled') || (state.services.ready === 'scheduled' && action.value === 'completed'))) return state;
      if (action.service === 'arrival') {
        const stages = ['planned','landed','met','arrived'];
        if (stages.indexOf(String(action.value)) !== stages.indexOf(state.services.arrival) + 1) return state;
      }
      if (action.service === 'tourDone' && (state.services.tour === 'none' || action.value !== true)) return state;
      const services = journeySchema.shape.services.safeParse({ ...state.services, [action.service]: action.value, ...(action.service === 'tour' ? { tourDone: false } : {}) });
      if (!services.success) return state;
      return { ...state, services: services.data, notifications: [...state.notifications, 'Serviceplanung in der Demo aktualisiert.'].slice(-50) };
    }
    default: return state;
  }
}
