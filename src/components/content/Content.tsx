import React, { useState, useEffect } from "react";
import { useFetchContentTags } from "../../utils/fetchContentTags";
import "./style.scss";

const Content: React.FC = () => {
  const [contentResponse, setContentResponse] = useState<string | null>(null);

  const {
    fetchAndSetContentTags,
    loading,
    contentResponse: fetchedContentResponse,
    interestTags,
  } = useFetchContentTags();

  useEffect(() => {
    if (fetchedContentResponse) {
      setContentResponse(fetchedContentResponse);
    }
  }, [fetchedContentResponse]);

  const generateContentTags = () => {
    const inputMessage = interestTags || "Generate content tags";
    fetchAndSetContentTags(inputMessage);
  };

  return (
    <div className="content-container">
      <div className="content-box-title">Content Tags from AI</div>

      {loading ? (
        <div className="loading">Loading content tags...</div>
      ) : interestTags ? (
        <div className="content-boxes">{interestTags}</div>
      ) : (
        <div>No content tags available.</div>
      )}

      <button
        onClick={generateContentTags}
        disabled={loading}
        className="generate-content-button"
      >
        {loading ? "Generating..." : "Generate Content Tags"}
      </button>

      <div className="content-box-response">
        {loading ? "Loading content response from AI..." : contentResponse}
      </div>
    </div>
  );
};

export default Content;
