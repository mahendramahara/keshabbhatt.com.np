import React, { createContext, useContext, useState } from "react";
import type { TopTabKey } from "../components/ui/TopTabBar";

interface TabContextValue {
  activeTab: TopTabKey;
  setActiveTab: (tab: TopTabKey) => void;
}

const TabContext = createContext<TabContextValue>({
  activeTab: "home",
  setActiveTab: () => {},
});

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<TopTabKey>("home");

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}

export function useTab(): TabContextValue {
  return useContext(TabContext);
}
