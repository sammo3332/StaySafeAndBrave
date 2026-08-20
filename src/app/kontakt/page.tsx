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
import { Mail, Phone, MessageSquare, Send, MapPinIcon, Building } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import images from "@/lib/placeholder-images.json";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen lang sein."),
  email: z.string().email("Ungültige E-Mail Adresse."),
  subject: z.string().min(5, "Betreff muss mindestens 5 Zeichen lang sein."),
  message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen lang sein.").max(500, "Nachricht darf maximal 500 Zeichen lang sein."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function KontaktPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(data: ContactFormValues) {
    console.log("Kontaktformular gesendet:", data);
    toast({
      title: "Nachricht gesendet!",
      description: "Vielen Dank für deine Kontaktaufnahme. Wir melden uns bald bei dir.",
    });
    form.reset();
  }

  return (
    <>
      <section className="w-full mb-12">
        <Image
          src={images.general.contactHeader.src}
          alt="Contact Brave Guides"
          data-ai-hint={images.general.contactHeader.dataAiHint}
          width={1200}
          height={400}
          className="w-full h-auto object-cover shadow-lg"
        />
      </section>
      <div className="container mx-auto px-4">
        <div className="space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Kontaktiere Uns
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Hast du Fragen, Anregungen oder möchtest du eine individuelle Tour anfragen?
              Wir freuen uns auf deine Nachricht!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <Card className="shadow-lg">
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
                          <FormDescription>Maximal 500 Zeichen.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Send className="w-4 h-4 mr-2" /> Nachricht Senden
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Direkter Kontakt</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-accent" />
                    <a href="mailto:info@staysafeandbrave.de" className="text-muted-foreground hover:text-primary">
                      info@staysafeandbrave.de
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-accent" />
                    <span className="text-muted-foreground">+49 123 4567890 (Platzhalter)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-primary">Unser Standort</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="flex items-center gap-3">
                        <Building className="w-5 h-5 text-accent" />
                        <p className="text-muted-foreground">Stay Safe and Brave HQ (Beispiel)</p>
                    </div>
                     <div className="flex items-center gap-3">
                        <MapPinIcon className="w-5 h-5 text-accent" />
                        <p className="text-muted-foreground">Musterstraße 1, 12345 Musterstadt, Deutschland</p>
                    </div>
                    <div className="mt-4 aspect-video">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.998035404006!2d2.292292615674088!3d48.85837007928754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sEiffel%20Tower!5e0!3m2!1sen!2sde!4v1620000000000!5m2!1sen!2sde" 
                            width="100%" 
                            height="100%" 
                            style={{ border:0, borderRadius: '0.5rem' }} 
                            allowFullScreen={false} 
                            loading="lazy" 
                            title="Beispielkarte Eiffelturm"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
