"use client";

import { useEffect, useState } from "react";
import { useFirestore } from "@/firebase";
import { collection, onSnapshot, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import type { BookingDTO, BookingStatus } from "@/lib/dtos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  AlertCircle,
  Loader2,
  Calendar,
  User,
  Package,
  MessageSquare,
  AlertTriangle,
  Info,
} from "lucide-react";

export default function AdminBookingsPage() {
  const db = useFirestore();

  const [bookings, setBookings] = useState<BookingDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (!db) return;

    setIsLoading(true);
    setError(null);

    const bookingsCollectionRef = collection(db, "bookings");

    const unsubscribe = onSnapshot(
      bookingsCollectionRef,
      (snapshot) => {
        const loaded: BookingDTO[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({
            id: docSnap.id,
            ...docSnap.data(),
          } as BookingDTO);
        });

        // Client-side sort by createdAt desc if available
        loaded.sort((a, b) => {
          const timeA = getTimestampMillis(a.createdAt);
          const timeB = getTimestampMillis(b.createdAt);
          return timeB - timeA;
        });

        setBookings(loaded);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error subscribing to bookings for admin:", err);
        setError("Buchungen konnten nicht geladen werden. Bitte prüfe deine Administratorberechtigungen.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db]);

  async function handleUpdateStatus(booking: BookingDTO, newStatus: BookingStatus) {
    if (!db || updatingId) return;

    setUpdatingId(booking.id);

    try {
      // 1. Update Firestore booking document (authorized via isAdmin() rule)
      const bookingRef = doc(db, "bookings", booking.id);
      await updateDoc(bookingRef, {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });

      // 2. Attempt transactional email dispatch via server endpoint
      let emailNotice = "";
      try {
        const emailRes = await fetch("/api/bookings/transactional-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: booking.id,
            newStatus,
          }),
        });
        const emailData = await emailRes.json();
        if (!emailRes.ok || !emailData.success) {
          emailNotice = "Hinweis: Keine E-Mail versendet (Firebase Admin SDK auf dem Server unkonfiguriert).";
        }
      } catch {
        emailNotice = "Hinweis: E-Mail-Dienst konnte nicht aufgerufen werden.";
      }

      toast({
        title: "Status aktualisiert",
        description: `Buchung wurde auf "${getStatusLabel(newStatus)}" gesetzt. ${emailNotice}`.trim(),
      });
    } catch (err: any) {
      console.error("Error updating booking status:", err);
      toast({
        variant: "destructive",
        title: "Aktualisierung fehlgeschlagen",
        description: err?.message || "Der Buchungsstatus konnte nicht geändert werden.",
      });
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredBookings = bookings.filter((b) => {
    if (filterStatus === "all") return true;
    return b.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Buchungsverwaltung</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Operative Einsicht in alle Buchungsanfragen und kontrollierte Statuswechsel.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {["all", "requested", "confirmed", "completed", "cancelled"].map((status) => (
            <Button
              key={status}
              size="sm"
              variant={filterStatus === status ? "default" : "outline"}
              onClick={() => setFilterStatus(status)}
              className="text-xs h-8 capitalize"
            >
              {status === "all" ? "Alle" : getStatusLabel(status as BookingStatus)}
              <span className="ml-1.5 text-[11px] opacity-70">
                ({status === "all" ? bookings.length : bookings.filter((b) => b.status === status).length})
              </span>
            </Button>
          ))}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Buchungsdaten werden geladen...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-16 text-center">
            <CalendarCheck className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-base font-semibold">Keine Buchungen vorhanden</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {filterStatus === "all"
                ? "Bislang wurden noch keine Buchungsanfragen in Firestore angelegt."
                : `Es gibt derzeit keine Buchungen mit dem Status "${getStatusLabel(filterStatus as BookingStatus)}".`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredBookings.map((booking) => {
            const isUpdating = updatingId === booking.id;

            return (
              <Card key={booking.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          ID: {booking.id}
                        </span>
                        {renderStatusBadge(booking.status)}
                      </div>
                      <CardTitle className="text-lg">
                        {booking.packageName || booking.packageId || "Unbenanntes Paket"}
                      </CardTitle>
                    </div>

                    {/* Operational Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 sm:pt-0 flex-wrap">
                      {booking.status === "requested" && (
                        <>
                          <Button
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(booking, "confirmed")}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5 mr-1" />
                            )}
                            Anfrage bestätigen
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(booking, "cancelled")}
                            className="text-destructive hover:bg-destructive/10 text-xs h-8 border-destructive/30"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Stornieren
                          </Button>
                        </>
                      )}

                      {booking.status === "confirmed" && (
                        <>
                          <Button
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(booking, "completed")}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8"
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                            ) : (
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            )}
                            Als abgeschlossen markieren
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdating}
                            onClick={() => handleUpdateStatus(booking, "cancelled")}
                            className="text-destructive hover:bg-destructive/10 text-xs h-8 border-destructive/30"
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            Stornieren
                          </Button>
                        </>
                      )}

                      {booking.status === "completed" && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Erfolgreich abgeschlossen
                        </span>
                      )}

                      {booking.status === "cancelled" && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
                          Storniert
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-3 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-muted/30 p-3 rounded-lg border text-xs">
                    <div>
                      <span className="text-muted-foreground block">Reisende Person (UID):</span>
                      <span className="font-mono font-medium text-foreground">{booking.userId}</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Mentorin:</span>
                      <span className="font-medium text-foreground">
                        {booking.mentorName || booking.mentorId}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Reisezeitraum:</span>
                      <span className="font-medium text-foreground">
                        {booking.requestedStartDate && booking.requestedEndDate
                          ? `${booking.requestedStartDate} – ${booking.requestedEndDate}`
                          : booking.bookingDate || "Nicht angegeben"}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Erstellt am:</span>
                      <span className="font-medium text-foreground">
                        {formatTimestamp(booking.createdAt)}
                      </span>
                    </div>
                  </div>

                  {booking.travelerMessage && (
                    <div className="bg-background border rounded-lg p-3 text-xs space-y-1">
                      <span className="font-semibold text-muted-foreground flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-primary" />
                        Nachricht der reisenden Person:
                      </span>
                      <p className="text-foreground whitespace-pre-wrap">{booking.travelerMessage}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function renderStatusBadge(status: BookingStatus) {
  switch (status) {
    case "requested":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <Clock className="w-3 h-3 mr-1" />
          Anfrage eingegangen
        </Badge>
      );
    case "confirmed":
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Check className="w-3 h-3 mr-1" />
          Bestätigt
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Abgeschlossen
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="bg-zinc-100 text-zinc-700 border-zinc-200">
          <XCircle className="w-3 h-3 mr-1" />
          Storniert
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function getStatusLabel(status: BookingStatus): string {
  switch (status) {
    case "requested":
      return "Angefragt";
    case "confirmed":
      return "Bestätigt";
    case "completed":
      return "Abgeschlossen";
    case "cancelled":
      return "Storniert";
    default:
      return status;
  }
}

function formatTimestamp(val: any): string {
  if (!val) return "–";
  if (typeof val === "string") return val;
  if (typeof val.toDate === "function") {
    return val.toDate().toLocaleString("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }
  return "–";
}

function getTimestampMillis(val: any): number {
  if (!val) return 0;
  if (typeof val === "string") return new Date(val).getTime();
  if (typeof val.toMillis === "function") return val.toMillis();
  if (typeof val.toDate === "function") return val.toDate().getTime();
  return 0;
}
