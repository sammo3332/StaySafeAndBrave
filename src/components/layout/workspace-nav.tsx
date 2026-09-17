"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const links=[['Übersicht','/dashboard'],['Anfragen','/dashboard/bookings'],['Buchungen','/angebote'],['Nachrichten','/dashboard/messages'],['Tagebuch','/reiseberichte'],['Profil','/dashboard/settings']];
export function WorkspaceNav(){const path=usePathname();return <nav aria-label="Meine Reise" className="mb-8 flex flex-wrap gap-1 border-b pb-4">{links.map(([label,href])=><Link key={href} href={href} aria-current={(path===href || (href==='/dashboard/messages'&&path.startsWith(href)))?'page':undefined} className="rounded-full px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted aria-[current=page]:bg-foreground aria-[current=page]:text-background">{label}</Link>)}</nav>}
