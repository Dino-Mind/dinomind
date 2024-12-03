import { useEffect, useState } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

export const TextGenerateEffectFx = ({
  words,
  className,
  filter = true,
  duration = 0.1,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const wordsArray = words.split(" ");

  // Start the animation
  useEffect(() => {
    animate(
      "span",
      {
        opacity: 1,
        filter: filter ? "blur(0px)" : "none",
      },
      {
        duration: duration || 1,
        delay: stagger(0.2),
      }
    ).then(() => {
      // Trigger state change to show Markdown after animation
      setTimeout(() => setIsAnimationComplete(true), 100); // Slight delay for transition
    });
  }, [scope, animate]);

  // Render animated words
  const renderWords = () => {
    return (
      <motion.div ref={scope} className="flex flex-wrap gap-1">
        {wordsArray.map((word, idx) => (
          <motion.span
            key={`${word}-${idx}`}
            className="text-chatText opacity-0 text-base"
            style={{
              filter: filter ? "blur(10px)" : "none",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: duration || 1,
              delay: idx * 0.2,
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  // Render Markdown version
  const renderMarkdown = () => {
    return (
      <motion.div
        className="prose prose-invert leading-snug tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ReactMarkdown>{words}</ReactMarkdown>
      </motion.div>
    );
  };

  return (
    <div className={cn(className)}>
      <div className="mt-4">
        <div className="leading-snug tracking-wide">
          {isAnimationComplete ? renderMarkdown() : renderWords()}
        </div>
      </div>
    </div>
  );
};
