'use server';

import { z } from 'zod';
import { geminiModel } from '@/ai/localClient';

const ContextualHelpInputSchema = z.object({
  question: z.string().min(1).describe('The user’s question.'),
  department: z.string().min(1).describe('The department selected by the user.'),
});
export type ContextualHelpInput = z.infer<typeof ContextualHelpInputSchema>;

const ContextualHelpOutputSchema = z.object({
  response: z.string().describe('The chatbot’s contextually relevant response.'),
});
export type ContextualHelpOutput = z.infer<typeof ContextualHelpOutputSchema>;

export async function getContextualHelp(
  rawInput: ContextualHelpInput
): Promise<ContextualHelpOutput> {
  const input = ContextualHelpInputSchema.parse(rawInput);

  const systemPrompt =
    "You are a helpful assistant for the " + input.department + " department.\n" +
    "Your goal is to answer user questions accurately and naturally.\n\n" +
    "**RULES:**\n" +
    "1.  **Language:** You MUST detect the user's language and reply ONLY in that same language.\n" +
    "2.  **Tone:** Be friendly and natural. Do not say you are an AI.\n" +
    "3.  **Formatting:** When presenting information, use clear and simple language. Use Markdown for basic styling like bold text, italics, and bulleted lists (`*` or `-`).\n" +
    "    **If a table is required, you MUST format it using valid HTML table syntax** (with <table>, <thead>, <tbody>, <tr>, <th>, and <td> tags). Ensure the HTML is well-formed and complete. This is the only supported method for creating tables.\n\n" +
    "Use your knowledge and any provided context to answer the user's question.";

  const userText = `Question: ${input.question}`;

  const prompt = `${systemPrompt}\n\n${userText}`;

  const resp = await geminiModel.generateContent(prompt);

  const text = resp.response.text();

  return ContextualHelpOutputSchema.parse({ response: text });
}
