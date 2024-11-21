import React from "react";
import { useFetchedHistory } from "../../hooks/useFetchedHistory";
import "./style.scss";

const Interest: React.FC = () => {
  const {
    historyItems,
    summaries,
    loadingHistory,
    loadingSummarization,
    handleSummarizeHistory,
    clearInterestData,
  } = useFetchedHistory();

  return (
    <div className="interest-container">
      <div className="history-items">
        <h3>History Items TEST</h3>
        {loadingHistory ? (
          <p>Loading history...</p>
        ) : (
          historyItems.map((item) => (
            <div key={item.id} className="history-item">
              <p>{item.title || "No Title"}</p>
              <p>Visit Count: {item.visitCount}</p>
            </div>
          ))
        )}
      </div>

      <div className="interest-summary">
        <h3>Interest Data</h3>
        {loadingSummarization ? (
          <p>Summarizing...</p>
        ) : summaries ? (
          Object.entries(summaries).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))
        ) : (
          <p>No interest data available.</p>
        )}
        <div className="summary-buttons">
          <button
            onClick={handleSummarizeHistory}
            disabled={loadingSummarization}
          >
            {loadingSummarization ? "Summarizing..." : "Summarize History"}
          </button>
          <button onClick={clearInterestData}>Clear Interest Data</button>
        </div>
      </div>
    </div>
  );
};

export default Interest;
