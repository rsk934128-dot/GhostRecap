'use server';
/**
 * @fileOverview Genkit flow for the AI Copilot Workspace.
 * Handles summarization, task extraction, and contextual explanation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CopilotInputSchema = z.object({
  messageContent: z.string().describe('The content of the communication to analyze.'),
  mode: z.enum(['summarize', 'extractTasks', 'explainContext', 'generateReply']).describe('The operation mode for the Copilot.'),
});
export type CopilotInput = z.infer<typeof CopilotInputSchema>;

const CopilotOutputSchema = z.object({
  analysis: z.string().describe('The AI generated analysis or output based on the mode.'),
  tasks: z.array(z.string()).optional().describe('List of extracted tasks if in extractTasks mode.'),
  priorityScore: z.number().min(0).max(100).optional().describe('An updated priority score based on deep analysis.'),
});
export type CopilotOutput = z.infer<typeof CopilotOutputSchema>;

export async function runCopilot(input: CopilotInput): Promise<CopilotOutput> {
  return copilotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'copilotWorkspacePrompt',
  input: { schema: CopilotInputSchema },
  output: { schema: CopilotOutputSchema },
  prompt: `You are the GhostRecap AI Copilot, a high-level communication intelligence assistant.
Your goal is to provide deep insights for the following message:

Message: {{{messageContent}}}
Mode: {{{mode}}}

Instructions:
- If 'summarize': Provide a concise, bulleted summary.
- If 'extractTasks': Identify all actionable items, promises, or deadlines. Return them in the 'tasks' field.
- If 'explainContext': Explain the sentiment, underlying intent, and relationship implications.
- If 'generateReply': Suggest a professional and contextually appropriate response.

Always calculate a 'priorityScore' from 0-100 based on urgency and importance.`,
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
