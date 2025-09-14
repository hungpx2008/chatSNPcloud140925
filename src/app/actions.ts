'use server';

import { generateContent } from 'ai';
import {
  MultimodalHelpInput,
  getMultimodalHelp,
} from '@/ai/flows/multimodal-help';
import { geminiModel } from '@/ai/localClient';

// This is the primary endpoint for the chat UI.
export async function getHelp(
  question: string,
  department: string,
  photoDataUri?: string
) {
  // A real app would have more robust rate limiting.

  try {
    const input: MultimodalHelpInput = {
      question,
      department,
      photoDataUri,
    };
    const { response } = await getMultimodalHelp(input);
    return response;
  } catch (e: any) {
    // Log the full error to the server console for better debugging
    console.error('[getHelp action failed]', e);
    // A real app would have more robust error handling and user-facing messages.
    return `Sorry, I encountered an error while trying to help. Please try again. (Error: ${e.message})`;
  }
}
