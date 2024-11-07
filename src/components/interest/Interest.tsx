import React, { useEffect, useState } from "react";

import { fetchHistoryItems } from "../../utils/fetchHistoryItems";
import { fetchGeminiNanoResponse } from "../../utils/fetchGeminiResponse";
import { HistoryItem } from "../../types/historyItemType";
import "./style.scss";

interface Message {
  sender: string;
  text: string;
}

const Interest: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [summaryText, setSummaryText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getHistoryData = async () => {
      const { historyItems, summaryText } = await fetchHistoryItems();
      setHistoryItems(historyItems);
      setSummaryText(summaryText);
    };

    getHistoryData();
  }, []);

  useEffect(() => {
    if (summaryText) {
      const promptTemplate = `The following are URLs I've frequently visited in the past week: "{userMessage}". Based on this data, generate concise and relevant content tags that reflect my interests. write me only tags for this contents`;

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "user",
          text: promptTemplate.replace("{userMessage}", summaryText),
        },
      ]);

      console.log(
        "Prompt Template:",
        promptTemplate.replace("{userMessage}", summaryText)
      );

      fetchGeminiNanoResponse(
        summaryText,
        promptTemplate,
        setLoading,
        setMessages
      );
    }
  }, [summaryText]);

  return (
    <div className="interest-container">
      <div className="interest-summary-title">
        Your profile taste:
        <div className="interest-summary-text">
          {loading
            ? "Loading tags..."
            : messages[messages.length - 1]?.text ||
              summaryText ||
              "Loading..."}
        </div>
      </div>

      <div className="history-item-container">
        {historyItems.map((item) => (
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
    </div>
  );
};

export default Interest;
