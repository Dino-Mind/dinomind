import { useState, useEffect } from "react";
import { fetchHistoryItems } from "./fetchHistoryItems";
import {
  loadInterestData,
  saveInterestData,
  clearInterestData,
} from "./dataUtils";
import { useGeminiNanoResponse } from "./fetchGeminiResponse";
import { HistoryItem } from "../types/historyItemType";

export const useFetchInterestTags = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [interestTags, setInterestTags] = useState<string | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingSummarization, setLoadingSummarization] = useState(false);

  const { fetchGeminiNanoResponse } = useGeminiNanoResponse();

  // Step 1: Load History Items
  useEffect(() => {
    const fetchAndSetHistory = async () => {
      setLoadingHistory(true);
      const { historyItems } = await fetchHistoryItems();
      setHistoryItems(historyItems);
      setLoadingHistory(false);
    };
    fetchAndSetHistory();
  }, []);

  // Step 2: Load Saved Interest Data
  useEffect(() => {
    loadInterestData(setInterestTags);
  }, []);

  // Step 3: Summarize History Items and Save Interest Tags
  const refreshInterestTags = async () => {
    setLoadingSummarization(true);
    clearInterestData(() => setInterestTags(null));

    const summaries = await Promise.all(
      historyItems.map((item) =>
        fetchGeminiNanoResponse(
          `Title: ${item.title || "No Title"}, Visit Count: ${item.visitCount}`,
          "interest"
        )
      )
    );
    const tags = summaries.join(", ");
    saveInterestData(tags); // Save interest tags in local storage
    setInterestTags(tags);
    setLoadingSummarization(false);
  };

  return {
    historyItems,
    interestTags,
    loadingHistory,
    loadingSummarization,
    refreshInterestTags,
  };
};

// import { useState, useEffect } from "react";
// import { fetchHistoryItems } from "./fetchHistoryItems";
// import { loadInterestData, clearInterestData } from "./dataUtils";
// import { useGeminiNanoResponse } from "./fetchGeminiResponse";
// import { HistoryItem } from "../types/historyItemType";
// import { Message, Sender } from "../types/messageType";

// export const useFetchInterestTags = () => {
//   const [interestTags, setInterestTags] = useState<string | null>(null);
//   const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
//   const [summaryText, setSummaryText] = useState<string>("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [hasLocalData, setHasLocalData] = useState<boolean>(false);

//   const {
//     fetchGeminiNanoResponse,
//     loading,
//     messages: fetchedMessages,
//   } = useGeminiNanoResponse();

//   useEffect(() => {
//     loadInterestData((savedTags) => {
//       if (savedTags) {
//         setInterestTags(savedTags);
//         setMessages([{ sender: Sender.AI, text: savedTags }]);
//         setHasLocalData(true);
//       }
//     });
//   }, []);

//   useEffect(() => {
//     if (!hasLocalData && !summaryText) {
//       getHistoryData();
//     }
//   }, [hasLocalData, summaryText]);

//   const getHistoryData = async () => {
//     const { historyItems, summaryText } = await fetchHistoryItems();
//     setHistoryItems(historyItems);
//     setSummaryText(summaryText);
//   };

//   useEffect(() => {
//     if (
//       summaryText &&
//       summaryText !== "No recent history items found." &&
//       !hasLocalData
//     ) {
//       fetchGeminiNanoResponse(summaryText, "interest");
//     }
//   }, [summaryText, hasLocalData]);

//   const refreshInterestTags = () => {
//     clearInterestData(() => {
//       setMessages([]);
//       setHasLocalData(false);
//       fetchGeminiNanoResponse(summaryText, "interest");
//     });
//   };

//   const deleteInterestTags = () => {
//     clearInterestData(() => {
//       setMessages([]);
//       setInterestTags(null);
//       setSummaryText("");
//       setHistoryItems([]);
//       setHasLocalData(false);
//     });
//   };

//   useEffect(() => {
//     if (fetchedMessages.length) {
//       setMessages((prevMessages) => [...prevMessages, ...fetchedMessages]);
//     }
//   }, [fetchedMessages]);

//   return {
//     loading,
//     interestTags,
//     historyItems,
//     summaryText,
//     messages,
//     refreshInterestTags,
//     deleteInterestTags,
//   };
// };
