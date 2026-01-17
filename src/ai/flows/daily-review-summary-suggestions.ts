'use server';

/**
 * @fileOverview Generates a daily summary of user activities and offers personalized suggestions.
 *
 * - generateDailySummaryAndSuggestions - A function that generates the daily summary and suggestions.
 * - DailyReviewInput - The input type for the generateDailySummaryAndSuggestions function.
 * - DailyReviewOutput - The return type for the generateDailySummaryAndSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyReviewInputSchema = z.object({
  mood: z.string().describe('The user\'s mood for the day.'),
  habits: z.string().describe('The user\'s habit tracking data for the day.'),
  spending: z.string().describe('The user\'s spending data for the day.'),
  decisions: z.string().describe('The user\'s decisions for the day.'),
});
export type DailyReviewInput = z.infer<typeof DailyReviewInputSchema>;

const DailyReviewOutputSchema = z.object({
  summary: z.string().describe('A summary of the user\'s day.'),
  suggestions: z.string().describe('Personalized suggestions for the user based on their day.'),
});
export type DailyReviewOutput = z.infer<typeof DailyReviewOutputSchema>;

export async function generateDailySummaryAndSuggestions(
  input: DailyReviewInput
): Promise<DailyReviewOutput> {
  return dailyReviewSummarySuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyReviewSummarySuggestionsPrompt',
  input: {schema: DailyReviewInputSchema},
  output: {schema: DailyReviewOutputSchema},
  prompt: `You are an AI assistant that provides daily summaries and personalized suggestions to users based on their mood, habits, spending, and decisions.

  Summarize the user's day and provide suggestions to improve their overall well-being and focus.

  Mood: {{{mood}}}
  Habits: {{{habits}}}
  Spending: {{{spending}}}
  Decisions: {{{decisions}}}
  `,
});

const dailyReviewSummarySuggestionsFlow = ai.defineFlow(
  {
    name: 'dailyReviewSummarySuggestionsFlow',
    inputSchema: DailyReviewInputSchema,
    outputSchema: DailyReviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
