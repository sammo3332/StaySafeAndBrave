"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, useFirestore } from "@/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import type { ConversationDTO, MentorDTO } from "@/lib/dtos";
import { resolveMentorByAuthUid } from "@/lib/mentor-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  ShieldAlert,
  Clock,
  ArrowRight,
  User,
  Loader2,
  Inbox,
  AlertCircle,
} from "lucide-react";

export default function MentorMessagesPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const [mentor, setMentor] = useState<MentorDTO | null>(null);
  const [isMentorLoading, setIsMentorLoading] = useState<boolean>(true);
  const [mentorResolved, setMentorResolved] = useState<boolean>(false);

  const [conversations, setConversations] = useState<ConversationDTO[]>([]);
  const [isConversationsLoading, setIsConversationsLoading] = useState<boolean>(true);
  const [conversationsError, setConversationsError] = useState<string | null>(null);

  // 1. Authentication guard
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/auth/login");
    }
  }, [isUserLoading, user, router]);

  // 2. Resolve linked mentor profile by authUid == user.uid
  useEffect(() => {
    if (!user?.uid || !db) {
      if (!isUserLoading) {
        setIsMentorLoading(false);
        setMentorResolved(true);
      }
      return;
    }

    let isMounted = true;
    setIsMentorLoading(true);

    resolveMentorByAuthUid(db, user.uid)
      .then((resolved) => {
        if (!isMounted) return;
        setMentor(resolved);
        setMentorResolved(true);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error resolving mentor profile:", err);
        setMentor(null);
        setMentorResolved(true);
      })
      .finally(() => {
        if (isMounted) setIsMentorLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [db, user?.uid, isUserLoading]);

  // 3. Real-time subscription to conversations for this mentor profile (where mentorId == mentor.id)
  useEffect(() => {
    if (!db || !mentor?.id) {
      setConversations([]);
      setIsConversationsLoading(false);
      return;
    }

    setIsConversationsLoading(true);
    setConversationsError(null);

    const convCol = collection(db, "conversations");
    const q = query(convCol, where("mentorId", "==", mentor.id));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: ConversationDTO[] = [];
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            ...(doc.data() as Omit<ConversationDTO, "id">),
          });
        });
        setConversations(list);
        setIsConversationsLoading(false);
      },
      (err) => {
        console.error("Failed to load mentor conversations:", err);
        setConversationsError("Fehler beim Laden der Nachrichten. Bitte prüfe deine Berechtigungen.");
        setIsConversationsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, mentor?.id]);

  // Helper to format timestamps safely
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

  // Sort conversations chronologically descending by latest message/activity
  const sortedConversations = useMemo(() => {
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

  // Loading state
  if (isUserLoading || isMentorLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Lade Mentor-Postfach...</p>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Truthful unlinked / unauthorized state
  if (mentorResolved && !mentor) {
    return (
      <div className="py-8 max-w-2xl mx-auto space-y-6">
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 dark:border-amber-900/50 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl text-amber-950 dark:text-amber-200">
                  Kein verknüpftes Mentor-Profil
                </CardTitle>
                <CardDescription className="text-amber-800/80 dark:text-amber-300/80">
                  Für dieses Konto ist kein aktiver Mentor-Zugang hinterlegt.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-amber-950/90 dark:text-amber-200/90">
            <p className="leading-relaxed">
              Dein aktuelles Benutzerkonto (<strong>{user.email || user.uid}</strong>) ist keinem Mentor-Profil über die private Autorisierung (<code>/mentorAuth</code>) zugeordnet.
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hinweis: Die Freischaltung des Mentor-Zugangs erfordert eine administrative Verknüpfung deines Firebase-Kontos mit dem entsprechenden Mentor-Eintrag.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <Link href="/">Zur Startseite</Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard">Zum Reisenden-Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header with Mentor Identity Context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Mentor Postfach</h1>
          <p className="text-base text-muted-foreground mt-1">
            Nachrichten und direkte Anfragen deiner Reisenden zu ihren Buchungen.
          </p>
        </div>
        {mentor && (
          <div className="flex items-center gap-2 p-2 px-3 rounded-md bg-muted/70 border text-xs text-muted-foreground">
            <User className="w-4 h-4 text-primary" />
            <span>
              Angemeldet als <strong>{mentor.firstName} {mentor.lastName}</strong> ({mentor.location})
            </span>
          </div>
        )}
      </div>

      {/* Error alert if conversations failed to load */}
      {conversationsError && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{conversationsError}</p>
        </div>
      )}

      {/* Conversations List */}
      {isConversationsLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-7 h-7 animate-spin text-primary mb-2" />
          <p className="text-xs text-muted-foreground">Lade Unterhaltungen...</p>
        </div>
      ) : sortedConversations.length > 0 ? (
        <div className="grid gap-4">
          {sortedConversations.map((conv) => {
            const hasLastMessage = !!conv.lastMessageText;
            const isLastFromMe = conv.lastMessageSenderId === user.uid;
            const messageTimeStr = formatMessageTime(conv.lastMessageCreatedAt || conv.updatedAt);

            return (
              <Card
                key={conv.id}
                className="hover:shadow-md transition-shadow duration-200 border overflow-hidden"
              >
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Badge variant="outline" className="text-xs font-mono">
                          Buchung #{conv.bookingId.slice(0, 8)}
                        </Badge>
                        {isLastFromMe ? (
                          <Badge variant="secondary" className="text-[11px] font-normal">
                            Du hast geantwortet
                          </Badge>
                        ) : hasLastMessage ? (
                          <Badge variant="default" className="text-[11px] font-normal">
                            Neue Nachricht vom Reisenden
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[11px] font-normal text-muted-foreground">
                            Noch keine Nachrichten
                          </Badge>
                        )}
                        {messageTimeStr && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            {messageTimeStr}
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Reisenden-ID: <span className="font-mono">{conv.travelerId}</span>
                      </div>

                      <p className="text-sm line-clamp-2 text-foreground/90 pt-1">
                        {conv.lastMessageText || (
                          <span className="italic text-muted-foreground">Keine Nachrichten vorhanden.</span>
                        )}
                      </p>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0">
                      <Button asChild size="sm" className="gap-1.5">
                        <Link href={`/mentor/messages/${conv.id}`}>
                          <span>Zur Unterhaltung</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-3">
            <div className="p-4 rounded-full bg-muted">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Keine Nachrichten vorhanden</h3>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Es liegen aktuell noch keine aktiven Reise-Unterhaltungen für dein Profil vor. Sobald ein Reisender dir eine Nachricht zu einer Buchung sendet, findest du sie hier.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
