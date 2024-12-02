import React from "react";

import { Button } from "../ui/button";
import { useFetchedHistory } from "@/hooks/useFetchedHistory";
import { CardsContainer } from "../ui/CardsContainer";
import "./style.scss";
import Dino from "../dino/Dino";

const Content: React.FC = () => {
  const { loading, generatedContent, syncAndGenerateContent } =
    useFetchedHistory();

  return (
    <div className="content-container">
      <div className="temporary-div">
        {!generatedContent.length && (
          <>
            <div className="temporary-buttons">
              <Button
                className="sync-button"
                onClick={syncAndGenerateContent}
                disabled={loading}
              >
                {loading ? "Syncing..." : "Sync with History"}
              </Button>
            </div>

            <p className="text-xs text-gray-500 w-[75%] m-4 text-center">
              Hello 👋 We will sync your history and generate some content for
              you. All the content will be stored in your browser. We won't
              store any of your data on our servers. Because we don't have one.
              😅
            </p>
          </>
        )}
        {loading && <Dino />}
      </div>

      <CardsContainer />
    </div>
  );
};

export default Content;
