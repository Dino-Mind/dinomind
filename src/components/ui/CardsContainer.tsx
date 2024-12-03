import React, { FC, useState } from "react";

import { cn } from "@/lib/utils";
import { CardContainerHoverFx } from "./fx/cardContainerHoverFx";
import { Content } from "@/hooks/useContentResponse";

type CardsContainerProps = {
  content: Content[];
};

export const CardsContainer: FC<CardsContainerProps> = ({ content }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto px-8">
      <div
        className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-2")}
      >
        {content?.map((content, idx) => (
          <div
            key={idx}
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <CardContainerHoverFx
              title={`Generated Content ${idx + 1}`}
              id={content.id}
              description={content.content}
              tag={content.tag}
              summary={content.summary}
              hovered={hoveredIndex === idx}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
