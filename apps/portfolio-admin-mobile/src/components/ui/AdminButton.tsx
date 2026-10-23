import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { useAppTheme } from "@/store/theme-context";

export type ButtonVariant = "primary" | "secondary" | "danger" | "gold" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface AdminButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon,
  className = "",
}) => {
  const { colors } = useAppTheme();

  const getButtonStyles = () => {
    switch (variant) {
      case "gold":
        return {
          backgroundColor: colors.gold,
          borderColor: colors.gold,
          textColor: "#040e24",
        };
      case "danger":
        return {
          backgroundColor: colors.danger,
          borderColor: colors.danger,
          textColor: "#ffffff",
        };
      case "secondary":
        return {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.surfaceBorder,
          textColor: colors.textMain,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: colors.surfaceBorder,
          textColor: colors.textSecondary,
        };
      case "primary":
      default:
        return {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.goldBorder,
          textColor: colors.gold,
        };
    }
  };

  const styleConfig = getButtonStyles();

  const sizeClasses = {
    sm: "py-1.5 px-3 rounded-lg",
    md: "py-2.5 px-4 rounded-xl",
    lg: "py-3.5 px-6 rounded-xl",
  };

  const textSizes = {
    sm: "text-xs font-semibold",
    md: "text-sm font-semibold",
    lg: "text-base font-bold",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
      style={{
        backgroundColor: styleConfig.backgroundColor,
        borderColor: styleConfig.borderColor,
        borderWidth: 1,
        opacity: disabled ? 0.5 : 1,
      }}
      className={`flex-row items-center justify-center gap-2 ${sizeClasses[size]} ${className}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={styleConfig.textColor} />
      ) : (
        <>
          {icon && <View>{icon}</View>}
          <Text
            style={{ color: styleConfig.textColor }}
            className={`tracking-tight ${textSizes[size]}`}
          >
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default AdminButton;
