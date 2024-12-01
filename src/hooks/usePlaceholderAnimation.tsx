import { useEffect, useRef, useState } from "react";

export const usePlaceholderAnimation = (
    placeholders: string[],
    interval = 3000
  ) => {
    const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
    useEffect(() => {
      const startAnimation = () => {
        intervalRef.current = setInterval(() => {
          setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
        }, interval);
      };
  
      const handleVisibilityChange = () => {
        if (document.visibilityState !== "visible" && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        } else if (document.visibilityState === "visible") {
          startAnimation();
        }
      };
  
      startAnimation();
      document.addEventListener("visibilitychange", handleVisibilityChange);
  
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      };
    }, [placeholders, interval]);
  
    return placeholders[currentPlaceholder];
  };