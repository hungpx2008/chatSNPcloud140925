"use server";

import { getContextualHelp } from "@/ai/flows/contextual-help";

export async function getHelp(
  question: string,
  department: string
): Promise<string> {
  if (!question || !department) {
    return "I can't help without a question and a department.";
  }

  try {
    const result = await getContextualHelp({ question, department });
    return result.response;
  } catch (error) {
    console.error("Error getting contextual help:", error);
    return "Sorry, I encountered an error while trying to help. Please try again.";
  }
}
