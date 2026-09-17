import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { DemoFlow, type DemoStep } from '@/components/demo/demo-flow';
const steps = ['pakete', 'reisedaten', 'warenkorb', 'bezahlen', 'bestaetigung', 'meine-reise'];
export const dynamicParams = false;
export function generateStaticParams() { return steps.map(step => ({ step })); }
export default async function DemoStepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  if (!steps.includes(step)) notFound();
  return <Suspense fallback={<div className="page-shell py-16">Demo wird geladen …</div>}><DemoFlow step={step as DemoStep} /></Suspense>;
}
