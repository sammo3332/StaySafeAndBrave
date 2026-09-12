import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kontakt',
  description:
    'Hast du Fragen zu Stay Safe & Brave, zur Buchung oder zu unseren Local Mentoren? Kontaktiere unser Team direkt.',
  openGraph: {
    title: 'Kontakt | Stay Safe & Brave',
    description:
      'Hast du Fragen zu Stay Safe & Brave, zur Buchung oder zu unseren Local Mentoren? Kontaktiere unser Team direkt.',
  },
};

export default function KontaktLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
