import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Stories aus Südafrika',
  description:
    'Echte Reiseberichte und Erlebnisse von Reisenden, die Südafrika selbstbestimmt und sicher mit unseren Local Mentoren bereist haben.',
  openGraph: {
    title: 'Travel Stories aus Südafrika | Stay Safe & Brave',
    description:
      'Echte Reiseberichte und Erlebnisse von Reisenden, die Südafrika selbstbestimmt und sicher mit unseren Local Mentoren bereist haben.',
  },
};

export default function StoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
