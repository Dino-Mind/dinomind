import {
  loadHistoryData,
  loadSessionData,
  saveInterestData,
  saveSummaryData,
} from "./dataUtils";
import { promptConfig } from "../utils/config/promptConfig";
import { handleError } from "./error/errorHandler";
import { Message } from "../types/messageType";

export const summarizeText = async (text: string): Promise<string> => {
  if (typeof window === "undefined" || !window.ai || !window.ai.summarizer) {
    console.warn(
      "[summarizeText] - AI Summarization not available. Using fallback."
    );
    return "Summarization is currently unavailable. Please try again later.";
  }

  try {
    const session = await window.ai.summarizer.create({
      type: "key-points",
      format: "plain-text",
      length: "short",
    });

    const summary = await session.summarize(text);
    session.destroy();
    return summary;
  } catch (error) {
    console.error("[summarizeText] - Error during summarization:", error);
    return "An error occurred while summarizing the text.";
  }
};

export const processSummarizedHistory = async (): Promise<void> => {
  loadHistoryData(async (historyItems) => {
    if (!historyItems.length) {
      console.warn("No history items available to summarize.");
      return;
    }

    try {
      const { promptTemplate } = promptConfig["summarize"];

      const summaryPromises = historyItems.map(async (item) => {
        try {
          const prompt = promptTemplate.replace(
            "{userMessage}",
            `Title: ${item.title || "No Title"}, Visit Count: ${
              item.visitCount
            }`
          );

          const summary = await summarizeText(prompt);

          console.log("from_GEMINI_SUMMARIZE:", summary);

          return summary;
        } catch (error) {
          return handleError(error, {
            logToConsole: true,
            fallbackValue: "Error summarizing text.",
          });
        }
      });

      const summaries = await Promise.all(summaryPromises);
      const successfulSummaries = summaries.filter(
        (summary) => summary !== null
      ) as string[];
      saveInterestData(successfulSummaries);
    } catch (error) {
      console.error(
        "Unexpected error during the summarization process:",
        error
      );
    }
  });
};

// process for maintaining the chat continuity
export const processChatHistory = async (): Promise<string | null> => {
  const sessionData = await new Promise<Message[]>((resolve) =>
    loadSessionData((data) => resolve(data || []))
  );

  if (!sessionData.length) {
    console.log(
      "[summarizeChatHistory3] - No sessionData found. Skipping summarization."
    );
    return null;
  }

  const formattedSessionData = sessionData
    .map((entry) => `${entry.sender}: ${entry.text}`)
    .join(" ");

  console.log(
    "[summarizeChatHistory3] - Formatted session data:",
    formattedSessionData
  );

  const { promptTemplate } = promptConfig.summarize;
  const prompt = promptTemplate.replace("{sessionData}", formattedSessionData);

  console.log("[summarizeChatHistory3] - Generated prompt for AI:", prompt);

  try {
    const summary = await summarizeText(prompt);
    console.log("[summarizeChatHistory3] - AI-generated summary:", summary);

    saveSummaryData(summary);
    console.log("[summarizeChatHistory3] - Summary saved:", summary);

    return summary;
  } catch (error) {
    console.error("[summarizeChatHistory3] - Error summarizing text:", error);
    return "Unable to summarize at this time.";
  }
};
