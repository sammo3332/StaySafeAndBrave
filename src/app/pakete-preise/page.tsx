"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldCheck, User, ArrowLeft, Info } from "lucide-react";
import Image from "next/image";
import images from "@/lib/placeholder-images.json";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import type { MentorDTO } from "@/lib/dtos";
import { getPackages } from "@/lib/packages";

function PaketePreiseContent() {
  const searchParams = useSearchParams();
  const mentorId = searchParams.get("mentor");

  const db = useFirestore();
  const mentorRef = useMemoFirebase(() => {
    if (!db || !mentorId) return null;
    return doc(db, "mentors", mentorId);
  }, [db, mentorId]);

  const { data: mentor } = useDoc<MentorDTO>(mentorRef);
  const packages = getPackages();

  const mentorFullName = mentor
    ? `${mentor.firstName || ""} ${mentor.lastName || ""}`.trim()
    : null;

  return (
    <>
      <section className="w-full mb-12">
        <Image
          src={images.general.pricingHeader.src}
          alt="Begleitpakete und Preise mit Stay Safe & Brave"
          data-ai-hint={images.general.pricingHeader.dataAiHint}
          width={1200}
          height={400}
          className="w-full h-auto object-cover shadow-lg"
          priority
        />
      </section>

      <div className="container mx-auto px-4 pb-12">
        <div className="space-y-10">
          {/* Carried Mentor Context Banner */}
          {mentorId && (
            <div className="max-w-4xl mx-auto rounded-xl border border-primary/30 bg-primary/5 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3 text-center sm:text-left">
                {mentor?.profilePictureUrl ? (
                  <Image
                    src={mentor.profilePictureUrl}
                    alt={mentorFullName || "Mentor Porträt"}
                    width={52}
                    height={52}
                    className="w-13 h-13 rounded-full object-cover border-2 border-primary/40 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                    <User className="w-6 h-6" aria-hidden="true" />
                  </div>
                )}
                <div>
                  <div className="text-xs uppercase tracking-wider font-semibold text-primary">
                    Ausgewählter Local Mentor
                  </div>
                  <div className="text-base font-bold text-foreground">
                    {mentorFullName || "Lokaler Mentor"}
                    {mentor?.location && (
                      <span className="font-normal text-muted-foreground text-sm ml-2">
                        • {mentor.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="shrink-0">
                <Link href="/mentors">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1.5" aria-hidden="true" />
                  Anderen Mentor wählen
                </Link>
              </Button>
            </div>
          )}

          {/* Page Headline */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Unsere Begleitpakete
            </h1>
            {/* Product Rule Clarification */}
            <div className="rounded-xl border border-primary/20 bg-muted/40 p-5 text-left flex items-start gap-3 shadow-xs">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                Stay Safe &amp; Brave ist kein Marktplatz für geführte Touren. Stay Safe &amp; Brave verbindet selbstbestimmte Reisende mit einem persönlichen Local Mentor. Die konkrete Ausgestaltung der Begleitpakete wird derzeit final abgestimmt.
              </p>
            </div>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <Card key={pkg.id} className="flex flex-col rounded-xl shadow-md border border-border/70 bg-card">
                <CardHeader className="pt-8 pb-4">
                  <CardTitle className="text-2xl font-semibold text-primary">{pkg.name}</CardTitle>
                  <div className="flex items-baseline gap-x-1 mt-2">
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                      {pkg.priceLabel || "In Abstimmung"}
                    </span>
                  </div>
                  <CardDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {pkg.shortDescription}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="rounded-lg bg-muted/40 p-4 border border-border/50 text-sm text-muted-foreground leading-relaxed">
                    {pkg.description}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 pb-6">
                  <Button
                    size="lg"
                    className="w-full bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed font-medium shadow-none border border-border/60"
                    disabled
                  >
                    Paket in Abstimmung
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Product Clarification */}
          <Card className="bg-muted/30 max-w-6xl mx-auto border border-border/70">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center gap-2">
                <ShieldCheck className="w-7 h-7" />
                Persönliche Begleitung statt Tourpaket
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Stay Safe &amp; Brave verbindet selbstbestimmte Reisende mit einem persönlichen Local Mentor. Die konkreten Leistungen der Pakete Basis, Standard und Premium werden derzeit final abgestimmt und erst veröffentlicht, sobald sie verbindlich definiert sind.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function PaketePreisePage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-12 text-center text-muted-foreground">Lade Pakete &amp; Preise...</div>}>
      <PaketePreiseContent />
    </Suspense>
  );
}

