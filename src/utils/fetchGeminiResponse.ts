export const fetchGeminiNanoResponse = async (
  userMessage: string,
  promptTemplate: string,
  setLoading: (loading: boolean) => void,
  setMessages: React.Dispatch<
    React.SetStateAction<{ sender: string; text: string }[]>
  >
) => {
  setLoading(true);

  try {
    if (!window.ai || !window.ai.languageModel) {
      console.log("Gemini Nano is not available in this browser.");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "ai",
          text: "Error: Gemini Nano is not available in this browser.",
        },
      ]);
      return;
    }

    //generate prompt with injected userMessage
    const prompt = promptTemplate.replace("{userMessage}", userMessage);

    const session = await window.ai.languageModel.create({
      temperature: 0.7, // Control response creativity
      topK: 3, // Limit word choice
    });

    const stream = await session.promptStreaming(prompt);

    let responseText = "";
    for await (const chunk of stream) {
      responseText = chunk.trim();
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "ai", text: responseText },
    ]);
  } catch (error) {
    console.error("Error fetching AI response:", error);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "ai", text: "Error: Could not reach the AI service." },
    ]);
  } finally {
    setLoading(false);
  }
};
