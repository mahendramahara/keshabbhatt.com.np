import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AppHeaderProps {
  onOpenDrawer?: () => void;
  onRefresh?: () => void;
  currentLocale?: "en" | "ne";
  onToggleLocale?: () => void;
}

export function AppHeader({
  onOpenDrawer,
  onRefresh,
  currentLocale = "en",
  onToggleLocale,
}: AppHeaderProps) {
  return (
    <View className="bg-slate-950 border-b border-slate-800/80 px-4 pt-3 pb-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        {onOpenDrawer ? (
          <TouchableOpacity
            onPress={onOpenDrawer}
            activeOpacity={0.7}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl"
          >
            <Ionicons name="menu-outline" size={20} color="#f8fafc" />
          </TouchableOpacity>
        ) : null}

        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-full overflow-hidden border border-amber-400/60 shadow-sm bg-slate-900">
            <Image
              source={require("../../../assets/images/avatar.png")}
              className="w-full h-full object-cover"
              resizeMode="cover"
            />
          </View>
          <View>
            <Text className="text-sm font-bold text-slate-100 tracking-tight">
              Keshab Datt Bhatt
            </Text>
            <Text className="text-[10px] text-amber-300 font-semibold uppercase tracking-wider">
              Executive CMS
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        {onToggleLocale ? (
          <TouchableOpacity
            onPress={onToggleLocale}
            activeOpacity={0.7}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl flex-row items-center gap-1"
          >
            <Ionicons name="language-outline" size={13} color="#d4af37" />
            <Text className="text-[11px] font-bold text-amber-300 uppercase">
              {currentLocale}
            </Text>
          </TouchableOpacity>
        ) : null}

        {onRefresh ? (
          <TouchableOpacity
            onPress={onRefresh}
            activeOpacity={0.7}
            className="p-2 bg-slate-900 border border-slate-800 rounded-xl"
          >
            <Ionicons name="reload-outline" size={16} color="#cbd5e1" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
