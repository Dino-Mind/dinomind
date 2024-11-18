import { useState, useEffect } from "react";
import { useGeminiNanoResponse } from "./fetchGeminiResponse";
import { loadInterestData, saveContentData } from "./dataUtils";

export const useFetchContentTags = () => {
  const [contentResponse, setContentResponse] = useState<string | null>(null);
  const [interestTags, setInterestTags] = useState<string | null>(null);
  const { fetchGeminiNanoResponse, loading, messages } =
    useGeminiNanoResponse();

  useEffect(() => {
    loadInterestData((tags) => {
      setInterestTags(tags);
    });
  }, []);

  const fetchAndSetContentTags = async (
    inputMessage: string
  ): Promise<void> => {
    try {
      const aiResponse = await fetchGeminiNanoResponse(inputMessage, "content");
      setContentResponse(aiResponse);
      saveContentData(aiResponse);
    } catch (error) {
      console.error("Error fetching content tags:", error);
    }
  };

  return {
    loading,
    messages,
    contentResponse,
    interestTags,
    fetchAndSetContentTags,
  };
};
