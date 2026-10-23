import React from "react";
import { View, TouchableOpacity, type ViewStyle, type StyleProp } from "react-native";
import { useAppTheme } from "@/store/theme-context";

export interface AdminCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const AdminCard: React.FC<AdminCardProps> = ({
  children,
  onPress,
  className = "",
  style,
}) => {
  const { colors } = useAppTheme();

  const baseStyle: ViewStyle = {
    backgroundColor: colors.cardBg,
    borderColor: colors.surfaceBorder,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[baseStyle, style]}
        className={`shadow-xs ${className}`}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[baseStyle, style]} className={`shadow-xs ${className}`}>
      {children}
    </View>
  );
};

export default AdminCard;
