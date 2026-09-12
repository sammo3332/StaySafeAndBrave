"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFirestore } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CalendarCheck,
  Users,
  Star,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";

interface OverviewStats {
  totalBookings: number;
  requestedBookings: number;
  totalMentors: number;
  totalReviews: number;
}

export default function AdminOverviewPage() {
  const db = useFirestore();

  const [stats, setStats] = useState<OverviewStats>({
    totalBookings: 0,
    requestedBookings: 0,
    totalMentors: 0,
    totalReviews: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      if (!db) return;

      try {
        setIsLoading(true);
        setLoadError(null);

        // 1. Fetch real bookings
        const bookingsSnap = await getDocs(collection(db, "bookings"));
        let requestedCount = 0;
        bookingsSnap.forEach((docSnap) => {
          const data = docSnap.data();
          if (data?.status === "requested") {
            requestedCount++;
          }
        });

        // 2. Fetch real mentors
        const mentorsSnap = await getDocs(collection(db, "mentors"));

        // 3. Fetch real reviews
        const reviewsSnap = await getDocs(collection(db, "reviews"));

        if (isMounted) {
          setStats({
            totalBookings: bookingsSnap.size,
            requestedBookings: requestedCount,
            totalMentors: mentorsSnap.size,
            totalReviews: reviewsSnap.size,
          });
        }
      } catch (err: any) {
        console.error("Error loading admin overview stats:", err);
        if (isMounted) {
          setLoadError("Statistiken konnten nicht vollständig aus Firestore geladen werden.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, [db]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Betriebsübersicht</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Echte operative Firestore-Kennzahlen und Schnellzugriff auf Verwaltungsmodule.
        </p>
      </div>

      {loadError && (
        <div className="flex items-center gap-2 p-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {/* Real Firestore Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bookings Card */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Buchungsanfragen
            </CardTitle>
            <CalendarCheck className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-3xl font-bold text-foreground">
                  {stats.totalBookings}
                </div>
                <div className="flex items-center gap-1.5 mt-2">
                  {stats.requestedBookings > 0 ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {stats.requestedBookings} offen (requested)
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Keine offenen Anfragen
                    </Badge>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Mentors Card */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gelistete Mentorinnen
            </CardTitle>
            <Users className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-3xl font-bold text-foreground">
                  {stats.totalMentors}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Einträge in /mentors
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Reviews Card */}
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mentor-Bewertungen
            </CardTitle>
            <Star className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            ) : (
              <>
                <div className="text-3xl font-bold text-foreground">
                  {stats.totalReviews}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Echte verifizierte Bewertungen in /reviews
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Operational Modules Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarCheck className="w-5 h-5 text-primary" />
              Buchungsverwaltung
            </CardTitle>
            <CardDescription>
              Echte Buchungsanfragen einsehen, Details prüfen und kontrollierte Statuswechsel vornehmen.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/bookings">
                Buchungen verwalten
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="w-5 h-5 text-primary" />
              Mentorinnen-Aufsicht
            </CardTitle>
            <CardDescription>
              Profile und Verifizierungsstatus prüfen. Einsicht in die Provisionierung von Mentor-Zugängen.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/mentors">
                Mentorinnen prüfen
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between hover:border-primary/50 transition-colors shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Star className="w-5 h-5 text-primary" />
              Bewertungen-Audit
            </CardTitle>
            <CardDescription>
              Reisebewertungen einsehen, Sternebewertungen und Feedback im Kontext der Buchung prüfen.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/reviews">
                Bewertungen einsehen
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Backend & Security Operational Transparency Note */}
      <div className="bg-muted/40 border rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Info className="w-4 h-4 text-primary" />
          Operative Hinweise &amp; Backend-Status
        </div>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-5 leading-relaxed">
          <li>
            <strong>Admin-Identitätsmodell:</strong> Autorisierung erfolgt ausschließlich über die private Firestore-Collection <code className="bg-background px-1 py-0.5 rounded border">/adminAuth/{`{authUid}`}</code>. Rollen werden niemals im öffentlichen Benutzerprofil gespeichert.
          </li>
          <li>
            <strong>Statusübergänge bei Buchungen:</strong> Nur konservative, operative Übergänge (<code className="bg-background px-1 py-0.5 rounded border">confirmed</code>, <code className="bg-background px-1 py-0.5 rounded border">completed</code>, <code className="bg-background px-1 py-0.5 rounded border">cancelled</code>) sind zulässig. Eigentumsfelder (userId, mentorId, packageId, createdAt) sind strikt unveränderlich.
          </li>
          <li>
            <strong>Server-seitiges Firebase Admin SDK:</strong> Noch nicht mit Dienstkonto-Schlüsseln konfiguriert. Privilegierte Server-Endpunkte schlagen konsequent sicher fehl (Fail-Closed).
          </li>
        </ul>
      </div>
    </div>
  );
}
