import React from "react";
import { View, Text } from "react-native";

interface BadgeProps {
  label: string;
  variant?: "gold" | "blue" | "emerald" | "slate";
}

export function Badge({ label, variant = "gold" }: BadgeProps) {
  const getColors = () => {
    switch (variant) {
      case "gold":
        return "bg-amber-950/60 border-amber-500/40 text-amber-300";
      case "blue":
        return "bg-blue-950/60 border-blue-500/40 text-blue-300";
      case "emerald":
        return "bg-emerald-950/60 border-emerald-500/40 text-emerald-300";
      case "slate":
      default:
        return "bg-slate-800/80 border-slate-700 text-slate-300";
    }
  };

  return (
    <View className={`px-2.5 py-1 rounded-full border ${getColors()} self-start`}>
      <Text className="text-[10px] font-semibold tracking-wider uppercase">
        {label}
      </Text>
    </View>
  );
}
