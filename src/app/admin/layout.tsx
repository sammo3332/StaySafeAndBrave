"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser, useFirestore } from "@/firebase";
import { resolveIsAdminByAuthUid } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldAlert,
  ShieldCheck,
  LayoutDashboard,
  CalendarCheck,
  Users,
  Star,
  Loader2,
  ArrowLeft,
  Lock,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isAdminChecking, setIsAdminChecking] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function verifyAdmin() {
      if (isUserLoading) return;

      if (!user?.uid || !db) {
        if (isMounted) {
          setIsAdmin(false);
          setIsAdminChecking(false);
        }
        return;
      }

      try {
        setIsAdminChecking(true);
        const adminVerified = await resolveIsAdminByAuthUid(db, user.uid);
        if (isMounted) {
          setIsAdmin(adminVerified);
        }
      } catch (err) {
        console.error("Error verifying admin role:", err);
        if (isMounted) {
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) {
          setIsAdminChecking(false);
        }
      }
    }

    verifyAdmin();

    return () => {
      isMounted = false;
    };
  }, [user?.uid, db, isUserLoading]);

  // Loading state
  if (isUserLoading || isAdminChecking) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm font-medium">
          Admin-Berechtigungen werden geprüft...
        </p>
      </div>
    );
  }

  // Unauthenticated state
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="bg-card border rounded-xl p-8 shadow-sm">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Anmeldung erforderlich
          </h2>
          <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
            Der Administrationsbereich erfordert eine gültige Authentifizierung und verifizierte Administrator-Rechte.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild>
              <Link href="/auth/login">Zur Anmeldung</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Zur Startseite</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated, but not an admin
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="bg-card border border-destructive/20 rounded-xl p-8 shadow-sm">
          <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Zugriff verweigert (403)
          </h2>
          <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
            Das angemeldete Benutzerkonto ({user.email || user.uid}) ist nicht als Administrator autorisiert.
          </p>
          <div className="bg-muted/50 text-xs text-muted-foreground p-3 rounded-lg border mb-6 text-left space-y-1">
            <p className="font-semibold text-foreground">Sicherheitsanforderung:</p>
            <p>
              Zugriff auf /admin erfordert einen gültigen Firestore-Eintrag in{" "}
              <code className="bg-background px-1 py-0.5 rounded border text-foreground">
                /adminAuth/{user.uid}
              </code>{" "}
              mit der Rolle <code className="bg-background px-1 py-0.5 rounded border text-foreground">role: &quot;admin&quot;</code>.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Zum Benutzer-Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/">Zur Startseite</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin Layout
  const navItems = [
    {
      href: "/admin",
      label: "Übersicht",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/admin/bookings",
      label: "Buchungen",
      icon: CalendarCheck,
      exact: false,
    },
    {
      href: "/admin/mentors",
      label: "Mentorinnen",
      icon: Users,
      exact: false,
    },
    {
      href: "/admin/reviews",
      label: "Bewertungen",
      icon: Star,
      exact: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 max-w-7xl py-8 space-y-6">
      {/* Admin Header Bar */}
      <header className="border-b pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Operations
            </Badge>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Stay Safe &amp; Brave Verwaltung
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/" className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" />
              Zur Website
            </Link>
          </Button>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <nav className="flex items-center space-x-1 border-b pb-2 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Main Admin Content */}
      <main>{children}</main>
    </div>
  );
}
