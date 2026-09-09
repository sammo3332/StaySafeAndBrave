"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  MapPin,
  CalendarDays,
  PlusCircle,
  Loader2,
  Trash2,
  Edit3,
  Globe,
  Lock,
  UserCheck,
  ExternalLink,
  Info,
} from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import {
  collection,
  doc,
  query,
  where,
  orderBy,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import type { ReportDTO, ReportVisibility, BookingDTO } from "@/lib/dtos";

export default function DiaryView() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    location: string;
    tripDate: string;
    bookingId: string;
    visibility: ReportVisibility;
  }>({
    title: "",
    content: "",
    location: "",
    tripDate: "",
    bookingId: "none",
    visibility: "private",
  });

  // Filter State
  const [filter, setFilter] = useState<"all" | "private" | "public">("all");

  // 1. Fetch User's Private Reports from Subcollection
  const reportsRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return collection(db, "users", user.uid, "reports");
  }, [db, user?.uid]);

  const reportsQuery = useMemoFirebase(() => {
    if (!reportsRef) return null;
    return query(reportsRef, orderBy("createdAt", "desc"));
  }, [reportsRef]);

  const { data: reports, isLoading: isReportsLoading } = useCollection<ReportDTO>(reportsQuery);

  // 2. Fetch User's Bookings for optional mentor association
  const bookingsRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return query(collection(db, "bookings"), where("userId", "==", user.uid));
  }, [db, user?.uid]);

  const { data: bookings } = useCollection<BookingDTO>(bookingsRef);

  const handleOpenCreate = () => {
    setEditingReportId(null);
    setFormData({
      title: "",
      content: "",
      location: "",
      tripDate: "",
      bookingId: "none",
      visibility: "private",
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (report: ReportDTO) => {
    setEditingReportId(report.id);
    setFormData({
      title: report.title,
      content: report.content,
      location: report.location || "",
      tripDate: report.tripDate || "",
      bookingId: report.bookingId || "none",
      visibility: report.visibility || "private",
    });
    setIsDialogOpen(true);
  };

  const handleSaveReport = async () => {
    if (!user || !db || !reportsRef) return;
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        variant: "destructive",
        title: "Pflichtfelder ausfüllen",
        description: "Bitte gib mindestens einen Titel und den Inhalt deines Berichts an.",
      });
      return;
    }

    setIsSaving(true);
    try {
      let selectedBooking: BookingDTO | undefined;
      if (formData.bookingId && formData.bookingId !== "none" && bookings) {
        selectedBooking = bookings.find((b) => b.id === formData.bookingId);
      }

      const nowIso = new Date().toISOString();

      if (editingReportId) {
        // Edit existing report
        const reportDocRef = doc(db, "users", user.uid, "reports", editingReportId);
        const updatePayload: Partial<ReportDTO> = {
          title: formData.title.trim(),
          content: formData.content.trim(),
          location: formData.location.trim() || undefined,
          tripDate: formData.tripDate || undefined,
          mentorId: selectedBooking?.mentorId || undefined,
          mentorName: selectedBooking?.mentorName || undefined,
          bookingId: selectedBooking?.id || undefined,
          visibility: formData.visibility,
          updatedAt: nowIso,
        };

        if (formData.visibility === "public") {
          const existing = reports?.find((r) => r.id === editingReportId);
          if (!existing?.publishedAt) {
            updatePayload.publishedAt = nowIso;
          }
        }

        await updateDoc(reportDocRef, updatePayload);
        toast({
          title: "Eintrag aktualisiert",
          description: "Dein Reisebericht wurde erfolgreich gespeichert.",
        });
      } else {
        // Create new report
        const newDocRef = doc(reportsRef);
        const newReportPayload: ReportDTO = {
          id: newDocRef.id,
          userId: user.uid,
          title: formData.title.trim(),
          content: formData.content.trim(),
          location: formData.location.trim() || undefined,
          tripDate: formData.tripDate || undefined,
          mentorId: selectedBooking?.mentorId || undefined,
          mentorName: selectedBooking?.mentorName || undefined,
          bookingId: selectedBooking?.id || undefined,
          visibility: formData.visibility,
          publishedAt: formData.visibility === "public" ? nowIso : undefined,
          createdAt: nowIso,
          updatedAt: nowIso,
        };

        await setDoc(newDocRef, newReportPayload);
        toast({
          title: "Eintrag erstellt",
          description:
            formData.visibility === "public"
              ? "Dein Bericht wurde gespeichert und als Travel Story veröffentlicht."
              : "Dein Bericht wurde sicher in deinem privaten Reisetagebuch gespeichert.",
        });
      }

      setIsDialogOpen(false);
    } catch (error: any) {
      console.error("Error saving report:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Speichern",
        description: error?.message || "Der Bericht konnte nicht gespeichert werden.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleVisibility = async (report: ReportDTO) => {
    if (!user || !db) return;
    const currentVis = report.visibility || "private";
    const nextVis: ReportVisibility = currentVis === "public" ? "private" : "public";
    const nowIso = new Date().toISOString();

    try {
      const reportDocRef = doc(db, "users", user.uid, "reports", report.id);
      await updateDoc(reportDocRef, {
        visibility: nextVis,
        publishedAt: nextVis === "public" ? (report.publishedAt || nowIso) : null,
        updatedAt: nowIso,
      });

      toast({
        title: nextVis === "public" ? "Veröffentlicht" : "Auf privat gesetzt",
        description:
          nextVis === "public"
            ? "Dein Bericht ist nun öffentlich unter Travel Stories sichtbar."
            : "Dein Bericht ist nun wieder privat und nur für dich sichtbar.",
      });
    } catch (error: any) {
      console.error("Error toggling visibility:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Ändern der Sichtbarkeit",
        description: error?.message || "Die Sichtbarkeit konnte nicht aktualisiert werden.",
      });
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (!user || !db) return;
    try {
      const reportDocRef = doc(db, "users", user.uid, "reports", reportId);
      await deleteDoc(reportDocRef);
      toast({
        title: "Eintrag gelöscht",
        description: "Der Bericht wurde aus deinem Tagebuch entfernt.",
      });
    } catch (error: any) {
      console.error("Error deleting report:", error);
      toast({
        variant: "destructive",
        title: "Fehler beim Löschen",
        description: error?.message || "Der Bericht konnte nicht gelöscht werden.",
      });
    }
  };

  if (isUserLoading || isReportsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Dein Reisetagebuch wird geladen...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 text-center py-20">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Privates Reisetagebuch</h1>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Melde dich an, um persönliche Notizen, Routen und Reiseberichte festzuhalten oder optional als Travel Story zu teilen.
        </p>
        <Button asChild>
          <Link href="/auth/login">Jetzt anmelden</Link>
        </Button>
      </div>
    );
  }

  const filteredReports = reports?.filter((r) => {
    const vis = r.visibility || "private";
    if (filter === "private") return vis === "private";
    if (filter === "public") return vis === "public";
    return true;
  });

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b">
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary flex items-center gap-3">
              <BookOpen className="w-9 h-9" />
              Mein Reisetagebuch
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
              Halte deine Erlebnisse in Südafrika fest. Deine Berichte sind standardmäßig privat und nur für dich sichtbar. Du entscheidest, was du als öffentliche Travel Story teilen möchtest.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button onClick={handleOpenCreate} className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <PlusCircle className="w-4 h-4 mr-2" />
              Neuer Eintrag
            </Button>
          </div>
        </div>

        {/* Filters & Public Stories Link */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-muted/60 p-1 rounded-lg border text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === "all" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Alle ({reports?.length || 0})
            </button>
            <button
              onClick={() => setFilter("private")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === "private" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Nur Privat ({reports?.filter((r) => (r.visibility || "private") === "private").length || 0})
            </button>
            <button
              onClick={() => setFilter("public")}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filter === "public" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Als Story geteilt ({reports?.filter((r) => r.visibility === "public").length || 0})
            </button>
          </div>

          <Button asChild variant="outline" size="sm" className="text-xs">
            <Link href="/stories">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-primary" />
              Öffentliche Travel Stories ansehen
            </Link>
          </Button>
        </div>

        {/* Entries Grid */}
        {filteredReports && filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => {
              const isPublic = report.visibility === "public";
              return (
                <Card
                  key={report.id}
                  className="flex flex-col justify-between overflow-hidden rounded-xl border bg-card shadow-xs hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge
                        variant={isPublic ? "default" : "secondary"}
                        className={`text-[11px] font-normal flex items-center gap-1 shrink-0 ${
                          isPublic ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                        }`}
                      >
                        {isPublic ? (
                          <>
                            <Globe className="w-3 h-3" />
                            Öffentlich
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            Privat
                          </>
                        )}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          onClick={() => handleOpenEdit(report)}
                          title="Bearbeiten"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDeleteReport(report.id)}
                          title="Löschen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>

                    <CardTitle className="text-lg font-semibold text-foreground mt-2 line-clamp-2">
                      {report.title}
                    </CardTitle>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1">
                      {report.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          {report.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {report.tripDate
                          ? new Date(report.tripDate).toLocaleDateString("de-DE")
                          : new Date(report.createdAt).toLocaleDateString("de-DE")}
                      </span>
                    </div>

                    {report.mentorName && (
                      <div className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Mit Mentor: {report.mentorName}</span>
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="py-2">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-4 leading-relaxed whitespace-pre-line">
                      {report.content}
                    </p>
                  </CardContent>

                  <CardFooter className="pt-4 border-t flex flex-col gap-2.5">
                    <div className="flex items-center justify-between w-full text-[11px] text-muted-foreground">
                      <span>
                        Zuletzt bearbeitet: {new Date(report.updatedAt).toLocaleDateString("de-DE")}
                      </span>
                      {isPublic && (
                        <Link
                          href={`/stories/${report.id}`}
                          className="text-primary hover:underline flex items-center gap-0.5 font-medium"
                        >
                          Story ansehen
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      )}
                    </div>

                    <Button
                      variant={isPublic ? "outline" : "secondary"}
                      size="sm"
                      className="w-full text-xs h-8"
                      onClick={() => handleToggleVisibility(report)}
                    >
                      {isPublic ? (
                        <>
                          <Lock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                          Auf &bdquo;Privat&ldquo; zurücksetzen
                        </>
                      ) : (
                        <>
                          <Globe className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                          Als Travel Story veröffentlichen
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-muted/30 p-12 text-center border-dashed border-2">
            <BookOpen className="w-14 h-14 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">
              {filter === "all"
                ? "Noch keine Reisetagebuch-Einträge"
                : filter === "private"
                ? "Keine privaten Einträge gefunden"
                : "Keine veröffentlichten Travel Stories"}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              {filter === "all"
                ? "Dein persönliches Tagebuch ist noch leer. Halte jetzt deine ersten Erlebnisse oder Tipps fest."
                : "Passe deinen Filter an oder erstelle einen neuen Reisebericht."}
            </p>
            {filter === "all" && (
              <Button variant="outline" className="mt-5" onClick={handleOpenCreate}>
                Ersten Eintrag verfassen
              </Button>
            )}
          </Card>
        )}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>
              {editingReportId ? "Reisebericht bearbeiten" : "Neuen Reisetagebuch-Eintrag verfassen"}
            </DialogTitle>
            <DialogDescription>
              Halte deine Erlebnisse fest. Du entscheidest, ob dieser Eintrag privat bleibt oder als Travel Story geteilt wird.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-3">
            <div className="grid gap-1.5">
              <label htmlFor="title" className="text-xs font-semibold text-foreground">
                Titel *
              </label>
              <Input
                id="title"
                placeholder="z.B. Mein Sonnenuntergang am Signal Hill"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <label htmlFor="location" className="text-xs font-semibold text-foreground">
                  Ort / Region
                </label>
                <Input
                  id="location"
                  placeholder="z.B. Kapstadt, Bo-Kaap"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="grid gap-1.5">
                <label htmlFor="tripDate" className="text-xs font-semibold text-foreground">
                  Reisedatum
                </label>
                <Input
                  id="tripDate"
                  type="date"
                  value={formData.tripDate}
                  onChange={(e) => setFormData({ ...formData, tripDate: e.target.value })}
                />
              </div>
            </div>

            {/* Optional Mentor Association */}
            {bookings && bookings.length > 0 && (
              <div className="grid gap-1.5">
                <label htmlFor="bookingMentor" className="text-xs font-semibold text-foreground">
                  Zugehöriger Local Mentor (optional)
                </label>
                <Select
                  value={formData.bookingId}
                  onValueChange={(val) => setFormData({ ...formData, bookingId: val })}
                >
                  <SelectTrigger id="bookingMentor">
                    <SelectValue placeholder="Wähle eine Buchung aus..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keine Mentor-Verknüpfung</SelectItem>
                    {bookings.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.mentorName || "Local Mentor"} ({b.packageName || "Buchung"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-1.5">
              <label htmlFor="content" className="text-xs font-semibold text-foreground">
                Inhalt / Erlebnisbericht *
              </label>
              <Textarea
                id="content"
                placeholder="Erzähle von deinen Eindrücken, Geheimtipps oder Sicherheits-Empfehlungen..."
                className="min-h-[160px] leading-relaxed"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>

            {/* Visibility Selector */}
            <div className="p-3 rounded-lg border bg-muted/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">Sichtbarkeit</span>
                <span className="text-xs text-muted-foreground">Standard: Privat</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant={formData.visibility === "private" ? "default" : "outline"}
                  size="sm"
                  className="text-xs flex-1"
                  onClick={() => setFormData({ ...formData, visibility: "private" })}
                >
                  <Lock className="w-3.5 h-3.5 mr-1.5" />
                  Privat (nur für mich)
                </Button>
                <Button
                  type="button"
                  variant={formData.visibility === "public" ? "default" : "outline"}
                  size="sm"
                  className={`text-xs flex-1 ${
                    formData.visibility === "public" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                  }`}
                  onClick={() => setFormData({ ...formData, visibility: "public" })}
                >
                  <Globe className="w-3.5 h-3.5 mr-1.5" />
                  Öffentlich (Travel Story)
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Öffentliche Stories werden unter &bdquo;Travel Stories&ldquo; geteilt. Dein Name und persönliche E-Mail-Adresse werden niemals veröffentlicht.
              </p>
            </div>

            {/* Note on Image Upload */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/60 border text-[11px] text-muted-foreground">
              <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <span>
                Bild-Uploads für Reiseberichte werden künftig über den gesicherten Cloud-Speicher bereitgestellt. Aktuell sind Textberichte vollständig verfügbar.
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveReport} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Speichern...
                </>
              ) : (
                "Speichern"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
