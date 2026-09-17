"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ContentImage } from "@/components/ui/content-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  CalendarDays,
  UserCheck,
  ArrowLeft,
  Loader2,
  Compass,
  Share2,
} from "lucide-react";
import { useFirestore } from "@/firebase";
import { collectionGroup, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { publicStory, publicMentor, formatStoryDate } from '@/components/content/public-data';
import type { ReportDTO, MentorDTO } from "@/lib/dtos";
import { toast } from "@/hooks/use-toast";

interface StoryDetailPageProps {
  params: Promise<{
    storyId: string;
  }>;
}

export default function StoryDetailPage({ params }: StoryDetailPageProps) {
  const resolvedParams = use(params);
  const storyId = resolvedParams.storyId;

  const db = useFirestore();
  const [story, setStory] = useState<ReportDTO | null>(null);
  const [mentor, setMentor] = useState<MentorDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (!db || !storyId) return;

    let isMounted = true;

    async function loadStory() {
      setIsLoading(true);
      setIsNotFound(false);
      setLoadError(null);
      setStory(null);
      setMentor(null);

      try {
        // Query collectionGroup for public stories only
        const q = query(
          collectionGroup(db, "reports"),
          where("visibility", "==", "public")
        );
        const snapshot = await getDocs(q);

        let matchingStory: ReportDTO | null = null;
        let invalidMatch = false;
        for (const docSnap of snapshot.docs) {
          if (docSnap.id === storyId) {
            matchingStory = publicStory({ ...docSnap.data(), id: docSnap.id });
            invalidMatch = matchingStory === null;
            break;
          }
        }

        if (!isMounted) return;

        if (invalidMatch) {
          setLoadError('Dieser öffentliche Eintrag kann gerade nicht dargestellt werden.');
          return;
        }
        if (!matchingStory || matchingStory.visibility !== "public") {
          setIsNotFound(true);
          setIsLoading(false);
          return;
        }

        setStory(matchingStory);

        // If story is linked to a mentor, fetch public mentor card
        if (matchingStory.mentorId) {
          try {
            const mentorSnap = await getDoc(doc(db, "mentors", matchingStory.mentorId));
            if (mentorSnap.exists() && isMounted) {
              const linkedMentor = publicMentor({ ...mentorSnap.data(), id: mentorSnap.id });
              setMentor(linkedMentor?.active === false ? null : linkedMentor);
            }
          } catch (e) {
            console.warn("Could not load linked mentor info", e);
          }
        }
      } catch (err) {
        console.error("Error loading travel story:", err);
        if (isMounted) setLoadError('Die Story konnte gerade nicht geladen werden. Bitte versuche es erneut.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadStory();

    return () => {
      isMounted = false;
    };
  }, [db, storyId, retry]);

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link kopiert",
        description: "Der Link zu dieser Travel Story wurde in deine Zwischenablage kopiert.",
      });
      } catch { toast({title:"Link konnte nicht kopiert werden",description:"Kopiere die Adresse aus der Adresszeile deines Browsers.",variant:"destructive"}); }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-sm text-muted-foreground">Travel Story wird geladen...</p>
      </div>
    );
  }

  if (loadError) {
    return <div className="page-shell py-16 max-w-2xl" role="alert">
      <h1 className="editorial-title section-title">Story gerade nicht erreichbar</h1>
      <p className="mt-4 text-muted-foreground">{loadError}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={() => setRetry(value => value + 1)}>Erneut versuchen</Button>
        <Button asChild variant="outline"><Link href="/stories">Alle Travel Stories</Link></Button>
      </div>
    </div>;
  }

  if (isNotFound || !story) {
    return (
      <div className="container mx-auto px-4 max-w-2xl py-20 text-center">
        <Compass className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-foreground">Travel Story nicht gefunden</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Diese Reisegeschichte existiert nicht oder wurde von der Autorin bzw. dem Autor als privat eingestuft.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/stories">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zu den Travel Stories
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formattedDate = formatStoryDate(story);

  return (
    <article className="container mx-auto px-4 max-w-3xl py-8">
      {/* Back button & share */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
          <Link href="/stories">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Alle Travel Stories
          </Link>
        </Button>

        <Button variant="outline" size="sm" onClick={handleShare} className="text-xs">
          <Share2 className="w-3.5 h-3.5 mr-1.5" />
          Teilen
        </Button>
      </div>

      {/* Header */}
      <header className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <Badge variant="secondary" className="font-normal text-xs">
            Travel Story
          </Badge>
          <span className="flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            {formattedDate || 'Ohne Datumsangabe'}
          </span>
          {story.location && (
            <span className="flex items-center gap-1 font-medium text-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {story.location}
            </span>
          )}
        </div>

        <h1 className="editorial-title page-title leading-tight">
          {story.title}
        </h1>
      </header>

      {/* Linked Mentor Card (if story is connected to a mentor) */}
      {(mentor || story.mentorName) && (
        <Card className="mb-8 border-primary/20 bg-primary/5 rounded-xl overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Reisebegleitung &amp; Mentor
              </span>
              {mentor && (
                <Link
                  href={`/mentors/${mentor.id}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Profil ansehen &rarr;
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <p className="text-sm text-muted-foreground">
              Dieses Reiseerlebnis wurde unterstützt von{" "}
              <strong className="text-foreground font-semibold">
                {mentor ? `${mentor.firstName} ${mentor.lastName}`.trim() : story.mentorName}
              </strong>
              {mentor?.location ? ` (${mentor.location})` : ""}.
            </p>
          </CardContent>
        </Card>
      )}

      {story.imageUrls?.[0] && <ContentImage src={story.imageUrls[0]} alt={`Reisebild zu ${story.title}`} className="mb-8 aspect-[3/2] w-full rounded-2xl" fallback="Kein Reisebild verfügbar"/>}
      {/* Story Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="text-base sm:text-lg leading-relaxed text-foreground/90 whitespace-pre-line break-words space-y-4">
          {story.content}
        </div>
      </div>

      {/* Bottom info banner */}
      <footer className="mt-12 pt-8 border-t space-y-6">
        <div className="p-5 rounded-xl bg-muted/40 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Bereit für deine eigene Südafrika-Reise?
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Finde deinen persönlichen Local Mentor für maßgeschneiderte Tipps und Begleitung.
            </p>
          </div>
          <Button asChild size="sm" className="shrink-0 bg-primary hover:bg-primary/90">
            <Link href="/mentors">Mentoren finden</Link>
          </Button>
        </div>
      </footer>
    </article>
  );
}
