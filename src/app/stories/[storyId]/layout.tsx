import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Story',
  description:
    'Authentischer Reisebericht über persönliche Eindrücke, Routen und Reisebegleitung mit einem Local Mentor in Südafrika.',
};

export default function StoryDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
