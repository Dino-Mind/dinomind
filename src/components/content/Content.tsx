import React from "react";

import { Button } from "../ui/button";
import { useFetchedHistory } from "@/hooks/useFetchedHistory";
import { CardsContainer } from "../ui/CardsContainer";
import "./style.scss";

const Content: React.FC = () => {

  const { loading, syncAndGenerateContent, clearInterestData } =
    useFetchedHistory();

  return (
    <div className="content-container">
      <div className="temporary-div">
        <div className="temporary-buttons">
            <Button
              className="sync-button"
              onClick={syncAndGenerateContent}
              disabled={loading}
            >
              {loading ? "Syncing..." : "Sync with History"}
            </Button>

          <div className="temporary-dev-buttons">
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
