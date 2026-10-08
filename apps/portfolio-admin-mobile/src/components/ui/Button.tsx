import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger" | "outline";
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
  icon,
  className = "",
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-amber-500 active:bg-amber-600 border border-amber-400";
      case "secondary":
        return "bg-slate-800 active:bg-slate-700 border border-slate-700";
      case "danger":
        return "bg-rose-900/80 active:bg-rose-900 border border-rose-700";
      case "outline":
      default:
        return "bg-transparent active:bg-slate-800/40 border border-slate-600";
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return "text-slate-950 font-bold";
      case "danger":
        return "text-rose-200 font-semibold";
      case "secondary":
      case "outline":
      default:
        return "text-slate-200 font-semibold";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      className={`px-4 py-3 rounded-xl flex-row items-center justify-center gap-2 ${getVariantStyles()} ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === "primary" ? "#0f172a" : "#cbd5e1"} />
      ) : (
        <>
          {icon}
          <Text className={`text-xs ${getTextColor()}`}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}
