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
  subtitle = "Admin Portal v1.1.0",
}) => {
  const insets = useSafeAreaInsets();
  const { colors, mode, toggleTheme } = useAppTheme();
  const { admin, logout } = useAuth();

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
        <View className="flex-row items-center gap-2.5">
          <View
            style={{ backgroundColor: colors.gold }}
            className="w-9 h-9 rounded-xl items-center justify-center shadow-xs"
          >
            <Shield size={18} color="#040e24" strokeWidth={2.5} />
          </View>
          <View>
            <View className="flex-row items-center gap-2">
              <Text style={{ color: colors.textMain }} className="font-bold text-base tracking-tight">
                {title}
              </Text>
              <View
                style={{
                  backgroundColor: colors.goldSoft,
                  borderColor: colors.goldBorder,
                }}
                className="px-1.5 py-0.5 rounded border"
              >
                <Text style={{ color: colors.gold }} className="text-[10px] font-bold uppercase tracking-wider">
                  Admin
                </Text>
              </View>
            </View>
            <Text style={{ color: colors.textMuted }} className="text-xs">
              {subtitle}
            </Text>
          </View>
        </View>

        {/* Action Controls */}
        <View className="flex-row items-center gap-2">
          {/* Theme Switcher */}
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            style={{
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.surfaceBorder,
            }}
            className="w-8 h-8 rounded-lg items-center justify-center border"
          >
            {mode === "dark" ? (
              <Sun size={16} color={colors.gold} />
            ) : (
              <Moon size={16} color={colors.textMain} />
            )}
          </TouchableOpacity>

          {/* Admin Avatar & Role / Logout */}
          {admin && (
            <View className="flex-row items-center gap-1.5">
              <View
                style={{
                  backgroundColor: colors.backgroundSecondary,
                  borderColor: colors.surfaceBorder,
                }}
                className="px-2 py-1 rounded-lg border flex-row items-center gap-1.5"
              >
                <View
                  style={{ backgroundColor: colors.gold }}
                  className="w-5 h-5 rounded-full items-center justify-center"
                >
                  <Text className="text-[10px] font-bold text-slate-900">
                    {admin.name?.charAt(0) || "K"}
                  </Text>
                </View>
                <Text style={{ color: colors.textSecondary }} className="text-xs font-semibold">
                  {admin.username}
                </Text>
              </View>

              <TouchableOpacity
                onPress={logout}
                activeOpacity={0.7}
                style={{
                  backgroundColor: colors.dangerSoft,
                  borderColor: colors.dangerBorder,
                }}
                className="w-8 h-8 rounded-lg items-center justify-center border"
              >
                <LogOut size={14} color={colors.danger} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default AdminHeader;
