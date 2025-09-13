import OpenAI from 'openai';

const LOCAL_LLM_BASE_URL = "http://127.0.0.1:1234/v1";
export const LOCAL_LLM_MODEL = "google/gemma-3n-e4b";

export const localOpenAI = new OpenAI({
  apiKey: 'not-needed', // API key is not needed for local LLM
  baseURL: LOCAL_LLM_BASE_URL,
});
