'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { generateTravelTips, type TravelTipsInput, type TravelTipsOutput } from '@/ai/flows/travel-tips';
import { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast'; 

const formSchema = z.object({
  travelPlans: z.string().min(10, {
    message: 'Bitte beschreibe deine Reisepläne mit mindestens 10 Zeichen.',
  }),
  interests: z.string().min(3, {
    message: 'Bitte gib mindestens ein Interesse an (mind. 3 Zeichen).',
  }),
});

interface TravelAssistantFormProps {
  onTipsGenerated: (tips: TravelTipsOutput) => void;
  onFormSubmit: () => void; // Callback to notify parent that form is submitted
}

export function TravelAssistantForm({ onTipsGenerated, onFormSubmit }: TravelAssistantFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      travelPlans: '',
      interests: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    onFormSubmit(); // Notify parent to clear previous tips or show loading state

    try {
      const input: TravelTipsInput = {
        travelPlans: values.travelPlans,
        interests: values.interests,
      };
      const result = await generateTravelTips(input);
      onTipsGenerated(result);
      toast({
        title: "Reisetipps generiert!",
        description: "Deine personalisierten Reisetipps sind unten fertig.",
      });
    } catch (error) {
      console.error('Fehler beim Generieren der Reisetipps:', error);
      onTipsGenerated({ tips: 'Entschuldigung, beim Generieren der Reisetipps ist ein Fehler aufgetreten. Bitte versuche es erneut.' });
      toast({
        title: "Fehler",
        description: "Fehler beim Generieren der Reisetipps. Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2 text-primary">
          <Wand2 className="w-7 h-7" />
          KI-gestützter Reiseassistent
        </CardTitle>
        <CardDescription>
          Erhalte personalisierte Reisetipps und Sicherheitsempfehlungen für dein Südafrika-Abenteuer.
          Erzähl uns von deinen Plänen und Interessen und lass dich von unserer KI leiten.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="travelPlans"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Deine Reisepläne</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="z.B., 'Besuch von Kapstadt für 5 Tage im Juli, dann eine Woche Fahrt auf der Garden Route. Interessiert an Wildtieren und Stränden.'"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Beschreibe deine Ziele, Daten, Dauer und alle spezifischen Aktivitäten, die du im Sinn hast.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Deine Interessen</FormLabel>
                  <FormControl>
                    <Input placeholder="z.B., Wandern, Museen, Essen, Fotografie, Abenteuersport" {...field} />
                  </FormControl>
                  <FormDescription>
                    Liste deine Hobbys und was du auf Reisen gerne tust.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generiere Tipps...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Erhalte meine personalisierten Tipps
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
