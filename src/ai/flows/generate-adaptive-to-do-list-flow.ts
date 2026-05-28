'use server';
/**
 * @fileOverview A Genkit flow optimized for suggesting strategic study topics and time allocations.
 * 
 * - generateAdaptiveToDoList - Generates 3-4 high-impact tasks based on weak areas and scoring topics.
 * - GenerateAdaptiveToDoListInput - Input including weak areas and available time.
 * - GenerateAdaptiveToDoListOutput - A list of 3-4 strategic tasks.
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
  ).describe('A list of 3 to 4 recommended study tasks.'),
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
  prompt: `You are an AI study coach for bank exams (SBI PO, IBPS PO, RBI Grade B). Your goal is to suggest a strategic study plan consisting of 3 to 4 high-impact tasks.

User Context:
{{#if weakAreas}}
Focus Areas (Weakness): {{#each weakAreas}}{{this.subject}}: {{this.chapter}}, {{/each}}
{{/if}}
{{#if availableStudyTimeMinutes}}
Total Available Time: {{availableStudyTimeMinutes}} minutes
{{/if}}

Strategic Logic:
1. **Prioritize Scoring Subjects**: Ensure tasks include "high-scoring" and "high-weightage" topics like Data Interpretation (DI), Puzzles & Seating Arrangement, and Arithmetic (Profit/Loss, SI/CI). These are vital for clearing cutoffs in SBI/IBPS PO.
2. **Address Weaknesses**: Allocate more time to the sub-topics the user is weak in.
3. **Exam Readiness**: Align suggestions with the standard Adda247 mock pattern for upcoming Prelims and Mains.

Rules:
- Suggest exactly 3 to 4 tasks.
- The total 'estimatedTimeMinutes' across all tasks should be close to the 'availableStudyTimeMinutes' (default to 120-180 mins if not provided).
- Return specific, actionable chapter names from the Adda247 syllabus.`,
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
      throw new Error('Failed to generate study suggestions.');
    }
    return output;
  }
);
