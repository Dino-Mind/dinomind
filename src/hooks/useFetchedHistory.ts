import { useState } from "react";
import { fetchHistoryItems } from "../utils/fetchHistoryItems";
import { createInterestData } from "../utils/fetchGeminiSummarize";
import { removeLocalStorageData } from "../utils/dataUtils";
import { handleError } from "../utils/error/errorHandler";
import { useContentResponse } from "./useContentResponse";

export const useFetchedHistory = () => {
  const [loading, setLoading] = useState(false);
  const { fetchGenerateContent, generatedContent } = useContentResponse();


  const syncAndGenerateContent = async () => {
    setLoading(true);
    try {
      const historyItems = await fetchHistoryItems();
      const interestData = await createInterestData(historyItems);
      await fetchGenerateContent(interestData as string[]);
    } catch (error) {
      handleError(error, {
        logToConsole: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearInterestData = () => {
    removeLocalStorageData("interestData", () => {});
  };

  return {
    generatedContent,
    loading,
    syncAndGenerateContent,
    clearInterestData,
  };
};

// const interestDataMapped = (interestData as string[]).reduce((acc, item, index) => {
//   acc[`Item ${index + 1}`] = item;
//   return acc;
// }, {} as { [key: string]: string });
// setMappedInterestData(interestDataMapped);
