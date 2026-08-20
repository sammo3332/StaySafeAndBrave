import Link from 'next/link';
import { HeartHandshake, Menu, UserCircle, ShoppingCart } from 'lucide-react';
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

const NavLink = ({ href, children, className }: { href: string; children: React.ReactNode, className?: string }) => (
  <Link href={href} passHref>
    <Button variant="ghost" className={cn("text-sm font-medium hover:bg-accent/10 hover:text-primary dark:hover:text-primary", className)}>
      {children}
    </Button>
  </Link>
);

export function Header() {
  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/mentors', label: 'Finde einen Mentor' },
    { href: '/reiseberichte', label: 'Reiseberichte' },
    { href: '/pakete-preise', label: 'Pakete & Preise' },
    { href: '/sicherheitsrichtlinien', label: 'Sicherheit' },
    { href: '/ueber-uns', label: 'Über uns' },
    { href: '/kontakt', label: 'Kontakt' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <HeartHandshake className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold text-primary">Stay Safe &amp; Brave</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => (
            <NavLink key={item.href} href={item.href}>{item.label}</NavLink>
          ))}
          <CartIcon />
          <NavLink href="/auth/login" className="ml-2">
            <UserCircle className="h-5 w-5 mr-1"/>
            Login/Registrieren
          </NavLink>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center">
          <CartIcon />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Navigation öffnen</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="grid gap-2">
                <Link href="/" className="flex items-center gap-2 mb-4" prefetch={false}>
                  <HeartHandshake className="h-7 w-7 text-primary" />
                  <span className="text-xl font-bold text-primary">Stay Safe &amp; Brave</span>
                </Link>
                {navItems.map(item => (
                  <Link key={item.href} href={item.href} passHref>
                     <Button variant="ghost" className="w-full justify-start text-base py-3 hover:bg-accent/10 hover:text-primary">
                        {item.label}
                     </Button>
                  </Link>
                ))}
                 <Link href="/auth/login" passHref>
                     <Button variant="ghost" className="w-full justify-start text-base py-3 hover:bg-accent/10 hover:text-primary">
                        <UserCircle className="h-5 w-5 mr-2"/>
                        Login/Registrieren
                     </Button>
                  </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
