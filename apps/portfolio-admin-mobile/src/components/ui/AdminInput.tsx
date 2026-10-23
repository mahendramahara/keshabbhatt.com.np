import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, type KeyboardTypeOptions } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { useAppTheme } from "@/store/theme-context";

export interface AdminInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  icon?: React.ReactNode;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  className?: string;
}

export const AdminInput: React.FC<AdminInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  autoCorrect,
  icon,
  error,
  multiline = false,
  numberOfLines = 1,
  className = "",
}) => {
  const { colors } = useAppTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isSecure = secureTextEntry && !isPasswordVisible;

  return (
    <View className={`space-y-1.5 ${className}`}>
      {label && (
        <Text style={{ color: colors.textMuted }} className="text-xs font-semibold uppercase tracking-wider">
          {label}
        </Text>
      )}

      <View
        style={{
          backgroundColor: colors.inputBg,
          borderColor: error ? colors.danger : isFocused ? colors.gold : colors.surfaceBorder,
          borderWidth: 1,
        }}
        className={`flex-row items-center rounded-xl px-3.5 ${
          multiline ? "py-2.5" : "h-12"
        }`}
      >
        {icon && <View className="mr-2.5">{icon}</View>}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            flex: 1,
            color: colors.textMain,
            fontSize: 14,
            textAlignVertical: multiline ? "top" : "center",
          }}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
            className="p-1.5"
          >
            {isPasswordVisible ? (
              <EyeOff size={18} color={colors.textMuted} />
            ) : (
              <Eye size={18} color={colors.textMuted} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={{ color: colors.danger }} className="text-xs font-medium pl-1">
          {error}
        </Text>
      )}
    </View>
  );
};

export default AdminInput;
