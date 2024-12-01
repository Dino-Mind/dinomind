/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from "../types/componentType";
import { Message } from "../types/messageType";
import { promptConfig } from "./config/promptConfig";
import {
  loadSessionData,
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

  const { promptTemplate, continuedPromptTemplate } = promptConfig[component];

  let prompt: string;
  const isChatbox = component === "chatbox";

  try {
    if (!window.ai || !window.ai.languageModel) {
      return handleError("Gemini Nano is not available in this browser.", {
        fallbackValue: "Error: AI service unavailable.",
      });
    }

    if (isChatbox) {
      const sessionData = await new Promise<Message[]>((resolve) =>
        loadSessionData((sessionData) => {
          resolve(sessionData || []);
        })
      );

      if (!sessionData.length) {
        prompt = promptTemplate.replace("{userMessage}", userMessage);
      } else {
        const savedSummary = await new Promise<string>((resolve) =>
          loadSummaryData((summary) => {
            resolve(summary || "");
          })
        );

        prompt =
          continuedPromptTemplate
            ?.replace("{summaryData}", savedSummary)
            .replace("{userMessage}", userMessage) ||
          promptTemplate.replace("{userMessage}", userMessage);

        removeLocalStorageData("sessionData", () =>
          console.log("[fetchGeminiResponse] - Cleared sessionData")
        );
        removeLocalStorageData("chatSummary", () =>
          console.log("[fetchGeminiResponse] - Cleared chatSummary")
        );
      }
    } else {
      prompt = promptTemplate.replace("{userMessage}", userMessage);
      console.log(
        "[fetchGeminiResponse] - Using non-chatbox component promptTemplate:",
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
