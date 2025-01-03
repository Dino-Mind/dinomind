import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Card } from "../Card";

interface HoverEffectProps {
  id: string;
  description: string;
  tag: string;
  summary?: string;
  hovered: boolean;
}

export const CardContainerHoverFx: React.FC<HoverEffectProps> = ({
  id,
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
            className="absolute inset-0 h-full w-full bg-primary-xPrimary/[0.5] dark:bg-primary-xPrimary/[0.8] block rounded-3xl"
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
      <Card id={id} description={description} summary={summary} tag={tag} />
    </>
  );
};
