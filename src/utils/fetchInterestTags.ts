import { useState, useEffect } from "react";
import { fetchHistoryItems } from "./fetchHistoryItems";
import { loadInterestData, clearInterestData } from "./dataUtils";
import { useGeminiNanoResponse } from "./fetchGeminiResponse";
import { HistoryItem } from "../types/historyItemType";
import { Message, Sender } from "../types/messageType";

export const useFetchInterestTags = () => {
  const [interestTags, setInterestTags] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [summaryText, setSummaryText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasLocalData, setHasLocalData] = useState<boolean>(false);

  const {
    fetchGeminiNanoResponse,
    loading,
    messages: fetchedMessages,
  } = useGeminiNanoResponse();

  useEffect(() => {
    loadInterestData((savedTags) => {
      if (savedTags) {
        setInterestTags(savedTags);
        setMessages([{ sender: Sender.AI, text: savedTags }]);
        setHasLocalData(true);
      }
    });
  }, []);

  useEffect(() => {
    if (!hasLocalData && !summaryText) {
      getHistoryData();
    }
  }, [hasLocalData, summaryText]);

  const getHistoryData = async () => {
    const { historyItems, summaryText } = await fetchHistoryItems();
    setHistoryItems(historyItems);
    setSummaryText(summaryText);
  };

  useEffect(() => {
    if (
      summaryText &&
      summaryText !== "No recent history items found." &&
      !hasLocalData
    ) {
      fetchGeminiNanoResponse(summaryText, "interest");
    }
  }, [summaryText, hasLocalData]);

  const refreshInterestTags = () => {
    clearInterestData(() => {
      setMessages([]);
      setHasLocalData(false);
      fetchGeminiNanoResponse(summaryText, "interest");
    });
  };

  const deleteInterestTags = () => {
    clearInterestData(() => {
      setMessages([]);
      setInterestTags(null);
      setSummaryText("");
      setHistoryItems([]);
      setHasLocalData(false);
    });
  };

  useEffect(() => {
    if (fetchedMessages.length) {
      setMessages((prevMessages) => [...prevMessages, ...fetchedMessages]);
    }
  }, [fetchedMessages]);

  return {
    loading,
    interestTags,
    historyItems,
    summaryText,
    messages,
    refreshInterestTags,
    deleteInterestTags,
  };
};
