import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Card } from "../Card";

interface HoverEffectProps {
  id: string;
  title: string;
  description: string;
  tag: string;
  summary?: string;
  hovered: boolean;
}

export const CardContainerHoverFx: React.FC<HoverEffectProps> = ({
  id,
  title,
  description,
  summary,
  tag,
  hovered,
}) => {
  return (
    <>
      <AnimatePresence>
        {hovered && (
          <motion.span
            className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block rounded-3xl"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>
      <Card
        id={id}
        title={title}
        description={description}
        summary={summary}
        tag={tag}
      />
    </>
  );
};
