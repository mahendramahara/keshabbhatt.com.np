import React from "react";
import { View, Text } from "react-native";
import { Inbox } from "lucide-react-native";
import { useAppTheme } from "@/store/theme-context";
import { AdminButton } from "./AdminButton";

export interface AdminEmptyStateProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actionTitle?: string;
  onAction?: () => void;
  className?: string;
}

export const AdminEmptyState: React.FC<AdminEmptyStateProps> = ({
  title,
  subtitle,
  icon,
  actionTitle,
  onAction,
  className = "",
}) => {
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderColor: colors.surfaceBorder,
        borderWidth: 1,
      }}
      className={`p-8 rounded-2xl items-center justify-center text-center ${className}`}
    >
      <View
        style={{ backgroundColor: colors.backgroundSecondary }}
        className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
      >
        {icon || <Inbox size={24} color={colors.textMuted} />}
      </View>

      <Text style={{ color: colors.textMain }} className="font-bold text-base text-center mb-1">
        {title}
      </Text>

      {subtitle && (
        <Text style={{ color: colors.textMuted }} className="text-xs text-center max-w-[240px] leading-relaxed mb-4">
          {subtitle}
        </Text>
      )}

      {actionTitle && onAction && (
        <AdminButton
          title={actionTitle}
          onPress={onAction}
          variant="gold"
          size="sm"
        />
      )}
    </View>
  );
};

export default AdminEmptyState;
