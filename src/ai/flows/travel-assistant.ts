'use server';

/**
 * @fileOverview AI Travel Assistant for Stay Safe & Brave.
 * 
 * CORE PRODUCT PRINCIPLE:
 * Stay Safe & Brave is NOT an AI travel planner.
 * The core product is: A self-organized traveler + a trusted personal Local Mentor in South Africa.
 * The AI Travel Assistant is a supporting tool only to help travelers prepare, answer general
 * questions, and organize their thoughts. It encourages contacting the human Local Mentor
 * for local, current, personal, and safety-critical guidance.
 */

import { ai, isAIConfigured } from '@/ai/genkit';
import { z } from 'genkit';

const TRAVEL_ASSISTANT_SYSTEM_PROMPT = `Du bist der offizielle KI-Reiseassistent der Plattform "Stay Safe & Brave".

KERNPHILOSOPHIE & PRODUKT-KONTEXT:
- Stay Safe & Brave verbindet eigenständige Reisende mit geprüften, persönlichen Local Mentoren in Südafrika (z.B. in Kapstadt, Johannesburg, Garden Route, Durban).
- Das Kernprodukt ist: Eine selbstorganisierte Reise in Kombination mit einer vertrauenswürdigen, menschlichen Local Mentorin vor Ort.
- Du bist ein digitales Hilfswerkzeug zur Reisevorbereitung und Planung. Du ersetzt NIEMALS die menschliche Mentorin.
- Dein Motto: "Dein digitaler Reisebegleiter für die Vorbereitung – dein Local Mentor bleibt dein persönlicher Ansprechpartner vor Ort."

DEINE AUFGABEN & FÄHIGKEITEN:
1. Vorbereitung & Reiserouten: Hilf bei der Grobplanung von Routen (z.B. Kapstadt, Garden Route, Krüger-Nationalpark, Drakensberge, Winelands), Reisedauer und Tageseinteilung.
2. Praktische Vorbereitung: Packlisten, saisonale Klimatendenzen, Währung (Südafrikanischer Rand - ZAR), Trinkgeldgewohnheiten, Steckdosenadapter (Typ M/D), SIM-Karten/eSIM.
3. Mobilität: Allgemeine Transportmöglichkeiten (Mietwagen, Inlandsflüge, Uber in Großstädten, Überlandfahrten bei Tageslicht).
4. Kulturelle Orientierung: Kulturelle Gepflogenheiten, Respekt im Alltag, Verhaltensregeln.
5. Vorbereitung auf den Mentor: Schlage Reisenden kluge, spezifische Fragen vor, die sie vor oder während der Reise ihrer Local Mentorin stellen können.

ZEITKRITISCHE FAKTEN & KEIN ECHTZEIT-ZUGRIFF:
- Du besitzt KEINEN Echtzeit-Zugriff auf aktuelle Daten (kein Live-Wetter, keine aktuellen Polizeiberichte, keine akuten Straßenblockaden, keine Echtzeit-Öffnungszeiten).
- Gib zeitkritische Fakten NIEMALS als gesichert oder aktuell aus, es sei denn, sie sind von verifizierten Quellen für den aktuellen Moment belegt.
- Betrifft insbesondere:
  * Stromversorgung / Load Shedding (erfinde keine aktuellen Netzabschaltungen oder aktuellen Stufen)
  * Aktuelle Sicherheits- oder Vorfallslagen
  * Tagesaktuelles Wetter & kurzfristige Wetterumschwünge
  * Verkehrsstörungen, Streiks oder Straßensperren
  * Öffnungszeiten von Sehenswürdigkeiten und Nationalparks
  * Visa-, Einreise- und Zollbestimmungen
- Verwende bei zeitkritischen Themen stets klare, sachliche Formulierungen wie:
  "Das kann sich ändern; prüfe die aktuelle offizielle Information." bzw. "Informiere dich hierzu kurz vor Reisebeginn direkt bei den offiziellen Stellen."
- Nenne oder suggeriere niemals einen Echtzeit-Datenzugriff.

EINREISE-, RECHTS- & GESUNDHEITSBESTIMMUNGEN:
- Für Reisepass, Visum, internationalen Führerschein, Impf- und Gesundheitsanforderungen oder rechtliche Bestimmungen:
  * Vermeide absolute, verbindliche Behauptungen, sofern keine gesicherten aktuellen Daten vorliegen.
  * Unterscheide klar zwischen allgemeiner Vorbereitungsempfehlung (Orientierungshilfe) und verbindlichen offiziellen Einreisevorschriften.
  * Verweise ausdrücklich auf die Prüfung der offiziellen südafrikanischen Behörden (Department of Home Affairs, südafrikanische Botschaft/Konsulate) bzw. des Auswärtigen Amtes / EDA / BMEIA.

STROMVERSORGUNG & POWERBANKS (LOAD SHEDDING):
- Behaupte NIEMALS automatisch, dass aktuell Load Shedding stattfindet oder in welchem Umfang aktuell Stromausfälle herrschen.
- Eine Powerbank darf und soll gerne als praktische Reiseausrüstung für lange Ausflugstage, Safaris oder Unterwegszeiten empfohlen werden. Erfinde jedoch keine aktuellen Netzzustände oder Stromabschaltungsphasen.

SICHERHEITS- & VERTRAUENSGRENZEN (STRENG EINHALTEN):
- Bei Fragen zu akuten Gefahren, Notfällen, medizinischen oder juristischen Lagen:
  * Stelle klar, dass du als KI-Assistent keine Notfallhilfe leisten kannst.
  * Verweise ruhig und bestimmt auf offizielle Notrufnummern in Südafrika (Notruf vom Mobiltelefon: 112 / Polizei SAPS: 10111 / Rettungsdienst: 10177) und offizielle Stellen (Botschaft/Konsulat).
  * Empfehle, sich bei Vor-Ort-Fragen oder Unsicherheiten sofort an die persönliche Local Mentorin zu wenden.
  * Vermeide alarmistische, angstmachende Sprache. Südafrika ist ein wunderbares, vielfältiges Reiseland, das mit gesunder Achtsamkeit und Vorbereitung gut bereist werden kann.
- Erfinde NIEMALS Buchungen, Verfügbarkeiten von Mentorinnen, feste Preise oder Dienstleistungen.
- Behaupte niemals, du hättest eine Mentorin kontaktiert oder eine Reservierung vorgenommen.

LOCAL MENTOR HANDOFF (UNBEDINGT BEIBEHALTEN):
- Wenn eine Frage stark vom aktuellen lokalen Kontext abhängt (z.B. aktuelle Sicherheitslage in einem spezifischen Stadtteil, Vor-Ort-Geheimtipps für Cafés und Restaurants, Straßenzustände abseits der Hauptrouten, individuelle Ausflugsempfehlungen):
  Empfehle auf natürliche Weise, dies mit der persönlichen Local Mentorin zu besprechen (z.B. "Für eine tagesaktuelle Einschätzung vor Ort und persönliche Empfehlungen ist dein Local Mentor die beste Ansprechpartnerin.").
- Füge diesen Hinweis NICHT mechanisch an jeden einzelnen Satz an, sondern gezielt dort, wo lokales Vor-Ort-Wissen wirklich den Unterschied macht.
- Vermeide repetitive Standard-Disclaimer.

ANTWORTFORMAT:
- Antworte stets auf Deutsch, in einem warmen, sachlichen, ermutigenden und professionellen Ton.
- Verwende sauberes Markdown mit sinnvollen Überschriften (###), gut strukturierten Aufzählungspunkten (* oder -) und dezenten Hervorhebungen (**fett**). Vermeide doppelt maskierte Steuerzeichen.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface TravelAssistantRequest {
  message: string;
  history?: ChatMessage[];
}

export interface TravelAssistantResponse {
  success: boolean;
  reply: string;
  error?: string;
  suggestMentorContact?: boolean;
  suggestedFollowUps?: string[];
}

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().max(2000),
});

const TravelAssistantInputSchema = z.object({
  message: z.string().min(2, 'Bitte gib mindestens 2 Zeichen ein.').max(1000, 'Maximal 1.000 Zeichen erlaubt.'),
  history: z.array(ChatMessageSchema).max(8).optional(),
});

export type TravelAssistantInput = z.infer<typeof TravelAssistantInputSchema>;

/**
 * Server action to process questions for the AI Travel Assistant.
 * Validates inputs, fails closed if unconfigured, and calls Genkit server-side.
 */
export async function askTravelAssistant(input: TravelAssistantRequest): Promise<TravelAssistantResponse> {
  // 1. Basic validation
  if (!input || typeof input.message !== 'string') {
    return {
      success: false,
      reply: '',
      error: 'Ungültige Anfrage. Bitte gib eine gültige Textnachricht ein.',
    };
  }

  const trimmedMessage = input.message.trim();

  if (trimmedMessage.length < 2) {
    return {
      success: false,
      reply: '',
      error: 'Bitte gib eine Frage oder ein Anliegen mit mindestens 2 Zeichen ein.',
    };
  }

  if (trimmedMessage.length > 1000) {
    return {
      success: false,
      reply: '',
      error: 'Deine Nachricht ist zu lang (maximal 1.000 Zeichen erlaubt). Bitte fasse deine Frage etwas kürzer.',
    };
  }

  // 2. Fail-closed check: Ensure AI provider is configured
  if (!isAIConfigured()) {
    return {
      success: false,
      reply: '',
      error: 'Der KI-Reiseassistent ist serverseitig zurzeit nicht konfiguriert (fehlender API-Schlüssel). Bitte wende dich an das Team oder kontaktiere deine Local Mentorin direkt.',
    };
  }

  // 3. Prepare messages with bounded history
  try {
    const rawHistory = Array.isArray(input.history) ? input.history.slice(-6) : [];
    const validMessages: Array<{ role: 'user' | 'model'; content: Array<{ text: string }> }> = [];

    for (const item of rawHistory) {
      if (item && typeof item.content === 'string' && (item.role === 'user' || item.role === 'assistant')) {
        const cleanText = item.content.trim().slice(0, 1500);
        if (cleanText.length > 0) {
          validMessages.push({
            role: item.role === 'assistant' ? 'model' : 'user',
            content: [{ text: cleanText }],
          });
        }
      }
    }

    // Append the current user prompt
    validMessages.push({
      role: 'user',
      content: [{ text: trimmedMessage }],
    });

    // 4. Generate response via Genkit using server-side Gemini model
    const response = await ai.generate({
      system: TRAVEL_ASSISTANT_SYSTEM_PROMPT,
      messages: validMessages,
    });

    const replyText = response.text || '';

    if (!replyText.trim()) {
      return {
        success: false,
        reply: '',
        error: 'Es konnte keine Antwort erzeugt werden. Bitte versuche es erneut.',
      };
    }

    // Analyze if mentor handoff is highlighted in the answer
    const lowerReply = replyText.toLowerCase();
    const suggestMentor = lowerReply.includes('local mentor') || 
                          lowerReply.includes('mentorin') || 
                          lowerReply.includes('vor ort fragen');

    // Contextual follow-up suggestions
    let followUps: string[] = [];
    if (lowerReply.includes('pack') || trimmedMessage.toLowerCase().includes('pack')) {
      followUps = [
        'Welche Kleidung empfiehlt sich für Pirschfahrten (Safari)?',
        'Welche Steckeradapter brauche ich in Südafrika?',
      ];
    } else if (lowerReply.includes('route') || lowerReply.includes('kapstadt') || lowerReply.includes('garden')) {
      followUps = [
        'Wie viele Tage sollte ich mindestens für Kapstadt einplanen?',
        'Ist ein Mietwagen für die Garden Route empfehlenswert?',
      ];
    } else {
      followUps = [
        'Welche Fragen sollte ich meiner Local Mentorin vorab stellen?',
        'Wie organisiere ich meine Ankunft am Flughafen am besten?',
      ];
    }

    return {
      success: true,
      reply: replyText,
      suggestMentorContact: suggestMentor,
      suggestedFollowUps: followUps,
    };
  } catch (error: unknown) {
    // Log server-side only; never expose credentials, internal URLs, or raw stack traces to the user
    console.error('Fehler im AI Travel Assistant Flow:', error instanceof Error ? error.message : error);

    return {
      success: false,
      reply: '',
      error: 'Entschuldigung, beim Verarbeiten deiner Anfrage ist ein unerwarteter Fehler aufgetreten. Bitte versuche es in wenigen Momenten erneut oder wende dich direkt an deine Local Mentorin.',
    };
  }
}
