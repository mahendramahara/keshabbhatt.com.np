import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type TopTabKey = "home" | "articles" | "create" | "health";

interface TabItem {
  key: TopTabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  badge?: number;
}

interface TopTabBarProps {
  activeTab: TopTabKey;
  onSelectTab: (tab: TopTabKey) => void;
}

export function TopTabBar({ activeTab, onSelectTab }: TopTabBarProps) {
  const tabs: TabItem[] = [
    { key: "home", label: "Dashboard", icon: "grid-outline" },
    { key: "articles", label: "Articles", icon: "newspaper-outline" },
    { key: "create", label: "New Post", icon: "add-circle-outline" },
    { key: "health", label: "Cloud Sync", icon: "cloud-done-outline" },
  ];

  return (
    <View className="bg-slate-950/95 border-b border-slate-800 flex-row items-center justify-around px-2 py-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onSelectTab(tab.key)}
            activeOpacity={0.7}
            className="flex-1 items-center justify-center py-2.5 relative"
          >
            <View className="items-center gap-1">
              <Ionicons
                name={tab.icon}
                size={20}
                color={isActive ? "#d4af37" : "#94a3b8"}
              />
              <Text
                className={`text-[10px] font-semibold tracking-wider ${
                  isActive ? "text-amber-300" : "text-slate-400"
                }`}
              >
                {tab.label}
              </Text>
            </View>

            {isActive ? (
              <View className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-amber-400 rounded-full" />
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
