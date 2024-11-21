import { ComponentType } from "../types/componentType";
import { promptConfig } from "./config/promptConfig";
import { handleError } from "./error/errorHandler";

export const fetchGeminiResponse = async (
  userMessage: string,
  component: ComponentType
): Promise<string> => {
  if (!userMessage.trim()) {
    return handleError("No data available to generate content data.", {
      fallbackValue: "Error: No input provided.",
    });
  }

  const { promptTemplate } = promptConfig[component];

  try {
    if (!window.ai || !window.ai.languageModel) {
      return handleError("Gemini Nano is not available in this browser.", {
        fallbackValue: "Error: AI service unavailable.",
      });
    }

    const prompt = promptTemplate.replace("{userMessage}", userMessage);
    const session = await window.ai.languageModel.create({
      temperature: 0.7,
      topK: 3,
    });

    const stream = await session.promptStreaming(prompt);

    let responseText = "";

    for await (const chunk of stream) {
      responseText = chunk.trim();
    }

    return responseText;
  } catch (error) {
    return handleError(error, {
      logToConsole: true,
      fallbackValue: "Error: Could not reach the AI service.",
    });
  }
};
