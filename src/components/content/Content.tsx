import React from "react";
import "./style.scss";
import { useGenerateContent } from "@/hooks/useGenerateContent";
import { Button } from "../ui/button";

const Content: React.FC = () => {
  const { generatedContent, interestData, loading, fetchGenerateContent } =
    useGenerateContent();

  return (
    <div className="content-container">

      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <div className="interest-data">
        <h3>Interest Data</h3>
        <p>{interestData || "No interest data available."}</p>
      </div>

      <Button
        onClick={fetchGenerateContent}
        disabled={loading}
        className="generate-content-button"
      >
        {loading ? "Generating..." : "Generate Content Tags"}
      </Button>

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
