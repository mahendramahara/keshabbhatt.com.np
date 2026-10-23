import React, { createContext, useContext, useState } from "react";

export type AdminTab = "dashboard" | "articles" | "categories" | "admins" | "cv";

interface TabContextValue {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

const TabContext = createContext<TabContextValue>({
  activeTab: "dashboard",
  setActiveTab: () => {},
});

export const TabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
};

export function useTab(): TabContextValue {
  return useContext(TabContext);
}
