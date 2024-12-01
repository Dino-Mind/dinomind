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
      saveInterestData(successfulSummaries as string[]);

      return successfulSummaries
      // saveInterestData(successfulSummaries);
    } catch (error) {
      console.error(
        "Unexpected error during the summarization process:",
        error
      );
      return [];
    }
  }

  return new Promise((resolve, reject) => {
    handleHistoryData(historyItems)
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
};

// process for maintaining the chat continuity
// export const processChatHistory = async (): Promise<string | null | undefined> => {
//   const sessionData = await new Promise<Message[]>((resolve) =>
//     loadSessionData((data) => resolve(data || []))
//   );

//   if (!sessionData.length) {
//     console.log(
//       "[fetchGeminiSummarize-processChatHistory] - No sessionData found. Skipping summarization."
//     );
//     return null;
//   }

//   const formattedSessionData = sessionData
//     .map((entry) => `${entry.sender}: ${entry.text}`)
//     .join(" ");

//   console.log(
//     "[fetchGeminiSummarize-processChatHistory] - Formatted session data:",
//     formattedSessionData
//   );

//   // Check Summarizer API availability
//   const canSummarize = await self.ai.summarizer.capabilities();
//   if (!canSummarize || canSummarize.available === "no") {
//     console.log("[processChatHistory] - Summarizer API is not available.");
//     return "Summarization is currently unavailable.";
//   }

//   if (canSummarize.available === "readily") {
//     const { promptTemplate } = promptConfig.summarize;
//     const prompt = promptTemplate.replace(
//       "{sessionData}",
//       formattedSessionData
//     );

//     console.log(
//       "[fetchGeminiSummarize-processChatHistory] - Generated prompt for AI:",
//       prompt
//     );

//     try {
//       const summary = await summarizeText(prompt);
//       console.log(
//         "[fetchGeminiSummarize-processChatHistory] - AI-generated summary:",
//         summary
//       );

//       saveSummaryData(summary);
//       console.log(
//         "[fetchGeminiSummarize-processChatHistory] - Summary saved:",
//         summary
//       );

//       return summary;
//     } catch (error) {
//       console.error(
//         "[fetchGeminiSummarize-processChatHistory] - Error summarizing text:",
//         error
//       );
//       return "Unable to summarize at this time.";
//     }
//   }
// };
