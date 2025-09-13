'use server';

import { z } from 'zod';
import { localOpenAI, LOCAL_LLM_MODEL } from '@/ai/localClient';

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
    "    **IMPORTANT**: Do NOT use Markdown tables. For example, do NOT use | Header | or |--|. \n" +
    "    **If a table is required, you MUST format it using valid HTML table syntax** (with <table>, <thead>, <tbody>, <tr>, <th>, and <td> tags). Ensure the HTML is well-formed and complete.\n\n" +
    "Use your knowledge and any provided context to answer the user's question.";

  const userText = `Question: ${input.question}`;

  const resp = await localOpenAI.chat.completions.create({
    model: LOCAL_LLM_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userText },
    ],
  });

  const text =
    resp.choices?.[0]?.message?.content?.toString() ??
    '[No content returned from local model]';

  return ContextualHelpOutputSchema.parse({ response: text });
}