import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

import { MeteorsFx } from "./fx/meteorsFx";
import { Button } from "./button";
import { CardContent } from "./CardContent";

interface CardProps {
  id: string;
  description: string;
  tag: string;
  summary?: string;
}

export const Card: React.FC<CardProps> = ({
  id,
  description,
  tag,
  summary,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openCardContent = () => setIsOpen(true);
  const closeCardContent = () => setIsOpen(false);

  return (
    <>
      <div className="relative shadow-xl bg-primary-xBackgroundCard px-4 py-8 overflow-hidden rounded-2xl flex flex-col justify-end items-start z-20">
        <ReactMarkdown className="prose prose-invert text-slate-400 mb-4 text-sm relative z-50">
          {description.substring(0, 200) + "..."}
        </ReactMarkdown>

        {/* <div className="flex flex-wrap gap-2 mb-4 relative z-50  bg-gray-700 text-gray-300 px-3 py-0.5 text-sm rounded-xl">
          {tag.substring(0,10)}
        </div> */}

        <Button variant={"secondary"} onClick={openCardContent}>
          Explore
        </Button>

        <MeteorsFx number={20} />
      </div>

      <CardContent
        isOpen={isOpen}
        id={id}
        description={description}
        summary={summary}
        tag={tag}
        onClose={closeCardContent}
      />
    </>
  );
};
