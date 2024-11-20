import React, { useState, useEffect } from "react";
import "./style.scss";
import { processSummarizedHistory } from "../../utils/fetchGeminiSummarize";
import { loadInterestData, clearInterestData } from "../../utils/dataUtils";
import { fetchHistoryItems } from "../../utils/fetchHistoryItems";

const Interest: React.FC = () => {
  const [localSummaries, setLocalSummaries] = useState<{
    [key: string]: string;
  } | null>(null);
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(true);
  const [loadingSummarization, setLoadingSummarization] =
    useState<boolean>(false);

  useEffect(() => {
    // Step 1: Fetch History Data
    const fetchAndSaveHistory = async () => {
      setLoadingHistory(true);
      await fetchHistoryItems(); // Fetches and saves history data to local storage
      setLoadingHistory(false);

      // Load the saved history data
      chrome.storage.local.get("historyData", (result) => {
        setHistoryItems(result.historyData || []);
      });
    };

    fetchAndSaveHistory();
  }, []);

  const handleSummarizeHistory = async () => {
    // Step 2: Process Summarized History
    setLoadingSummarization(true);
    await processSummarizedHistory(); // Summarizes and saves interest data
    setLoadingSummarization(false);

    // Load the saved interest data
    loadInterestData((data) => setLocalSummaries(JSON.parse(data || "{}")));
  };

  const handleClearInterestData = () => {
    // Clear interest data
    clearInterestData(() => setLocalSummaries(null));
  };

  return (
    <div className="interest-container">
      {/* History Items */}
      <div className="history-items">
        <h3>History Items</h3>
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

      {/* Interest Tags */}
      <div className="interest-summary">
        <h3>Interest Tags</h3>
        {loadingSummarization ? (
          <p>Summarizing...</p>
        ) : localSummaries ? (
          Object.entries(localSummaries).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))
        ) : (
          <p>No interest tags available.</p>
        )}
        <div className="summary-buttons">
          <button
            onClick={handleSummarizeHistory}
            disabled={loadingSummarization}
          >
            {loadingSummarization ? "Summarizing..." : "Summarize History"}
          </button>
          <button onClick={handleClearInterestData}>Clear Interest Data</button>
        </div>
      </div>
    </div>
  );
};

export default Interest;

// import React from "react";
// import { useFetchInterestTags } from "../../utils/fetchInterestTags";
// import "./style.scss";

// const Interest: React.FC = () => {
//   const {
//     historyItems,
//     interestTags,
//     loadingHistory,
//     loadingSummarization,
//     refreshInterestTags,
//   } = useFetchInterestTags();

//   return (
//     <div className="interest-container">
//       {/* History Items */}
//       <div className="history-items">
//         <h3>History Items</h3>
//         {loadingHistory ? (
//           <p>Loading history...</p>
//         ) : (
//           historyItems.map((item) => (
//             <div key={item.id} className="history-item">
//               <p>{item.title || "No Title"}</p>
//               <p>Visit Count: {item.visitCount}</p>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Interest Tags */}
//       <div className="interest-tags">
//         <h3>Interest Tags</h3>
//         {loadingSummarization ? (
//           <p>Summarizing...</p>
//         ) : interestTags ? (
//           <p>{interestTags}</p>
//         ) : (
//           <p>No interest tags available.</p>
//         )}
//         <button onClick={refreshInterestTags} disabled={loadingSummarization}>
//           {loadingSummarization ? "Refreshing..." : "Refresh Tags"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Interest;
