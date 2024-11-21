import { useState, useEffect } from "react";
import { fetchHistoryItems } from "../utils/fetchHistoryItems";
import { processSummarizedHistory } from "../utils/fetchGeminiSummarize";
import { loadInterestData, removeLocalStorageData } from "../utils/dataUtils";
import { HistoryItem } from "../types/historyItemType";
import { handleError } from "../utils/error/errorHandler";

export const useFetchedHistory = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [summaries, setSummaries] = useState<{ [key: string]: string } | null>(
    null
  );
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingSummarization, setLoadingSummarization] = useState(false);

  const fetchAndSaveHistory = async () => {
    setLoadingHistory(true);
    try {
      await fetchHistoryItems();
      chrome.storage.local.get("historyData", (result) => {
        setHistoryItems(result.historyData || []);
      });
    } catch (error) {
      handleError(error, {
        logToConsole: true,
        fallbackValue: [],
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleSummarizeHistory = async () => {
    setLoadingSummarization(true);
    try {
      await processSummarizedHistory();

      loadInterestData((data) => {
        if (data) {
          const transformedSummaries = data.reduce((acc, item, index) => {
            acc[`Item ${index + 1}`] = item;
            return acc;
          }, {} as { [key: string]: string });
          setSummaries(transformedSummaries);
        } else {
          setSummaries(null);
        }
      });
    } catch (error) {
      handleError(error, {
        logToConsole: true,
      });
    } finally {
      setLoadingSummarization(false);
    }
  };

  const clearInterestData = () => {
    removeLocalStorageData("interestData", () => setSummaries(null));
  };

  useEffect(() => {
    fetchAndSaveHistory();
  }, []);

  return {
    historyItems,
    summaries,
    loadingHistory,
    loadingSummarization,
    fetchAndSaveHistory,
    handleSummarizeHistory,
    clearInterestData,
  };
};
