import { ComponentType } from "../types/componentType";
import { promptConfig } from "./config/promptConfig";

export const fetchGeminiResponse = async (
  userMessage: string,
  component: ComponentType
): Promise<string> => {
  if (!userMessage.trim()) {
    return "No data available to generate content data.";
  }

  const { promptTemplate } = promptConfig[component];

  try {
    if (!window.ai || !window.ai.languageModel) {
      return "Error: Gemini Nano is not available in this browser.";
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
    console.error("Error fetching AI response:", error);
    return "Error: Could not reach the AI service.";
  }
};
