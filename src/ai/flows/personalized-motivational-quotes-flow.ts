'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating personalized motivational quotes.
 *
 * - generateMotivationalQuote - A function that generates a motivational quote for bank exam aspirants.
 * - GenerateMotivationalQuoteInput - The input type for the generateMotivationalQuote function.
 * - GenerateMotivationalQuoteOutput - The return type for the generateMotivationalQuote function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMotivationalQuoteInputSchema = z
  .object({})
  .describe('Input for generating a personalized motivational quote. No specific input is required as the context is bank exam preparation.');
export type GenerateMotivationalQuoteInput = z.infer<typeof GenerateMotivationalQuoteInputSchema>;

const GenerateMotivationalQuoteOutputSchema = z
  .object({
    quote: z.string().describe('A personalized motivational quote relevant to bank exam preparation.'),
  })
  .describe('Output containing a personalized motivational quote.');
export type GenerateMotivationalQuoteOutput = z.infer<typeof GenerateMotivationalQuoteOutputSchema>;

const prompt = ai.definePrompt({
  name: 'motivationalQuotePrompt',
  input: { schema: GenerateMotivationalQuoteInputSchema },
  output: { schema: GenerateMotivationalQuoteOutputSchema },
  prompt: `You are a high-performance coach and wise mentor for competitive exam aspirants. 

Your task is to generate a single, powerful, and authentic motivational quote (maximum 2-3 sentences) specifically for students preparing for rigorous bank exams (SBI PO, IBPS, RBI).

CRITICAL INSTRUCTIONS:
- AVOID generic "AI-sounding" platitudes or toxic positivity.
- AVOID clichés like "yesterday's challenges" or "shapes your success tomorrow."
- FOCUS on the psychological grit, discipline, and stoic endurance required for long-term preparation.
- DRAW inspiration from concepts of deliberate practice, the beauty of the struggle, and the precision required in competitive fields.
- TONE should be grounded, slightly intense, and deeply encouraging.

Examples of the quality and depth required:
- "The standard you walk past is the standard you accept. In the quiet of your study hours, every unsolved problem is a choice between mastery and mediocrity."
- "Discipline is simply the art of remembering what you want most, even when the exhaustion of the moment whispers for you to quit. Stay the course."
- "Precision isn't an accident; it's the residue of a thousand failed attempts and the refusal to stop until the process is seamless."
- "The weight of preparation is heavy, but it is lighter than the burden of regret. Carry it with pride today."

Now, generate one such impactful motivational quote. Return it in a JSON object with a 'quote' key.`,
});

const generateMotivationalQuoteFlow = ai.defineFlow(
  {
    name: 'generateMotivationalQuoteFlow',
    inputSchema: GenerateMotivationalQuoteInputSchema,
    outputSchema: GenerateMotivationalQuoteOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function generateMotivationalQuote(
  input: GenerateMotivationalQuoteInput
): Promise<GenerateMotivationalQuoteOutput> {
  return generateMotivationalQuoteFlow(input);
}
