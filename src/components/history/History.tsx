import React, { useEffect, useState } from "react";

import "./style.scss";

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
    const urlToHistoryItem: { [url: string]: HistoryItem } = {};
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    const oneWeekAgo = Date.now() - millisecondsPerWeek;

    // Fetch history items from the last week
    chrome.history.search(
      { text: "", startTime: oneWeekAgo, maxResults: 50 },
      (historyItems) => {
        historyItems.forEach((item) => {
          // Store each item with its details
          urlToHistoryItem[item.url!] = {
            id: item.id,
            url: item.url!,
            title: item.title,
            lastVisitTime: item.lastVisitTime,
            visitCount: item.visitCount,
          };
        });

        // Sort by visitCount and limit to top 10
        const sortedHistoryItems = Object.values(urlToHistoryItem)
          .sort((a, b) => (b.visitCount ?? 0) - (a.visitCount ?? 0))
          .slice(0, 10);

        setHistoryItems(sortedHistoryItems);
      }
    );
  }, []);

  return (
    <div className="history-box">
      <div className="history-box-title">
        Most Frequently Visited URLs (Last 7 Days)
      </div>
      {historyItems.map((item) => (
        <div key={item.id} className="history-item-container">
          <div className="history-item-cred">
            <a
              className="item-title"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.title || "No Title"}
            </a>
            <a className="item-url">{item.url}</a>
          </div>

          <div className="details">
            <div className="detail-item">
              <strong>Visit Count:</strong>
              <span>{item.visitCount}</span>
            </div>
            <div className="detail-item">
              <strong>Last Visit:</strong>
              <span>
                {item.lastVisitTime
                  ? new Date(item.lastVisitTime).toLocaleString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;
