import { useEffect, useState } from "react";
import { loadInterestData, saveContentData } from "../utils/dataUtils";
import { useGeminiResponse } from "./useGeminiResponse";
import { handleError } from "../utils/error/errorHandler";

export const useGenerateContent = () => {
  const [interestData, setInterestData] = useState<string[] | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);

  const { fetchResponse, loading } = useGeminiResponse();

  useEffect(() => {
    loadInterestData(setInterestData);
  }, []);

  const fetchGenerateContent = async () => {
    if (!interestData) {
      return;
    }

    try {
      const responses = await Promise.all(
        interestData.map((tag) => fetchResponse(tag, "content"))
      );
      setGeneratedContent(responses);

      const contentArray: string[] = [];
      responses.forEach((content) => {
        contentArray.push(content);
      });

      saveContentData(contentArray);
    } catch (error) {
      handleError(error, { logToConsole: true });
    }
  };

  return {
    interestData,
    generatedContent,
    loading,
    fetchGenerateContent,
  };
};
