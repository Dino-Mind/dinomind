import React, { useEffect, useState } from "react";

import ContentChat from "./ContentChat";

import { MeteorsFx } from "./fx/meteorsFx";
import { createSummaryForContent } from "@/utils/createSummaryForContent";
import Nugget from "./Nugget";

interface CardContentProps {
  isOpen: boolean;
  id: string;
  description: string;
  tag: string;
  summary?: string;
  onClose: () => void;
}

export const CardContent: React.FC<CardContentProps> = ({
  isOpen,
  id,
  description,
  summary: initialSummary,
  tag,
  onClose,
}) => {
  const [summary, setSummary] = useState<string | undefined>(initialSummary);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen && !summary) {
        setLoadingSummary(true);
        const generatedSummary = await createSummaryForContent(id, description);
        setSummary(generatedSummary);
        setLoadingSummary(false);
      }
    };

    fetchData();
  }, [isOpen, id, description, summary]);

  return (
    <div
      className={`fixed top-0 left-0 h-[100vh] w-[100vw] bg-primary-xBackground shadow-xl transform transition-all duration-500 ease-in-out ${
        isOpen ? "opacity-100 z-50" : "opacity-0 z-[-1] pointer-events-none"
      }`}
    >
      <div className="flex flex-col h-full z-[9999]">
        <div className="flex flex-row justify-between items-center p-8 mb-3 h-12 text-white overflow-y-auto border-b border-gray-700">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 hover:rotate-180 transition-transform duration-300 text-2xl"
          >
            ✕
          </button>

          <div className="flex gap-2 w-[80vw] items-center overflow-x-auto whitespace-nowrap">
            <Nugget tagItem={tag} />
          </div>
        </div>
        <ContentChat
          id={id}
          description={description}
          tag={tag}
          summary={summary}
          loadingSummary={loadingSummary}
        />
      </div>
      <MeteorsFx number={20} />
    </div>
  );
};
