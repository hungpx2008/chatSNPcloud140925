'use server';

import { z } from 'zod';
import { geminiModel } from '@/ai/localClient';
import { extractTextFromFile } from '@/services/file-parser';

// Regex updated to correctly capture the base64 data part.
const dataUriRegex = /^data:(.+?);base64,(.+)$/;

const MultimodalHelpInputSchema = z.object({
  question: z.string().min(1).describe('The user’s question.'),
  department: z.string().min(1).describe('The department selected by the user.'),
  photoDataUri: z
    .string()
    .regex(dataUriRegex, 'photoDataUri must be a valid base64 data URI')
    .optional()
    .describe(
      "Optional photo/audio/document as data URI: 'data:<mimetype>;base64,<encoded>'"
    ),
});
export type MultimodalHelpInput = z.infer<typeof MultimodalHelpInputSchema>;

const MultimodalHelpOutputSchema = z.object({
  response: z.string().describe('The chatbot’s contextually relevant response.'),
});
export type MultimodalHelpOutput = z.infer<typeof MultimodalHelpOutputSchema>;

const MAX_FILECONTENT_CHARS = 16_000; // Reduced from 100_000
function clamp(s?: string, max = MAX_FILECONTENT_CHARS) {
  if (!s) return s;
  return s.length > max ? s.slice(0, max) + '\n\n[...truncated…]' : s;
}

export async function getMultimodalHelp(
  rawInput: MultimodalHelpInput
): Promise<MultimodalHelpOutput> {
  const input = MultimodalHelpInputSchema.parse(rawInput);

  let mode: 'document' | 'image' | 'audio' | 'none' | 'unknown' = 'none';
  let fileContent: string | undefined;
  let dataUri = input.photoDataUri;

  if (dataUri) {
    try {
      const parsed = await extractTextFromFile(dataUri);
      if (parsed?.type === 'document') {
        mode = 'document';
        fileContent = clamp(parsed.content || undefined);
        dataUri = undefined; // Unset dataUri so we don't send it to the model
      } else if (parsed?.type === 'image') {
        mode = 'image';
      } else if (parsed?.type === 'audio') {
        mode = 'audio';
      } else {
        mode = 'unknown';
      }
    } catch (e) {
      console.error('Could not parse file; fallback to raw media if possible.', e);
      mode = 'unknown';
    }
  }

  const systemPrompt =
    "You are a helpful assistant for the " + input.department + " department.\n" +
    "Your goal is to answer user questions accurately and naturally.\n\n" +
    "**RULES:**\n" +
    "1.  **Language:** You MUST detect the user's language and reply ONLY in that same language.\n" +
    "2.  **Tone:** Be friendly and natural. Do not say you are an AI.\n" +
    "3.  **Formatting:**\n" +
    "    -   Use clear and simple language.\n" +
    "    -   Use Markdown for basic styling like bold text, italics, and bulleted lists (`*` or `-`).\n" +
    "    -   **If a table is required, you MUST format it using valid HTML table syntax** (with <table>, <thead>, <tbody>, <tr>, <th>, and <td> tags). Ensure the HTML is well-formed and complete. This is the only supported method for creating tables.\n\n" +
    "Use your knowledge, the department context, and any provided document/media to answer the user's question.";

  if (mode === 'document' || !dataUri) {
    const userText =
      `Question:\n${input.question}\n` +
      (fileContent
        ? `\nThe user provided a document. Treat it as the PRIMARY source of truth:\n---\n${fileContent}\n---\n`
        : '');
    const prompt = `${systemPrompt}\n\n${userText}`;
    const resp = await geminiModel.generateContent(prompt);
    const text = resp.response.text();
    return MultimodalHelpOutputSchema.parse({ response: text });
  }

  const textPart = `${systemPrompt}\n\nQuestion: ${input.question}`;
  const contentParts: any[] = [textPart];

  const match = dataUri.match(dataUriRegex);
  if (match) {
    const [_, mimeType, base64] = match;
    if (mode === 'image' && mimeType && base64) {
      contentParts.push({ inlineData: { mimeType, data: base64 } });
    } else if (mode === 'audio') {
      contentParts.push({
        text:
          'Attached audio as data URI (this model may not process audio directly in chat). ' +
          `Preview (base64 prefix): ${dataUri!.slice(0, 64)}...`,
      });
    } else {
      contentParts.push({
        text: `Attached media (unknown type). Prefix: ${dataUri!.slice(0, 64)}...`,
      });
    }
  }

  const resp = await geminiModel.generateContent(contentParts);
  const text = resp.response.text();
  return MultimodalHelpOutputSchema.parse({ response: text });
}
