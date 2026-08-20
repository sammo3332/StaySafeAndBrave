"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Shield, KeyRound, Bell, Camera, Save, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { useEffect } from "react";
import type { UserDTO } from "@/lib/dtos";

const profileFormSchema = z.object({
  firstName: z.string().min(2, "Vorname muss mindestens 2 Zeichen lang sein."),
  lastName: z.string().min(2, "Nachname muss mindestens 2 Zeichen lang sein."),
  email: z.string().email("Ungültige E-Mail-Adresse."),
  bio: z.string().max(200, "Bio darf maximal 200 Zeichen lang sein.").optional(),
  homeCountry: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!db || !user?.uid) return null;
    return doc(db, "users", user.uid);
  }, [db, user?.uid]);

  const { data: userData, isLoading: isDataLoading } = useDoc<UserDTO>(userDocRef);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      bio: "",
      homeCountry: "",
    },
  });

  useEffect(() => {
    if (userData) {
      profileForm.reset({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        bio: userData.bio || "",
        homeCountry: userData.homeCountry || "",
      });
    }
  }, [userData, profileForm]);

  if (isUserLoading || isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  function onProfileSubmit(values: ProfileFormValues) {
    if (!userDocRef) return;

    const updatedData: Partial<UserDTO> = {
      ...values,
      updatedAt: new Date().toISOString(),
    };

    updateDocumentNonBlocking(userDocRef, updatedData);
    
    toast({
      title: "Profil aktualisiert",
      description: "Deine Änderungen wurden erfolgreich gespeichert.",
    });
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">Einstellungen</h1>
        <p className="text-lg text-muted-foreground">
          Verwalte deine Kontoeinstellungen und persönlichen Informationen.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-primary">
            <UserCircle className="w-6 h-6 text-accent" />
            Profilinformationen
          </CardTitle>
          <CardDescription>Aktualisiere deine persönlichen Daten und deinen Avatar.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="w-24 h-24 border-2 border-primary shadow-sm">
                  <AvatarImage src={userData?.profilePictureUrl} />
                  <AvatarFallback>{userData?.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={profileForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vorname</FormLabel>
                        <FormControl>
                          <Input placeholder="Vorname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nachname</FormLabel>
                        <FormControl>
                          <Input placeholder="Nachname" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail-Adresse</FormLabel>
                    <FormControl>
                      <Input type="email" disabled {...field} />
                    </FormControl>
                    <FormDescription>Deine E-Mail kann derzeit nicht geändert werden.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="homeCountry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heimatland</FormLabel>
                    <FormControl>
                      <Input placeholder="z.B. Deutschland" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kurzbio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Erzähl uns etwas über dich..." className="min-h-[80px]" {...field} />
                    </FormControl>
                    <FormDescription>Max. 200 Zeichen.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                <Save className="w-4 h-4 mr-2"/> Änderungen speichern
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2 text-primary">
            <Bell className="w-6 h-6 text-accent"/>
            Benachrichtigungen
          </CardTitle>
          <CardDescription>Wähle, wie du benachrichtigt werden möchtest.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <p className="text-base font-medium">E-Mail-Benachrichtigungen</p>
              <p className="text-sm text-muted-foreground">Erhalte Updates zu deinen Buchungen.</p>
            </div>
            <Switch checked={true} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
