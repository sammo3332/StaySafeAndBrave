'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RefreshCw, 
  AlertTriangle, 
  HeartHandshake, 
  ShieldCheck, 
  MessageCircle, 
  Compass, 
  ArrowRight,
  Info,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SafeMarkdown } from '@/components/travel-assistant/safe-markdown';
import { askTravelAssistant, type ChatMessage } from '@/ai/flows/travel-assistant';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { BookingDTO } from '@/lib/dtos';

interface FormattedMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedFollowUps?: string[];
  suggestMentorContact?: boolean;
}

const STARTER_QUESTIONS = [
  {
    id: 'starter-1',
    title: 'Packliste für 2 Wochen',
    question: 'Was sollte ich für zwei Wochen in Südafrika einpacken?',
  },
  {
    id: 'starter-2',
    title: 'Kapstadt & Garden Route',
    question: 'Wie könnte ich Kapstadt und die Garden Route optimal kombinieren?',
  },
  {
    id: 'starter-3',
    title: 'Fragen an die Mentorin',
    question: 'Welche Fragen sollte ich meinem Local Mentor vor der Reise stellen?',
  },
  {
    id: 'starter-4',
    title: 'Erste Reisetage strukturieren',
    question: 'Hilf mir, meine ersten Reisetage in Südafrika sinnvoll zu strukturieren.',
  },
];

export function TravelChat() {
  const [messages, setMessages] = useState<FormattedMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Check if user has an active mentor booking for direct handoff
  const { user } = useUser();
  const db = useFirestore();

  const bookingsQuery = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, 'bookings'), where('userId', '==', user.uid));
  }, [db, user?.uid]);

  const { data: userBookings } = useCollection<BookingDTO>(bookingsQuery);
  const activeBooking = userBookings && userBookings.length > 0 ? userBookings[0] : null;

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    if (text.length < 2) {
      setErrorMessage('Bitte gib mindestens 2 Zeichen ein.');
      return;
    }

    if (text.length > 1000) {
      setErrorMessage('Deine Nachricht darf maximal 1.000 Zeichen lang sein.');
      return;
    }

    setErrorMessage(null);
    setInputValue('');

    const userMessageId = `user-${Date.now()}`;
    const newMessages: FormattedMessage[] = [
      ...messages,
      { id: userMessageId, role: 'user', content: text },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Build lightweight session history (last 6 messages max)
      const historyPayload: ChatMessage[] = newMessages.slice(-6).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await askTravelAssistant({
        message: text,
        history: historyPayload,
      });

      if (response.success && response.reply) {
        setMessages(prev => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: response.reply,
            suggestedFollowUps: response.suggestedFollowUps,
            suggestMentorContact: response.suggestMentorContact,
          },
        ]);
      } else {
        setErrorMessage(
          response.error ||
            'Entschuldigung, beim Verarbeiten deiner Anfrage ist ein Fehler aufgetreten. Bitte versuche es erneut.'
        );
      }
    } catch (err: unknown) {
      console.error('Chat error:', err);
      setErrorMessage(
        'Kommunikationsfehler mit dem Reiseassistenten. Bitte überprüfe deine Verbindung und versuche es erneut.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setErrorMessage(null);
    setInputValue('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Mentor Connection Banner (if authenticated and has booking) */}
      {activeBooking ? (
        <div 
          id="mentor-handoff-banner" 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20 text-foreground"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary">
                Du hast eine persönliche Reisebegleitung gebucht!
              </p>
              <p className="text-xs text-muted-foreground">
                Mentor:{' '}
                <span className="font-medium text-foreground">
                  {activeBooking.mentorName || 'Deine Local Mentorin'}
                </span>{' '}
                – Für tagesaktuelle Vor-Ort-Tipps kannst du ihr jederzeit direkt schreiben.
              </p>
            </div>
          </div>
          <Button asChild size="sm" variant="default" className="shrink-0 bg-primary hover:bg-primary/90">
            <Link href={`/dashboard/messages/${activeBooking.id}`} className="flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              Nachrichten öffnen
            </Link>
          </Button>
        </div>
      ) : (
        <div 
          id="mentor-discovery-banner" 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-muted/60 border border-border text-foreground"
        >
          <div className="flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              Der AI Assistant hilft bei der Vorbereitung.{' '}
              <strong className="text-foreground font-medium">Dein echter Local Mentor</strong> begleitet dich persönlich vor Ort.
            </p>
          </div>
          <Button asChild size="sm" variant="outline" className="shrink-0 text-xs h-8">
            <Link href="/mentors" className="flex items-center gap-1">
              Mentoren ansehen <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>
      )}

      {/* Main Chat Frame */}
      <Card className="shadow-md border-border/80 bg-card overflow-hidden">
        {/* Chat Header Bar */}
        <div className="px-5 py-3.5 border-b bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                Reisevorbereitungs-Chat
                <Badge variant="secondary" className="text-[10px] font-normal px-2 py-0">
                  Digitaler Assistent
                </Badge>
              </h2>
              <p className="text-xs text-muted-foreground">
                Allgemeine Reiseplanung, Packlisten &amp; Routen
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button
              id="reset-chat-button"
              variant="ghost"
              size="sm"
              onClick={handleResetChat}
              className="text-xs text-muted-foreground hover:text-foreground h-8"
              disabled={isLoading}
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Neues Gespräch
            </Button>
          )}
        </div>

        {/* Chat Feed */}
        <CardContent className="p-4 sm:p-6 min-h-[380px] max-h-[560px] overflow-y-auto space-y-4">
          {/* Empty / Welcome State */}
          {messages.length === 0 ? (
            <div id="chat-empty-state" className="flex flex-col items-center justify-center text-center py-8 px-2 space-y-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-lg font-semibold text-primary">
                  Wie kann ich dich bei deiner Vorbereitung unterstützen?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Stelle Fragen zu Reiserouten, Packlisten, Reisedauern oder bereite Fragen vor, die du deiner Local Mentorin stellen möchtest.
                </p>
              </div>

              {/* Starter Question Chips */}
              <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-left">
                {STARTER_QUESTIONS.map(starter => (
                  <button
                    key={starter.id}
                    id={starter.id}
                    type="button"
                    onClick={() => handleSendMessage(starter.question)}
                    disabled={isLoading}
                    className="p-3 rounded-lg border border-border bg-background hover:bg-muted/50 hover:border-primary/40 transition-colors text-left group"
                  >
                    <p className="text-xs font-semibold text-primary group-hover:underline flex items-center justify-between">
                      {starter.title}
                      <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {starter.question}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-primary text-primary-foreground rounded-tr-xs ml-auto shadow-xs'
                          : 'bg-muted/40 border border-border/70 text-foreground rounded-tl-xs shadow-xs'
                      }`}
                    >
                      {/* Message Content rendered cleanly and safely via SafeMarkdown */}
                      <SafeMarkdown
                        content={message.content}
                        variant={isUser ? 'user' : 'assistant'}
                      />

                      {/* Mentor Handoff Note if contextual */}
                      {!isUser && message.suggestMentorContact && (
                        <div className="mt-3 pt-3 border-t border-border/60 flex items-start gap-2 text-xs text-muted-foreground">
                          <HeartHandshake className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>
                            <strong>Tipp für vor Ort:</strong> Für tagesaktuelle Empfehlungen und persönliche Vor-Ort-Begleitung sprichst du am besten direkt mit deinem{' '}
                            <Link href="/mentors" className="text-primary underline font-medium hover:text-primary/80">
                              Local Mentor
                            </Link>.
                          </span>
                        </div>
                      )}

                      {/* Suggested Follow-Ups */}
                      {!isUser && message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
                        <div className="mt-3 pt-2 flex flex-wrap gap-1.5">
                          {message.suggestedFollowUps.map((followUp, fIdx) => (
                            <button
                              key={fIdx}
                              id={`follow-up-${message.id}-${fIdx}`}
                              type="button"
                              onClick={() => handleSendMessage(followUp)}
                              disabled={isLoading}
                              className="text-xs px-2.5 py-1 rounded-full bg-background border border-primary/25 hover:border-primary hover:bg-primary/5 text-primary transition-colors cursor-pointer"
                            >
                              {followUp}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center shrink-0 mt-1">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0 animate-pulse">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-muted/40 border border-border/70 rounded-2xl rounded-tl-xs p-3.5 text-xs text-muted-foreground flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
                    <span>Der Reiseassistent bereitet deine Antwort vor...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>

        {/* Error State Banner */}
        {errorMessage && (
          <div id="chat-error-banner" className="mx-4 mb-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive flex items-start gap-2.5 text-xs sm:text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium">{errorMessage}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setErrorMessage(null)}
              className="h-6 px-2 text-xs hover:bg-destructive/10"
            >
              Schließen
            </Button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="space-y-2"
          >
            <div className="relative">
              <Textarea
                id="travel-chat-input"
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Stelle eine Frage zur Reisevorbereitung... (z.B. Packliste, Garden Route, Transport)"
                className="min-h-[72px] max-h-[140px] resize-none pr-24 py-2.5 text-sm"
                disabled={isLoading}
                maxLength={1000}
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                <Button
                  id="travel-chat-submit-btn"
                  type="submit"
                  size="sm"
                  disabled={isLoading || inputValue.trim().length < 2}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 px-3"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 mr-1" />
                      Senden
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
              <span className="flex items-center gap-1">
                <Info className="w-3 h-3" />
                Eingabetaste zum Senden, Umschalt+Eingabe für neue Zeile
              </span>
              <span>{inputValue.length} / 1.000 Zeichen</span>
            </div>
          </form>
        </div>
      </Card>

      {/* Safety & Trust Boundaries Footnote */}
      <div 
        id="chat-trust-disclaimer" 
        className="p-4 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground space-y-1.5"
      >
        <div className="flex items-center gap-1.5 text-foreground font-semibold">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>Sicherheits- &amp; Vertrauenshinweis</span>
        </div>
        <p className="leading-relaxed">
          Dieser digitale Assistent unterstützt unverbindlich bei der Vorbereitung und Reiseplanung. 
          Er verfügt über keine Echtzeitdaten und ersetzt keine Sicherheitsbehörden oder Notrufdienste.
          Bei akuten Notfällen vor Ort wende dich direkt an die offiziellen Notrufnummern in Südafrika 
          (<strong>112</strong> vom Mobiltelefon / <strong>10111</strong> Polizei) oder kontaktiere deine 
          persönliche <strong>Local Mentorin</strong>.
        </p>
      </div>
    </div>
  );
}
