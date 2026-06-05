'use server';
/**
 * @fileOverview A Genkit flow for categorizing messages using AI.
 *
 * - smartMessageCategorization - A function that categorizes message content.
 * - SmartMessageCategorizationInput - The input type for the smartMessageCategorization function.
 * - SmartMessageCategorizationOutput - The return type for the smartMessageCategorization function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SmartMessageCategorizationInputSchema = z.object({
  messageContent: z
    .string()
    .describe('The content of the message to be categorized.'),
});
export type SmartMessageCategorizationInput = z.infer<
  typeof SmartMessageCategorizationInputSchema
>;

const SmartMessageCategorizationOutputSchema = z.object({
  category: z
    .enum(['Urgent', 'Transactional', 'OTP', 'Other'])
    .describe("The category of the message ('Urgent', 'Transactional', 'OTP', or 'Other')."),
});
export type SmartMessageCategorizationOutput = z.infer<
  typeof SmartMessageCategorizationOutputSchema
>;

export async function smartMessageCategorization(
  input: SmartMessageCategorizationInput
): Promise<SmartMessageCategorizationOutput> {
  return smartMessageCategorizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'messageCategorizationPrompt',
  input: { schema: SmartMessageCategorizationInputSchema },
  output: { schema: SmartMessageCategorizationOutputSchema },
  prompt: `You are an AI assistant tasked with categorizing messages into one of the following types:
- 'Urgent': For time-sensitive, critical, or immediate action-required messages.
- 'Transactional': For automated notifications, receipts, order updates, or system alerts.
- 'OTP': For one-time passwords, verification codes, or security tokens.
- 'Other': If none of the above categories fit.

Categorize the following message content:

Message: {{{messageContent}}}`,
});

const smartMessageCategorizationFlow = ai.defineFlow(
  {
    name: 'smartMessageCategorizationFlow',
    inputSchema: SmartMessageCategorizationInputSchema,
    outputSchema: SmartMessageCategorizationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
