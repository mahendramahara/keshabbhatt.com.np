import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No Articles Found",
  description = "No articles matching your current filter were found in the database.",
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="items-center justify-center p-8 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl my-4">
      <View className="w-12 h-12 rounded-full bg-slate-800/80 items-center justify-center mb-3">
        <Ionicons name="document-text-outline" size={24} color="#94a3b8" />
      </View>
      <Text className="text-sm font-bold text-slate-200 mb-1">
        {title}
      </Text>
      <Text className="text-xs text-slate-400 text-center leading-relaxed mb-4">
        {description}
      </Text>
      {actionText && onAction ? (
        <Button title={actionText} onPress={onAction} variant="outline" />
      ) : null}
    </View>
  );
}
