'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HeartHandshake, Menu, UserCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { CartIcon } from '@/components/cart/cart-icon';

const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
  <Button
    variant="ghost"
    asChild
    className={cn("text-sm font-medium hover:bg-accent/10 hover:text-primary dark:hover:text-primary", className)}
  >
    <Link href={href}>
      {children}
    </Link>
  </Button>
);

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/mentors', label: 'Mentoren' },
    { href: '/stories', label: 'Stories' },
    { href: '/travel-assistant', label: 'AI-Assistent' },
    { href: '/pakete-preise', label: 'Pakete & Preise' },
    { href: '/sicherheitsrichtlinien', label: 'Sicherheit' },
    { href: '/ueber-uns', label: 'Über uns' },
    { href: '/kontakt', label: 'Kontakt' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xs">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false} aria-label="Stay Safe & Brave Startseite">
          <HeartHandshake className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-primary tracking-tight">Stay Safe &amp; Brave</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(item => (
            <NavLink key={item.href} href={item.href}>{item.label}</NavLink>
          ))}
          <CartIcon />
          <NavLink href="/auth/login" className="ml-2">
            <UserCircle className="h-5 w-5 mr-1"/>
            Login
          </NavLink>
        </nav>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center gap-2">
          <CartIcon />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Navigation öffnen">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Navigation öffnen</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-4">
                <Link
                  href="/"
                  className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg hover:bg-muted"
                  prefetch={false}
                  onClick={() => setIsOpen(false)}
                >
                  <HeartHandshake className="h-6 w-6 text-primary" />
                  <span className="text-lg font-bold text-primary">Stay Safe &amp; Brave</span>
                </Link>

                {navItems.map(item => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    asChild
                    className="w-full justify-start text-base py-3 hover:bg-accent/10 hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href={item.href}>
                      {item.label}
                    </Link>
                  </Button>
                ))}

                <div className="pt-4 mt-2 border-t border-border flex flex-col gap-2">
                  <Button
                    variant="default"
                    asChild
                    className="w-full justify-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/auth/login">
                      <UserCircle className="h-5 w-5 mr-2"/>
                      Login / Registrieren
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
