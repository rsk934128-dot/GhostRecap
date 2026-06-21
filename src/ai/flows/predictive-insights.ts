'use server';
/**
 * @fileOverview Genkit flow for Predictive Intelligence.
 * Includes robust failsafe for API quota limits.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictiveInputSchema = z.object({
  messages: z.array(z.object({
    sender: z.string(),
    content: z.string(),
    timestamp: z.string(),
  })).describe('A list of messages to analyze.'),
});

const PredictiveOutputSchema = z.object({
  insights: z.array(z.object({
    type: z.enum(['Opportunity', 'Risk', 'Decision', 'Follow-up']),
    description: z.string(),
    impactScore: z.number(),
    suggestedAction: z.string().optional(),
  })).describe('Autonomous predictive insights.'),
  healthScore: z.number().describe('Overall health score.'),
  opportunityPipeline: z.number().describe('Value score of opportunities.'),
});
export type PredictiveOutput = z.infer<typeof PredictiveOutputSchema>;

export async function getPredictiveInsights(input: z.infer<typeof PredictiveInputSchema>): Promise<PredictiveOutput> {
  try {
    const result = await predictiveFlowV3(input);
    return result;
  } catch (error: any) {
    console.error('Predictive AI Quota/Error:', error);
    return {
      insights: [
        { 
          type: 'Follow-up', 
          description: 'AI Insights are in standby mode. Network quota reached.', 
          impactScore: 0 
        }
      ],
      healthScore: 100,
      opportunityPipeline: 0
    };
  }
}

const prompt = ai.definePrompt({
  name: 'predictiveIntelligencePromptV3',
  input: { schema: PredictiveInputSchema },
  output: { schema: PredictiveOutputSchema },
  prompt: `Analyze the communication feed for Risks, Opportunities, Decisions, and Follow-ups.
Feed:
{{#each messages}}
- From: {{this.sender}} | Content: {{this.content}}
{{/each}}`,
});

const predictiveFlowV3 = ai.defineFlow(
  {
    name: 'predictiveFlowV3',
    inputSchema: PredictiveInputSchema,
    outputSchema: PredictiveOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
