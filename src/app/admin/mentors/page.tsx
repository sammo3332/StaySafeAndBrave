"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFirestore } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { MentorDTO } from "@/lib/dtos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Globe,
  ExternalLink,
  Key,
  Info,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

export default function AdminMentorsPage() {
  const db = useFirestore();

  const [mentors, setMentors] = useState<MentorDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchMentors() {
      if (!db) return;

      try {
        setIsLoading(true);
        setError(null);

        const mentorsSnap = await getDocs(collection(db, "mentors"));
        const loaded: MentorDTO[] = [];
        mentorsSnap.forEach((docSnap) => {
          loaded.push({
            id: docSnap.id,
            ...docSnap.data(),
          } as MentorDTO);
        });

        if (isMounted) {
          setMentors(loaded);
        }
      } catch (err: any) {
        console.error("Error fetching mentors for admin inspection:", err);
        if (isMounted) {
          setError("Mentorinnen-Profile konnten nicht geladen werden.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchMentors();

    return () => {
      isMounted = false;
    };
  }, [db]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Mentorinnen-Aufsicht</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Operative Einsicht in gelistete Profile, Verifizierungsstatus und Zugangsberechtigungen.
          </p>
        </div>

        <Badge variant="outline" className="self-start sm:self-auto text-xs py-1 px-3">
          {mentors.length} {mentors.length === 1 ? "Profil" : "Profile"} gelistet
        </Badge>
      </div>

      {/* Security & Provisioning Notice */}
      <div className="bg-muted/40 border rounded-xl p-4 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-foreground">
            Hinweis zur Mentor-Authentifizierung &amp; Provisionierung:
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Die private Zuordnung zwischen Firebase Auth Konten und Mentor-Profilen erfolgt über{" "}
            <code className="bg-background px-1 py-0.5 rounded border text-foreground">/mentorAuth/{`{authUid}`}</code>.
            Um Missbrauch zu verhindern, ist das Auslesen fremder Zuordnungen clientseitig gesperrt.
            Die Erstellung von Mentor-Login-Konten erfordert ein vertrauenswürdiges Server-Dienstkonto (Firebase Admin SDK).
            Es werden keine fiktiven Konten oder Verifizierungen erzeugt.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
          <p className="text-sm text-muted-foreground">Mentorinnen-Profile werden geladen...</p>
        </div>
      ) : mentors.length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-16 text-center">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-base font-semibold">Keine Mentorinnen gefunden</h3>
            <p className="text-sm text-muted-foreground mt-1">
              In der Collection /mentors sind derzeit keine Datensätze vorhanden.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {mentors.map((mentor) => {
            const fullName = `${mentor.firstName || ""} ${mentor.lastName || ""}`.trim() || mentor.id;

            return (
              <Card key={mentor.id} className="shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          ID: {mentor.id}
                        </span>
                        {renderVerificationBadge(mentor.verificationStatus)}
                        {mentor.active !== false ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                            Aktiv
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-zinc-100 text-zinc-600 border-zinc-200 text-xs">
                            Inaktiv
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {fullName}
                      </CardTitle>
                    </div>

                    <Button variant="outline" size="sm" asChild className="self-start sm:self-auto text-xs">
                      <Link href={`/mentors/${mentor.id}`} target="_blank" rel="noopener noreferrer">
                        Öffentliches Profil
                        <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="pt-0 space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-muted/30 p-3 rounded-lg border">
                    <div>
                      <span className="text-muted-foreground block">Standort:</span>
                      <span className="font-medium text-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        {mentor.location || "Nicht angegeben"}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Sprachen:</span>
                      <span className="font-medium text-foreground flex items-center gap-1 mt-0.5">
                        <Globe className="w-3 h-3 text-muted-foreground" />
                        {mentor.languages && mentor.languages.length > 0
                          ? mentor.languages.join(", ")
                          : "Nicht angegeben"}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Bewertungen &amp; Score:</span>
                      <span className="font-medium text-foreground mt-0.5 block">
                        {typeof mentor.averageRating === "number"
                          ? `★ ${mentor.averageRating.toFixed(1)} (${mentor.reviewCount || 0} Bewertungen)`
                          : "Noch keine Bewertungen"}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block">Tagessatz:</span>
                      <span className="font-medium text-foreground mt-0.5 block">
                        {mentor.dailyRate ? `${mentor.dailyRate} € / Tag` : "–"}
                      </span>
                    </div>
                  </div>

                  {/* Operational Verification Audit Fields */}
                  <div className="border rounded-lg p-3 bg-background space-y-2">
                    <span className="font-semibold text-muted-foreground block">
                      Operativer Verifizierungsstatus (Echte Firestore-Felder):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="flex items-center gap-1.5">
                        {mentor.identityVerified ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <span className="text-muted-foreground">Identitätsnachweis:</span>
                        <span className="font-medium text-foreground">
                          {mentor.identityVerified ? "Geprüft" : "Offen / Nicht hinterlegt"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {mentor.backgroundCheckVerified ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <span className="text-muted-foreground">Hintergrund-Check:</span>
                        <span className="font-medium text-foreground">
                          {mentor.backgroundCheckVerified ? "Geprüft" : "Offen / Nicht hinterlegt"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {mentor.profileApproved ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-muted-foreground" />
                        )}
                        <span className="text-muted-foreground">Profilfreigabe:</span>
                        <span className="font-medium text-foreground">
                          {mentor.profileApproved ? "Freigegeben" : "Nicht freigegeben"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Provisioning Status */}
                  <div className="border border-dashed rounded-lg p-3 bg-muted/20 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Auth-Provisionierung (/mentorAuth):
                      </span>
                      <span className="font-medium text-foreground">
                        Zugang nicht provisioniert (Server-Tooling erforderlich)
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      Keine fiktiven Zugangsdaten
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function renderVerificationBadge(status?: string) {
  switch (status) {
    case "verified":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <ShieldCheck className="w-3 h-3 mr-1" />
          Verifiziert
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          In Prüfung
        </Badge>
      );
    case "suspended":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <ShieldAlert className="w-3 h-3 mr-1" />
          Gesperrt
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="bg-zinc-100 text-zinc-600 border-zinc-200">
          Unverifiziert
        </Badge>
      );
  }
}
