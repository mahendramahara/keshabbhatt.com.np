import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useAppTheme } from "@/store/theme-context";

export interface AdminStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accentColor?: string;
  onPress?: () => void;
  className?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor,
  onPress,
  className = "",
}) => {
  const { colors } = useAppTheme();
  const accent = accentColor || colors.gold;

  const content = (
    <View
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.surfaceBorder,
        borderWidth: 1,
      }}
      className={`p-4 rounded-2xl relative overflow-hidden shadow-xs ${className}`}
    >
      {/* Top Accent Strip */}
      <View
        style={{ backgroundColor: accent }}
        className="absolute top-0 left-0 right-0 h-1"
      />

      <View className="flex-row items-center justify-between mb-2">
        <Text style={{ color: colors.textMuted }} className="text-xs font-semibold uppercase tracking-wider">
          {title}
        </Text>
        <View
          style={{ backgroundColor: `${accent}15` }}
          className="w-8 h-8 rounded-xl items-center justify-center"
        >
          {icon}
        </View>
      </View>

      <Text style={{ color: colors.textMain }} className="text-2xl font-bold tracking-tight">
        {value}
      </Text>

      {subtitle && (
        <Text style={{ color: colors.textSecondary }} className="text-xs mt-1">
          {subtitle}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

export default AdminStatCard;
