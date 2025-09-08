"use server";

import { getContextualHelp } from "@/ai/flows/contextual-help";
import { getMultimodalHelp } from "@/ai/flows/multimodal-help";

export async function getHelp(
  question: string,
  department: string,
  photoDataUri?: string,
): Promise<string> {
  if (!question || !department) {
    return "I can't help without a question and a department.";
  }

  try {
    if (photoDataUri) {
        const result = await getMultimodalHelp({ question, department, photoDataUri });
        return result.response;
    }
    const result = await getContextualHelp({ question, department });
    return result.response;
  } catch (error) {
    console.error("Error getting contextual help:", error);
    return "Sorry, I encountered an error while trying to help. Please try again.";
  }
}
