import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Local Mentoren in Südafrika',
  description:
    'Finde verifizierte Local Mentoren in Kapstadt, Johannesburg und Durban für individuelle und sichere Reisebegleitung.',
  openGraph: {
    title: 'Local Mentoren in Südafrika | Stay Safe & Brave',
    description:
      'Finde verifizierte Local Mentoren in Kapstadt, Johannesburg und Durban für individuelle und sichere Reisebegleitung.',
  },
};

export default function MentorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
