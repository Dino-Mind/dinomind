import React from "react";

// import { Tabs } from "../components/ui/Tabs";
import { TabName } from "../types";
import "../styles/style.scss";
import { FileText, MessageCircle, User } from "lucide-react";
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
      console.log("Tab selected in UI:", tabValue);
      dispatch(setActiveTab(tabValue));
    }
  };

  return (
    <div className="flex h-screen w-full">
      <div className="flex-1 bg-gray-100 p-4">
        <FadeInDiv tabs={tabs} activeTab={activeTab} />
      </div>
      <nav className="w-[65px] flex flex-col justify-between chatbox-background">

        <div className="space-y-4 mt-4">
          {tabs.map((tab) => (
            <NavbarButton
              key={tab.value}
              icon={tab.icon}
              title={tab.title}
              onClick={() => handleTabSelect(tab.value)}
            />
          ))}
        </div>
        <div className="mb-4">
          <NavbarButton icon={User} title="Profile" />
        </div>
      </nav>
    </div>
  );
};

// <Tabs
//   tabs={tabs}
//   containerClassName="tabs-container"
//   activeTabClassName="active-tab"
//   tabClassName="tab"
//   contentClassName="tab-content"
// />
export default Body;
