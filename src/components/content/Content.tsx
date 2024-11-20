import React, { useEffect, useState } from "react";
import { loadInterestData, saveContentData } from "../../utils/dataUtils";
import { useGeminiNanoResponse } from "../../utils/fetchGeminiResponse";
import "./style.scss";

const Content: React.FC = () => {
  const [interestData, setInterestData] = useState<string | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const { fetchGeminiNanoResponse, loading } = useGeminiNanoResponse();

  // Step 1: Load Interest Data 
   useEffect(() => {
    loadInterestData(setInterestData);
  }, []);

  // Step 2: Generate Content Tags and Save
  const generateContent = async () => {
    if (!interestData) return;

    const responses = await Promise.all(
      interestData
        .split(", ")
        .map((tag) => fetchGeminiNanoResponse(tag, "content"))
    );
    setGeneratedContent(responses);

    // Save generated content to local storage
    responses.forEach((content, index) => {
      saveContentData(`content_${index}`, content);
    });
  };

  return (
    <div className="content-container">
      <div className="interest-data">
        <h3>Interest Data</h3>
        <p>{interestData || "No interest data available."}</p>
      </div>

      {/* Generate Content Tags */}
      <button
        onClick={generateContent}
        disabled={loading}
        className="generate-content-button"
      >
        {loading ? "Generating..." : "Generate Content Tags"}
      </button>

      {/* Generated Content */}
      <div className="generated-content">
        <h3>Generated Content</h3>
        {generatedContent.length > 0 ? (
          generatedContent.map((content, index) => <p key={index}>{content}</p>)
        ) : (
          <p>No content generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default Content;

// import React, { useState, useEffect } from "react";
// import { loadContentData } from "../../utils/dataUtils";
// import { useGeminiNanoResponse } from "../../utils/fetchGeminiResponse";
// import "./style.scss";

// const Content: React.FC = () => {
//   const [contentResponses, setContentResponses] = useState<string[]>([]);
//   const [storedData, setStoredData] = useState<{ [key: string]: string }>({});
//   const { fetchGeminiNanoResponse, loading } = useGeminiNanoResponse();

//   useEffect(() => {
//     const fetchStoredData = async () => {
//       const data = await loadContentData(); // Load data from storage
//       setStoredData(data);
//     };
//     fetchStoredData();
//   }, []);

//   const generateContentTags = async () => {
//     const responses = await Promise.all(
//       Object.entries(storedData).map(([, summary]) =>
//         fetchGeminiNanoResponse(summary, "content")
//       )
//     );
//     setContentResponses(responses);
//   };

//   return (
//     <div className="content-container">
//       <div className="content-box-title">Content Tags from AI</div>

//       {loading ? (
//         <div className="loading">Loading content tags...</div>
//       ) : contentResponses.length > 0 ? (
//         <div className="content-boxes">
//           {contentResponses.map((response, index) => (
//             <div key={index}>{response}</div>
//           ))}
//         </div>
//       ) : (
//         <div>No content tags available.</div>
//       )}

//       <button
//         onClick={generateContentTags}
//         disabled={loading}
//         className="generate-content-button"
//       >
//         {loading ? "Generating..." : "Generate Content Tags"}
//       </button>
//     </div>
//   );
// };

// export default Content;
