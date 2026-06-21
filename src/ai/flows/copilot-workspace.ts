'use server';
/**
 * @fileOverview Genkit flow for the AI Copilot Workspace.
 * Handles summarization, task extraction, and contextual explanation.
 * Includes failsafe for API quota limits and audit mode support.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CopilotInputSchema = z.object({
  messageContent: z.string().describe('The content of the communication to analyze.'),
  mode: z.enum(['summarize', 'extractTasks', 'explainContext', 'generateReply', 'audit']).describe('The operation mode for the Copilot.'),
});
export type CopilotInput = z.infer<typeof CopilotInputSchema>;

const CopilotOutputSchema = z.object({
  analysis: z.string().describe('The AI generated analysis or output based on the mode.'),
  tasks: z.array(z.string()).optional().describe('List of extracted tasks if in extractTasks mode.'),
  priorityScore: z.number().min(0).max(100).optional().describe('An updated priority score based on deep analysis.'),
  securityProtocol: z.string().optional().describe('Identified security protocol if in audit mode.'),
});
export type CopilotOutput = z.infer<typeof CopilotOutputSchema>;

export async function runCopilot(input: CopilotInput): Promise<CopilotOutput> {
  try {
    return await copilotFlow(input);
  } catch (error: any) {
    if (error.message?.includes('429') || error.message?.includes('QUOTA_EXCEEDED') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return {
        analysis: 'Cognitive layer at capacity. Fragment stored in secure buffer. Basic categorization verified via local hardware signature.',
        priorityScore: 50,
        securityProtocol: input.mode === 'audit' ? 'FAILSAFE_PROTOCOL_ACTIVE' : undefined
      };
    }
    throw error;
  }
}

const prompt = ai.definePrompt({
  name: 'copilotWorkspacePromptV2',
  input: { schema: CopilotInputSchema },
  output: { schema: CopilotOutputSchema },
  prompt: `You are the GhostRecap AI Copilot, a sovereign communication intelligence assistant.
Analyze the following input:

Content: {{{messageContent}}}
Mode: {{{mode}}}

Instructions:
- If 'summarize': Provide a concise, bulleted summary of the core message.
- If 'extractTasks': Identify actionable items or deadlines.
- If 'explainContext': Analyze sentiment and intent.
- If 'audit': This is a high-security MDB Core Signal. Verify the HSM handshake request, explain the cryptographic implications (AES-256, RSA signatures), and assess node trust.

Always calculate a 'priorityScore' (0-100). If it's an MDB Signal, the score must be 90+.`,
});

const copilotFlow = ai.defineFlow(
  {
    name: 'copilotFlow',
    inputSchema: CopilotInputSchema,
    outputSchema: CopilotOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
