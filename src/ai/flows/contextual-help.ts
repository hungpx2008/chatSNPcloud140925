'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing contextual help in a chatbot application,
 *               tailoring responses based on the selected department.
 *
 * - `getContextualHelp`: A function that takes a user's question and the selected department
 *                         and returns a contextually relevant response.
 * - `ContextualHelpInput`: The input type for the `getContextualHelp` function, including the user's question and department.
 * - `ContextualHelpOutput`: The output type for the `getContextualHelp` function, containing the chatbot's response.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the contextual help flow.
const ContextualHelpInputSchema = z.object({
  question: z.string().describe('The user’s question.'),
  department: z.string().describe('The department selected by the user.'),
});
export type ContextualHelpInput = z.infer<typeof ContextualHelpInputSchema>;

// Define the output schema for the contextual help flow.
const ContextualHelpOutputSchema = z.object({
  response: z.string().describe('The chatbot’s contextually relevant response.'),
});
export type ContextualHelpOutput = z.infer<typeof ContextualHelpOutputSchema>;

// Exported function to get contextual help.
export async function getContextualHelp(input: ContextualHelpInput): Promise<ContextualHelpOutput> {
  return contextualHelpFlow(input);
}

// Define the prompt to generate contextually relevant responses.
const contextualHelpPrompt = ai.definePrompt({
  name: 'contextualHelpPrompt',
  input: {schema: ContextualHelpInputSchema},
  output: {schema: ContextualHelpOutputSchema},
  prompt: `You are a chatbot assistant for the {{{department}}} department.
  Use your knowledge and the department context to answer the following question.
  Question: {{{question}}}

  Please format your response using Markdown. Present the document in a clear and professional format.
	•	Use line breaks appropriately to enhance readability.
	•	Apply bullet points for the main ideas.
	•	When necessary, organize information using a numbered list for step-by-step clarity.
  • If a table is required, ensure it is formatted using valid Markdown table syntax. Do not include any text before or after the table itself.`,
});

// Define the Genkit flow for contextual help.
const contextualHelpFlow = ai.defineFlow(
  {
    name: 'contextualHelpFlow',
    inputSchema: ContextualHelpInputSchema,
    outputSchema: ContextualHelpOutputSchema,
  },
  async input => {
    const {output} = await contextualHelpPrompt(input);
    return output!;
  }
);
