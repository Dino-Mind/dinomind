import { useGeminiNanoResponse } from "./fetchGeminiResponse";
import { saveContentData } from "./chatDataUtils";
import { useState } from "react";

export const useFetchContentTags = () => {
  const [contentResponse, setContentResponse] = useState<string | null>(null);
  const { fetchGeminiNanoResponse, loading, messages } = useGeminiNanoResponse();

  const fetchContentTags = async (inputMessage: string): Promise<void> => {
    try {
      const aiResponse = await fetchGeminiNanoResponse(
        inputMessage,
        "content",
      );

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
    fetchContentTags,
  };
};