'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing contextual help
 *               with multimodal input (text and images).
 *
 * - `getMultimodalHelp`: A function that takes a user's question, department, and an optional image
 *                         and returns a contextually relevant response.
 * - `MultimodalHelpInput`: The input type for the `getMultimodalHelp` function.
 * - `MultimodalHelpOutput`: The output type for the `getMultimodalHelp` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the multimodal help flow.
const MultimodalHelpInputSchema = z.object({
  question: z.string().describe('The user’s question.'),
  department: z.string().describe('The department selected by the user.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type MultimodalHelpInput = z.infer<typeof MultimodalHelpInputSchema>;

// Define the output schema for the multimodal help flow.
const MultimodalHelpOutputSchema = z.object({
  response: z.string().describe('The chatbot’s contextually relevant response.'),
});
export type MultimodalHelpOutput = z.infer<typeof MultimodalHelpOutputSchema>;

// Exported function to get multimodal help.
export async function getMultimodalHelp(input: MultimodalHelpInput): Promise<MultimodalHelpOutput> {
  return multimodalHelpFlow(input);
}

// Define the prompt to generate contextually relevant responses.
const multimodalHelpPrompt = ai.definePrompt({
  name: 'multimodalHelpPrompt',
  input: {schema: MultimodalHelpInputSchema},
  output: {schema: MultimodalHelpOutputSchema},
  prompt: `You are a chatbot assistant for the {{{department}}} department.
  Use your knowledge, the department context, and the provided image (if any) to answer the following question:
  {{{question}}}
  {{#if photoDataUri}}
  Image context:
  {{media url=photoDataUri}}
  {{/if}}
  `,
});

// Define the Genkit flow for multimodal help.
const multimodalHelpFlow = ai.defineFlow(
  {
    name: 'multimodalHelpFlow',
    inputSchema: MultimodalHelpInputSchema,
    outputSchema: MultimodalHelpOutputSchema,
  },
  async input => {
    const {output} = await multimodalHelpPrompt(input);
    return output!;
  }
);
