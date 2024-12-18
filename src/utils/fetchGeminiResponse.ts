/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType } from "../types/componentType";
import { promptConfig } from "./config/promptConfig";

import { handleError } from "./error/errorHandler";

let session: any | null = null;
let clonedSession: any | null = null;

const controller = new AbortController();

export const fetchGeminiResponse = async (
  userMessage: string,
  component: ComponentType,
  summary?: string
): Promise<string> => {
  if (!userMessage.trim()) {
    return handleError("No data available to generate content data.", {
      fallbackValue: "Error: No input provided.",
    });
  }

  const { promptTemplate } = promptConfig[component];
  let prompt: string;
  const isChatbox = component === "chatbox";
  const isContentChat = component === "contentChat";

  try {
    if (isChatbox) {
      prompt = promptTemplate.replace("{userMessage}", userMessage);
    } else if (isContentChat) {
      prompt =
        promptTemplate
          ?.replace("{summary}", summary || "No summary provided")
          .replace("{userMessage}", userMessage) || "";
      console.log("PROMPT :", prompt, "Summary__:", summary);
    } else {
      prompt = promptTemplate?.replace("{userMessage}", userMessage) || "";
    }
    /*Because of isFirstContentmessageProcessed;
    other components isint engaging first message prompt (contentPromptTemplate)
    we should tie it to content id, somehow..
    */
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
