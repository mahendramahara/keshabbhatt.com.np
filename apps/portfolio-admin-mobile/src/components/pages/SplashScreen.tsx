import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Shield } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/store/theme-context";

export const SplashScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <View
      style={{
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
      className="flex-1 items-center justify-center p-6"
    >
      <View className="items-center">
        {/* Brand Shield */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderColor: colors.goldBorder,
            borderWidth: 2,
          }}
          className="w-20 h-20 rounded-3xl items-center justify-center mb-5 shadow-lg"
        >
          <Shield size={40} color={colors.gold} strokeWidth={2.2} />
        </View>

        {/* Title & Brand */}
        <Text
          style={{ color: colors.textMain }}
          className="font-bold text-2xl tracking-tight text-center"
        >
          Keshab Datt Bhatt
        </Text>
        <Text
          style={{ color: colors.textMuted }}
          className="text-sm font-medium text-center mt-1 mb-4"
        >
          Executive Administration Portal
        </Text>

        {/* Version Badge */}
        <View
          style={{
            backgroundColor: colors.goldSoft,
            borderColor: colors.goldBorder,
            borderWidth: 1,
          }}
          className="px-3 py-1 rounded-full mb-8"
        >
          <Text style={{ color: colors.gold }} className="text-xs font-bold uppercase tracking-wider">
            Version 1.2.3
          </Text>
        </View>

        {/* Loading Spinner */}
        <ActivityIndicator size="small" color={colors.gold} />
        <Text style={{ color: colors.textMuted }} className="text-xs mt-3 tracking-wide">
          Verifying security environment...
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;
