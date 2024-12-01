import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  loadContentData,
  saveContentData,
} from "../utils/dataUtils";
import { fetchContentResponse } from "../utils/fetchContentResponse";
import { handleError } from "../utils/error/errorHandler";
import { setIsContentChanged } from "@/redux/slices/uiSlice";
import { generateId } from "@/utils/generateId";

export type Content = {
  id: string;
  content: string;
  tag: string;
  summary?: string;
}

export const useContentResponse = () => {
  const dispatch = useDispatch();
  const [generatedContent, setGeneratedContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);



  useEffect(() => {
    loadContentData((content: Content[]) => {
      if (content.length > 0) {
        setGeneratedContent(content);
      } else {
        console.warn("Content data is empty.");
      }
    });
  }, []);

  const fetchGenerateContent = async (interestData: string[]) => {
    if (!interestData) {
      console.log("No interest data available.");
      return;
    }

    setLoading(true);
    const contentArray: Content[] = [];

    try {
      for (const tag of interestData) {
        const response = await fetchContentResponse(tag, "content");
        contentArray.push({
          id: generateId(),
          content: response,
          tag: tag,
          summary: "This content is about Arsenal from Premier League and their invincible season.",
        });
      }

      saveContentData(contentArray);
      console.log(">>>>>>>>>>FINAL Contents_ARRAY :", contentArray);

      setGeneratedContent(contentArray);

      dispatch(setIsContentChanged(true));
    } catch (error) {
      handleError(error, { logToConsole: true });
    } finally {
      setLoading(false);
    }
  };

  return {
    generatedContent,
    loading,
    fetchGenerateContent,
    setGeneratedContent,
  };
};
