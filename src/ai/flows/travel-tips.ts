//Travel-tips.ts
'use server';
/**
 * @fileOverview Generiert personalisierte Reisetipps und Vorbereitungsempfehlungen.
 * 
 * Basiert auf der gemeinsamen Genkit-Konfiguration und achtet auf die Kernprinzipien:
 * Der KI-Assistent dient der Vorbereitung, ersetzt jedoch niemals die persönliche Local Mentorin.
 */

import { ai, isAIConfigured } from '@/ai/genkit';
import { z } from 'genkit';

const TravelTipsInputSchema = z.object({
  travelPlans: z
    .string()
    .min(5, 'Reisepläne müssen mindestens 5 Zeichen enthalten.')
    .max(1500, 'Reisepläne dürfen maximal 1.500 Zeichen lang sein.')
    .describe('Die Reisepläne des Benutzers, einschließlich Zielen und Daten.'),
  interests: z
    .string()
    .min(2, 'Interessen müssen mindestens 2 Zeichen enthalten.')
    .max(500, 'Interessen dürfen maximal 500 Zeichen lang sein.')
    .describe('Die Interessen des Benutzers, wie Wandern, Kultur, Safaris oder Kulinarik.'),
});
export type TravelTipsInput = z.infer<typeof TravelTipsInputSchema>;

const TravelTipsOutputSchema = z.object({
  tips: z.string().describe('Personalisierte Reisetipps und Vorbereitungsempfehlungen.'),
});
export type TravelTipsOutput = z.infer<typeof TravelTipsOutputSchema>;

export async function generateTravelTips(input: TravelTipsInput): Promise<TravelTipsOutput> {
  // 1. Fail-closed check
  if (!isAIConfigured()) {
    return {
      tips: 'Der KI-Reisedienst ist serverseitig zurzeit nicht konfiguriert (fehlender API-Schlüssel). Bitte wende dich für persönliche Empfehlungen direkt an deine Local Mentorin.',
    };
  }

  // 2. Validate inputs
  const parsed = TravelTipsInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      tips: 'Ungültige Eingabedaten. Bitte gib deine Pläne und Interessen etwas genauer an.',
    };
  }

  try {
    return await generateTravelTipsFlow(parsed.data);
  } catch (error: unknown) {
    console.error('Fehler beim Generieren der Reisetipps:', error instanceof Error ? error.message : error);
    return {
      tips: 'Entschuldigung, beim Generieren der Reisetipps ist ein unerwarteter Fehler aufgetreten. Bitte versuche es später erneut oder kontaktiere deine Local Mentorin.',
    };
  }
}

const prompt = ai.definePrompt({
  name: 'travelTipsPrompt',
  input: {schema: TravelTipsInputSchema},
  output: {schema: TravelTipsOutputSchema},
  prompt: `Du bist der Vorbereitungs-Assistent für "Stay Safe & Brave" (Südafrika).
Das Kernprodukt unserer Plattform ist der Reisende zusammen mit einer vertrauenswürdigen menschlichen Local Mentorin vor Ort.
Du unterstützt bei der allgemeinen Reisevorbereitung und Planung. Du ersetzt keine Mentorin und verfügst über keine Echtzeitdaten.

Erstelle basierend auf den Reiseplänen und Interessen des Benutzers eine Liste mit nützlichen, praktischen Reisetipps für Südafrika.
Empfiehlt auch sinnvolle Fragen, die der Reisende vorab seiner Local Mentorin stellen kann.

Reisepläne: {{{travelPlans}}}
Interessen: {{{interests}}}

Gib deine Antwort auf Deutsch, übersichtlich strukturiert und freundlich ermutigend aus.
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
    return output || { tips: 'Es konnten keine Tipps erzeugt werden.' };
  }
);
