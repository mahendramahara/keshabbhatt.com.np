import React from "react";
import { View, Text, TouchableOpacity, Image, Linking, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { DrawerContentComponentProps } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { Badge } from "./Badge";
import type { TopTabKey } from "./TopTabBar";
import { webUrl } from "../../config/env";

interface CustomDrawerContentProps {
  activeTab: TopTabKey;
  onSelectTab: (tab: TopTabKey) => void;
  navigation: DrawerContentComponentProps["navigation"];
}

const MENU_ITEMS: { key: TopTabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "home", label: "Executive Dashboard", icon: "grid-outline" },
  { key: "articles", label: "Articles Repository", icon: "newspaper-outline" },
  { key: "create", label: "Publish New Article", icon: "add-circle-outline" },
  { key: "health", label: "Supabase Keep-Alive", icon: "cloud-done-outline" },
];

export function CustomDrawerContent({
  activeTab,
  onSelectTab,
  navigation,
}: CustomDrawerContentProps) {
  const insets = useSafeAreaInsets();

  const handleSelectTab = (tab: TopTabKey) => {
    onSelectTab(tab);
    navigation.closeDrawer();
  };

  const handleOpenLiveWeb = () => {
    Linking.openURL(webUrl("/en/articles")).catch((error) => {
      console.warn("Could not open website:", error);
    });
  };

  return (
    <View className="flex-1 bg-slate-950" style={{ paddingBottom: insets.bottom }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="px-5 pb-5 bg-slate-900 border-b border-slate-800"
          style={{ paddingTop: insets.top + 20 }}
        >
          <View className="flex-row items-center gap-4 mb-4">
            <View className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 bg-slate-950">
              <Image
                source={require("../../../assets/images/avatar.png")}
                className="w-full h-full object-cover"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-slate-100">Keshab Datt Bhatt</Text>
              <Text className="text-xs text-slate-400 mt-0.5" numberOfLines={1}>
                Banking IT Executive
              </Text>
              <View className="mt-1.5 flex-row">
                <Badge label="Koteshwor 32, Kathmandu, Nepal" variant="gold" />
              </View>
            </View>
          </View>

          <View className="bg-slate-950/80 px-3 py-2.5 rounded-xl border border-slate-800/80 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <View className="w-2 h-2 rounded-full bg-emerald-400" />
              <Text className="text-xs text-slate-300 font-medium">CMS System Active</Text>
            </View>
            <Text className="text-xs text-amber-300 font-semibold">Live DB</Text>
          </View>
        </View>

        <View className="flex-1 px-4 py-5 gap-1.5">
          <Text className="text-[11px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
            Navigation Menu
          </Text>

          {MENU_ITEMS.map((item) => {
            const isSelected = activeTab === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                onPress={() => handleSelectTab(item.key)}
                activeOpacity={0.75}
                className={`flex-row items-center gap-3 px-4 py-3.5 rounded-xl border ${
                  isSelected
                    ? "bg-slate-900 border-amber-400/50"
                    : "bg-transparent border-transparent"
                }`}
              >
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={isSelected ? "#d4af37" : "#94a3b8"}
                />
                <Text
                  className={`text-sm font-semibold flex-1 ${
                    isSelected ? "text-amber-300" : "text-slate-300"
                  }`}
                >
                  {item.label}
                </Text>
                {isSelected ? (
                  <Ionicons name="chevron-forward" size={16} color="#d4af37" />
                ) : null}
              </TouchableOpacity>
            );
          })}

          <View className="my-3 border-t border-slate-800/80" />

          <TouchableOpacity
            onPress={handleOpenLiveWeb}
            activeOpacity={0.75}
            className="flex-row items-center gap-3 px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-800"
          >
            <Ionicons name="globe-outline" size={20} color="#38bdf8" />
            <Text className="text-sm font-semibold text-slate-200 flex-1">
              Open Live Web Portfolio
            </Text>
            <Ionicons name="open-outline" size={16} color="#64748b" />
          </TouchableOpacity>
        </View>

        <View className="px-5 py-4 border-t border-slate-800/80">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-xs text-slate-400">Version</Text>
            <Text className="text-xs font-mono text-slate-300">1.0.0 (Expo)</Text>
          </View>
          <Text className="text-[11px] text-slate-500">
            Keshab Bhatt Portfolio CMS - Executive Mobile Suite
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
