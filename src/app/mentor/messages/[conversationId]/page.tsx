"use client";

import { use, useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, useFirestore } from "@/firebase";
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import type { ConversationDTO, MessageDTO, MentorDTO } from "@/lib/dtos";
import { resolveMentorByAuthUid } from "@/lib/mentor-auth";
import { sendAtomicMessage } from "@/lib/messaging";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  Loader2,
  ShieldAlert,
  AlertCircle,
  Clock,
  User,
  CheckCircle2,
} from "lucide-react";

export default function MentorConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = use(params);
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const [mentor, setMentor] = useState<MentorDTO | null>(null);
  const [isMentorLoading, setIsMentorLoading] = useState<boolean>(true);
  const [mentorResolved, setMentorResolved] = useState<boolean>(false);

  const [conversation, setConversation] = useState<ConversationDTO | null>(null);
  const [isConvLoading, setIsConvLoading] = useState<boolean>(true);
  const [convError, setConvError] = useState<string | null>(null);

  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState<boolean>(true);

  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Auth guard
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

  // 3. Real-time subscription to conversation document
  useEffect(() => {
    if (!db || !conversationId) return;

    setIsConvLoading(true);
    setConvError(null);

    const convRef = doc(db, "conversations", conversationId);
    const unsubscribe = onSnapshot(
      convRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setConversation({
            id: docSnap.id,
            ...(docSnap.data() as Omit<ConversationDTO, "id">),
          });
        } else {
          setConversation(null);
        }
        setIsConvLoading(false);
      },
      (err) => {
        console.error("Error subscribing to conversation:", err);
        setConvError("Keine Berechtigung oder Unterhaltung existiert nicht.");
        setIsConvLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, conversationId]);

  // 4. Real-time subscription to messages subcollection
  useEffect(() => {
    if (!db || !conversationId) return;

    setIsMessagesLoading(true);
    const messagesCol = collection(db, "conversations", conversationId, "messages");
    const q = query(messagesCol, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: MessageDTO[] = [];
        snapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            ...(doc.data() as Omit<MessageDTO, "id">),
          });
        });
        setMessages(list);
        setIsMessagesLoading(false);
      },
      (err) => {
        console.error("Error subscribing to messages:", err);
        setIsMessagesLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, conversationId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Format helpers
  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      const date = typeof timestamp?.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    try {
      const date = typeof timestamp?.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return "";
      return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
    } catch {
      return "";
    }
  };

  // 5. Send message via atomic writeBatch helper
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || !mentor) return;

    const trimmed = messageText.trim();
    if (!trimmed) return;

    if (trimmed.length > 2000) {
      setSendError("Nachricht darf maximal 2000 Zeichen lang sein.");
      return;
    }

    // Verify mentor authorization for this conversation
    if (conversation && conversation.mentorId !== mentor.id) {
      setSendError("Du bist nicht berechtigt, in dieser Unterhaltung zu antworten.");
      return;
    }

    setIsSending(true);
    setSendError(null);

    try {
      await sendAtomicMessage({
        db,
        conversationId,
        senderId: user.uid,
        text: trimmed,
      });
      setMessageText("");
    } catch (err: any) {
      console.error("Error sending mentor message:", err);
      setSendError(err?.message || "Fehler beim Senden der Nachricht.");
    } finally {
      setIsSending(false);
    }
  };

  // Loading state
  if (isUserLoading || isMentorLoading || isConvLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[420px] space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Lade Unterhaltung...</p>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return null;
  }

  // Truthful unlinked / unauthorized mentor state
  if (mentorResolved && !mentor) {
    return (
      <div className="py-8 max-w-2xl mx-auto space-y-6">
        <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-amber-600" />
              <CardTitle className="text-xl">Kein verknüpftes Mentor-Profil</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>
              Dein Konto ist keinem Mentor-Profil über die private Autorisierung (<code>/mentorAuth</code>) zugeordnet.
            </p>
            <Button asChild variant="outline">
              <Link href="/mentor/messages">Zurück zur Übersicht</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Conversation does not exist or unauthorized
  if (convError || !conversation) {
    return (
      <div className="py-8 max-w-2xl mx-auto space-y-6">
        <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <CardTitle className="text-xl">Unterhaltung nicht gefunden</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Diese Unterhaltung konnte nicht geladen werden oder du verfügst nicht über die erforderlichen Berechtigungen.
            </p>
            <Button asChild variant="outline">
              <Link href="/mentor/messages">Zurück zum Mentor-Postfach</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verify conversation belongs to this mentor
  if (conversation.mentorId !== mentor?.id) {
    return (
      <div className="py-8 max-w-2xl mx-auto space-y-6">
        <Card className="border-destructive/30 bg-destructive/5 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-destructive" />
              <CardTitle className="text-xl">Zugriff verweigert</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              Diese Reiseunterhaltung ist einem anderen Mentor zugeordnet und kann von deinem Profil nicht eingesehen werden.
            </p>
            <Button asChild variant="outline">
              <Link href="/mentor/messages">Zurück zum Mentor-Postfach</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between gap-4 border-b pb-4">
        <Button asChild variant="ghost" size="sm" className="gap-2">
          <Link href="/mentor/messages">
            <ArrowLeft className="w-4 h-4" />
            <span>Zurück zum Mentor-Postfach</span>
          </Link>
        </Button>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User className="w-3.5 h-3.5 text-primary" />
          <span>
            Angemeldet als <strong>{mentor?.firstName} {mentor?.lastName}</strong>
          </span>
        </div>
      </div>

      {/* Booking and Conversation Context Banner */}
      <Card className="bg-muted/40 border shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                Buchung #{conversation.bookingId}
              </Badge>
              <Badge variant="secondary" className="text-xs font-normal">
                1:1 Nachrichtenaustausch
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Reisenden-ID: <span className="font-mono">{conversation.travelerId}</span>
            </p>
          </div>
          <div className="text-xs text-muted-foreground sm:text-right">
            <span>Zugeordnet zu deinem Mentor-Profil</span>
          </div>
        </CardContent>
      </Card>

      {/* Messages Stream */}
      <Card className="shadow-sm border">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4 min-h-[360px] max-h-[520px] overflow-y-auto pr-1">
            {isMessagesLoading ? (
              <div className="flex flex-col items-center justify-center flex-1 py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Lade Nachrichten...</p>
              </div>
            ) : messages.length > 0 ? (
              messages.map((msg) => {
                const isMe = msg.senderId === user.uid;
                const formattedTime = formatTime(msg.createdAt);
                const formattedDate = formatDate(msg.createdAt);

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="text-[11px] text-muted-foreground mb-1 px-1 flex items-center gap-1.5">
                      <span>{isMe ? "Du (Mentor)" : "Reisender"}</span>
                      {formattedDate && <span>• {formattedDate}</span>}
                    </div>

                    <div
                      className={`max-w-[82%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-xs"
                          : "bg-muted border border-border text-foreground rounded-bl-xs"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words leading-relaxed">
                        {msg.text}
                      </p>
                      <div
                        className={`text-[10px] mt-1 text-right ${
                          isMe ? "text-primary-foreground/75" : "text-muted-foreground"
                        }`}
                      >
                        {formattedTime}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  In dieser Unterhaltung wurden noch keine Nachrichten ausgetauscht.
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Reply Input Box */}
      <Card className="shadow-sm border">
        <CardContent className="p-4 sm:p-5">
          <form onSubmit={handleSendMessage} className="space-y-3">
            {sendError && (
              <div className="flex items-center gap-2 p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{sendError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Schreibe deine Antwort an den Reisenden..."
                className="min-h-[100px] resize-none text-sm"
                maxLength={2000}
                disabled={isSending}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
              />
              <div className="flex justify-between items-center text-[11px] text-muted-foreground px-1">
                <span>Enter zum Senden • Umschalt+Enter für neue Zeile</span>
                <span>{messageText.length} / 2000</span>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSending || !messageText.trim()}
                className="gap-2 px-5"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Wird gesendet...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Antwort senden</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
