import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useAppTheme } from "@/store/theme-context";

export interface FilterTabOption {
  id: string;
  label: string;
  count?: number;
}

export interface AdminFilterTabsProps {
  tabs: FilterTabOption[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export const AdminFilterTabs: React.FC<AdminFilterTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  const { colors } = useAppTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={`flex-row py-1 ${className}`}
    >
      <View className="flex-row items-center gap-2 pr-4">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              activeOpacity={0.7}
              style={{
                backgroundColor: isActive ? colors.gold : colors.surface,
                borderColor: isActive ? colors.gold : colors.surfaceBorder,
                borderWidth: 1,
              }}
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-xl shadow-xs"
            >
              <Text
                style={{
                  color: isActive ? "#040e24" : colors.textSecondary,
                  fontWeight: isActive ? "700" : "500",
                }}
                className="text-xs"
              >
                {tab.label}
              </Text>
              {typeof tab.count === "number" && (
                <View
                  style={{
                    backgroundColor: isActive ? "rgba(4, 14, 36, 0.2)" : colors.backgroundSecondary,
                  }}
                  className="px-1.5 py-0.5 rounded-full"
                >
                  <Text
                    style={{
                      color: isActive ? "#040e24" : colors.textMuted,
                      fontSize: 10,
                      fontWeight: "700",
                    }}
                  >
                    {tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default AdminFilterTabs;
