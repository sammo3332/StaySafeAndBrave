
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Newspaper, MapPin, CalendarDays, PlusCircle, Loader2, BookOpen, Trash2 } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, doc, query, orderBy } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";
import type { ReportDTO } from "@/lib/dtos";

export default function DiaryView() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReport, setNewReport] = useState({ title: "", content: "", location: "" });

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

  const handleCreateReport = () => {
    if (!user || !reportsRef) return;
    if (!newReport.title || !newReport.content) {
      toast({ variant: "destructive", title: "Fehler", description: "Bitte fülle Titel und Inhalt aus." });
      return;
    }

    const reportData: Omit<ReportDTO, "id"> = {
      userId: user.uid,
      title: newReport.title,
      content: newReport.content,
      location: newReport.location || "Unbekannter Ort",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addDocumentNonBlocking(reportsRef, reportData);
    
    toast({ title: "Eintrag erstellt", description: "Dein Reisebericht wurde sicher gespeichert." });
    setNewReport({ title: "", content: "", location: "" });
    setIsDialogOpen(false);
  };

  const handleDeleteReport = (reportId: string) => {
    if (!user || !db) return;
    const reportDocRef = doc(db, "users", user.uid, "reports", reportId);
    deleteDocumentNonBlocking(reportDocRef);
    toast({ title: "Eintrag gelöscht", description: "Der Bericht wurde aus deinem Tagebuch entfernt." });
  };

  if (isUserLoading || isReportsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Dein Reisetagebuch wird geladen...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 text-center py-20">
        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Privates Tagebuch</h1>
        <p className="text-muted-foreground mb-6">Bitte melde dich an, um deine persönlichen Reiseberichte zu verwalten.</p>
        <Button asChild><a href="/auth/login">Jetzt anmelden</a></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-left">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl flex items-center gap-3">
              <BookOpen className="w-10 h-10" />
              Mein Reisetagebuch
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
              Halte deine Erlebnisse fest. Deine Berichte sind privat und nur für dich sichtbar.
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <PlusCircle className="w-5 h-5 mr-2" />
                Neuer Eintrag
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Neuen Reisebericht verfassen</DialogTitle>
                <DialogDescription>
                  Was hast du heute erlebt? Teile deine Gedanken und Entdeckungen.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Titel</label>
                  <Input 
                    id="title" 
                    placeholder="z.B. Mein Tag am Tafelberg" 
                    value={newReport.title}
                    onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="location" className="text-sm font-medium">Ort</label>
                  <Input 
                    id="location" 
                    placeholder="z.B. Kapstadt" 
                    value={newReport.location}
                    onChange={(e) => setNewReport({ ...newReport, location: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="content" className="text-sm font-medium">Inhalt</label>
                  <Textarea 
                    id="content" 
                    placeholder="Erzähle von deinem Abenteuer..." 
                    className="min-h-[150px]"
                    value={newReport.content}
                    onChange={(e) => setNewReport({ ...newReport, content: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Abbrechen</Button>
                <Button onClick={handleCreateReport}>Speichern</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {reports && reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reports.map((report) => (
              <Card key={report.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-primary">{report.title}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDeleteReport(report.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3.5 h-3.5" />
                      {new Date(report.createdAt).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {report.location}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-6 leading-relaxed whitespace-pre-line">
                    {report.content}
                  </p>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between items-center text-xs text-muted-foreground">
                  <span>Zuletzt bearbeitet: {new Date(report.updatedAt).toLocaleDateString('de-DE')}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/30 p-12 text-center border-dashed border-2">
            <Newspaper className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary">Noch keine Einträge</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Dein Tagebuch ist noch leer. Beginne damit, dein erstes Abenteuer festzuhalten!
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setIsDialogOpen(true)}>
              Meinen ersten Bericht schreiben
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
