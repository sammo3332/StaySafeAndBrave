
"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  MessageCircle, 
  UserCircle, 
  LogOut, 
  ShieldCheck, 
  Loader2, 
  BookOpen, 
  MapPin, 
  Compass,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase, useAuth } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import type { UserDTO, BookingDTO, MentorDTO, BookingStatus } from "@/lib/dtos";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();

  // Redirect to login if user is not authenticated once auth state has resolved
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/auth/login");
    }
  }, [isUserLoading, user, router]);

  // Fetch authenticated user profile data
  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: userData, isLoading: isDataLoading } = useDoc<UserDTO>(userDocRef);

  // Query ONLY authenticated user's bookings from Firestore
  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, "bookings"), where("userId", "==", user.uid));
  }, [db, user?.uid]);

  const { data: bookings, isLoading: isBookingsLoading } = useCollection<BookingDTO>(bookingsQuery);

  // Fetch mentors to display mentor name and image for bookings
  const mentorsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "mentors");
  }, [db]);

  const { data: mentors } = useCollection<MentorDTO>(mentorsRef);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  const getMentor = (mentorId: string) => mentors?.find((m) => m.id === mentorId);

  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const renderStatusBadge = (status: BookingStatus | string) => {
    if (status === "requested") {
      return (
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          Anfrage gesendet
        </span>
      );
    }
    if (status === "confirmed") {
      return (
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          Bestätigt
        </span>
      );
    }
    if (status === "pending") {
      return (
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          In Abstimmung
        </span>
      );
    }
    if (status === "completed") {
      return (
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
          Abgeschlossen
        </span>
      );
    }
    if (status === "cancelled") {
      return (
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
          Storniert
        </span>
      );
    }
    return (
      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
        {status}
      </span>
    );
  };

  if (isUserLoading || !user || isDataLoading || isBookingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Lade Dashboard...</p>
      </div>
    );
  }

  const hasBookings = bookings && bookings.length > 0;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome & Profile Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Willkommen zurück, {userData?.firstName || "Traveler"}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Verwalte deine Reisebegleitungen, Nachrichten und Notizen.
          </p>
        </div>
        <Button 
          variant="outline" 
          className="border-destructive text-destructive hover:bg-destructive/10" 
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Abmelden
        </Button>
      </div>

      <Card className="shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-20 h-20 rounded-full border-2 border-primary shadow-sm overflow-hidden bg-background flex items-center justify-center">
            {userData?.profilePictureUrl ? (
              <Image 
                src={userData.profilePictureUrl} 
                alt={userData.firstName || "Profilbild"} 
                fill
                className="object-cover"
              />
            ) : (
              <UserCircle className="w-14 h-14 text-muted-foreground" />
            )}
          </div>
          <div className="text-center md:text-left">
            <CardTitle className="text-2xl text-primary">
              {userData?.firstName ? `${userData.firstName} ${userData?.lastName || ""}`.trim() : "Traveler"}
            </CardTitle>
            <CardDescription className="text-base">{userData?.email || user.email}</CardDescription>
            <CardDescription className="text-sm">
              Mitglied seit: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString("de-DE", { month: "long", year: "numeric" }) : "Kürzlich beigetreten"}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>

      {/* Real Booking Overview / Truthful Summary */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-accent" />
            Deine Reisebegleitungen &amp; Anfragen
          </h2>
          {hasBookings && (
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              <Link href="/dashboard/bookings" className="flex items-center gap-1">
                Alle anzeigen <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          )}
        </div>

        {hasBookings ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => {
              const mentor = getMentor(booking.mentorId);
              const mentorDisplayName = booking.mentorName || (mentor ? `${mentor.firstName} ${mentor.lastName}`.trim() : "Local Mentor");
              const packageDisplayName = booking.packageName ? `Paket ${booking.packageName}` : "Persönliche Reisebegleitung";

              return (
                <Card key={booking.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-start gap-4 p-4">
                    <div className="relative w-14 h-14 rounded-lg border overflow-hidden bg-muted shrink-0">
                      {mentor?.profilePictureUrl ? (
                        <Image
                          src={mentor.profilePictureUrl}
                          alt={mentor.firstName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground font-semibold">
                          {mentorDisplayName.charAt(0) || "M"}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg text-primary truncate">
                        {mentorDisplayName}
                      </CardTitle>
                      <CardDescription className="text-xs truncate">
                        {packageDisplayName}
                      </CardDescription>
                      <div className="mt-1.5">
                        {renderStatusBadge(booking.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2 text-sm">
                    {booking.requestedStartDate && booking.requestedEndDate ? (
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground">Reisezeitraum:</strong>{" "}
                        {formatDisplayDate(booking.requestedStartDate)} – {formatDisplayDate(booking.requestedEndDate)}
                      </p>
                    ) : booking.bookingDate ? (
                      <p className="text-xs text-muted-foreground">
                        <strong className="text-foreground">Datum:</strong> {formatDisplayDate(booking.bookingDate)}
                      </p>
                    ) : null}

                    {mentor?.location && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" /> {mentor.location}
                      </p>
                    )}

                    <div className="pt-2 border-t mt-2 flex justify-end">
                      {/* INVARIANT: conversationId === bookingId for 1:1 messaging per booking */}
                      <Button asChild variant="ghost" size="sm" className="h-7 text-xs text-primary hover:text-primary">
                        <Link href={`/dashboard/messages/${booking.id}`} className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          Nachrichten
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-muted/30 border-dashed border-2 p-8 text-center">
            <div className="flex flex-col items-center justify-center space-y-3 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Compass className="w-6 h-6" />
              </div>
              <CardTitle className="text-xl text-primary">Noch keine Buchungen vorhanden</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Du hast aktuell noch keine Reisebegleitung angefragt. Finde einen geprüften Local Mentor für deine nächste Reise.
              </CardDescription>
              <Button asChild className="mt-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/mentors">Local Mentor finden</Link>
              </Button>
            </div>
          </Card>
        )}
      </section>

      {/* Primary Coherent Navigation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-primary">Schnellzugriff</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Bookings */}
          <Card className="shadow hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-primary">Meine Buchungen</CardTitle>
                <CalendarDays className="w-5 h-5 text-accent" />
              </div>
              <CardDescription className="text-sm">
                Alle Anfragen und Mentor-Sitzungen im Detail verwalten.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/bookings">Buchungen öffnen</Link>
              </Button>
            </CardContent>
          </Card>

          {/* 2. Messages */}
          <Card className="shadow hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-primary">Nachrichten</CardTitle>
                <MessageCircle className="w-5 h-5 text-accent" />
              </div>
              <CardDescription className="text-sm">
                Direkter Austausch mit deinen Local Mentoren.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/messages">Nachrichten öffnen</Link>
              </Button>
            </CardContent>
          </Card>

          {/* 3. Travel Journal / Reports */}
          <Card className="shadow hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-primary">Reisetagebuch</CardTitle>
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <CardDescription className="text-sm">
                Persönliche Reiseberichte und Notizen festhalten.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/reiseberichte">Reisetagebuch öffnen</Link>
              </Button>
            </CardContent>
          </Card>

          {/* 4. Settings */}
          <Card className="shadow hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-primary">Profileinstellungen</CardTitle>
                <UserCircle className="w-5 h-5 text-accent" />
              </div>
              <CardDescription className="text-sm">
                Persönliche Daten und Kontoeinstellungen bearbeiten.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/dashboard/settings">Einstellungen öffnen</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Safety / Travel Assistant Banner */}
      <Card className="bg-secondary/10 border-secondary/30 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-secondary-foreground">
            <ShieldCheck className="w-5 h-5"/>
            Sicherheitsbegleitung &amp; Vorbereitung
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Erhalte personalisierte Sicherheitsempfehlungen und Länderhinweise von unserem KI-Reiseassistenten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Link href="/travel-assistant">KI-Reiseassistent öffnen</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

