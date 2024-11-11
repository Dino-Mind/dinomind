/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import "./style.scss";
import {
  loadInterestData,
  loadContentData,
  saveContentData,
} from "../../utils/chatDataUtils";
import { fetchGeminiNanoResponse } from "../../utils/fetchGeminiResponse";
import { Message } from "../../types/messageType";

const Content: React.FC = () => {
  const [contentTags, setContentTags] = useState<string | null>(null);
  const [contentResponse, setContentResponse] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);

    loadInterestData((savedTags) => {
      setContentTags(savedTags || null);
      setLoading(false);
    });

    loadContentData((savedContent) => {
      setContentResponse(savedContent || null);
    });
  }, []);

  const generateContentTags = async () => {
    const inputMessage = contentTags || "Generate content tags";
    setAiLoading(true);

    const aiResponse = await fetchGeminiNanoResponse(
      inputMessage,
      "content",
      setAiLoading,
      (newMessages) => {
        setMessages(newMessages);
      }
    );

    setContentResponse(aiResponse);
    saveContentData(aiResponse);
  };

  return (
    <div className="content-container">
      <div className="content-box-title">Content Tags from AI</div>

      {loading ? (
        <div className="loading">Loading content tags...</div>
      ) : contentTags ? (
        <div className="content-boxes">{contentTags}</div>
      ) : (
        <div>No content tags available.</div>
      )}

      <button
        onClick={generateContentTags}
        disabled={aiLoading}
        className="generate-content-button"
      >
        {aiLoading ? "Generating..." : "Generate Content Tags"}
      </button>

      <div className="content-box-response">
        {aiLoading ? "Loading content response from AI..." : contentResponse}
      </div>
    </div>
  );
};

export default Content;
