"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarCheck,
  CalendarX,
  PlusCircle,
  SlidersHorizontal,
  Loader2,
  MapPin,
  MessageSquare,
  Star,
  Edit3,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc, query, where, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import type { BookingDTO, MentorDTO, ReviewDTO } from "@/lib/dtos";
import { toast } from "@/hooks/use-toast";

export default function BookingsPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  // Review Dialog State
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<BookingDTO | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewText, setReviewText] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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

  // 3. Fetch User's Reviews (to show review status per booking)
  const reviewsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, "reviews"), where("travelerId", "==", user.uid));
  }, [db, user?.uid]);

  const { data: reviews } = useCollection<ReviewDTO>(reviewsQuery);

  if (isUserLoading || isBookingsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Buchungen werden geladen...</p>
      </div>
    );
  }

  // Helper to get mentor data for a booking
  const getMentor = (mentorId: string) => mentors?.find((m) => m.id === mentorId);

  const activeBookings =
    bookings?.filter(
      (b) => b.status === "requested" || b.status === "confirmed" || b.status === "pending"
    ) || [];
  const pastBookings =
    bookings?.filter((b) => b.status === "completed" || b.status === "cancelled") || [];

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

  const renderStatusBadge = (status: string) => {
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
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 border border-yellow-200">
          Ausstehend
        </span>
      );
    }
    if (status === "completed") {
      return (
        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border">
          Abgeschlossen
        </span>
      );
    }
    return (
      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800">
        {status}
      </span>
    );
  };

  const isBookingEligibleForReview = (booking?: BookingDTO | null): boolean => {
    if (!booking) return false;
    return booking.status === "confirmed" || booking.status === "completed";
  };

  const handleOpenReview = (booking: BookingDTO) => {
    const existing = reviews?.find((r) => r.id === booking.id || r.bookingId === booking.id);
    if (!existing && !isBookingEligibleForReview(booking)) {
      toast({
        variant: "destructive",
        title: "Bewertung nicht möglich",
        description: "Eine Bewertung kann erst für eine bestätigte oder abgeschlossene Buchung abgegeben werden.",
      });
      return;
    }
    setSelectedBookingForReview(booking);
    if (existing) {
      setReviewRating(existing.rating);
      setReviewText(existing.text || "");
    } else {
      setReviewRating(5);
      setReviewText("");
    }
    setIsReviewOpen(true);
  };

  const handleSaveReview = async () => {
    if (!user || !db || !selectedBookingForReview) return;
    const bookingId = selectedBookingForReview.id;
    const existing = reviews?.find((r) => r.id === bookingId || r.bookingId === bookingId);

    if (!existing && !isBookingEligibleForReview(selectedBookingForReview)) {
      toast({
        variant: "destructive",
        title: "Nicht berechtigt",
        description: "Für diese Buchung kann keine Bewertung abgegeben werden.",
      });
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      toast({
        variant: "destructive",
        title: "Ungültige Bewertung",
        description: "Bitte wähle zwischen 1 und 5 Sternen.",
      });
      return;
    }

    setIsSubmittingReview(true);

    try {
      if (existing) {
        // Update review (only rating, text, updatedAt per security rules)
        const reviewRef = doc(db, "reviews", bookingId);
        await updateDoc(reviewRef, {
          rating: reviewRating,
          text: reviewText.trim() || "",
          updatedAt: serverTimestamp(),
        });
        toast({
          title: "Bewertung aktualisiert",
          description: "Deine Bewertung wurde erfolgreich geändert.",
        });
      } else {
        // Create review (reviewId === bookingId)
        const reviewRef = doc(db, "reviews", bookingId);
        const newReview: any = {
          id: bookingId,
          bookingId: bookingId,
          mentorId: selectedBookingForReview.mentorId,
          travelerId: user.uid,
          rating: reviewRating,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        if (user.displayName && user.displayName.trim()) {
          newReview.travelerName = user.displayName.trim();
        }
        if (reviewText.trim()) {
          newReview.text = reviewText.trim();
        }
        await setDoc(reviewRef, newReview);
        toast({
          title: "Bewertung abgegeben",
          description: "Vielen Dank für deine authentische Rückmeldung zu deiner Mentorin!",
        });
      }
      setIsReviewOpen(false);
    } catch (err: any) {
      console.error("Error saving review:", err);
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: err?.message || "Deine Bewertung konnte nicht gespeichert werden.",
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
            Meine Buchungen &amp; Anfragen
          </h1>
          <p className="text-muted-foreground mt-1">
            Übersicht all deiner geplanten und vergangenen Begleitungen mit unseren Local Mentoren.
          </p>
        </div>
        <div className="flex items-center gap-3">
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
              const mentorDisplayName =
                booking.mentorName ||
                (mentor ? `${mentor.firstName} ${mentor.lastName}`.trim() : "Local Mentor");
              const packageDisplayName = booking.packageName
                ? `Paket ${booking.packageName}`
                : "Persönliche Reisebegleitung";
              const existingReview = reviews?.find(
                (r) => r.id === booking.id || r.bookingId === booking.id
              );

              return (
                <Card
                  key={booking.id}
                  className="shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
                >
                  <div>
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
                        <div className="mt-1.5">{renderStatusBadge(booking.status)}</div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2.5">
                      {booking.requestedStartDate && booking.requestedEndDate ? (
                        <p className="text-sm text-muted-foreground">
                          <strong>Gewünschter Reisezeitraum:</strong>{" "}
                          {formatDisplayDate(booking.requestedStartDate)} –{" "}
                          {formatDisplayDate(booking.requestedEndDate)}
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

                      {/* Review status or button */}
                      {(existingReview || isBookingEligibleForReview(booking)) && (
                        <div className="pt-2">
                          {existingReview ? (
                            <div className="flex items-center justify-between p-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs">
                              <span className="flex items-center gap-1 text-amber-900 dark:text-amber-200 font-medium">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                Bewertet: {existingReview.rating} von 5 Sternen
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-[11px] text-amber-900 hover:text-amber-950"
                                onClick={() => handleOpenReview(booking)}
                              >
                                <Edit3 className="w-3 h-3 mr-1" />
                                Ändern
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs text-amber-800 dark:text-amber-300 border-amber-300 hover:bg-amber-50"
                              onClick={() => handleOpenReview(booking)}
                            >
                              <Star className="w-3.5 h-3.5 mr-1 text-amber-500" />
                              Local Mentor bewerten
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </div>

                  <div className="p-4 pt-2 border-t flex justify-end">
                    <Button asChild variant="outline" size="sm" className="text-primary hover:text-primary">
                      <Link href={`/dashboard/messages/${booking.id}`}>
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        Nachrichten öffnen
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-muted/30 p-6 text-center">
            <p className="text-muted-foreground">
              Du hast keine aktuellen Buchungen oder offenen Anfragen.
            </p>
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
              const mentorDisplayName =
                booking.mentorName ||
                (mentor ? `${mentor.firstName} ${mentor.lastName}`.trim() : "Local Mentor");
              const existingReview = reviews?.find(
                (r) => r.id === booking.id || r.bookingId === booking.id
              );

              return (
                <Card key={booking.id} className="shadow-sm">
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
                      <CardTitle className="text-xl text-primary">{mentorDisplayName}</CardTitle>
                      <CardDescription className="text-sm">Abgeschlossen</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    {booking.requestedStartDate && booking.requestedEndDate ? (
                      <p className="text-sm text-muted-foreground">
                        <strong>Reisezeitraum:</strong>{" "}
                        {formatDisplayDate(booking.requestedStartDate)} –{" "}
                        {formatDisplayDate(booking.requestedEndDate)}
                      </p>
                    ) : booking.bookingDate ? (
                      <p className="text-sm text-muted-foreground">
                        <strong>Datum:</strong> {formatDisplayDate(booking.bookingDate)}
                      </p>
                    ) : null}

                    {/* Review option for past bookings */}
                    {(existingReview || isBookingEligibleForReview(booking)) && (
                      <div className="pt-2">
                        {existingReview ? (
                          <div className="flex items-center justify-between p-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs">
                            <span className="flex items-center gap-1 text-amber-900 dark:text-amber-200 font-medium">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                              Bewertet: {existingReview.rating} von 5 Sternen
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-[11px] text-amber-900 hover:text-amber-950"
                              onClick={() => handleOpenReview(booking)}
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Ändern
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs text-amber-800 dark:text-amber-300 border-amber-300 hover:bg-amber-50"
                            onClick={() => handleOpenReview(booking)}
                          >
                            <Star className="w-3.5 h-3.5 mr-1 text-amber-500" />
                            Local Mentor bewerten
                          </Button>
                        )}
                      </div>
                    )}
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

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Local Mentor bewerten</DialogTitle>
            <DialogDescription>
              Gib eine authentische Bewertung für deine Begleitung mit{" "}
              <strong>{selectedBookingForReview?.mentorName || "deinem Local Mentor"}</strong> ab.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            {/* Interactive Star Rating */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Deine Bewertung *</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating !== null ? hoverRating : reviewRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      className="p-1 focus:outline-none focus:ring-2 focus:ring-primary rounded transition-transform hover:scale-110"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      aria-label={`${star} von 5 Sternen`}
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          active
                            ? "fill-amber-400 text-amber-500"
                            : "text-muted-foreground/30 hover:text-amber-400"
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-sm font-semibold text-foreground ml-2">
                  {hoverRating !== null ? hoverRating : reviewRating} von 5 Sternen
                </span>
              </div>
            </div>

            {/* Review text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="reviewText" className="text-xs font-semibold text-foreground">
                  Erfahrungsbericht (optional)
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {reviewText.length}/2000 Zeichen
                </span>
              </div>
              <Textarea
                id="reviewText"
                placeholder="Was hat dir an der Begleitung besonders gut gefallen? Welche Tipps waren hilfreich?"
                maxLength={2000}
                className="min-h-[120px] text-sm"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsReviewOpen(false)}
              disabled={isSubmittingReview}
            >
              Abbrechen
            </Button>
            <Button
              onClick={handleSaveReview}
              disabled={isSubmittingReview}
              className="bg-primary hover:bg-primary/90"
            >
              {isSubmittingReview ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Wird gespeichert...
                </>
              ) : (
                "Bewertung speichern"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
