'use server';
/**
 * @fileOverview A Genkit flow for analyzing cultural sentiment in media collaborations.
 *
 * - analyzeMediaSentiment - A function that analyzes media data for cultural trends.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MediaSentimentInputSchema = z.object({
  mediaData: z.array(z.object({
    artist: z.string(),
    category: z.string(),
    tracks: z.array(z.object({
      title: z.string(),
      description: z.string(),
      type: z.string(),
    })),
  })).describe('The list of artists and their tracks to analyze.'),
});
export type MediaSentimentInput = z.infer<typeof MediaSentimentInputSchema>;

const MediaSentimentOutputSchema = z.object({
  overallSentiment: z.string().describe('A summary of the overall cultural sentiment found.'),
  culturalTrendScore: z.number().min(0).max(100).describe('A score representing the global crossover potential.'),
  keyInsights: z.array(z.string()).describe('List of key cultural insights.'),
  marketImpact: z.string().describe('Predicted impact on regional entertainment nodes.'),
});
export type MediaSentimentOutput = z.infer<typeof MediaSentimentOutputSchema>;

export async function analyzeMediaSentiment(input: MediaSentimentInput): Promise<MediaSentimentOutput> {
  return mediaSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'mediaSentimentPrompt',
  input: { schema: MediaSentimentInputSchema },
  output: { schema: MediaSentimentOutputSchema },
  prompt: `You are the GhostRecap Cultural Analyst. Your mission is to analyze global music collaborations and identify high-value cultural signals.

Analyze the following media intelligence node:

{{#each mediaData}}
Artist: {{this.artist}} (Category: {{this.category}})
Tracks:
{{#each this.tracks}}
- {{this.title}}: {{this.description}} (Type: {{this.type}})
{{/each}}
{{/each}}

Tasks:
1. **Sentiment Analysis**: Determine if the trend is leaning towards soulful, energetic, or global crossover.
2. **Trend Scoring**: Assign a 0-100 score for cultural relevance.
3. **Insights**: Identify why these specific collaborations (like B Praak & Jaani or Jassie Gill & Badshah) are successful.
4. **Market Impact**: Predict the business value for merchant nodes in these regions.`,
});

const mediaSentimentFlow = ai.defineFlow(
  {
    name: 'mediaSentimentFlow',
    inputSchema: MediaSentimentInputSchema,
    outputSchema: MediaSentimentOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
