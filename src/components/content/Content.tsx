import React from "react";

import { Button } from "../ui/button";
import { useContentResponse } from "@/hooks/useContentResponse";
import { useFetchedHistory } from "@/hooks/useFetchedHistory";
import { CardsContainer } from "../ui/CardsContainer";
import "./style.scss";

const Content: React.FC = () => {
  const { interestData, loading, fetchGenerateContent } = useContentResponse();

  const { loadingSummarization, handleSummarizeHistory, clearInterestData } =
    useFetchedHistory();

  return (
    <div className="content-container">
      <div className="temporary-div">
        <div className="temporary-text">
          {interestData
            ? "Interest data exists"
            : "No interest data available."}
        </div>
        <div className="temporary-buttons">
          <div>
            <Button
              onClick={fetchGenerateContent}
              disabled={loading}
              className="sync-button"
            >
              {loading ? "Syncing..." : "Sync Interest Data"}
            </Button>
          </div>

          <div className="temporary-dev-buttons">
            <button
              className="sync-button"
              onClick={handleSummarizeHistory}
              disabled={loadingSummarization}
            >
              {loadingSummarization ? "Summarizing..." : "Summarize History"}
            </button>
            <button className="sync-button" onClick={clearInterestData}>
              Clear Interest Data
            </button>
          </div>
        </div>
      </div>

      <CardsContainer />
    </div>
  );
};

export default Content;
