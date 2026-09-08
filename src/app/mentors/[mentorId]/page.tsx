'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import type { MentorDTO } from '@/lib/dtos';
import { getPackages } from '@/lib/packages';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  MapPin,
  Award,
  LanguagesIcon,
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  UserCheck,
  Star,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Compass,
  User,
  Loader2,
  AlertCircle,
  Package,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ mentorId: string }>;
}

export default function MentorDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const mentorId = resolvedParams.mentorId;
  const db = useFirestore();

  const mentorRef = useMemoFirebase(() => {
    if (!db || !mentorId) return null;
    return doc(db, 'mentors', mentorId);
  }, [db, mentorId]);

  const { data: mentor, isLoading, error } = useDoc<MentorDTO>(mentorRef);
  const packages = getPackages();

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" aria-hidden="true" />
          <p className="text-muted-foreground font-medium">Lade Mentorenprofil...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border border-destructive/40 p-8 text-center space-y-6 shadow-sm bg-destructive/5">
          <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto text-destructive">
            <AlertCircle className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Fehler beim Laden des Profils
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Das Mentorenprofil konnte leider nicht aus der Datenbank geladen werden. Bitte versuche es später noch einmal.
            </p>
          </div>
          <div>
            <Button asChild variant="outline">
              <Link href="/mentors">
                <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Zurück zur Mentoren-Übersicht
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Not found or inactive state
  if (!mentor || mentor.active === false) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="border border-border/80 p-8 text-center space-y-6 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
            <AlertCircle className="w-7 h-7 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Mentor nicht verfügbar
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Das gesuchte Profil existiert nicht, ist momentan nicht aktiv oder die URL ist ungültig.
            </p>
          </div>
          <div>
            <Button asChild variant="outline">
              <Link href="/mentors">
                <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                Zurück zur Mentoren-Übersicht
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const fullName = `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim() || 'Lokaler Mentor';
  const hasRealRating =
    typeof mentor.averageRating === 'number' &&
    !isNaN(mentor.averageRating) &&
    mentor.averageRating > 0;
  const isVerified = mentor.verificationStatus === 'verified';
  const languagesList = Array.isArray(mentor.languages) ? mentor.languages : [];
  const expertiseList = Array.isArray(mentor.areasOfExpertise) ? mentor.areasOfExpertise : [];
  const travelStylesList = Array.isArray(mentor.travelStyles) ? mentor.travelStyles : [];

  // Trust items backed by real data only
  const hasTrustDetails = Boolean(
    isVerified ||
    mentor.identityVerified ||
    mentor.backgroundCheckVerified ||
    mentor.profileApproved
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Navigation Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/mentors"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" aria-hidden="true" />
          Zurück zur Mentoren-Übersicht
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Portrait & Key Facts */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border border-border/70 shadow-sm bg-card">
            <div className="relative aspect-[4/3] sm:aspect-[4/3] bg-muted/60 w-full overflow-hidden">
              {mentor.profilePictureUrl ? (
                <Image
                  src={mentor.profilePictureUrl}
                  alt={`Porträt von ${fullName}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                  <User className="w-20 h-20 stroke-1 opacity-40 mb-2" aria-hidden="true" />
                  <span className="text-xs text-muted-foreground/80">{fullName}</span>
                </div>
              )}

              {/* Verification badge ONLY if verified */}
              {isVerified && (
                <Badge
                  variant="secondary"
                  className="absolute top-3 right-3 bg-emerald-700 text-white border border-emerald-600 text-xs shadow-md font-medium flex items-center gap-1 px-2.5 py-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" aria-hidden="true" />
                  <span>Verifiziert</span>
                </Badge>
              )}
            </div>

            <CardContent className="p-6 space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-primary">{fullName}</h1>
                <div className="flex items-center text-muted-foreground text-sm mt-1.5">
                  <MapPin className="w-4 h-4 mr-1.5 text-secondary shrink-0" aria-hidden="true" />
                  <span>{mentor.location || 'Südafrika'}</span>
                </div>
              </div>

              {/* Real rating only when backed by data */}
              {hasRealRating && (
                <div
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60"
                  aria-label={`Bewertung: ${mentor.averageRating!.toFixed(1)} von 5 Sternen`}
                >
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500 shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-sm text-amber-900 dark:text-amber-200">
                    {mentor.averageRating!.toFixed(1)} / 5.0
                  </span>
                  {typeof mentor.reviewCount === 'number' && mentor.reviewCount > 0 && (
                    <span className="text-xs text-muted-foreground">
                      ({mentor.reviewCount} {mentor.reviewCount === 1 ? 'Bewertung' : 'Bewertungen'})
                    </span>
                  )}
                </div>
              )}

              {/* Languages */}
              {languagesList.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <LanguagesIcon className="w-4 h-4 text-secondary shrink-0" aria-hidden="true" />
                    <span>Gesprochene Sprachen</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-5.5">
                    {languagesList.join(', ')}
                  </p>
                </div>
              )}

              {/* Verified Trust State Details (Only if backed by data) */}
              {hasTrustDetails && (
                <div className="space-y-2 pt-2 border-t border-border/50">
                  <h2 className="text-xs font-semibold text-foreground">Vertrauensmerkmale</h2>
                  <ul className="space-y-1.5 text-xs text-muted-foreground">
                    {isVerified && (
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                        <span>Verifizierter Local Mentor</span>
                        {mentor.verifiedAt && (
                          <span className="text-muted-foreground/80">({mentor.verifiedAt})</span>
                        )}
                      </li>
                    )}
                    {mentor.identityVerified && (
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                        <span>Identität bestätigt</span>
                      </li>
                    )}
                    {mentor.backgroundCheckVerified && (
                      <li className="flex items-center gap-2">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                        <span>Sicherheitsüberprüfung bestanden</span>
                      </li>
                    )}
                    {mentor.profileApproved && (
                      <li className="flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
                        <span>Profil vom Stay Safe &amp; Brave Team geprüft</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Primary CTA (Desktop & Mobile view) */}
              <div className="pt-2">
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm"
                >
                  <Link href={`/pakete-preise?mentor=${mentor.id}`}>
                    Mit diesem Mentor weitermachen
                    <ArrowRight className="w-4 h-4 ml-2 shrink-0" aria-hidden="true" />
                  </Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Im nächsten Schritt wählst du dein passendes Reisebegleitpaket.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Bio, Expertise, Travel Styles, Qualifications, Package Preview */}
        <div className="lg:col-span-2 space-y-8">
          {/* About & Bio */}
          <Card className="border border-border/70 shadow-sm bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold text-primary">
                Über {mentor.firstName || fullName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {mentor.bio || 'Dieser Mentor hat noch keine ausführliche Beschreibung hinterlegt.'}
              </p>

              {/* Expertise */}
              {expertiseList.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Award className="w-4 h-4 text-secondary shrink-0" aria-hidden="true" />
                    <span>Themen &amp; Expertise</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {expertiseList.map((item) => (
                      <Badge
                        key={item}
                        variant="outline"
                        className="border-accent/60 text-accent-foreground bg-accent/10 px-3 py-1 text-xs sm:text-sm font-normal"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Travel Styles (when available) */}
              {travelStylesList.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Compass className="w-4 h-4 text-secondary shrink-0" aria-hidden="true" />
                    <span>Reisestile</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {travelStylesList.map((style) => (
                      <Badge
                        key={style}
                        variant="secondary"
                        className="bg-muted text-foreground px-3 py-1 text-xs sm:text-sm font-normal"
                      >
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Qualifications (when available) */}
              {mentor.qualifications && (
                <div className="space-y-2 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Briefcase className="w-4 h-4 text-secondary shrink-0" aria-hidden="true" />
                    <span>Qualifikationen &amp; Erfahrung</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {mentor.qualifications}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 5: Package Preview */}
          <Card className="border border-border/70 shadow-sm bg-muted/20">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Package className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
                <CardTitle className="text-xl font-semibold">
                  Mögliche Begleitpakete
                </CardTitle>
              </div>
              <CardDescription className="text-sm text-muted-foreground leading-relaxed mt-1">
                Wähle im nächsten Produktschritt ein Begleitpaket für deine Reise.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="rounded-xl border border-border/70 bg-card p-5 space-y-2">
                    <h3 className="font-semibold text-lg text-primary">{pkg.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {pkg.description || pkg.shortDescription}
                    </p>
                  </div>
                ))}
              </div>

              {/* Bottom CTA Block */}
              <div className="rounded-xl bg-card border border-border/60 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-semibold text-base text-foreground">
                    Mit {mentor.firstName || 'diesem Mentor'} weitermachen?
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Wähle dein Begleitpaket im nächsten Schritt aus.
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shrink-0"
                >
                  <Link href={`/pakete-preise?mentor=${mentor.id}`}>
                    Mit diesem Mentor weitermachen
                    <ArrowRight className="w-4 h-4 ml-2 shrink-0" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
