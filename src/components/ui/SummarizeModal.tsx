import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { Button } from "./button";
import { summarizeText } from "@/utils/fetchGeminiSummarize";

import "./style.scss";
import Dino from "../dino/Dino";

interface SummarizeModalProps {
  text: string;
  onClose: () => void;
}

const SummarizeModal: React.FC<SummarizeModalProps> = ({ text, onClose }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const result = await summarizeText(text);
        setSummary(result);
      } catch (error) {
        console.error("Error fetching summary:", error);
        setSummary("An error occurred while summarizing the text.");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <span
      id="summarize-modal-container"
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[9999]"
    >
      <div className="bg-white p-6 rounded-lg text-center m-10">
        {loading ? (
          <span className="mt-5 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-500  m-4 text-center">
              Summarizing... Please wait.
            </p>
            <Dino />
          </span>
        ) : (
          <div className="m-10 text-black">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        )}

        <div className="mt-6">
          <Button variant={"secondary"} onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </span>
  );
};

export default SummarizeModal;
