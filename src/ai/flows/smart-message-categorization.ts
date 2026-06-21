'use server';
/**
 * @fileOverview A Genkit flow for categorizing messages using AI.
 * Updated to recognize MDB Core and Nexus specific signals.
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
    .enum(['Urgent', 'Transactional', 'OTP', 'Other', 'MDB-Signal'])
    .describe("The category of the message ('Urgent', 'Transactional', 'OTP', 'MDB-Signal', or 'Other')."),
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
  prompt: `You are an AI assistant for GhostRecap Intelligence OS. Categorize messages into:
- 'Urgent': Critical action-required messages.
- 'Transactional': Receipts, orders, or system alerts.
- 'OTP': Verification codes.
- 'MDB-Signal': Communication from Midland Bank, Nexus, or HSM Bridge regarding API keys, handshake, or approvals.
- 'Other': None of the above.

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
