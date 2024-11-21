import { loadHistoryData, saveInterestData } from "./dataUtils";
import { promptConfig } from "../utils/config/promptConfig";

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
          console.log(
            `Error summarizing history item "${item.title || "No Title"}":`,
            error
          );
          return null;
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
