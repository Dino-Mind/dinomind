import { HistoryItem } from "../types/historyItemType";

export const fetchHistoryItems = async (): Promise<{
  historyItems: HistoryItem[];
  summaryText: string;
}> => {
  return new Promise((resolve) => {
    const urlToHistoryItem: { [url: string]: HistoryItem } = {};
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const oneWeekAgo = Date.now() - millisecondsPerWeek;

    chrome.history.search(
      { text: "", startTime: oneWeekAgo, maxResults: 50 },
      (historyItems) => {
        historyItems.forEach((item) => {
          urlToHistoryItem[item.url!] = {
            id: item.id,
            url: item.url!,
            title: item.title,
            lastVisitTime: item.lastVisitTime,
            visitCount: item.visitCount,
          };
        });

        const sortedHistoryItems = Object.values(urlToHistoryItem)
          .sort((a, b) => (b.visitCount ?? 0) - (a.visitCount ?? 0))
          .slice(0, 5);

        const summaryText = sortedHistoryItems.length
          ? sortedHistoryItems
              .map(
                (item) =>
                  `Title: ${item.title || "No Title"}, Visit Count: ${
                    item.visitCount
                  }`
              )
              .join(" | ")
          : "No recent history items found.";

        resolve({ historyItems: sortedHistoryItems, summaryText });
      }
    );
  });
};
