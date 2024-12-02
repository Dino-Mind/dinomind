"use client";

import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RootState } from "@/redux/rootReducer";
import { setActiveTab } from "@/redux/slices/uiSlice";
import { TabName } from "@/types";

export type Tab = {
  title: string;
  value: TabName;
  content?: string | React.ReactNode;
  icon?: React.ElementType;
};

type TabsProps = {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
}

export const Tabs: FC<TabsProps> = ({
  tabs,
  containerClassName,
  activeTabClassName,
  tabClassName,
}) => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.ui.activeTab);

  const handleTabSelect = (tabValue: TabName) => {
    if (tabValue !== activeTab) {
      console.log("Tab selected in UI:", tabValue);
      dispatch(setActiveTab(tabValue));
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-row items-center justify-center [perspective:1000px] relative overflow-auto sm:overflow-visible no-visible-scrollbar max-w-full w-full",
          containerClassName
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.title}
            onClick={() => handleTabSelect(tab.value)}
            className={cn("relative px-4 py-2 rounded-full", tabClassName)}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {activeTab === tab.value && (
              <motion.div
                layoutId="clickedbutton"
                transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                className={cn(
                  "absolute inset-0 bg-gray-200 dark:bg-zinc-800 rounded-full",
                  activeTabClassName
                )}
              />
            )}
            <span className="relative block text-black dark:text-white">
              {tab.title}
            </span>
          </button>
        ))}
      </div>

    </>
  );
};
