import { loadHistoryData, saveInterestData } from "./dataUtils";

/**
 * Summarizes the given text using the AI Summarizer.
 * @param text - The text to summarize.
 * @returns A promise resolving to the summary.
 */
export const summarizeText = async (text: string): Promise<string> => {
  if (!window.ai || !window.ai.summarizer) {
    throw new Error("AI Summarization is not supported in this browser.");
  }

  const session = await window.ai.summarizer.create({
    type: "key-points",
    format: "plain-text",
    length: "short",
  });

  const summary = await session.summarize(text);
  session.destroy();
  return summary;
};

/**
 * Processes history data by summarizing each history item
 * and saving the summaries to interest data.
 */

export const processSummarizedHistory = async (): Promise<void> => {
  loadHistoryData(async (historyItems) => {
    if (!historyItems.length) {
      console.warn("No history items available to summarize.");
      return;
    }

    for (const item of historyItems) {
      try {
        const summary = await summarizeText(
          `Title: ${item.title || "No Title"}, Visit Count: ${item.visitCount}`
        );
        console.log("from_GEMINI_SUMMARIZE:", summary);
        saveInterestData(summary);
      } catch (error) {
        console.error(
          `Error summarizing history item "${item.title || "No Title"}":`,
          error
        );
      }
    }
  });
};
