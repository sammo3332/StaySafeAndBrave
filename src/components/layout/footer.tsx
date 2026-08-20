
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HeartHandshake, Facebook, Instagram, Twitter, Youtube, Linkedin, Send } from 'lucide-react';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-muted/50 py-12 text-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand and About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-2" prefetch={false}>
              <HeartHandshake className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Stay Safe & Brave</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Authentische und sichere Reiseerlebnisse in Südafrika mit lokalen Mentoren.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mentors" className="hover:text-primary hover:underline">Finde einen Mentor</Link></li>
              <li><Link href="/reiseberichte" className="hover:text-primary hover:underline">Reiseberichte</Link></li>
              <li><Link href="/pakete-preise" className="hover:text-primary hover:underline">Pakete & Preise</Link></li>
              <li><Link href="/sicherheitsrichtlinien" className="hover:text-primary hover:underline">Sicherheit</Link></li>
              <li><Link href="/ueber-uns" className="hover:text-primary hover:underline">Über uns</Link></li>
              <li><Link href="/kontakt" className="hover:text-primary hover:underline">Kontakt</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/impressum" className="hover:text-primary hover:underline">Impressum</Link></li>
              <li><Link href="/datenschutz" className="hover:text-primary hover:underline">Datenschutz</Link></li>
              <li><Link href="/agb" className="hover:text-primary hover:underline">AGB</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Newsletter</h3>
            <form className="flex gap-2">
              <Input type="email" placeholder="Deine E-Mail Adresse" className="bg-background flex-1" />
              <Button type="submit" variant="default" size="icon" aria-label="Newsletter abonnieren">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-6 space-y-2">
              <h3 className="text-md font-semibold text-foreground">Folge uns</h3>
              <div className="flex space-x-3">
                <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary"><Facebook className="h-6 w-6" /></Link>
                <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary"><Instagram className="h-6 w-6" /></Link>
                <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary"><Twitter className="h-6 w-6" /></Link>
                <Link href="#" aria-label="YouTube" className="text-muted-foreground hover:text-primary"><Youtube className="h-6 w-6" /></Link>
                <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary"><Linkedin className="h-6 w-6" /></Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {year || '...'} Stay Safe & Brave. Alle Rechte vorbehalten.</p>
          <p>Mit ❤️ für sicheres und authentisches Reisen.</p>
        </div>
      </div>
    </footer>
  );
}
