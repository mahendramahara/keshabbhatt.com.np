import React from "react";
import { View, Text } from "react-native";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function StatCard({ title, value, subtitle, icon }: StatCardProps) {
  return (
    <View className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex-1 shadow-sm">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </Text>
        {icon}
      </View>
      <Text className="text-2xl font-bold text-amber-300">
        {value}
      </Text>
      {subtitle ? (
        <Text className="text-[10px] text-slate-400 mt-1">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
