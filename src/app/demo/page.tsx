import { Suspense } from 'react';
import { DemoFlow } from '@/components/demo/demo-flow';
export default function DemoPage() { return <Suspense fallback={<div className="page-shell py-16">Demo wird geladen …</div>}><DemoFlow step="pakete" /></Suspense>; }
