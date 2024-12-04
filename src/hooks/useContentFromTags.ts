import { useEffect, useState } from "react";
import {
  loadContentData,
  loadTagStatData,
  removeLocalStorageData,
  saveContentData,
} from "../utils/dataUtils";
import { handleError } from "../utils/error/errorHandler";
import { Content } from "./useContentResponse";
import { fetchContentResponse } from "@/utils/fetchContentResponse";
import { generateId } from "@/utils/generateId";

export const useContentFromTags = () => {
  const [loading, setLoading] = useState(false);
  const [recommendedContent, setRecommendedContent] = useState<Content[]>([]);


  useEffect(() => {
    loadContentData((content: Content[]) => {
      const recommendedContent = content.filter((item) => item.recommended);
      if (recommendedContent.length) {
        setLoading(false);
        setRecommendedContent(recommendedContent);
        console.log("Recommended Content", recommendedContent);
      }
    });
  }, []);


  const syncAndGenerateContentFromTags = () => {
    setLoading(true);
    const contentArray: Content[] = [];
    try {
      loadTagStatData(async (tagData) => {
        const interestData = tagData.map((tag) => tag.tag).splice(0, 5);
        for (const tag of interestData) {
          const response = await fetchContentResponse(tag, "content");
          contentArray.push({
            id: generateId(),
            content: response,
            tag: tag?.split("\n")?.[0] || tag,
            summary: "",
            recommended: true,
          });
        }
        loadContentData((content: Content[]) => {
          contentArray.push(...content);
          saveContentData(contentArray);
          setRecommendedContent(contentArray);
          setLoading(false);
        });
      });
    } catch (error) {
      handleError(error, {
        logToConsole: true,
      });
      setLoading(false);
    } 
  };

  const clearInterestData = () => {
    removeLocalStorageData("interestData", () => {});
  };

  return {
    recommendedContent,
    loading,
    syncAndGenerateContentFromTags,
    clearInterestData,
  };
};

// const interestDataMapped = (interestData as string[]).reduce((acc, item, index) => {
//   acc[`Item ${index + 1}`] = item;
//   return acc;
// }, {} as { [key: string]: string });
// setMappedInterestData(interestDataMapped);
