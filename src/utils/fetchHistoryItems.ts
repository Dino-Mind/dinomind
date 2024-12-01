import { saveHistoryData } from "./dataUtils";
import { HistoryItem } from "../types/historyItemType";

export const fetchHistoryItems = async (): Promise<HistoryItem[]> => {
  return new Promise((resolve) => {
    const urlToHistoryItem: { [url: string]: HistoryItem } = {};
    const millisecondsPerMonth = 1000 * 60 * 60 * 24 * 7 * 4;
    const oneMonthAgo = Date.now() - millisecondsPerMonth;

    chrome.history.search(
      { text: "", startTime: oneMonthAgo, maxResults: 1000 },
      async (historyItems) => {
        historyItems.forEach((item) => {
          const simplifiedUrl = new URL(item.url!).hostname;

          urlToHistoryItem[item.url!] = {
            // id: item.id,
            // url: item.url!,
            simpleUrl: simplifiedUrl,
            title: item.title,
            // lastVisitTime: item.lastVisitTime,
            visitCount: item.visitCount,
          };
        });

        const sortedHistoryItems = Object.values(urlToHistoryItem)
          .sort((a, b) => (b.visitCount ?? 0) - (a.visitCount ?? 0))
          .slice(0, 5);

        saveHistoryData(sortedHistoryItems);

        resolve(sortedHistoryItems);
      }
    );
  });
};
