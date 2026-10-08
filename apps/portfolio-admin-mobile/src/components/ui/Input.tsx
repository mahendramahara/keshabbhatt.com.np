import React from "react";
import { View, Text, TextInput, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  multiline?: boolean;
  charCount?: number;
  minChars?: number;
  maxChars?: number;
}

export function Input({
  label,
  error,
  helperText,
  multiline,
  charCount,
  minChars,
  maxChars,
  className = "",
  ...props
}: InputProps) {
  const showCounter = typeof charCount === "number" && (minChars !== undefined || maxChars !== undefined);
  const isBelowMin = showCounter && minChars !== undefined && charCount < minChars;

  return (
    <View className="mb-4">
      {label || showCounter ? (
        <View className="flex-row items-center justify-between mb-1.5">
          {label ? (
            <Text className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              {label}
            </Text>
          ) : <View />}

          {showCounter ? (
            <Text
              className={`text-[11px] font-medium ${
                isBelowMin ? "text-amber-400" : "text-slate-400"
              }`}
            >
              {charCount}
              {minChars !== undefined ? ` / min ${minChars}` : ""}
              {maxChars !== undefined ? ` (max ${maxChars})` : ""}
            </Text>
          ) : null}
        </View>
      ) : null}

      <TextInput
        placeholderTextColor="#64748b"
        multiline={multiline}
        className={`bg-slate-900/90 border ${
          error ? "border-rose-500 bg-rose-950/10" : "border-slate-700 focus:border-amber-400"
        } rounded-xl px-3.5 py-2.5 text-xs text-slate-100 ${
          multiline ? "min-h-[100px] text-top" : "h-11"
        } ${className}`}
        {...props}
      />

      {error ? (
        <Text className="text-[11px] font-medium text-rose-400 mt-1">{error}</Text>
      ) : helperText ? (
        <Text className="text-[11px] text-slate-400 mt-1">{helperText}</Text>
      ) : null}
    </View>
  );
}
