'use server';
/**
 * @fileOverview Genkit flow for Predictive Intelligence.
 * Analyzes a feed of messages to find missed opportunities or risks.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictiveInputSchema = z.object({
  messages: z.array(z.object({
    sender: z.string(),
    content: z.string(),
    timestamp: z.string(),
  })).describe('A list of recent communications to analyze for patterns and risks.'),
});

const PredictiveOutputSchema = z.object({
  insights: z.array(z.object({
    type: z.enum(['Opportunity', 'Risk', 'Follow-up', 'Spam']),
    description: z.string(),
    impactScore: z.number(),
  })).describe('AI identified predictive insights.'),
  healthScore: z.number().describe('Overall communication health score (0-100).'),
});
export type PredictiveOutput = z.infer<typeof PredictiveOutputSchema>;

export async function getPredictiveInsights(input: z.infer<typeof PredictiveInputSchema>): Promise<PredictiveOutput> {
  return predictiveFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictiveIntelligencePrompt',
  input: { schema: PredictiveInputSchema },
  output: { schema: PredictiveOutputSchema },
  prompt: `Analyze the following communication feed and identify predictive intelligence insights.
Look for:
1. Unanswered questions that seem important.
2. Missed follow-ups on promises made.
3. Potential spam or security risks.
4. Business opportunities or relationship cooling signals.

Feed:
{{#each messages}}
- From: {{this.sender}} | Content: {{this.content}} | Date: {{this.timestamp}}
{{/each}}

Return a health score (0-100) reflecting how well these communications are being managed.`,
});

const predictiveFlow = ai.defineFlow(
  {
    name: 'predictiveFlow',
    inputSchema: PredictiveInputSchema,
    outputSchema: PredictiveOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
