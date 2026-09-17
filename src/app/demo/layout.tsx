import type { Metadata } from 'next';
import { DemoProvider } from '@/components/demo/demo-provider';
export const metadata: Metadata = { title: 'Deine Demo-Reise · Stay Safe & Brave', robots: { index: false, follow: false } };
export default function DemoLayout({ children }: { children: React.ReactNode }) { return <DemoProvider>{children}</DemoProvider>; }
