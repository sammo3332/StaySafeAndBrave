"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, CalendarDays, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import type { ConversationDTO, MentorDTO } from "@/lib/dtos";

export default function MessagesPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/auth/login");
    }
  }, [isUserLoading, user, router]);

  // Query real conversations where authenticated user is the traveler
  const conversationsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, "conversations"), where("travelerId", "==", user.uid));
  }, [db, user?.uid]);

  const { data: conversations, isLoading: isConversationsLoading } = useCollection<ConversationDTO>(conversationsQuery);

  // Fetch mentors to resolve mentor names and images
  const mentorsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "mentors");
  }, [db]);

  const { data: mentors } = useCollection<MentorDTO>(mentorsRef);

  const getMentor = (mentorId: string) => mentors?.find((m) => m.id === mentorId);

  const formatMessageTime = (val: any) => {
    if (!val) return "";
    try {
      const d = typeof val?.toDate === "function" ? val.toDate() : new Date(val);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const sortedConversations = useMemo(() => {
    if (!conversations) return [];
    return [...conversations].sort((a, b) => {
      const getTime = (c: ConversationDTO) => {
        const val = c.lastMessageCreatedAt || c.updatedAt || c.createdAt;
        if (!val) return 0;
        if (typeof (val as any)?.toMillis === "function") return (val as any).toMillis();
        return new Date(val as any).getTime() || 0;
      };
      return getTime(b) - getTime(a);
    });
  }, [conversations]);

  if (isUserLoading || !user || isConversationsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Lade Unterhaltungen...</p>
      </div>
    );
  }

  const hasConversations = sortedConversations.length > 0;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Meine Nachrichten</h1>
          <p className="text-lg text-muted-foreground">
            Direkter Austausch mit deinen Local Mentoren zu deinen Reisebuchungen.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/bookings" className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            Zu meinen Buchungen
          </Link>
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-primary">
            <MessageSquare className="w-5 h-5 text-accent" />
            Unterhaltungen {hasConversations && `(${sortedConversations.length})`}
          </CardTitle>
          <CardDescription>
            Hier findest du alle aktiven Nachrichtenstränge zu deinen Buchungsanfragen.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasConversations ? (
            <div className="divide-y border rounded-lg overflow-hidden">
              {sortedConversations.map((conv) => {
                const mentor = getMentor(conv.mentorId);
                const mentorDisplayName = conv.mentorName || (mentor ? `${mentor.firstName} ${mentor.lastName}`.trim() : "Local Mentor");
                const formattedTime = formatMessageTime(conv.lastMessageCreatedAt || conv.updatedAt);

                return (
                  <Link 
                    key={conv.id} 
                    href={`/dashboard/messages/${conv.id}`} 
                    className="block p-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-12 h-12 rounded-full border overflow-hidden bg-muted shrink-0">
                        {mentor?.profilePictureUrl ? (
                          <Image
                            src={mentor.profilePictureUrl}
                            alt={mentor.firstName || mentorDisplayName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-semibold text-muted-foreground">
                            {mentorDisplayName.charAt(0) || "M"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline gap-2">
                          <p className="font-semibold text-primary truncate">
                            {mentorDisplayName}
                          </p>
                          {formattedTime && (
                            <span className="text-xs text-muted-foreground shrink-0">
                              {formattedTime}
                            </span>
                          )}
                        </div>
                        {mentor?.location && (
                          <p className="text-xs text-muted-foreground truncate mb-1">
                            {mentor.location}
                          </p>
                        )}
                        {conv.lastMessageText ? (
                          <p className="text-sm text-foreground/80 truncate">
                            {conv.lastMessageText}
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic truncate">
                            Noch keine Nachrichten ausgetauscht
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground self-center shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 px-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-1">Keine Unterhaltungen vorhanden</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-5">
                Du hast aktuell noch keine laufenden Unterhaltungen. Starte eine Unterhaltung direkt aus deinen Buchungen.
              </p>
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/dashboard/bookings">Zu meinen Buchungen</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

