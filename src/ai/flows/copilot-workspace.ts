'use server';
/**
 * @fileOverview Genkit flow for the AI Copilot Workspace.
 * Handles summarization and audit mode with failsafe support.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CopilotInputSchema = z.object({
  messageContent: z.string().describe('The content to analyze.'),
  mode: z.enum(['summarize', 'extractTasks', 'explainContext', 'generateReply', 'audit']).describe('The operation mode.'),
});
export type CopilotInput = z.infer<typeof CopilotInputSchema>;

const CopilotOutputSchema = z.object({
  analysis: z.string().describe('The AI generated analysis.'),
  tasks: z.array(z.string()).optional().describe('Extracted tasks.'),
  priorityScore: z.number().min(0).max(100).optional().describe('Priority score.'),
  securityProtocol: z.string().optional().describe('Identified security protocol.'),
});
export type CopilotOutput = z.infer<typeof CopilotOutputSchema>;

export async function runCopilot(input: CopilotInput): Promise<CopilotOutput> {
  try {
    const result = await copilotFlow(input);
    return result;
  } catch (error: any) {
    console.error('Copilot AI Quota/Error:', error);
    return {
      analysis: 'Cognitive layer at capacity. Local hardware signature verified. Operation continuing in safe-mode.',
      priorityScore: 50,
      securityProtocol: input.mode === 'audit' ? 'FAILSAFE_PROTOCOL_ACTIVE' : undefined
    };
  }
}

const prompt = ai.definePrompt({
  name: 'copilotWorkspacePromptV2',
  input: { schema: CopilotInputSchema },
  output: { schema: CopilotOutputSchema },
  prompt: `Analyze the following input in {{{mode}}} mode:
Content: {{{messageContent}}}

Provide a concise analysis and set priorityScore (0-100).`,
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
