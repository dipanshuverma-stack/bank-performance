'use server';
/**
 * @fileOverview An AI agent that analyzes student performance data to identify weak sub-topics.
 *
 * - analyzeWeakAreas - A function that handles the analysis of performance data.
 * - AnalyzeWeakAreasInput - The input type for the analyzeWeakAreas function.
 * - AnalyzeWeakAreasOutput - The return type for the analyzeWeakAreas function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PerformanceEntrySchema = z.object({
  topic: z.string().describe('The name of the topic or chapter.'),
  type: z.enum(['Reasoning', 'Quants']).describe('The type of subject: Reasoning or Quants.'),
  accuracy: z.number().min(0).max(100).describe('The accuracy percentage for this topic.'),
  errors: z.string().optional().describe('Optional: Details about common errors or types of mistakes made in this topic.'),
});

const AnalyzeWeakAreasInputSchema = z.object({
  syllabus: z.string().describe('A detailed text representation of the Adda247 bank exam syllabus structure.'),
  performanceData: z.array(PerformanceEntrySchema).describe('An array of objects, each detailing performance for a specific topic.'),
});
export type AnalyzeWeakAreasInput = z.infer<typeof AnalyzeWeakAreasInputSchema>;

const AnalyzeWeakAreasOutputSchema = z.object({
  weakSubTopics: z.array(z.string()).describe('A list of identified weak sub-topics.'),
  explanation: z.string().describe('An explanation of the reasoning behind the identification of weak topics.'),
  recommendations: z.array(z.string()).describe('Specific study recommendations for the identified weak topics.'),
});
export type AnalyzeWeakAreasOutput = z.infer<typeof AnalyzeWeakAreasOutputSchema>;

export async function analyzeWeakAreas(input: AnalyzeWeakAreasInput): Promise<AnalyzeWeakAreasOutput> {
  return analyzeWeakAreasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeWeakAreasPrompt',
  input: { schema: AnalyzeWeakAreasInputSchema },
  output: { schema: AnalyzeWeakAreasOutputSchema },
  prompt: `You are an intelligent study logic tool designed to help bank exam aspirants identify their weak areas.
Your task is to analyze the provided performance data against the Adda247 syllabus and pinpoint specific sub-topics where the student needs to focus.

Syllabus:
{{{syllabus}}}

Performance Data:
{{#each performanceData}}
  - Topic: {{{topic}}}, Type: {{{type}}}, Accuracy: {{{accuracy}}}%{{#if errors}}, Errors: {{{errors}}}{{/if}}
{{/each}}

Based on the accuracy percentages (especially those below 70-75%) and any noted errors, identify the weak sub-topics. Provide an explanation for your findings and suggest actionable recommendations to improve.

Instructions:
1. List only the specific weak sub-topics. If a topic is generally weak, try to break it down further based on error descriptions or common sub-topics within the syllabus.
2. Provide a concise explanation detailing why these topics are considered weak.
3. Offer practical study recommendations for each identified weak topic.`,
});

const analyzeWeakAreasFlow = ai.defineFlow(
  {
    name: 'analyzeWeakAreasFlow',
    inputSchema: AnalyzeWeakAreasInputSchema,
    outputSchema: AnalyzeWeakAreasOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
