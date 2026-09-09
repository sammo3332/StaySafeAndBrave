
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CalendarX, PlusCircle, SlidersHorizontal, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { BookingDTO, MentorDTO } from "@/lib/dtos";
import images from "@/lib/placeholder-images.json";

export default function BookingsPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  // 1. Fetch User's Bookings
  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, "bookings"), where("userId", "==", user.uid));
  }, [db, user?.uid]);

  const { data: bookings, isLoading: isBookingsLoading } = useCollection<BookingDTO>(bookingsQuery);

  // 2. Fetch Mentors (to display names/images in the list)
  const mentorsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "mentors");
  }, [db]);

  const { data: mentors } = useCollection<MentorDTO>(mentorsRef);

  if (isUserLoading || isBookingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Buchungen werden geladen...</p>
      </div>
    );
  }

  // Helper to get mentor data for a booking
  const getMentor = (mentorId: string) => mentors?.find(m => m.id === mentorId);

  const activeBookings = bookings?.filter(b => b.status === 'requested' || b.status === 'confirmed' || b.status === 'pending') || [];
  const pastBookings = bookings?.filter(b => b.status === 'completed' || b.status === 'cancelled') || [];

  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return null;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const renderStatusBadge = (status: string) => {
    if (status === 'requested') {
      return (
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
          Anfrage gesendet
        </span>
      );
    }
    if (status === 'confirmed') {
      return (
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          Bestätigt
        </span>
      );
    }
    if (status === 'pending') {
      return (
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
          In Abstimmung
        </span>
      );
    }
    return (
      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Meine Buchungen</h1>
          <p className="text-lg text-muted-foreground">
            Verwalte deine Buchungsanfragen und persönliche Reisebegleitungen.
          </p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filtern
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/mentors">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Neue Buchung
                </Link>
            </Button>
        </div>
      </div>

      {/* Active Bookings & Requests */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-accent" />
          Aktuelle Buchungen &amp; Anfragen ({activeBookings.length})
        </h2>
        {activeBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBookings.map((booking) => {
              const mentor = getMentor(booking.mentorId);
              const mentorDisplayName = booking.mentorName || (mentor ? `${mentor.firstName} ${mentor.lastName}`.trim() : "Local Mentor");
              const packageDisplayName = booking.packageName ? `Paket ${booking.packageName}` : "Persönliche Reisebegleitung";

              return (
                <Card key={booking.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-start gap-4 p-4">
                    <div className="relative w-[72px] h-[72px] rounded-lg border overflow-hidden bg-muted shrink-0">
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
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary">
                        {mentorDisplayName}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {packageDisplayName}
                      </CardDescription>
                      <div className="mt-1.5">
                        {renderStatusBadge(booking.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2.5">
                    {booking.requestedStartDate && booking.requestedEndDate ? (
                      <p className="text-sm text-muted-foreground">
                        <strong>Gewünschter Reisezeitraum:</strong>{" "}
                        {formatDisplayDate(booking.requestedStartDate)} – {formatDisplayDate(booking.requestedEndDate)}
                      </p>
                    ) : booking.bookingDate ? (
                      <p className="text-sm text-muted-foreground">
                        <strong>Datum:</strong> {formatDisplayDate(booking.bookingDate)}
                      </p>
                    ) : null}

                    {booking.travelerMessage && (
                      <div className="p-2.5 rounded-md bg-muted/50 border border-border/50 text-xs text-muted-foreground italic">
                        &ldquo;{booking.travelerMessage}&rdquo;
                      </div>
                    )}

                    {mentor?.location && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {mentor.location}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-muted/30 p-6 text-center">
            <p className="text-muted-foreground">Du hast keine aktuellen Buchungen oder offenen Anfragen.</p>
            <Button asChild variant="link" className="mt-2 text-primary">
              <Link href="/mentors">Finde deinen Local Mentor</Link>
            </Button>
          </Card>
        )}
      </section>

      {/* Past Bookings */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
          <CalendarX className="w-6 h-6 text-accent" />
          Vergangene Buchungen ({pastBookings.length})
        </h2>
        {pastBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastBookings.map((booking) => {
              const mentor = getMentor(booking.mentorId);
              const mentorDisplayName = booking.mentorName || (mentor ? `${mentor.firstName} ${mentor.lastName}`.trim() : "Local Mentor");

              return (
                <Card key={booking.id} className="shadow-sm opacity-75">
                   <CardHeader className="flex flex-row items-start gap-4 p-4">
                    <div className="relative w-[72px] h-[72px] rounded-lg border overflow-hidden bg-muted shrink-0">
                      {mentor?.profilePictureUrl ? (
                        <Image
                          src={mentor.profilePictureUrl}
                          alt={mentor.firstName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          ?
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary">
                        {mentorDisplayName}
                      </CardTitle>
                      <CardDescription className="text-sm">Abgeschlossen</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    {booking.requestedStartDate && booking.requestedEndDate ? (
                      <p className="text-sm text-muted-foreground">
                        <strong>Reisezeitraum:</strong>{" "}
                        {formatDisplayDate(booking.requestedStartDate)} – {formatDisplayDate(booking.requestedEndDate)}
                      </p>
                    ) : booking.bookingDate ? (
                      <p className="text-sm text-muted-foreground">
                        <strong>Datum:</strong> {formatDisplayDate(booking.bookingDate)}
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-muted/30 p-6 text-center">
            <p className="text-muted-foreground">Du hast noch keine vergangenen Buchungen.</p>
          </Card>
        )}
      </section>
    </div>
  );
}
