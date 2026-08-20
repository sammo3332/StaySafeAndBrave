
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MessageCircle, UserCircle, LogOut, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from "@/firebase";
import { doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import type { UserDTO } from "@/lib/dtos";

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const auth = useAuth();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: userData, isLoading: isDataLoading } = useDoc<UserDTO>(userDocRef);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  if (isUserLoading || isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Willkommen zurück, {userData?.firstName || "Traveler"}!
          </h1>
          <p className="text-lg text-muted-foreground">Verwalte deine Abenteuer und Verbindungen.</p>
        </div>
        <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Abmelden
        </Button>
      </div>

      <Card className="shadow-md overflow-hidden">
        <CardHeader className="bg-muted/30 p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-24 h-24 rounded-full border-2 border-primary shadow-sm overflow-hidden bg-background flex items-center justify-center">
            {userData?.profilePictureUrl ? (
              <Image 
                src={userData.profilePictureUrl} 
                alt={userData.firstName} 
                fill
                className="object-cover"
              />
            ) : (
              <UserCircle className="w-16 h-16 text-muted-foreground" />
            )}
          </div>
          <div className="text-center md:text-left">
            <CardTitle className="text-2xl text-primary">{userData?.firstName} {userData?.lastName}</CardTitle>
            <CardDescription className="text-base">{userData?.email}</CardDescription>
            <CardDescription className="text-sm">
              Mitglied seit: {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' }) : "Unbekannt"}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-primary">Meine Buchungen</CardTitle>
              <CalendarDays className="w-7 h-7 text-accent" />
            </div>
            <CardDescription>Sieh und verwalte deine anstehenden und vergangenen Mentor-Sitzungen.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="px-0 text-primary">
              <Link href="/dashboard/bookings">Alle Buchungen anzeigen</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-primary">Nachrichten</CardTitle>
              <MessageCircle className="w-7 h-7 text-accent" />
            </div>
            <CardDescription>Überprüfe deine Gespräche mit Mentoren.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="px-0 text-primary">
              <Link href="/dashboard/messages">Zum Posteingang</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl text-primary">Profileinstellungen</CardTitle>
              <UserCircle className="w-7 h-7 text-accent" />
            </div>
            <CardDescription>Aktualisiere deine persönlichen Informationen und Präferenzen.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="link" className="px-0 text-primary">
              <Link href="/dashboard/settings">Profil bearbeiten</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-secondary/10 border-secondary/30 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-secondary-foreground">
            <ShieldCheck className="w-6 h-6"/>
            Plane dein nächstes Abenteuer sicher
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Erhalte personalisierte Reisetipps und Sicherheitsempfehlungen von unserem KI-Reiseassistenten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            <Link href="/travel-assistant">KI-Assistent fragen</Link>
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
