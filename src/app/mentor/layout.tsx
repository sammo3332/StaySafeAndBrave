import Link from 'next/link';
export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="workspace-shell">
      <nav aria-label="Mentorbereich" className="mb-6 flex flex-wrap gap-5 text-sm"><Link href="/mentor/bookings">Reisebegleitungen</Link><Link href="/mentor/messages">Bestehende Nachrichten</Link></nav>
      {children}
    </div>
  );
}
