import React from "react";

// import { Tabs } from "../components/ui/Tabs";
import { TabName } from "../types";
import "../styles/style.scss";
import { FileText, MessageCircle } from "lucide-react";
import { NavbarButton } from "@/components/ui/NavbarButton";
import { FadeInDiv } from "@/components/ui/FadeInDiv";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { Tab } from "@/components/ui/Tabs";
import { setActiveTab } from "@/redux/slices/uiSlice";

interface BodyProps {
  componentMap: Record<TabName, JSX.Element>;
}

const Body: React.FC<BodyProps> = ({ componentMap }) => {
  const activeTab = useSelector((state: RootState) => state.ui.activeTab);
  const dispatch = useDispatch();

  const tabs: Tab[] = [
    {
      title: "Content",
      value: "Content",
      content: componentMap["Content"],
      icon: FileText,
    },
    {
      title: "Chat",
      value: "ChatBox",
      content: componentMap["ChatBox"],
      icon: MessageCircle,
    },
  ];

  const handleTabSelect = (tabValue: TabName) => {
    if (tabValue !== activeTab) {
      dispatch(setActiveTab(tabValue));
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1">
        <FadeInDiv tabs={tabs} activeTab={activeTab} />
      </div>
      <nav
        className="w-[65px] flex flex-col justify-between bg-primary-xBackground border-l-2"
        style={{
          borderColor: "#292929",
        }}
      >
        <div className="space-y-4 mt-4">
          <div className="h-[42px]">
            <img
              src="src/assets/rex_magnified.png"
              alt="logo"
              className="w-8 h-8 mx-auto mb-4"
            />
          </div>
          {tabs.map((tab) => (
            <NavbarButton
              key={tab.value}
              icon={tab.icon}
              title={tab.title}
              onClick={() => handleTabSelect(tab.value)}
            />
          ))}
        </div>
        {/* <div className="mb-4">
          <NavbarButton icon={RefreshCw} title="Sync" onClick={() => handleRefresh()} disabled={loading} />
        </div> */}
      </nav>
    </div>
  );
};

export default Body;
