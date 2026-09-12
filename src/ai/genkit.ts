import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

/**
 * Returns true if server-side Gemini API credentials are provided.
 */
export function isAIConfigured(): boolean {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 0);
}

export const ai = genkit({
  plugins: [googleAI({ apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY })],
  model: 'googleai/gemini-3.6-flash',
});
