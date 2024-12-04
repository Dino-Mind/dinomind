import React, { useEffect } from "react";

import { Button } from "../ui/button";
import { useFetchedHistory } from "@/hooks/useFetchedHistory";
import { CardsContainer } from "../ui/CardsContainer";
import "./style.scss";
import Dino from "../dino/Dino";
import { saveTagStatData } from "@/utils/dataUtils";
import defaultTags from "./TagStat.json";
import { useContentFromTags } from "@/hooks/useContentFromTags";

const Content: React.FC = () => {
  const { loading, generatedContent, syncAndGenerateContent } =
    useFetchedHistory();

  const {
    loading: recoLoading,
    recommendedContent,
    syncAndGenerateContentFromTags,
  } = useContentFromTags();

  useEffect(() => {
    saveTagStatData(defaultTags);
  }, []);

  // useEffect(() => {
  //   if (generatedContent.length > 0) {
  //     syncAndGenerateContentFromTags();
  //   //   const callSync = async () => {
  //   //     await
  //   //   }
  //   //   callSync();
  //   // }
  //   }
  // }, [generatedContent]);

  return (
    <div className="content-container">
      <div className="temporary-div">
        {!generatedContent.length && (
          <>
            <div className="temporary-buttons">
              <Button
                variant={"secondary"}
                onClick={syncAndGenerateContent}
                disabled={loading}
              >
                {loading ? "Syncing..." : "Sync with History"}
              </Button>
            </div>

            <p className="text-sm text-gray-500 w-[75%] m-4 text-center">
              Hello 👋 We will sync your history and generate some content for
              you. All the content will be stored in your browser. We won't
              store any of your data on our servers. Because we don't have one.
              😅
            </p>
          </>
        )}
        {loading && <Dino />}
      </div>
      {generatedContent.length > 0 && (
        <>
          <div className="text-left pl-8">
            <div className="text-xl text-white font-bold mt-4">
              Based on your web history ⭐️
            </div>
            <div className="text-sm text-gray-500 mt-4">
              Here are the content generated from your history. You can interact
              with them, ask questions, or just chat with them. If you want to
              generate more content, you can sync with your history again.
            </div>
          </div>
          <CardsContainer
            content={generatedContent.filter((content) => !content.recommended)}
          />
        </>
      )}

      {generatedContent.length > 0 && (
        <>
          <div className="text-left pl-8 w-full">
            <div className="text-xl text-white font-bold mt-4">
              Recommendations ✨
            </div>
            {recommendedContent.length === 0 && (
              <p className="text-sm text-gray-500 w-[75%] my-4 text-left">
                We may generate some content randomly as well 🎉
              </p>
            )}
            {recommendedContent.length > 0 && (
              <div className="text-sm text-gray-500 mt-4">
                Here are the content generated from your likes. You can like and
                dislike and sync with again to get more relevant content.
              </div>
            )}
          </div>
          <CardsContainer
            content={recommendedContent.filter(
              (content) => content.recommended
            )}
          />
          <div className="temporary-buttons">
            <Button
              variant={"secondary"}
              onClick={syncAndGenerateContentFromTags}
              disabled={recoLoading}
            >
              {recoLoading ? "Syncing..." : "Load more content"}
            </Button>
          </div>
        </>
      )}

      {recoLoading && (
        <>
          <Dino />
          <p className="text-sm text-gray-500 w-[75%] m-4 text-center">
            We are also generating some content based on our recommender system.
            It will take some time. Please be patient. 😊
          </p>
        </>
      )}
    </div>
  );
};

export default Content;
