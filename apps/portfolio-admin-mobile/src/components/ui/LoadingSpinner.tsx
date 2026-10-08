import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = "Loading articles..." }: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <ActivityIndicator size="large" color="#d4af37" />
      <Text className="text-xs text-slate-400 mt-3 font-medium">
        {message}
      </Text>
    </View>
  );
}
