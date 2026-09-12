import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Local Mentor Profil',
  description:
    'Lerne deinen persönlichen Local Mentor in Südafrika kennen: Regionen, Fachgebiete, Sprachen und Begleitungsoptionen.',
};

export default function MentorDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
