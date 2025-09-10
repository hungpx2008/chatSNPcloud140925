'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing contextual help
 *               with multimodal input (text, images, and documents).
 *
 * - `getMultimodalHelp`: A function that takes a user's question, department, and an optional file
 *                         and returns a contextually relevant response.
 * - `MultimodalHelpInput`: The input type for the `getMultimodalHelp` function.
 * - `MultimodalHelpOutput`: The output type for the `getMultimodalHelp` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {extractTextFromFile} from '@/services/file-parser';

// Define the input schema for the multimodal help flow.
const MultimodalHelpInputSchema = z.object({
  question: z.string().describe('The user’s question.'),
  department: z.string().describe('The department selected by the user.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo or document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
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
  input: {schema: z.object({
    question: z.string(),
    department: z.string(),
    photoDataUri: z.string().optional(),
    fileContent: z.string().optional(),
  })},
  output: {schema: MultimodalHelpOutputSchema},
  prompt: `You are a chatbot assistant for the {{{department}}} department.
  Use your knowledge, the department context, and the provided image or file content (if any) to answer the following question.
  Please format your response using Markdown. Use line breaks, bullet points, or numbered lists to make the answer clear and easy to read.
  If a table is required, ensure it is formatted using valid Markdown table syntax. Do not include any conversational text before or after the table itself.

  Question:
  {{{question}}}
  {{#if photoDataUri}}
  Image context:
  {{media url=photoDataUri}}
  {{/if}}
  {{#if fileContent}}
  The user has provided a file with the following content, use it as the primary source of information to answer the question:
  ---
  {{{fileContent}}}
  ---
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
    let fileContent: string | undefined = undefined;
    let photoDataUri = input.photoDataUri;

    if (input.photoDataUri) {
        try {
            const extracted = await extractTextFromFile(input.photoDataUri);
            if(extracted.type === 'document') {
                fileContent = extracted.content || undefined; // Convert null to undefined
                // It's a document, so don't pass it to the model as media
                photoDataUri = undefined;
            }
        } catch (error) {
            console.error("Could not parse file content, proceeding without it.", error);
            // If parsing fails, we can just treat it as a potential image or ignore it.
        }
    }

    const {output} = await multimodalHelpPrompt({
        ...input,
        photoDataUri: photoDataUri,
        fileContent: fileContent,
    });
    return output!;
  }
);
