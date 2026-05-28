'use server';
/**
 * @fileOverview AI flow to discover and award dynamic achievements based on user performance.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AchievementSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string().describe('Lucide icon name (e.g., Trophy, Zap, Flame, Target)'),
  type: z.enum(['milestone', 'creative', 'consistency']),
});

const AnalyzeAchievementsInputSchema = z.object({
  mockLogs: z.array(z.any()),
  studySessions: z.array(z.any()),
  existingAchievements: z.array(z.string()),
});
export type AnalyzeAchievementsInput = z.infer<typeof AnalyzeAchievementsInputSchema>;

const AnalyzeAchievementsOutputSchema = z.object({
  newlyUnlocked: z.array(AchievementSchema),
});
export type AnalyzeAchievementsOutput = z.infer<typeof AnalyzeAchievementsOutputSchema>;

export async function analyzeAchievements(input: AnalyzeAchievementsInput): Promise<AnalyzeAchievementsOutput> {
  return analyzeAchievementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeAchievementsPrompt',
  input: { schema: AnalyzeAchievementsInputSchema },
  output: { schema: AnalyzeAchievementsOutputSchema },
  prompt: `You are an AI game designer for a bank exam preparation platform. Your goal is to keep the user motivated by "discovering" achievements in their performance data.

User Data:
- Mock Logs: {{json mockLogs}}
- Study Sessions: {{json studySessions}}
- Already Unlocked: {{json existingAchievements}}

INSTRUCTIONS:
1. Analyze the logs for patterns. Look for:
   - High Accuracy (e.g., >90% in a mock).
   - High Volume (e.g., total questions > 500, 1000).
   - Streaks (e.g., 3, 7, 14 days of activity).
   - Speed (e.g., very fast solve times in Quants).
   - Creative patterns (e.g., studying late at night, studying early morning, balancing subjects perfectly).

2. Award achievements that haven't been unlocked yet.
3. Be creative with "Creative" type achievements (e.g., "The Night Owl", "The Weekend Warrior", "Subject Specialist").
4. If no new achievements are found, return an empty array for 'newlyUnlocked'.

Example Output:
{
  "newlyUnlocked": [
    { "id": "night_owl", "title": "Night Owl", "description": "Logged a study session after midnight. True dedication!", "icon": "Moon", "type": "creative" }
  ]
}`,
});

const analyzeAchievementsFlow = ai.defineFlow(
  {
    name: 'analyzeAchievementsFlow',
    inputSchema: AnalyzeAchievementsInputSchema,
    outputSchema: AnalyzeAchievementsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
