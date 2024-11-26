/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from "../types/componentType";
import { promptConfig } from "./config/promptConfig";
import { handleError } from "./error/errorHandler";

let session: any | null = null;
let clonedSession: any | null = null;

const controller = new AbortController();

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

    // Create a session if it doesn't exist
    if (!session) {
      session = await window.ai.languageModel.create({
        temperature: 0.7,
        topK: 3,
      });
    }

    // Clone the session to preserve context for this specific interaction
    if (!clonedSession) {
      // clonedSession = await session.clone();
      clonedSession = await session.clone({ signal: controller.signal });
    }

    // const stream = await clonedSession.promptStreaming(prompt);
    const stream = await clonedSession.promptStreaming(prompt, {
      signal: controller.signal,
    });

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

// Optional utility to reset the session if needed
export const resetSession = async () => {
  if (session) {
    session.destroy();
    session = null;
    clonedSession = null;
    console.log("Session reset successfully.");
  }
};

export const abortCurrentPrompt = () => {
  controller.abort();
  console.log("Current prompt aborted.");
};
