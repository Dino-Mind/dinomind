/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from "../types/componentType";
import { promptConfig } from "../utils/config/promptConfig";
import { handleError } from "../utils/error/errorHandler";

let session: any = null;

export const fetchContentResponse = async (
  userMessage: string,
  component: ComponentType
): Promise<string> => {
  const { promptTemplate } = promptConfig[component];
  const prompt = promptTemplate.replace("{userMessage}", userMessage);

  try {
    console.log(
      "[fetchContentResponse] >>>>>>>>>>>>>>< Content creation started"
    );

    if (!window.ai || !window.ai.languageModel) {
      return handleError("Gemini Nano is not available in this browser.", {
        fallbackValue: "Error: AI service unavailable.",
      });
    }

    if (!session) {
      session = await window.ai.languageModel.create({
        temperature: 0.7,
        topK: 3,
      });
    }

    const stream = await session.promptStreaming(prompt);

    let responseText = "";

    for await (const chunk of stream) {
      responseText = chunk.trim();
    }

    console.log("[fetchContentResponse] PROMPT >>>>>>>>>>>>:", prompt);
    console.log("[fetchContentResponse] RESPONSE >>>>>>>>>>:", responseText);

    session = null;

    return responseText;
  } catch (error) {
    return handleError(error, {
      logToConsole: true,
      fallbackValue: "Error: Could not reach the AI service.",
    });
  }
};
