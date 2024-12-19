import { saveInterestData } from "./dataUtils";
import { promptConfig } from "../utils/config/promptConfig";
import { handleError } from "./error/errorHandler";
import { HistoryItem } from "@/types/historyItemType";

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

export const createInterestData = async (historyItems: HistoryItem[]) => {
  const handleHistoryData = async (historyItems: HistoryItem[]) => {
    if (!historyItems.length) {
      console.warn("No history items available to summarize.");
      return;
    }

    try {
      const { promptTemplate } = promptConfig["interest"];

      const summaryPromises = historyItems.map(async (item) => {
        try {
          const prompt = promptTemplate.replace(
            "{userMessage}",
            `url title: ${item.title || "No url Title"}, url: ${item.simpleUrl}`
          );
          console.log(prompt);
          const summary = await summarizeText(prompt);
          console.log(summary);

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

      const tagsFromSummaries = await Promise.all(
        successfulSummaries.map(async (interestItem) => {
          try {
            const { promptTemplate } = promptConfig["tag"];

            const prompt = promptTemplate.replace(
              "{userMessage}",
              `${interestItem}`
            );

            const tag = await summarizeText(prompt);

            console.log("tags from interestData:", tag);
            return tag;
          } catch (error) {
            return handleError(error, {
              logToConsole: true,
              fallbackValue: "Error summarizing text.",
            });
          }
        })
      );

      saveInterestData(tagsFromSummaries as string[]);

      return tagsFromSummaries;
    } catch (error) {
      console.error(
        "Unexpected error during the summarization process:",
        error
      );
      return [];
    }
  };

  return new Promise((resolve, reject) => {
    handleHistoryData(historyItems)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};
