'use client';
import { originalAssets } from '@/components/content/original-assets';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ArrowUpRight, UserRound } from 'lucide-react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
const links = [{href:'/mentors',label:'Local Mentoren'},{href:'/#so-funktionierts',label:'So funktioniert’s'},{href:'/stories',label:'Südafrika entdecken'},{href:'/travel-assistant',label:'Reise planen'},{href:'/demo',label:'Demo erleben'}];
export function Header() {
 const [open,setOpen]=useState(false); const pathname=usePathname(); const {user}=useUser();
 if(pathname.startsWith('/en')) return <header lang="en" className="border-b bg-background"><div className="page-shell flex flex-wrap items-center justify-between gap-4 py-5"><Link href="/en" className="font-semibold">Stay Safe & Brave</Link><nav aria-label="Main navigation" className="flex flex-wrap gap-5 text-sm">{[['Mentors','/en/mentors'],['Packages','/en/packages'],['Demo','/en/demo'],['About','/en/about'],['Join us','/en/join'],['FAQ','/en/faq'],['Deutsch','/']].map(([label,href])=><Link key={href} className="min-h-11 inline-flex items-center" href={href}>{label}</Link>)}</nav></div></header>;
 return <header className={`sticky top-0 z-50 ${pathname === '/' ? 'destination-header' : 'border-b bg-background/95'}`}>
  <div className={`${pathname === '/' ? 'destination-header-inner' : 'page-shell'} flex min-h-20 items-center justify-between gap-3`}>
   <Link href="/" aria-label="Stay Safe & Brave Startseite" className="flex shrink-0 items-center gap-2.5"><img src={originalAssets.logo} width={500} height={500} alt="" className="h-10 w-10 shrink-0 rounded-full"/><span className="text-sm sm:text-base font-semibold leading-tight tracking-tight">Stay Safe &amp; Brave<span className="block text-[10px] font-normal uppercase tracking-widest text-muted-foreground">Südafrika · Lokal verbunden</span></span></Link>
   <nav aria-label="Hauptnavigation" className="hidden xl:flex gap-5">{links.map(l=><Link key={l.href} href={l.href} aria-current={pathname===l.href?'page':undefined} className="text-sm hover:text-primary aria-[current=page]:text-primary">{l.label}</Link>)}</nav>
   <div className="flex items-center gap-2"><Link href="/en" className="px-2 py-3 text-xs" aria-label="Switch to English">EN</Link><Button asChild variant="outline" className="hidden sm:inline-flex"><Link href={user?'/dashboard':'/auth/login'}><UserRound className="h-4 w-4"/>{user?'Meine Reise':'Anmelden'}</Link></Button>
    <Sheet open={open} onOpenChange={setOpen}><SheetTrigger asChild><Button variant="ghost" size="icon" className="xl:hidden" aria-label="Menü öffnen"><Menu/></Button></SheetTrigger><SheetContent className="w-[min(90vw,360px)] overflow-y-auto"><SheetHeader><SheetTitle>Dein nächstes Abenteuer</SheetTitle></SheetHeader><nav aria-label="Mobile Navigation" className="mt-8 flex flex-col">{links.map(l=><Link onClick={()=>setOpen(false)} key={l.href} href={l.href} className="flex items-center justify-between border-b py-5 text-lg">{l.label}<ArrowUpRight className="h-4 w-4"/></Link>)}<Link href={user?'/dashboard':'/auth/login'} onClick={()=>setOpen(false)} className="mt-6 rounded-xl bg-foreground px-5 py-4 text-background">{user?'Meine Reise öffnen':'Anmelden / Registrieren'}</Link><Link href="/warenkorb" onClick={()=>setOpen(false)} className="py-5 text-sm">Meine Auswahl</Link></nav></SheetContent></Sheet>
   </div>
  </div>
 </header>;
}
