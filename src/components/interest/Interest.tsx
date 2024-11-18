import React from "react";

import "./style.scss";
import { useFetchInterestTags } from "../../utils/fetchInterestTags";

const Interest: React.FC = () => {
  const {
    loading,
    historyItems,
    summaryText,
    messages,
    refreshInterestTags,
    deleteInterestTags,
  } = useFetchInterestTags();

  return (
    <div className="interest-container">
      <div className="interest-summary">
        <div className="summary-title">Content Tags from AI:</div>
        <div className="summary-text">
          {loading
            ? "Loading tags..."
            : messages[messages.length - 1]?.text || "No tags available."}
        </div>
        <div className="summary-buttons">
          <button className="summary-button" onClick={refreshInterestTags}>
            Refresh Tags
          </button>
          <button className="summary-button" onClick={deleteInterestTags}>
            Delete Tags
          </button>
        </div>
      </div>

      <div className="history-summary">
        <div className="history-summary-title">History Text to AI:</div>
        <div className="history-summary-text">{summaryText}</div>
      </div>

      <div className="history-item-container">
        {historyItems?.map((item) => (
          <div key={item.id} className="history-item">
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
                <strong>Visit Count:</strong> <span>{item.visitCount}</span>
              </div>
              <div className="detail-item">
                <strong>Last Visit:</strong>{" "}
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
