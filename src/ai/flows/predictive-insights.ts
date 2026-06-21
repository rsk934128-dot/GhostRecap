'use server';
/**
 * @fileOverview Genkit flow for Predictive Intelligence v3.0.
 * Analyzes communication feeds for Risks, Opportunities, and Pending Decisions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PredictiveInputSchema = z.object({
  messages: z.array(z.object({
    sender: z.string(),
    content: z.string(),
    timestamp: z.string(),
  })).describe('A list of recent communications to analyze.'),
});

const PredictiveOutputSchema = z.object({
  insights: z.array(z.object({
    type: z.enum(['Opportunity', 'Risk', 'Decision', 'Follow-up']),
    description: z.string(),
    impactScore: z.number(),
    suggestedAction: z.string().optional(),
  })).describe('Autonomous predictive insights.'),
  healthScore: z.number().describe('Overall communication health score (0-100).'),
  opportunityPipeline: z.number().describe('Value score of potential opportunities found.'),
});
export type PredictiveOutput = z.infer<typeof PredictiveOutputSchema>;

export async function getPredictiveInsights(input: z.infer<typeof PredictiveInputSchema>): Promise<PredictiveOutput> {
  try {
    return await predictiveFlow(input);
  } catch (error: any) {
    if (error.message?.includes('429') || error.message?.includes('QUOTA_EXCEEDED') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return {
        insights: [
          { 
            type: 'Follow-up', 
            description: 'AI Insights are temporarily limited due to high network demand. Core system monitoring remains active.', 
            impactScore: 0 
          }
        ],
        healthScore: 100,
        opportunityPipeline: 0
      };
    }
    throw error;
  }
}

const prompt = ai.definePrompt({
  name: 'predictiveIntelligencePromptV3',
  input: { schema: PredictiveInputSchema },
  output: { schema: PredictiveOutputSchema },
  prompt: `Analyze the following communication feed as an Autonomous Intelligence Agent.
Identify:
1. **Risks**: Security threats or communication breakdowns.
2. **Opportunities**: High-value business leads or relationship growth signals.
3. **Decisions**: Unresolved discussions requiring a clear "Yes/No" or choice.
4. **Follow-ups**: Promises made that haven't been fulfilled.

Feed:
{{#each messages}}
- From: {{this.sender}} | Content: {{this.content}} | Date: {{this.timestamp}}
{{/each}}

Calculate an 'opportunityPipeline' score (0-100) based on the quality of business signals found.`,
});

const predictiveFlow = ai.defineFlow(
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
