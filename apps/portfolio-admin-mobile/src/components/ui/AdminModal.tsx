import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { X } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppTheme } from "@/store/theme-context";

export interface AdminModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  visible,
  onClose,
  title,
  children,
  footer,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end bg-black/60"
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="flex-1"
        />

        <View
          style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderColor: colors.surfaceBorder,
            borderTopWidth: 1,
            maxHeight: "85%",
            paddingBottom: Math.max(insets.bottom, 16),
          }}
          className="w-full shadow-lg overflow-hidden"
        >
          {/* Modal Header */}
          <View
            style={{
              borderBottomColor: colors.surfaceBorder,
              borderBottomWidth: 1,
            }}
            className="flex-row items-center justify-between px-5 py-4"
          >
            <Text style={{ color: colors.textMain }} className="font-bold text-base tracking-tight">
              {title}
            </Text>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={{ backgroundColor: colors.backgroundSecondary }}
              className="w-8 h-8 rounded-full items-center justify-center"
            >
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Modal Body */}
          <ScrollView
            className="px-5 py-4"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          {/* Modal Footer */}
          {footer && (
            <View
              style={{
                borderTopColor: colors.surfaceBorder,
                borderTopWidth: 1,
              }}
              className="px-5 pt-3"
            >
              {footer}
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AdminModal;
