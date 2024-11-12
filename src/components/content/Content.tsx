/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";

import { useFetchContentTags } from "../../utils/fetchContentTags";
import { loadContentAndInterestData } from "../../utils/contentDataUtils";
import { Message } from "../../types/messageType";
import "./style.scss";

const Content: React.FC = () => {
  const [contentTags, setContentTags] = useState<string | null>(null);
  const [contentResponse, setContentResponse] = useState<string | null>(null);
  const [loadingFromLocalStorage, setLoadingFromLocalStorage] = useState<boolean>(false);
  const { 
    fetchContentTags, loading, 
    contentResponse: fetchedContentResponse, 
    messages: fetchedContentTags
  } = useFetchContentTags();

  useEffect(() => {
    // TODO - lets move this into hooks and make it return as initial state
    loadContentAndInterestData(setContentTags, setContentResponse, setLoadingFromLocalStorage);
  }, []);

  useEffect(() => {
    if (fetchedContentTags.length) {
      // TODO - check types here possibly this is not working as expected
      setContentTags(fetchedContentTags[0].text);
    }
  }, [fetchedContentTags]);

  useEffect(() => {
    if (fetchedContentResponse) {
      setContentResponse(fetchedContentResponse);
    }
  }, [fetchedContentResponse]);

  const generateContentTags = () => {
    const inputMessage = contentTags || "Generate content tags";
    fetchContentTags(inputMessage);
  };

  return (
    <div className="content-container">
      <div className="content-box-title">Content Tags from AI</div>

      {loadingFromLocalStorage ? (
        <div className="loading">Loading content tags...</div>
      ) : contentTags ? (
        <div className="content-boxes">{contentTags}</div>
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
