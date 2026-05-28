'use server';
/**
 * @fileOverview A Genkit flow optimized for suggesting specific study topics and time allocations.
 *
 * - generateAdaptiveToDoList - A function that handles the generation of the adaptive to-do list.
 * - GenerateAdaptiveToDoListInput - The input type for the generateAdaptiveToDoList function.
 * - GenerateAdaptiveToDoListOutput - The return type for the generateAdaptiveToDoList function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAdaptiveToDoListInputSchema = z.object({
  weakAreas: z
    .array(
      z.object({
        subject: z.string(),
        chapter: z.string(),
      })
    )
    .optional(),
  availableStudyTimeMinutes: z.number().optional(),
  studyGoals: z.string().optional(),
});
export type GenerateAdaptiveToDoListInput = z.infer<typeof GenerateAdaptiveToDoListInputSchema>;

const GenerateAdaptiveToDoListOutputSchema = z.object({
  dailyToDoList: z.array(
    z.object({
      subject: z.enum(['Reasoning', 'Quants']),
      chapter: z.string().describe('The specific topic or chapter to study.'),
      estimatedTimeMinutes: z.number().describe('How long to spend on this topic.'),
    })
  ),
  overallRecommendation: z.string().optional(),
});
export type GenerateAdaptiveToDoListOutput = z.infer<typeof GenerateAdaptiveToDoListOutputSchema>;

export async function generateAdaptiveToDoList(
  input: GenerateAdaptiveToDoListInput
): Promise<GenerateAdaptiveToDoListOutput> {
  return generateAdaptiveToDoListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdaptiveToDoListPrompt',
  input: { schema: GenerateAdaptiveToDoListInputSchema },
  output: { schema: GenerateAdaptiveToDoListOutputSchema },
  prompt: `You are an AI study coach for bank exams. Suggest exactly ONE high-impact topic and an appropriate time duration for a study session.

User Context:
{{#if weakAreas}}
Weak Areas: {{#each weakAreas}}{{this.subject}}: {{this.chapter}}, {{/each}}
{{/if}}
{{#if availableStudyTimeMinutes}}
Available Time: {{availableStudyTimeMinutes}} minutes
{{/if}}

Rules:
1. Return exactly one specific sub-topic from the Adda247 bank exam syllabus (Reasoning or Quants).
2. The estimated time should be realistic (usually 30-60 minutes).
3. The chapter name should be concise and actionable.`,
});

const generateAdaptiveToDoListFlow = ai.defineFlow(
  {
    name: 'generateAdaptiveToDoListFlow',
    inputSchema: GenerateAdaptiveToDoListInputSchema,
    outputSchema: GenerateAdaptiveToDoListOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate suggestion.');
    }
    return output;
  }
);
