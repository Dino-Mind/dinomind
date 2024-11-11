/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";

import { fetchContentTags } from "../../utils/fetchContentTags";
import { loadContentAndInterestData } from "../../utils/contentDataUtils";
import { Message } from "../../types/messageType";
import "./style.scss";

const Content: React.FC = () => {
  const [contentTags, setContentTags] = useState<string | null>(null);
  const [contentResponse, setContentResponse] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);

  useEffect(() => {
    loadContentAndInterestData(setContentTags, setContentResponse, setLoading);
  }, []);

  const generateContentTags = () => {
    const inputMessage = contentTags || "Generate content tags";

    fetchContentTags(
      inputMessage,
      setLoading,
      setAiLoading,
      setMessages,
      setContentResponse
    );
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
