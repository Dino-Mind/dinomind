/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from "../types/componentType";
import { Message } from "../types/messageType";
import { promptConfig } from "./config/promptConfig";
import {
  loadChatData,
  loadSummaryData,
  removeLocalStorageData,
} from "./dataUtils";
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

  const { promptTemplate, continuedPromptTemplate, defaultPromptTemplate } =
    promptConfig[component];

  try {
    if (!window.ai || !window.ai.languageModel) {
      return handleError("Gemini Nano is not available in this browser.", {
        fallbackValue: "Error: AI service unavailable.",
      });
    }

    let prompt: string;

    if (component === "chatbox") {
      // Check for savedChatHistory to determine if the side panel was reopened
      const savedChatHistory = await new Promise<Message[]>((resolve) =>
        loadChatData((chatHistory) => resolve(chatHistory || []))
      );

      if (savedChatHistory.length > 0) {
        const savedSummary = await new Promise<string>((resolve) =>
          loadSummaryData((summary) => resolve(summary || ""))
        );

        prompt =
          continuedPromptTemplate
            ?.replace("{summaryData}", savedSummary)
            .replace("{userMessage}", userMessage) ||
          promptTemplate.replace("{userMessage}", userMessage);

        removeLocalStorageData("sessionData", () => {});
        removeLocalStorageData("chatSummary", () => {});
      } else {
        // No savedChatHistory; check for initial or regular interaction
        const chatHistory = await new Promise<Message[]>((resolve) =>
          loadChatData((chatHistory) => resolve(chatHistory || []))
        );

        if (chatHistory.length <= 0) {
          // Regular interaction; use defaultPromptTemplate
          prompt = defaultPromptTemplate
            ? defaultPromptTemplate.replace("{userMessage}", userMessage)
            : promptTemplate.replace("{userMessage}", userMessage);
        } else {
          // Initial interaction; use promptTemplate
          prompt = promptTemplate.replace("{userMessage}", userMessage);
        }
      }
    } else {
      // Other components use their specific promptTemplate
      prompt = promptTemplate.replace("{userMessage}", userMessage);
    }

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
