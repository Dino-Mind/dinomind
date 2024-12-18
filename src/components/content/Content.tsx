import React, { useEffect, useRef } from "react";

import { Button } from "../ui/button";
import { useFetchedHistory } from "@/hooks/useFetchedHistory";
import { CardsContainer } from "../ui/CardsContainer";
import "./style.scss";
import Dino from "../dino/Dino";
import { saveTagStatData } from "@/utils/dataUtils";
import defaultTags from "./TagStat.json";
import { useContentFromTags } from "@/hooks/useContentFromTags";
import { TagChips } from "./TagChips";
import { Content as ContentType } from "@/hooks/useContentResponse";

const Content: React.FC = () => {
  const [visibleRecommendations, setVisibleRecommendations] = React.useState<
    ContentType[]
  >([]);

  const loadingRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (recommendedContent.length > 0) {
      setVisibleRecommendations(recommendedContent);
    } else {
      setVisibleRecommendations([]);
    }
  }, [recommendedContent]);

  const handleSelect = (tags: string[]) => {
    console.log("tags", tags);
    if (tags.length === 0) {
      setVisibleRecommendations(recommendedContent);
      return;
    }
    const filtered = recommendedContent.filter((content) =>
      tags.includes(content.tag)
    );
    setVisibleRecommendations(filtered);
  };

  const scrollToBottom = () => {
    if (loadingRef.current) {
      loadingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (recoLoading) {
      console.log("recoLoad changed :", recoLoading);
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [recoLoading]);

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
          <div className="flex flex-col items-center justify-center w-full py-8">
            <div className="text-xl text-white font-bold mt-4">
              Recommendations ✨
            </div>
            {recommendedContent.length === 0 && (
              <p className="text-center text-sm text-gray-500 w-full my-4">
                We may generate some content randomly as well 🎉
              </p>
            )}
            {recommendedContent.length > 0 && (
              <>
                <div className="text-center w-full text-sm text-gray-500 mt-4">
                  Here are the content generated from your likes. You can like
                  and dislike and sync with again to get more relevant content.
                </div>
                <div>
                  <TagChips onTagSelect={handleSelect} />
                </div>
              </>
            )}
          </div>
          <CardsContainer content={visibleRecommendations} />
          <div className="temporary-buttons p-4">
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
        <div
          ref={loadingRef}
          className="mt-5 flex flex-col items-center justify-center text-center"
        >
          <Dino />
          <p className="text-sm text-gray-500 w-[75%] m-4 text-left">
            We are also generating some content based on our recommender system.
            It will take some time. Please be patient. 😊
          </p>
        </div>
      )}
    </div>
  );
};

export default Content;
