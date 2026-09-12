"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFirestore } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { ReviewDTO } from "@/lib/dtos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Users,
  CalendarCheck,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Info,
  ExternalLink,
} from "lucide-react";

export default function AdminReviewsPage() {
  const db = useFirestore();

  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");

  useEffect(() => {
    let isMounted = true;

    async function fetchReviews() {
      if (!db) return;

      try {
        setIsLoading(true);
        setError(null);

        const reviewsSnap = await getDocs(collection(db, "reviews"));
        const loaded: ReviewDTO[] = [];
        reviewsSnap.forEach((docSnap) => {
          loaded.push({
            id: docSnap.id,
            ...docSnap.data(),
          } as ReviewDTO);
        });

        // Sort descending by createdAt
        loaded.sort((a, b) => {
          const timeA = getTimestampMillis(a.createdAt);
          const timeB = getTimestampMillis(b.createdAt);
          return timeB - timeA;
        });

        if (isMounted) {
          setReviews(loaded);
        }
      } catch (err: any) {
        console.error("Error fetching reviews for admin inspection:", err);
        if (isMounted) {
          setError("Bewertungen konnten nicht geladen werden.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchReviews();

    return () => {
      isMounted = false;
    };
  }, [db]);

  const filteredReviews = reviews.filter((r) => {
    if (ratingFilter === "all") return true;
    return r.rating === ratingFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Bewertungen-Audit</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Operative Prüfung aller echten Mentorinnen-Bewertungen. Nur-Lese-Zugriff zur Wahrung der Integrität.
          </p>
        </div>

        {/* Rating Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant={ratingFilter === "all" ? "default" : "outline"}
            onClick={() => setRatingFilter("all")}
            className="text-xs h-8"
          >
            Alle ({reviews.length})
          </Button>
          {[5, 4, 3, 2, 1].map((stars) => (
            <Button
              key={stars}
              size="sm"
              variant={ratingFilter === stars ? "default" : "outline"}
              onClick={() => setRatingFilter(stars)}
              className="text-xs h-8"
            >
              ★ {stars} ({reviews.filter((r) => r.rating === stars).length})
            </Button>
          ))}
        </div>
      </div>

      {/* Read-Only Invariant Notice */}
      <div className="bg-muted/40 border rounded-xl p-4 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            Integrität &amp; Unveränderlichkeit:
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Bewertungen stammen direkt von Reisenden mit einer abgeschlossenen Buchung (1:1 Dokument-ID-Kopplung
            <code className="bg-background px-1 py-0.5 rounded border text-foreground ml-1">reviewId === bookingId</code>).
            Zur Sicherstellung absoluter Transparenz und Verfälschungssicherheit sind Bewertungen für Administratoren strikt schreibgeschützt (Read-Only).
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Bewertungen werden geladen...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-16 text-center">
            <Star className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-base font-semibold">Keine Bewertungen vorhanden</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {ratingFilter === "all"
                ? "Bislang wurden noch keine Bewertungen für Mentorinnen abgegeben."
                : `Es gibt derzeit keine Bewertungen mit ${ratingFilter} Sternen.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredReviews.map((review) => {
            return (
              <Card key={review.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-amber-400 text-amber-400" : "text-zinc-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-sm">
                          {review.rating} von 5 Sternen
                        </span>
                        <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
                          Read-Only
                        </Badge>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      Erstellt am: {formatTimestamp(review.createdAt)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-3 text-xs">
                  {review.text ? (
                    <div className="bg-background border rounded-lg p-3 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      &quot;{review.text}&quot;
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic text-xs">
                      (Kein zusätzlicher Textkommentar abgegeben)
                    </p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-muted/30 p-3 rounded-lg border text-xs">
                    <div>
                      <span className="text-muted-foreground block">Verfassende Person:</span>
                      <span className="font-medium text-foreground">
                        {review.travelerName || review.travelerId}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Mentorin (ID):</span>
                      <span className="font-medium text-foreground flex items-center gap-1">
                        <Users className="w-3 h-3 text-muted-foreground" />
                        <Link
                          href={`/mentors/${review.mentorId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-primary flex items-center gap-1"
                        >
                          {review.mentorId}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Zugehörige Buchungs-ID:</span>
                      <span className="font-mono text-foreground">{review.bookingId}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
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
