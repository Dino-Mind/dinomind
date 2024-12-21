import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  loadContentData,
  saveContentData,
  saveTagStats,
} from "../utils/dataUtils";
import { fetchContentResponse } from "../utils/fetchContentResponse";
import { handleError } from "../utils/error/errorHandler";
import { setIsContentChanged } from "@/redux/slices/uiSlice";
import { generateId } from "@/utils/generateId";
import { Message } from "@/types/messageType";

export type Content = {
  id: string;
  content: string;
  tag: string;
  summary?: string;
  recommended?: boolean;
  content_chat?: Message[];
};

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
          tag: tag?.split("\n")?.[0] || tag,
          summary: "",
        });
      }

      // Add extra interest stats

      const tagStats = interestData.map((tag) => {
        return {
          tag: tag.split("\n")[0],
          like: 0,
          dislike: 0,
          ctr: 0,
          totalCount: 0,
        };
      });

      saveTagStats(tagStats);
      saveContentData(contentArray);

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
