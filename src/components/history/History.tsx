import React, { useEffect, useState } from "react";

type HistoryItem = {
  id: string;
  url: string;
  title?: string;
  lastVisitTime?: number;
  visitCount?: number;
};

const History: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const urlToCount: { [url: string]: number } = {};
    let numRequestsOutstanding = 0;
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const millisecondsPerMonth = millisecondsPerWeek * 4;
    const oneWeekAgo = new Date().getTime() - millisecondsPerWeek;
    const oneMonthAgo = new Date().getTime() - millisecondsPerMonth;

    const processVisits = (
      url: string,
      visitItems: chrome.history.VisitItem[]
    ) => {
      visitItems.forEach((visit) => {
        if (visit.transition === "typed") {
          urlToCount[url] = (urlToCount[url] || 0) + 1;
        }
      });

      if (!--numRequestsOutstanding) {
        const sortedUrls = Object.keys(urlToCount).sort(
          (a, b) => urlToCount[b] - urlToCount[a]
        );
        const topUrls = sortedUrls
          .slice(0, 10)
          .map((url) => ({ id: url, url }));
        setHistoryItems(topUrls);
      }
    };

    // Start fetching history items
    chrome.history.search(
      { text: "", startTime: oneWeekAgo, maxResults: 20 },
      (historyItems) => {
        historyItems.forEach((historyItem) => {
          numRequestsOutstanding++;
          chrome.history.getVisits({ url: historyItem.url! }, (visitItems) =>
            processVisits(historyItem.url!, visitItems)
          );
        });
        if (!numRequestsOutstanding) {
          setHistoryItems([]);
        }
      }
    );
  }, []);

  return (
    <div className="history-box">
      <h3>Recently Typed URLs</h3>
      <ul>
        {historyItems.map((item) => (
          <li key={item.id}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
