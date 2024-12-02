/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from "../types/componentType";
import { promptConfig } from "./config/promptConfig";

import { handleError } from "./error/errorHandler";

let session: any | null = null;
let clonedSession: any | null = null;
let isFirstContentMessageProcessed = false;

const controller = new AbortController();

export const fetchGeminiResponse = async (
  userMessage: string,
  component: ComponentType,
  summary?: string,
  id?: string
): Promise<string> => {
  if (!userMessage.trim()) {
    return handleError("No data available to generate content data.", {
      fallbackValue: "Error: No input provided.",
    });
  }

  const { promptTemplate } = promptConfig[component];
  let prompt: string;
  const isChatbox = component === "chatbox";
  const isContent = component === "content";

  // Track if this is the first message in the content conversation
  const isFirstContentMessage = isContent && summary;

  try {
    if (!window.ai || !window.ai.languageModel) {
      return handleError("Gemini Nano is not available in this browser.", {
        fallbackValue: "Error: AI service unavailable.",
      });
    }

    if (isChatbox) {
      // Chatbox behavior: always use userMessage
      prompt = promptTemplate.replace("{userMessage}", userMessage);
      console.log(
        "[fetchGeminiResponse] - Using chatbox promptTemplate:",
        prompt
      );
    } else if (isContent) {
      if (!isFirstContentMessageProcessed) {
        // First message: include summary
        prompt = promptTemplate.replace(
          "{userMessage}",
          `${summary} - ${userMessage}`
        );
        console.log(
          `[fetchGeminiResponse] - Using content promptTemplate with summary (id: ${id}):`,
          prompt
        );
        isFirstContentMessageProcessed = true; // Mark the first message as processed
      } else {
        // Subsequent messages: use only userMessage
        prompt = promptTemplate.replace("{userMessage}", userMessage);
        console.log(
          `[fetchGeminiResponse] - Using content promptTemplate with userMessage only:`,
          prompt
        );
      }
    } else {
      // Default behavior for non-chatbox, non-content components
      prompt = promptTemplate.replace("{userMessage}", userMessage);
      console.log(
        "[fetchGeminiResponse] - Using default promptTemplate:",
        prompt
      );
    }

    if (!session) {
      session = await window.ai.languageModel.create({
        temperature: 0.7,
        topK: 3,
      });
    }

    if (!clonedSession) {
      clonedSession = await session.clone({ signal: controller.signal });
    }

    const stream = await clonedSession.promptStreaming(prompt, {
      signal: controller.signal,
    });

    let responseText = "";
    let previousChunk = "";

    for await (const chunk of stream) {
      const newChunk = chunk.startsWith(previousChunk)
        ? chunk.slice(previousChunk.length)
        : chunk;
      console.log("chunk:", newChunk);
      responseText += newChunk;
      previousChunk = chunk;
    }

    return responseText;
  } catch (error) {
    return handleError(error, {
      logToConsole: true,
      fallbackValue: "Error: Could not reach the AI service.",
    });
  }
};

export const resetSession = async () => {
  if (session) {
    session.destroy();
    session = null;
    clonedSession = null;
  }
};

export const abortCurrentPrompt = () => {
  controller.abort();
};
