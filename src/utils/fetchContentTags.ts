import { fetchGeminiNanoResponse } from "./fetchGeminiResponse";
import { Message } from "../types/messageType";
import { saveContentData } from "./chatDataUtils";

export const fetchContentTags = async (
  inputMessage: string,
  setLoading: (loading: boolean) => void,
  setAiLoading: (loading: boolean) => void,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setContentResponse: React.Dispatch<React.SetStateAction<string | null>>
): Promise<void> => {
  // Set AI loading state to true at start of fetch
  setAiLoading(true);

  try {
    // Fetch the AI response for content tags
    const aiResponse = await fetchGeminiNanoResponse(
      inputMessage,
      "content",
      setAiLoading,
      setMessages
    );

    // Update the content response state with the new AI response
    setContentResponse(aiResponse);

    // Save the content data to storage
    saveContentData(aiResponse);
  } catch (error) {
    console.error("Error fetching content tags:", error);
  } finally {
    // Reset loading states after fetch completes
    setAiLoading(false);
    setLoading(false);
  }
};
