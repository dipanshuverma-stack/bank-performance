'use server';
/**
 * @fileOverview A Genkit flow for generating a personalized daily study to-do list based on identified weak areas.
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
        subject: z
          .string()
          .describe(
            'The subject of the weak area (e.g., "Reasoning", "Quants").'
          ),
        chapter: z.string().describe('The specific chapter name.'),
        subtopics: z
          .array(z.string())
          .optional()
          .describe('Optional: Specific sub-topics within the chapter.'),
        reason: z
          .string()
          .optional()
          .describe('Optional: Reason for identifying this as a weak area.'),
      })
    )
    .describe('An array of identified weak chapters/topics.'),
  studyGoals: z
    .string()
    .optional()
    .describe('Optional: Overall study goals or focus areas for the day.'),
  availableStudyTimeMinutes: z
    .number()
    .optional()
    .describe('Optional: Total available study time in minutes for the day.'),
  syllabusContext: z
    .string()
    .optional()
    .describe('Optional: General context about the Adda247 syllabus structure.'),
});
export type GenerateAdaptiveToDoListInput = z.infer<
  typeof GenerateAdaptiveToDoListInputSchema
>;

const GenerateAdaptiveToDoListOutputSchema = z.object({
  dailyToDoList: z
    .array(
      z.object({
        subject: z.string().describe('The subject of the task.'),
        chapter: z.string().describe('The chapter to focus on.'),
        subtopic: z.string().optional().describe('Specific sub-topic, if applicable.'),
        taskDescription: z.string().describe('A detailed description of the task.'),
        estimatedTimeMinutes: z
          .number()
          .optional()
          .describe('Estimated time to complete this task in minutes.'),
      })
    )
    .describe('A personalized list of study tasks for the day.'),
  overallRecommendation: z
    .string()
    .optional()
    .describe('An overall recommendation or motivational message.'),
});
export type GenerateAdaptiveToDoListOutput = z.infer<
  typeof GenerateAdaptiveToDoListOutputSchema
>;

export async function generateAdaptiveToDoList(
  input: GenerateAdaptiveToDoListInput
): Promise<GenerateAdaptiveToDoListOutput> {
  return generateAdaptiveToDoListFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdaptiveToDoListPrompt',
  input: { schema: GenerateAdaptiveToDoListInputSchema },
  output: { schema: GenerateAdaptiveToDoListOutputSchema },
  prompt: `You are an AI assistant designed to help bank exam aspirants create personalized daily study to-do lists.
Your goal is to recommend specific chapters and sub-topics from the Adda247 syllabus based on the user's identified weak areas, to optimize their study time.

Here are the user's identified weak areas:
Weak Areas: {{{JSON weakAreas}}}

{{#if studyGoals}}
User's Study Goals: {{{studyGoals}}}
{{/if}}

{{#if availableStudyTimeMinutes}}
User's Available Study Time: {{{availableStudyTimeMinutes}}} minutes
{{/if}}

{{#if syllabusContext}}
Adda247 Syllabus Context: {{{syllabusContext}}}
{{/if}}

Generate a detailed daily to-do list, prioritizing tasks from the weak areas. For each task, include the subject, chapter, specific sub-topic (if available), a clear task description, and an estimated time to complete it in minutes. Ensure the tasks are actionable and directly address the weak areas.

Also, provide an overall recommendation or a motivational message to the student.

Output your response in a JSON format matching the schema for GenerateAdaptiveToDoListOutput.`,
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
      throw new Error('Failed to generate adaptive to-do list.');
    }
    return output;
  }
);
