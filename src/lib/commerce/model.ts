import { z } from 'zod';
import {originalMentors} from '../../components/content/original-mentors';
export const idSchema = z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/);
export const offerSchema = z.object({ title: z.string().min(3).max(120), mentorId: idSchema.refine(id=>!originalMentors.some(m=>m.id===id),'Fictional profiles cannot be sold'), mentorName: z.string().min(2).max(100), city: z.string().min(2).max(100), amount: z.number().int().min(50).max(1000000), currency: z.literal('eur'), approved: z.literal(true), profileVerified: z.literal(true), termsVersion: z.string().min(1).max(100), terms: z.string().min(20).max(5000), features: z.array(z.string().min(1).max(200)).min(1).max(15) });
export type Offer = z.infer<typeof offerSchema>;
export const checkoutSchema = z.object({ offerId: idSchema, slotId: idSchema, requestId: z.string().uuid(), acceptedTermsVersion: z.string().min(1).max(100) }).strict();
export const bookingSchema = z.object({ userId: z.string(), email: z.string().email(), offerId: idSchema, slotId: idSchema, offer: offerSchema, arrival: z.string(), departure: z.string(), status: z.enum(['creating','checkout','paid','expired','refund_pending','refunded','refund_failed']), createdAt: z.number(), requestId: z.string().uuid().optional(), sessionId: z.string().optional(), paymentIntent: z.string().optional(), refundId: z.string().optional(), paymentMethods: z.array(z.enum(['card','paypal'])).min(1).max(2).optional() });
export type CommerceBooking = z.infer<typeof bookingSchema>;
export function matchesPayment(b: CommerceBooking, session: { id: string; amount_total: number | null; currency: string | null; payment_status: string; metadata: Record<string,string> | null }, id: string) {
  return session.id === b.sessionId && session.metadata?.bookingId === id && session.amount_total === b.offer.amount && session.currency === b.offer.currency && session.payment_status === 'paid';
}

export function datesForStay(arrival:string,departure:string):string[]{
 const valid=(v:string)=>/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;
 if(!valid(arrival)||!valid(departure))throw new Error('Invalid stay dates');
 const start=Date.parse(arrival),end=Date.parse(departure),days=(end-start)/86400000;
 if(days<0||days>28)throw new Error('Unsupported stay length');
 return Array.from({length:days+1},(_,i)=>new Date(start+i*86400000).toISOString().slice(0,10));
}
