import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { loadContentData } from "@/utils/dataUtils";
import { cn } from "@/lib/utils";
import { CardContainerHoverFx } from "./fx/cardContainerHoverFx";
import { setIsContentChanged } from "@/redux/slices/uiSlice";
import { RootState } from "@/redux/rootReducer";
import { Content } from "@/hooks/useContentResponse";

export function CardsContainer() {
  const dispatch = useDispatch();
  const isContentChanged = useSelector(
    (state: RootState) => state.ui.isContentChanged
  );

  const [generatedContent, setGeneratedContent] = useState<Content[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    loadContentData((content: Content[]) => {
      if (content.length > 0) {
        setGeneratedContent(content);
      } else {
        console.warn("No initial content found.");
      }
    });
  }, []);

  useEffect(() => {
    if (isContentChanged) {
      loadContentData((content: Content[]) => {
        if (content.length > 0) {
          setGeneratedContent(content);
        } else {
          console.warn("No content available to update.");
        }
      });
      dispatch(setIsContentChanged(false));
    }
  }, [isContentChanged, dispatch]);

  return (
    <div className="max-w-5xl mx-auto px-8">
      <div
        className={cn("grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3  py-2")}
      >
        {generatedContent.map((content, idx) => (
          <div
            key={idx}
            className="relative group block p-2 h-full w-full"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <CardContainerHoverFx
              title={`Generated Content ${idx + 1}`}
              description={content.content}
              tag={content.tag}
              hovered={hoveredIndex === idx}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
