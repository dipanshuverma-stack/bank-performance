'use server';
/**
 * @fileOverview A Genkit flow optimized for suggesting strategic study topics based on weak areas.
 * 
 * - generateAdaptiveToDoList - Generates 3-4 high-impact tasks with a strict focus on weak subjects.
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
      reason: z.string().describe('Short reason why this was suggested (e.g., "Identified Weakness", "High Exam Weightage").'),
    })
  ).describe('A list of exactly 3 to 4 recommended study tasks.'),
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
  prompt: `You are an AI study coach for bank exams (SBI PO, IBPS PO, RBI Grade B). Your absolute priority is to help the student overcome their weak subjects.

User Context:
{{#if weakAreas}}
CRITICAL FOCUS (WEAK AREAS): 
{{#each weakAreas}}
- {{{this.subject}}}: {{{this.chapter}}}
{{/each}}
{{/if}}

Total Available Time: {{#if availableStudyTimeMinutes}}{{availableStudyTimeMinutes}}{{else}}180{{/if}} minutes

Strategic Execution Rules:
1. **Weakness First**: At least 2 of the suggested tasks MUST directly address the 'CRITICAL FOCUS' topics provided above.
2. **Scoring Balance**: The remaining 1-2 tasks should be high-scoring topics relevant to upcoming SBI/IBPS PO exams (e.g., DI, Puzzles, Arithmetic).
3. **Actionable Chapters**: Use specific chapter names from the Adda247 syllabus.
4. **Task Count**: Suggest exactly 3 to 4 tasks.
5. **Time Allocation**: Distribute the total available time reasonably across these tasks.

For each task, provide a very short 'reason' explaining why it's included (e.g., "Priority Weakness Fix" or "Core Scoring Pillar").`,
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
