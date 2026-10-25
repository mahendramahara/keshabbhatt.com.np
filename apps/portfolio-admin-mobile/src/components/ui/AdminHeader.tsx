import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Sun, Moon, LogOut, Shield } from "lucide-react-native";
import { useAppTheme } from "@/store/theme-context";
import { useAuth } from "@/store/auth-context";

export interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = "Keshab Bhatt",
  subtitle = "Admin Portal v1.2.4",
}) => {
  const insets = useSafeAreaInsets();
  const { colors, mode, toggleTheme } = useAppTheme();
  const { logout } = useAuth();

  return (
    <View
      style={{
        paddingTop: Math.max(insets.top, 12),
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.surfaceBorder,
      }}
      className="px-4 pb-3"
    >
      <View className="flex-row items-center justify-between">
        {/* Brand Identity */}
        <View style={{ gap: 10 }} className="flex-row items-center">
          <View
            style={{ backgroundColor: colors.gold }}
            className="w-9 h-9 rounded-xl items-center justify-center shadow-xs"
          >
            <Shield size={18} color="#040e24" strokeWidth={2.5} />
          </View>
          <View>
            <Text style={{ color: colors.textMain }} className="font-bold text-base tracking-tight">
              {title}
            </Text>
            <Text style={{ color: colors.textMuted }} className="text-xs font-medium">
              {subtitle}
            </Text>
          </View>
        </View>

        {/* Clean Action Controls */}
        <View style={{ gap: 8 }} className="flex-row items-center">
          {/* Theme Switcher */}
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.surfaceBorder,
              borderWidth: 1,
            }}
            className="w-9 h-9 rounded-xl items-center justify-center"
          >
            {mode === "dark" ? (
              <Sun size={17} color={colors.gold} />
            ) : (
              <Moon size={17} color={colors.textMain} />
            )}
          </TouchableOpacity>

          {/* Clean Logout Button */}
          <TouchableOpacity
            onPress={logout}
            activeOpacity={0.7}
            style={{
              backgroundColor: colors.dangerSoft,
              borderColor: colors.dangerBorder,
              borderWidth: 1,
            }}
            className="w-9 h-9 rounded-xl items-center justify-center"
          >
            <LogOut size={16} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AdminHeader;
