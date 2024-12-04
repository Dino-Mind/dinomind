import { motion } from "framer-motion";
import { Tab } from "./Tabs";
import { cn } from "@/lib/utils";

export const FadeInDiv = ({
    className,
    tabs,
    activeTab,
  }: {
    className?: string;
    tabs: Tab[];
    activeTab: string;
  }) => {
    const activeIndex = tabs.findIndex((tab) => tab.value === activeTab);
  
    return (
      <div className="relative w-full h-full">
        {tabs.map((tab, idx) => (
          <motion.div
            key={tab.value}
            layoutId={tab.value}
            style={{
              zIndex: idx === activeIndex ? 1 : -idx,
            }}
            animate={{
              y: idx === activeIndex ? [0, 40, 0] : 0,
            }}
            className={cn(
              "flex justify-center w-full h-full absolute top-0 right-0",
              className
            )}
          >
            {tab.content}
          </motion.div>
        ))}
      </div>
    );
  };
  