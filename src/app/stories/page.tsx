"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Compass,
  MapPin,
  CalendarDays,
  UserCheck,
  ArrowRight,
  BookOpen,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collectionGroup, query, where } from "firebase/firestore";
import type { ReportDTO } from "@/lib/dtos";

export default function StoriesPage() {
  const db = useFirestore();

  // Query only explicitly published reports across all users
  const publicStoriesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collectionGroup(db, "reports"), where("visibility", "==", "public"));
  }, [db]);

  const { data: rawStories, isLoading, error } = useCollection<ReportDTO>(publicStoriesQuery);

  // Sort descending by publication date or creation date in memory (avoiding composite index requirements)
  const stories = rawStories
    ? [...rawStories].sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.createdAt).getTime();
        const dateB = new Date(b.publishedAt || b.createdAt).getTime();
        return dateB - dateA;
      })
    : [];

  return (
    <div className="container mx-auto px-4 max-w-6xl py-6">
      {/* Header section */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <Badge variant="outline" className="px-3 py-1 text-xs text-primary border-primary/30">
          <Sparkles className="w-3 h-3 mr-1 text-primary" />
          Authentische Reiseberichte
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
          Travel Stories aus Südafrika
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Echte Erlebnisse, Routen und Insider-Tipps von Reisenden, die Südafrika selbstorganisiert und sicher mit unseren Local Mentoren erkundet haben.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="default" size="sm" className="bg-primary hover:bg-primary/90">
            <Link href="/mentors">Local Mentoren entdecken</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/reiseberichte">
              <BookOpen className="w-4 h-4 mr-1.5" />
              Eigenes Reisetagebuch
            </Link>
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Travel Stories werden geladen...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-6 rounded-xl border border-destructive/30 bg-destructive/5 text-center max-w-lg mx-auto">
          <p className="text-sm text-destructive font-medium">
            Travel Stories konnten aktuell nicht geladen werden.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Bitte prüfe deine Verbindung oder versuche es in wenigen Augenblicken erneut.
          </p>
        </div>
      )}

      {/* Stories list */}
      {!isLoading && !error && (
        <>
          {stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => {
                const formattedDate = story.publishedAt
                  ? new Date(story.publishedAt).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : story.tripDate
                  ? new Date(story.tripDate).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : new Date(story.createdAt).toLocaleDateString("de-DE", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    });

                return (
                  <Card
                    key={story.id}
                    className="flex flex-col justify-between overflow-hidden rounded-xl border bg-card shadow-xs hover:shadow-md transition-all duration-200"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground mb-1">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5 text-secondary" />
                          {formattedDate}
                        </span>
                        {story.location && (
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            {story.location}
                          </span>
                        )}
                      </div>

                      <CardTitle className="text-xl font-bold text-foreground leading-snug line-clamp-2">
                        <Link
                          href={`/stories/${story.id}`}
                          className="hover:text-primary transition-colors"
                        >
                          {story.title}
                        </Link>
                      </CardTitle>

                      {story.mentorName && (
                        <div className="pt-2">
                          {story.mentorId ? (
                            <Link
                              href={`/mentors/${story.mentorId}`}
                              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline bg-primary/5 px-2.5 py-1 rounded-md border border-primary/15"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Begleitet von Local Mentor: {story.mentorName}</span>
                            </Link>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Mit Local Mentor: {story.mentorName}</span>
                            </span>
                          )}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="py-2">
                      <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed whitespace-pre-line">
                        {story.content}
                      </p>
                    </CardContent>

                    <CardFooter className="pt-4 border-t">
                      <Button asChild variant="ghost" size="sm" className="w-full justify-between group">
                        <Link href={`/stories/${story.id}`}>
                          <span className="text-xs font-semibold text-primary">Story lesen</span>
                          <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="bg-muted/30 p-12 text-center border-dashed max-w-xl mx-auto">
              <Compass className="w-14 h-14 text-muted-foreground/50 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground">
                Noch keine veröffentlichten Travel Stories
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Unsere Reisenden können ihre persönlichen Reiseberichte aus ihrem Tagebuch freiwillig als Travel Story teilen. Sobald ein Bericht öffentlich geteilt wird, erscheint er hier.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Button asChild variant="outline">
                  <Link href="/reiseberichte">Zum eigenen Reisetagebuch</Link>
                </Button>
                <Button asChild>
                  <Link href="/mentors">Local Mentoren finden</Link>
                </Button>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
