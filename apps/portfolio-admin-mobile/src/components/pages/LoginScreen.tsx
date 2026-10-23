import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Shield, User, Lock, AlertCircle } from "lucide-react-native";
import { useAppTheme } from "@/store/theme-context";
import { AdminInput } from "../ui/AdminInput";
import { AdminButton } from "../ui/AdminButton";

export interface LoginScreenProps {
  onLogin: (identifier: string, pass: string) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
  onClearError?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  isLoading = false,
  error = null,
  onClearError,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!identifier.trim()) {
      setFormError("Username or email is required.");
      return;
    }
    if (!password) {
      setFormError("Password is required.");
      return;
    }
    setFormError(null);
    if (onClearError) onClearError();

    try {
      await onLogin(identifier.trim(), password);
    } catch (err: any) {
      setFormError(err.message || "Failed to sign in. Please verify your credentials.");
    }
  };

  const displayedError = error || formError;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ backgroundColor: colors.background }}
      className="flex-1"
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(insets.top + 28, 52),
          paddingBottom: Math.max(insets.bottom + 28, 36),
        }}
        className="flex-1 px-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="max-w-[420px] w-full self-center">
          {/* Brand Header */}
          <View className="items-center mb-8">
            <View
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.goldBorder,
                borderWidth: 1.5,
              }}
              className="w-16 h-16 rounded-2xl items-center justify-center mb-4 shadow-md"
            >
              <Shield size={32} color={colors.gold} strokeWidth={2.2} />
            </View>

            <Text
              style={{ color: colors.textMain }}
              className="font-bold text-2xl tracking-tight text-center"
            >
              Keshab Datt Bhatt
            </Text>
            <Text
              style={{ color: colors.textMuted }}
              className="text-xs font-medium text-center mt-1"
            >
              Executive Management & Control Center
            </Text>

            <View
              style={{
                backgroundColor: colors.goldSoft,
                borderColor: colors.goldBorder,
                borderWidth: 1,
              }}
              className="px-3 py-1 rounded-full mt-3"
            >
              <Text
                style={{ color: colors.gold }}
                className="text-[10px] font-bold uppercase tracking-wider"
              >
                Production Admin Portal
              </Text>
            </View>
          </View>

          {/* Form Card */}
          <View
            style={{
              backgroundColor: colors.cardBg,
              borderColor: colors.surfaceBorder,
              borderWidth: 1,
              gap: 16,
            }}
            className="p-6 rounded-3xl shadow-sm"
          >
            <View>
              <Text style={{ color: colors.textMain }} className="font-bold text-lg tracking-tight">
                Administrator Sign In
              </Text>
              <Text style={{ color: colors.textMuted }} className="text-xs leading-relaxed mt-1">
                Enter your authorized credentials to manage portfolio articles, research publications, and system documents.
              </Text>
            </View>

            {/* Error Banner */}
            {displayedError && (
              <View
                style={{
                  backgroundColor: colors.dangerSoft,
                  borderColor: colors.dangerBorder,
                  borderWidth: 1,
                }}
                className="p-3.5 rounded-xl flex-row items-center gap-2.5"
              >
                <AlertCircle size={16} color={colors.danger} />
                <Text style={{ color: colors.danger }} className="text-xs font-semibold flex-1">
                  {displayedError}
                </Text>
              </View>
            )}

            {/* Inputs */}
            <AdminInput
              label="Username or Email"
              value={identifier}
              onChangeText={(text) => {
                setIdentifier(text);
                if (displayedError) setFormError(null);
              }}
              placeholder="Enter username or email address"
              icon={<User size={16} color={colors.textMuted} />}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <AdminInput
              label="Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (displayedError) setFormError(null);
              }}
              placeholder="Enter your secure password"
              secureTextEntry
              icon={<Lock size={16} color={colors.textMuted} />}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Submit Button */}
            <AdminButton
              title="Authenticate & Enter"
              onPress={handleSignIn}
              variant="gold"
              size="lg"
              loading={isLoading}
              className="mt-1"
            />
          </View>

          {/* Security Footer */}
          <Text
            style={{ color: colors.textMuted }}
            className="text-[11px] text-center mt-6"
          >
            Protected by 256-bit enterprise encryption & JWT authentication.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
