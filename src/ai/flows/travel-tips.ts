//Travel-tips.ts
'use server';
/**
 * @fileOverview Generiert personalisierte Reisetipps und Sicherheitsempfehlungen.
 *
 * - generateTravelTips - Eine Funktion, die personalisierte Reisetipps und Sicherheitsempfehlungen generiert.
 * - TravelTipsInput - Der Eingabetyp für die Funktion generateTravelTips.
 * - TravelTipsOutput - Der Rückgabetyp für die Funktion generateTravelTips.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TravelTipsInputSchema = z.object({
  travelPlans: z
    .string()
    .describe('Die Reisepläne des Benutzers, einschließlich Zielen und Daten.'),
  interests: z.string().describe('Die Interessen des Benutzers, wie Wandern, Museen oder Essen.'),
});
export type TravelTipsInput = z.infer<typeof TravelTipsInputSchema>;

const TravelTipsOutputSchema = z.object({
  tips: z.string().describe('Personalisierte Reisetipps und Sicherheitsempfehlungen.'),
});
export type TravelTipsOutput = z.infer<typeof TravelTipsOutputSchema>;

export async function generateTravelTips(input: TravelTipsInput): Promise<TravelTipsOutput> {
  return generateTravelTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'travelTipsPrompt',
  input: {schema: TravelTipsInputSchema},
  output: {schema: TravelTipsOutputSchema},
  prompt: `Du bist ein Reiseexperte, der sich darauf spezialisiert hat, personalisierte Reisetipps und Sicherheitsempfehlungen zu geben.

  Basierend auf den Reiseplänen und Interessen des Benutzers, erstelle eine Liste mit personalisierten Reisetipps und Sicherheitsempfehlungen.
  Integriere aktuelle Ereignisse, Sicherheitsrichtlinien und lokale Bräuche in deine Empfehlungen.

  Reisepläne: {{{travelPlans}}}
  Interessen: {{{interests}}}

  Gib deine Antwort auf Deutsch aus.
  `,
});

const generateTravelTipsFlow = ai.defineFlow(
  {
    name: 'generateTravelTipsFlow',
    inputSchema: TravelTipsInputSchema,
    outputSchema: TravelTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
