import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Local Mentoren in Südafrika',
  description:
    'Entdecke Local Mentoren in Kapstadt, Johannesburg und Durban für persönliche Reisebegleitung.',
  openGraph: {
    title: 'Local Mentoren in Südafrika | Stay Safe & Brave',
    description:
      'Entdecke Local Mentoren in Kapstadt, Johannesburg und Durban für persönliche Reisebegleitung.',
  },
};

export default function MentorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
