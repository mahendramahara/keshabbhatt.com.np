import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  ShieldCheck,
  FileBadge,
} from "lucide-react-native";
import { useAppTheme } from "@/store/theme-context";
import { useTab, type AdminTab } from "@/store/tab-context";

interface TabItem {
  id: AdminTab;
  label: string;
  icon: (color: string, size: number) => React.ReactNode;
}

export const AdminTabBar: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { activeTab, setActiveTab } = useTab();

  const tabs: TabItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (c, s) => <LayoutDashboard size={s} color={c} />,
    },
    {
      id: "articles",
      label: "Articles",
      icon: (c, s) => <FileText size={s} color={c} />,
    },
    {
      id: "categories",
      label: "Categories",
      icon: (c, s) => <FolderKanban size={s} color={c} />,
    },
    {
      id: "admins",
      label: "Admins",
      icon: (c, s) => <ShieldCheck size={s} color={c} />,
    },
    {
      id: "cv",
      label: "CV",
      icon: (c, s) => <FileBadge size={s} color={c} />,
    },
  ];

  return (
    <View
      style={{
        backgroundColor: colors.tabBarBg,
        borderTopColor: colors.tabBarBorder,
        borderTopWidth: 1,
        paddingBottom: Math.max(insets.bottom, 10),
      }}
      className="pt-2 px-2 shadow-lg"
    >
      <View className="flex-row items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const activeColor = colors.gold;
          const inactiveColor = colors.textMuted;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
              className="items-center justify-center py-1 px-2.5 rounded-xl min-w-[56px]"
            >
              <View
                style={{
                  backgroundColor: isActive ? colors.goldSoft : "transparent",
                }}
                className="w-10 h-7 rounded-xl items-center justify-center mb-1"
              >
                {tab.icon(isActive ? activeColor : inactiveColor, 18)}
              </View>
              <Text
                style={{
                  color: isActive ? activeColor : inactiveColor,
                  fontWeight: isActive ? "700" : "500",
                }}
                className="text-[10px] tracking-tight"
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default AdminTabBar;
