'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing decision journal entries and providing AI-driven insights.
 *
 * The flow takes decision journal entries as input and uses a language model to identify patterns and provide insights.
 *
 * @interface DecisionJournalInsightsInput - Defines the input schema for the decision journal insights flow.
 * @interface DecisionJournalInsightsOutput - Defines the output schema for the decision journal insights flow.
 * @function getDecisionJournalInsights - The main function to trigger the decision journal insights flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DecisionJournalInsightsInputSchema = z.object({
  entries: z.array(
    z.object({
      decision: z.string().describe('The decision made.'),
      reason: z.string().describe('The reason for the decision.'),
      feeling: z.string().describe('The feeling associated with the decision.'),
    })
  ).describe('An array of decision journal entries.'),
});
export type DecisionJournalInsightsInput = z.infer<typeof DecisionJournalInsightsInputSchema>;

const DecisionJournalInsightsOutputSchema = z.object({
  insights: z.array(
    z.object({
      pattern: z.string().describe('The identified pattern in the decisions.'),
      explanation: z.string().describe('An explanation of the pattern.'),
      suggestion: z.string().describe('A suggestion based on the identified pattern.'),
    })
  ).describe('An array of AI-driven insights.'),
});
export type DecisionJournalInsightsOutput = z.infer<typeof DecisionJournalInsightsOutputSchema>;

export async function getDecisionJournalInsights(input: DecisionJournalInsightsInput): Promise<DecisionJournalInsightsOutput> {
  return decisionJournalInsightsFlow(input);
}

const decisionJournalInsightsPrompt = ai.definePrompt({
  name: 'decisionJournalInsightsPrompt',
  input: {schema: DecisionJournalInsightsInputSchema},
  output: {schema: DecisionJournalInsightsOutputSchema},
  prompt: `You are an AI assistant that analyzes decision journal entries and provides insights to help users improve their decision-making process.\n\n  Analyze the following decision journal entries and identify patterns in the decisions, reasons, and feelings associated with them. Provide actionable suggestions based on these patterns.\n\n  Entries:\n  {{#each entries}}\n  - Decision: {{{decision}}}\n    Reason: {{{reason}}}\n    Feeling: {{{feeling}}}\n  {{/each}}\n\n  Provide your insights in the following format:\n  Insights:\n  [{{#each insights}}\n    Pattern: {{{pattern}}}\n    Explanation: {{{explanation}}}\n    Suggestion: {{{suggestion}}}\n  {{/each}}]`,
});

const decisionJournalInsightsFlow = ai.defineFlow(
  {
    name: 'decisionJournalInsightsFlow',
    inputSchema: DecisionJournalInsightsInputSchema,
    outputSchema: DecisionJournalInsightsOutputSchema,
  },
  async input => {
    const {output} = await decisionJournalInsightsPrompt(input);
    return output!;
  }
);
