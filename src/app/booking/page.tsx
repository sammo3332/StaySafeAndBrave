"use client";

import { Suspense, useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CartContext } from "@/context/CartContext";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import type { MentorDTO } from "@/lib/dtos";
import { getPackageById, type PackageId } from "@/lib/packages";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { 
  Calendar, 
  User, 
  Package, 
  Send, 
  ArrowLeft, 
  Info, 
  AlertCircle, 
  Loader2, 
  ShieldCheck,
  MapPin,
  Lock
} from "lucide-react";

function BookingRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, addToCart, clearCart } = useContext(CartContext);
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  // Query parameter fallbacks if user navigates directly with ?mentor=...&package=...
  const queryMentorId = searchParams.get("mentor");
  const queryPackageId = searchParams.get("package") as PackageId | null;

  const mentorId = cart?.mentorId || queryMentorId || null;
  const packageId = cart?.packageId || (queryPackageId && getPackageById(queryPackageId) ? queryPackageId : null);

  // Fetch mentor details if available
  const mentorRef = useMemoFirebase(() => {
    if (!db || !mentorId) return null;
    return doc(db, "mentors", mentorId);
  }, [db, mentorId]);

  const { data: mentorData, isLoading: isMentorLoading } = useDoc<MentorDTO>(mentorRef);

  const mentorName = cart?.mentorName || (mentorData 
    ? `${mentorData.firstName || ""} ${mentorData.lastName || ""}`.trim() 
    : (mentorId ? "Local Mentor" : null));

  const packageDef = packageId ? getPackageById(packageId) : null;
  const packageName = cart?.packageName || packageDef?.name || null;

  // Form State
  const [requestedStartDate, setRequestedStartDate] = useState("");
  const [requestedEndDate, setRequestedEndDate] = useState("");
  const [travelerMessage, setTravelerMessage] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure cart is updated if query params provided missing context
  useEffect(() => {
    if (!cart && packageDef && mentorId) {
      addToCart({
        packageId: packageDef.id,
        packageName: packageDef.name,
        mentorId,
        mentorName: mentorName || undefined,
        priceAmount: packageDef.priceAmount,
        priceLabel: packageDef.priceLabel || "Preis in Abstimmung",
      });
    }
  }, [cart, packageDef, mentorId, mentorName, addToCart]);

  // Today's date string for input min attribute
  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 1. Validation: Mentor
    if (!mentorId || !mentorName) {
      setValidationError("Bitte wähle zuerst einen Local Mentor aus.");
      return;
    }

    // 2. Validation: Package
    if (!packageId || !packageName) {
      setValidationError("Bitte wähle zuerst ein Begleitpaket aus.");
      return;
    }

    // 3. Validation: Dates
    if (!requestedStartDate) {
      setValidationError("Bitte gib das Startdatum deines gewünschten Reisezeitraums an.");
      return;
    }
    if (!requestedEndDate) {
      setValidationError("Bitte gib das Enddatum deines gewünschten Reisezeitraums an.");
      return;
    }
    if (requestedEndDate < requestedStartDate) {
      setValidationError("Das Enddatum darf nicht vor dem Startdatum liegen.");
      return;
    }

    // 4. Validation: Authentication
    if (!user) {
      toast({
        title: "Anmeldung erforderlich",
        description: "Bitte melde dich an, um deine Buchungsanfrage abzusenden.",
      });
      router.push("/auth/login?redirect=/booking");
      return;
    }

    if (!db) {
      setValidationError("Datenbankverbindung nicht bereit. Bitte lade die Seite neu.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create new booking document reference in 'bookings' collection
      const newBookingRef = doc(collection(db, "bookings"));

      const bookingDocData = {
        id: newBookingRef.id,
        userId: user.uid,
        mentorId: mentorId,
        mentorName: mentorName,
        packageId: packageId,
        packageName: packageName,
        requestedStartDate: requestedStartDate,
        requestedEndDate: requestedEndDate,
        ...(travelerMessage.trim() ? { travelerMessage: travelerMessage.trim() } : {}),
        status: "requested" as const,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(newBookingRef, bookingDocData);

      // Successfully saved to Firestore
      toast({
        title: "Buchungsanfrage gesendet!",
        description: `Deine Anfrage für Paket ${packageName} wurde erfolgreich übermittelt.`,
      });

      // Clear cart context
      clearCart();

      // Route to user's bookings dashboard
      router.push("/dashboard/bookings");
    } catch (err: any) {
      console.error("Error creating booking request:", err);
      setValidationError(
        err?.message || "Beim Senden deiner Buchungsanfrage ist ein Fehler aufgetreten. Bitte versuche es erneut."
      );
      toast({
        variant: "destructive",
        title: "Fehler bei der Buchungsanfrage",
        description: "Deine Anfrage konnte nicht gespeichert werden. Bitte überprüfe deine Angaben und versuche es erneut.",
      });
      setIsSubmitting(false);
    }
  };

  // State: Missing Mentor
  if (!mentorId) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="border border-border/80 shadow-sm text-center p-6">
          <CardHeader>
            <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <User className="w-7 h-7" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Kein Local Mentor ausgewählt
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-1">
              Stay Safe &amp; Brave bietet persönliche Begleitung durch geprüfte Local Mentors. Wähle deinen passenden Mentor aus, um eine Buchungsanfrage zu starten.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/mentors">
                Local Mentors entdecken
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/pakete-preise">
                Begleitpakete ansehen
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // State: Missing Package
  if (!packageId) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card className="border border-border/80 shadow-sm text-center p-6">
          <CardHeader>
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <Package className="w-7 h-7" aria-hidden="true" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Kein Begleitpaket ausgewählt
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-1">
              Du hast bereits einen Local Mentor im Blick. Wähle nun dein gewünschtes Begleitpaket (Basis, Standard oder Premium).
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild className="w-full sm:w-auto">
              <Link href={`/pakete-preise?mentor=${mentorId}`}>
                Begleitpaket für Mentor wählen
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/mentors">
                Zurück zur Mentoren-Übersicht
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href={`/pakete-preise?mentor=${mentorId}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" />
          Zurück zur Paketauswahl
        </Link>
      </div>

      <header className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
          Buchungsanfrage senden
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Frage deine persönliche Reisebegleitung mit deinem ausgewählten Local Mentor für deinen Wunschzeitraum an.
        </p>
      </header>

      {/* Transparency Note */}
      <div className="mb-8 p-4 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
        <div className="text-sm text-muted-foreground leading-relaxed">
          <p className="font-semibold text-foreground mb-0.5">
            Dies ist zunächst eine Buchungsanfrage. Dein Local Mentor muss die Anfrage noch bestätigen.
          </p>
          <p>
            Stay Safe &amp; Brave ist keine Gruppen- oder Pauschaltour-Plattform. Wir vermitteln selbstbestimmten Reisenden einen verlässlichen persönlichen Local Mentor vor Ort.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selected Summary Card */}
        <Card className="border border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-foreground">
              Deine Auswahl
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected Mentor */}
            <div className="flex items-center justify-between p-3.5 rounded-md bg-muted/40 border border-border/60">
              <div className="flex items-center gap-3">
                {mentorData?.profilePictureUrl ? (
                  <Image
                    src={mentorData.profilePictureUrl}
                    alt={mentorName || "Mentor"}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <User className="w-6 h-6" aria-hidden="true" />
                  </div>
                )}
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-primary">
                    Ausgewählter Local Mentor
                  </div>
                  <div className="text-base font-bold text-foreground">
                    {mentorName}
                  </div>
                  {mentorData?.location && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {mentorData.location}
                    </div>
                  )}
                </div>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link href="/mentors">Ändern</Link>
              </Button>
            </div>

            {/* Selected Package */}
            <div className="flex items-center justify-between p-3.5 rounded-md bg-muted/40 border border-border/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-primary">
                    Ausgewähltes Begleitpaket
                  </div>
                  <div className="text-base font-bold text-foreground">
                    Paket {packageName}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {packageDef?.shortDescription || "Persönliche Local Mentor Reisebegleitung"} • <span className="font-medium text-foreground">Preis in Abstimmung</span>
                  </div>
                </div>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-xs">
                <Link href={`/pakete-preise?mentor=${mentorId}`}>Ändern</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Travel Period & Message */}
        <Card className="border border-border/70 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" aria-hidden="true" />
              Gewünschter Reisezeitraum
            </CardTitle>
            <CardDescription>
              Wähle den Zeitraum aus, in dem du die Begleitung durch deinen Local Mentor wünschst.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="font-semibold text-foreground">
                  Startdatum *
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  min={todayStr}
                  value={requestedStartDate}
                  onChange={(e) => setRequestedStartDate(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate" className="font-semibold text-foreground">
                  Enddatum *
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  min={requestedStartDate || todayStr}
                  value={requestedEndDate}
                  onChange={(e) => setRequestedEndDate(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Traveler Message */}
            <div className="space-y-2 pt-2">
              <Label htmlFor="travelerMessage" className="font-semibold text-foreground">
                Nachricht oder Reisewünsche an deinen Mentor (optional)
              </Label>
              <Textarea
                id="travelerMessage"
                rows={4}
                value={travelerMessage}
                onChange={(e) => setTravelerMessage(e.target.value)}
                placeholder="Erzähle kurz von deiner geplanten Route, besonderen Interessen (z. B. Fotografie, Natur, Kultur) oder Fragen..."
                className="resize-y"
              />
              <p className="text-xs text-muted-foreground">
                Hilft deinem Local Mentor, sich bestmöglich auf deine Reise einzustellen.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Validation error notice if present */}
        {validationError && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Authentication Notice if not logged in */}
        {!isUserLoading && !user && (
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
            <div className="flex items-start gap-2.5">
              <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold">Anmeldung erforderlich</p>
                <p className="text-xs text-amber-800">
                  Um die Buchungsanfrage verbindlich abzusenden und in deinem Dashboard zu verfolgen, melde dich bitte an.
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="default" className="shrink-0 bg-amber-700 hover:bg-amber-800 text-white">
              <Link href="/auth/login?redirect=/booking">
                Jetzt anmelden
              </Link>
            </Button>
          </div>
        )}

        {/* Submit Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full sm:flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" aria-hidden="true" />
                Anfrage wird übermittelt...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                Buchungsanfrage senden
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            asChild
            className="w-full sm:w-auto"
          >
            <Link href="/warenkorb">
              Zum Warenkorb
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Buchungsanfrage wird vorbereitet...</p>
        </div>
      }
    >
      <BookingRequestForm />
    </Suspense>
  );
}
