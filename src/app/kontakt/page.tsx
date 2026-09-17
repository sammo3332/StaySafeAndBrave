"use client";

import { useState, useCallback } from "react";
import { Turnstile } from "@/components/product/turnstile";
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
import { Mail, Phone, MessageSquare, Send, MapPinIcon, Building, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";



const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Name muss mindestens 2 Zeichen lang sein.").max(100, "Name darf maximal 100 Zeichen lang sein."),
  email: z.string().trim().email("Ungültige E-Mail Adresse.").max(254, "E-Mail darf maximal 254 Zeichen lang sein."),
  subject: z.string().trim().min(3, "Betreff muss mindestens 3 Zeichen lang sein.").max(150, "Betreff darf maximal 150 Zeichen lang sein."),
  message: z.string().trim().min(10, "Nachricht muss mindestens 10 Zeichen lang sein.").max(2000, "Nachricht darf maximal 2000 Zeichen lang sein."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function KontaktPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [token,setToken]=useState('');
  const [attempt,setAttempt]=useState(0);
  const onToken=useCallback((t:string)=>setToken(t),[]);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...data,token}),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        toast({
          variant: "destructive",
          title: "Nachricht konnte nicht gesendet werden",
          description: result.error || "Beim Senden deiner Nachricht ist ein Fehler aufgetreten.",
        });
        return;
      }

      toast({
        title: "Nachricht gesendet!",
        description: result.message || "Vielen Dank. Deine Nachricht wurde übermittelt.",
      });
      form.reset();
    } catch (err: any) {
      console.error("Error submitting contact form:", err);
      toast({
        variant: "destructive",
        title: "Übertragungsfehler",
        description: "Die Verbindung zum Server ist fehlgeschlagen. Bitte prüfe deine Internetverbindung und versuche es erneut.",
      });
    } finally {
      setIsSubmitting(false);setToken('');setAttempt(n=>n+1);
    }
  }

  return (
    <>
      <div className="page-shell py-12">
        <div className="space-y-12">
          <div className="text-center">
            <h1 className="editorial-title page-title">
              Lass uns sprechen.
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Hast du Fragen zur persönlichen Begleitung oder zur Plattform?
              Wir freuen uns auf deine Nachricht!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-primary flex items-center gap-2">
                  <MessageSquare className="w-7 h-7" />
                  Schreib uns eine Nachricht
                </CardTitle>
                <CardDescription>
                  Fülle das Formular aus und wir melden uns so schnell wie möglich bei dir.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dein Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Max Mustermann" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deine E-Mail Adresse</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="max.mustermann@beispiel.de" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Betreff</FormLabel>
                          <FormControl>
                            <Input placeholder="Deine Anfrage" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deine Nachricht</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Erzähl uns von deinem Anliegen..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Maximal 2000 Zeichen.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Turnstile key={attempt} onToken={onToken}/>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !token}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Wird gesendet...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" /> Nachricht senden
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Direkter Kontakt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <a href="mailto:info@staysafeandbrave.com" className="text-muted-foreground hover:text-primary">
                      info@staysafeandbrave.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <div className="border-t pt-6"><h2 className="text-xl">Worum geht es?</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Beschreibe kurz dein Anliegen. Für bestehende Anfragen findest du den Austausch mit deinem Mentor in deinem Reisebereich.</p><a href="/dashboard/messages" className="quiet-link mt-4 text-sm">Zu meinen Nachrichten</a></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
