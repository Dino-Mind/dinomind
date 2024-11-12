import React, { useEffect, useState } from "react";

import { loadInterestData, clearInterestData } from "../../utils/chatDataUtils";
import { fetchHistoryItems } from "../../utils/fetchHistoryItems";
import { useGeminiNanoResponse } from "../../utils/fetchGeminiResponse";
import { HistoryItem } from "../../types/historyItemType";
import { Message, Sender } from "../../types/messageType";
import "./style.scss";

const Interest: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [summaryText, setSummaryText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasLocalData, setHasLocalData] = useState<boolean>(false);
  const { fetchGeminiNanoResponse, loading, messages: fetchedMessages} = useGeminiNanoResponse();

  useEffect(() => {
    // TODO - lets move this into hooks and make it return as initial state
    loadInterestData((savedTags) => {
      if (savedTags) {
        setMessages([{ sender: Sender.AI, text: savedTags }]);
        setHasLocalData(true);
      } else {
        setHasLocalData(false);
      }
    });
  }, []);

  useEffect(() => {
    if(fetchedMessages.length) {
      setMessages((prevMessages) => [...prevMessages, ...fetchedMessages]);
    }
  },[fetchedMessages]);

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

  const handleRefresh = () => {
    if (!summaryText || summaryText === "No recent history items found.") {
      setMessages([
        {
          sender: Sender.SYSTEM,
          text: "No recent URLs available to generate tags.",
        },
      ]);
      return;
    }

    clearInterestData(() => {
      setMessages([]);
      setHasLocalData(false);
      fetchGeminiNanoResponse(summaryText, "interest");
    });
  };

  const handleDelete = () => {
    clearInterestData(() => {
      setMessages([]);
      setSummaryText("");
      setHistoryItems([]);
      setHasLocalData(false);
    });
  };

  return (
    <div className="interest-container">
      <div className="interest-summary">
        <div className="summary-title">Content tags from ai:</div>
        <div className="summary-text">
          {loading
            ? "Loading tags..."
            : messages[messages.length - 1]?.text || "No tags available."}
        </div>
        <div className="summary-buttons">
          <button className="summary-button" onClick={handleRefresh}>
            Refresh Tags
          </button>
          <button className="summary-button" onClick={handleDelete}>
            Delete Tags
          </button>
        </div>
      </div>

      <div className="history-summary">
        <div className="history-summary-title">history text to ai:</div>
        <div className="history-summary-text">{summaryText}</div>
        <div className="history-summary-buttons">
          <button className="history-summary-button" onClick={handleRefresh}>
            Refresh Tags
          </button>
          <button className="history-summary-button" onClick={handleDelete}>
            Delete Tags
          </button>
        </div>
      </div>

      <div className="history-item-container">
        {historyItems?.map((item) => (
          <div key={item.id}>
            <div className="history-item-cred">
              <a
                className="item-title"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.title || "No Title"}
              </a>
              <span className="item-url">{item.url}</span>
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
    </div>
  );
};

export default Interest;
