import React from "react";
import { View, Text } from "react-native";
import { useAppTheme } from "@/store/theme-context";

export type BadgeVariant = "gold" | "success" | "neutral" | "danger" | "info";

export interface AdminBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  label,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
}) => {
  const { colors } = useAppTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case "gold":
        return {
          bg: colors.goldSoft,
          border: colors.goldBorder,
          text: colors.gold,
          dotColor: colors.gold,
        };
      case "success":
        return {
          bg: colors.successSoft,
          border: colors.successBorder,
          text: colors.success,
          dotColor: colors.success,
        };
      case "danger":
        return {
          bg: colors.dangerSoft,
          border: colors.dangerBorder,
          text: colors.danger,
          dotColor: colors.danger,
        };
      case "info":
        return {
          bg: "rgba(56, 189, 248, 0.12)",
          border: "rgba(56, 189, 248, 0.3)",
          text: "#38bdf8",
          dotColor: "#38bdf8",
        };
      case "neutral":
      default:
        return {
          bg: colors.backgroundSecondary,
          border: colors.surfaceBorder,
          text: colors.textSecondary,
          dotColor: colors.textMuted,
        };
    }
  };

  const styleConfig = getVariantStyles();

  const sizeClasses = {
    sm: "px-2 py-0.5 rounded-md",
    md: "px-2.5 py-1 rounded-lg",
  };

  const textSizes = {
    sm: "text-[10px]",
    md: "text-xs",
  };

  return (
    <View
      style={{
        backgroundColor: styleConfig.bg,
        borderColor: styleConfig.border,
        borderWidth: 1,
      }}
      className={`flex-row items-center gap-1.5 self-start ${sizeClasses[size]} ${className}`}
    >
      {dot && (
        <View
          style={{ backgroundColor: styleConfig.dotColor }}
          className="w-1.5 h-1.5 rounded-full"
        />
      )}
      <Text
        style={{ color: styleConfig.text }}
        className={`font-semibold uppercase tracking-wider ${textSizes[size]}`}
      >
        {label}
      </Text>
    </View>
  );
};

export default AdminBadge;
