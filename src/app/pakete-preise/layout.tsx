import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Begleitpakete & Preise',
  description:
    'Übersicht unserer Begleitpakete Basis, Standard und Premium. Individuelle Reisebegleitung durch geprüfte Local Mentoren in Südafrika.',
  openGraph: {
    title: 'Begleitpakete & Preise | Stay Safe & Brave',
    description:
      'Übersicht unserer Begleitpakete Basis, Standard und Premium. Individuelle Reisebegleitung durch geprüfte Local Mentoren in Südafrika.',
  },
};

export default function PaketePreiseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
