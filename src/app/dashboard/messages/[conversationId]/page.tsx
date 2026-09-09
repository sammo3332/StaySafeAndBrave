"use client";

import { use, useEffect, useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useCollection, useMemoFirebase } from "@/firebase";
import {
  doc,
  collection,
  query,
  orderBy,
} from "firebase/firestore";
import type { ConversationDTO, MessageDTO, BookingDTO, MentorDTO } from "@/lib/dtos";
import { sendAtomicMessage } from "@/lib/messaging";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  Loader2,
  Calendar,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  User,
  Info,
} from "lucide-react";

// INVARIANT: conversationId === bookingId (deterministic 1:1 conversation per booking)
interface PageProps {
  params: Promise<{ conversationId: string }>;
}

export default function ConversationDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const conversationId = resolvedParams.conversationId;

  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Authentication check
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/auth/login");
    }
  }, [isUserLoading, user, router]);

  // 1. Fetch conversation document if it exists
  const convDocRef = useMemoFirebase(() => {
    if (!db || !conversationId) return null;
    return doc(db, "conversations", conversationId);
  }, [db, conversationId]);

  const {
    data: conversation,
    isLoading: isConvLoading,
    error: convError,
  } = useDoc<ConversationDTO>(convDocRef);

  // 2. Fetch booking document as fallback / verification of booking relationship
  const bookingDocRef = useMemoFirebase(() => {
    if (!db || !conversationId) return null;
    return doc(db, "bookings", conversationId);
  }, [db, conversationId]);

  const {
    data: booking,
    isLoading: isBookingLoading,
    error: bookingError,
  } = useDoc<BookingDTO>(bookingDocRef);

  // Derive mentorId and bookingId
  const mentorId = conversation?.mentorId || booking?.mentorId;
  const bookingId = conversation?.bookingId || booking?.id;

  // 3. Fetch mentor profile for details
  const mentorDocRef = useMemoFirebase(() => {
    if (!db || !mentorId) return null;
    return doc(db, "mentors", mentorId);
  }, [db, mentorId]);

  const { data: mentor } = useDoc<MentorDTO>(mentorDocRef);

  // 4. Real-time messages subcollection
  const messagesQuery = useMemoFirebase(() => {
    if (!db || !conversationId) return null;
    return query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "asc")
    );
  }, [db, conversationId]);

  const {
    data: messages,
    isLoading: isMessagesLoading,
  } = useCollection<MessageDTO>(messagesQuery);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.length]);

  // Format message time
  const formatTime = (val: any) => {
    if (!val) return "";
    try {
      const d = typeof val?.toDate === "function" ? val.toDate() : new Date(val);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const formatDate = (val: any) => {
    if (!val) return "";
    try {
      const d = typeof val?.toDate === "function" ? val.toDate() : new Date(val);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "short",
      });
    } catch {
      return "";
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user?.uid) return;

    const trimmed = messageText.trim();
    if (!trimmed) return;
    if (trimmed.length > 2000) {
      setSendError("Die Nachricht darf maximal 2000 Zeichen enthalten.");
      return;
    }

    // Verify authorized relationship (traveler-only for now)
    const isParticipant =
      (conversation && conversation.travelerId === user.uid) ||
      (booking && booking.userId === user.uid);

    if (!isParticipant) {
      setSendError("Du bist nicht berechtigt, Nachrichten in dieser Unterhaltung zu senden.");
      return;
    }

    setIsSending(true);
    setSendError(null);

    try {
      if (!conversation) {
        if (!booking || booking.userId !== user.uid) {
          throw new Error("Keine gültige Buchungsbeziehung gefunden.");
        }
        const mentorDisplayName =
          booking.mentorName ||
          (mentor ? `${mentor.firstName} ${mentor.lastName}`.trim() : "Local Mentor");

        await sendAtomicMessage({
          db,
          conversationId,
          senderId: user.uid,
          text: trimmed,
          createConversationData: {
            travelerId: user.uid,
            mentorId: booking.mentorId,
            mentorName: mentorDisplayName,
          },
        });
      } else {
        await sendAtomicMessage({
          db,
          conversationId,
          senderId: user.uid,
          text: trimmed,
        });
      }

      setMessageText("");
    } catch (err: any) {
      console.error("Error sending message:", err);
      setSendError(err?.message || "Fehler beim Senden der Nachricht.");
    } finally {
      setIsSending(false);
    }
  };

  // Loading state
  if (isUserLoading || isConvLoading || (isBookingLoading && !conversation)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground">Lade Unterhaltung...</p>
      </div>
    );
  }

  // Authorization and existence check
  const isAuthorizedTraveler =
    (conversation && conversation.travelerId === user?.uid) ||
    (booking && booking.userId === user?.uid);

  if (!isAuthorizedTraveler) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-primary mb-2">Unterhaltung nicht verfügbar</h2>
        <p className="text-muted-foreground mb-6">
          Diese Unterhaltung existiert nicht oder du bist nicht berechtigt, darauf zuzugreifen. Nachrichten können nur zu deinen eigenen Buchungen aufgerufen werden.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/dashboard/messages">Alle Nachrichten</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/dashboard/bookings">Zu meinen Buchungen</Link>
          </Button>
        </div>
      </div>
    );
  }

  const mentorDisplayName =
    conversation?.mentorName ||
    booking?.mentorName ||
    (mentor ? `${mentor.firstName} ${mentor.lastName}`.trim() : "Local Mentor");

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-8">
      {/* Header with Navigation and Mentor Context */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="shrink-0">
          <Link href="/dashboard/messages">
            <ArrowLeft className="w-5 h-5" />
            <span className="sr-only">Zurück zu allen Nachrichten</span>
          </Link>
        </Button>
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative w-11 h-11 rounded-full border overflow-hidden bg-muted shrink-0">
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
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-primary truncate leading-none">
                {mentorDisplayName}
              </h1>
              {mentor?.identityVerified && (
                <span title="Verifizierter Mentor">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate mt-0.5">
              {mentor?.location ? `${mentor.location} • ` : ""}Buchung #{conversationId.slice(0, 8)}
            </p>
          </div>
        </div>

        {booking && (
          <Button asChild variant="outline" size="sm" className="hidden sm:flex text-xs">
            <Link href="/dashboard/bookings">
              Buchungsdetails
            </Link>
          </Button>
        )}
      </div>

      {/* Booking Context Banner */}
      {booking && (
        <Card className="bg-muted/40 border-muted text-xs p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {booking.requestedStartDate && booking.requestedEndDate
                  ? `${booking.requestedStartDate} – ${booking.requestedEndDate}`
                  : booking.bookingDate || "Termin nach Vereinbarung"}
              </span>
              {booking.packageName && (
                <>
                  <span>•</span>
                  <span className="font-medium text-foreground">{booking.packageName}</span>
                </>
              )}
            </div>
            <Badge variant="outline" className="text-[11px] font-normal uppercase tracking-wider">
              {booking.status === "requested" ? "Anfrage gesendet" : booking.status}
            </Badge>
          </div>
        </Card>
      )}

      {/* Mentor Assignment Notice */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/60 border border-border text-xs text-muted-foreground">
        <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Deine Unterhaltung ist deinem Local Mentor zugeordnet.
        </p>
      </div>

      {/* Messages Container */}
      <Card className="shadow-sm border">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4 min-h-[360px] max-h-[520px] overflow-y-auto pr-1">
            {isMessagesLoading ? (
              <div className="flex flex-col items-center justify-center flex-1 py-12">
                <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Lade Nachrichten...</p>
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((msg) => {
                const isMe = msg.senderId === user?.uid;
                const formattedTime = formatTime(msg.createdAt);
                const formattedDate = formatDate(msg.createdAt);

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                        isMe
                          ? "bg-primary text-primary-foreground rounded-br-xs"
                          : "bg-muted text-foreground rounded-bl-xs border"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                      {formattedDate ? `${formattedDate}, ` : ""}
                      {formattedTime}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 py-16 text-center text-muted-foreground">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">Noch keine Nachrichten</p>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  Schreibe die erste Nachricht an {mentorDisplayName}, um Fragen oder Details zu deiner Buchung festzuhalten.
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Send Error Notice */}
          {sendError && (
            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-md flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{sendError}</span>
            </div>
          )}

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} className="mt-4 pt-3 border-t flex gap-2">
            <Textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Nachricht an ${mentorDisplayName} schreiben...`}
              rows={2}
              maxLength={2000}
              className="resize-none text-sm min-h-[50px] max-h-[120px]"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button
              type="submit"
              disabled={isSending || !messageText.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground self-end px-4 h-10"
            >
              {isSending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="sr-only">Senden</span>
            </Button>
          </form>
          <div className="flex justify-between items-center mt-1.5 px-1">
            <span className="text-[11px] text-muted-foreground">
              Enter zum Senden • Shift+Enter für neue Zeile
            </span>
            <span className="text-[11px] text-muted-foreground">
              {messageText.length}/2000
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
