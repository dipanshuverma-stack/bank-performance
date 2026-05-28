'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating motivational quotes from successful people.
 *
 * - generateMotivationalQuote - A function that fetches a motivational quote from a successful person.
 * - GenerateMotivationalQuoteInput - The input type for the generateMotivationalQuote function.
 * - GenerateMotivationalQuoteOutput - The return type for the generateMotivationalQuote function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMotivationalQuoteInputSchema = z
  .object({})
  .describe('Input for generating a personalized motivational quote.');
export type GenerateMotivationalQuoteInput = z.infer<typeof GenerateMotivationalQuoteInputSchema>;

const GenerateMotivationalQuoteOutputSchema = z
  .object({
    quote: z.string().describe('A powerful quote from a successful person.'),
    author: z.string().describe('The name of the successful person who said the quote.'),
  })
  .describe('Output containing a quote and its author.');
export type GenerateMotivationalQuoteOutput = z.infer<typeof GenerateMotivationalQuoteOutputSchema>;

const prompt = ai.definePrompt({
  name: 'motivationalQuotePrompt',
  input: { schema: GenerateMotivationalQuoteInputSchema },
  output: { schema: GenerateMotivationalQuoteOutputSchema },
  prompt: `You are a curator of wisdom from the world's most successful individuals, with a special emphasis on great Indian leaders, thinkers, athletes, and entrepreneurs (e.g., APJ Abdul Kalam, Swami Vivekananda, Ratan Tata, Mary Kom, Sachin Tendulkar).

Your task is to provide a single, highly relevant motivational quote that speaks to the discipline, focus, and endurance required for a student preparing for difficult competitive exams in India.

CRITICAL INSTRUCTIONS:
- The quote MUST be from a real, identifiable successful person, preferably from the Indian context.
- The quote should focus on themes like persistence, the value of hard work, overcoming failure, or the standard of excellence.
- DO NOT use generic AI-generated "quotes" or clichés.
- Ensure the quote is impactful and actually provides perspective for someone studying 10+ hours a day.

Return the result as a JSON object with 'quote' and 'author' keys.`,
});

const generateMotivationalQuoteFlow = ai.defineFlow(
  {
    name: 'generateMotivationalQuoteFlow',
    inputSchema: GenerateMotivationalQuoteInputSchema,
    outputSchema: GenerateMotivationalQuoteOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt(input);
      return output!;
    } catch (error: any) {
      console.warn('Motivational quote generation skipped due to AI availability:', error.message);
      return {
        quote: "Dream is not that which you see while sleeping, it is something that does not let you sleep.",
        author: "Dr. APJ Abdul Kalam"
      };
    }
  }
);

export async function generateMotivationalQuote(
  input: GenerateMotivationalQuoteInput
): Promise<GenerateMotivationalQuoteOutput> {
  return generateMotivationalQuoteFlow(input);
}
