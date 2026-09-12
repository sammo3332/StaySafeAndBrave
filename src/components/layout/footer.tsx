
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HeartHandshake, Facebook, Instagram, Twitter, Youtube, Linkedin, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export function Footer() {
  const [year, setYear] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast({
        variant: 'destructive',
        title: 'Ungültige E-Mail-Adresse',
        description: 'Bitte gib eine gültige E-Mail-Adresse ein.',
      });
      return;
    }
    toast({
      title: 'Vielen Dank für dein Interesse!',
      description: 'Die Newsletter-Anmeldung wird mit dem nächsten offiziellen Update freigeschaltet.',
    });
    setNewsletterEmail('');
  };

  return (
    <footer className="border-t bg-muted/50 py-12 text-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Brand and About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-2" prefetch={false} aria-label="Stay Safe & Brave Startseite">
              <HeartHandshake className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Stay Safe &amp; Brave</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Individuell reisen. Lokal begleitet. Sicherer unterwegs. Verbinde dich mit geprüften Local Mentoren in Südafrika.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/mentors" className="hover:text-primary hover:underline">Finde einen Mentor</Link></li>
              <li><Link href="/stories" className="hover:text-primary hover:underline">Travel Stories</Link></li>
              <li><Link href="/travel-assistant" className="hover:text-primary hover:underline">AI Travel Assistant</Link></li>
              <li><Link href="/pakete-preise" className="hover:text-primary hover:underline">Pakete &amp; Preise</Link></li>
              <li><Link href="/reiseberichte" className="hover:text-primary hover:underline">Mein Reisetagebuch</Link></li>
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
              <li><Link href="/admin" className="hover:text-primary hover:underline">Administration</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Newsletter</h3>
            <p className="text-xs text-muted-foreground">Erhalte praktische Reise-Updates und Einblicke aus Südafrika.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Deine E-Mail Adresse"
                aria-label="E-Mail für Newsletter"
                className="bg-background flex-1 text-sm"
              />
              <Button type="submit" variant="default" size="icon" aria-label="Newsletter abonnieren">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <div className="mt-6 space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Folge uns</h4>
              <div className="flex space-x-3 text-muted-foreground">
                <span className="p-2 rounded-full bg-muted text-muted-foreground/80 hover:text-primary transition-colors" title="Facebook (in Vorbereitung)">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </span>
                <span className="p-2 rounded-full bg-muted text-muted-foreground/80 hover:text-primary transition-colors" title="Instagram (in Vorbereitung)">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </span>
                <span className="p-2 rounded-full bg-muted text-muted-foreground/80 hover:text-primary transition-colors" title="Twitter / X (in Vorbereitung)">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </span>
                <span className="p-2 rounded-full bg-muted text-muted-foreground/80 hover:text-primary transition-colors" title="YouTube (in Vorbereitung)">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </span>
                <span className="p-2 rounded-full bg-muted text-muted-foreground/80 hover:text-primary transition-colors" title="LinkedIn (in Vorbereitung)">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {year || '...'} Stay Safe &amp; Brave. Alle Rechte vorbehalten.</p>
          <p className="mt-1">Individuell reisen. Lokal begleitet. Sicherer unterwegs.</p>
        </div>
      </div>
    </footer>
  );
}
