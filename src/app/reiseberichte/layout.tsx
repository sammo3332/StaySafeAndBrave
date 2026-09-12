import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mein Reisetagebuch',
  description: 'Persönliches Reisetagebuch für deine Reiseerlebnisse in Südafrika.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReiseberichteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
