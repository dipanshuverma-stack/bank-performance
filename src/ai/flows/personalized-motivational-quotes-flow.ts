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
  prompt: `You are an encouraging and wise mentor for bank exam aspirants. Your task is to generate a single, concise, and highly motivational quote (maximum 2-3 sentences) specifically tailored to inspire and uplift students preparing for competitive bank exams. The quote should focus on themes like perseverance, hard work, dealing with pressure, the journey of preparation, or achieving success in challenging exams.

Here are some examples of the kind of quotes I'm looking for:
- "Every morning is a new opportunity to conquer yesterday's challenges. Your dedication today shapes your success tomorrow in the bank exams."
- "The path to banking success is paved with consistent effort and unwavering belief. Keep pushing, your dream is within reach."
- "Don't just count the days, make the days count. Each practice question brings you closer to your banking career."
- "Pressure is a privilege. Embrace the intensity of your bank exam preparation, for it forges the strength needed to excel."

Now, generate one such motivational quote. The quote should be returned in a JSON object with a 'quote' key.`,
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
