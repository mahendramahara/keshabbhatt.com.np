import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { CreateArticleFormData } from "./CreateArticlePageView";

export interface EditArticlePageViewProps {
  formData: CreateArticleFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onChangeField: (field: keyof CreateArticleFormData, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export function EditArticlePageView({
  formData,
  errors,
  isSubmitting,
  onChangeField,
  onSubmit,
  onCancel,
}: EditArticlePageViewProps) {
  const errorCount = Object.keys(errors).length;

  return (
    <View className="flex-1 bg-slate-950">
      <View className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={onCancel}
          activeOpacity={0.7}
          className="p-2 bg-slate-800/80 rounded-xl flex-row items-center gap-1.5"
        >
          <Ionicons name="close" size={18} color="#f8fafc" />
          <Text className="text-xs font-semibold text-slate-200">Cancel</Text>
        </TouchableOpacity>

        <Text className="text-sm font-bold text-slate-100">
          Edit Article
        </Text>

        <View className="w-16" />
      </View>

      <ScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled">
        {errorCount > 0 ? (
          <View className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-4 mb-4">
            <View className="flex-row items-center gap-2 mb-1.5">
              <Ionicons name="alert-circle-outline" size={18} color="#f43f5e" />
              <Text className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                Validation Requirements ({errorCount})
              </Text>
            </View>
            <Text className="text-xs text-rose-200 mb-2">
              Please resolve the following requirements to save changes:
            </Text>
            {Object.entries(errors).map(([field, msg]) => (
              <View key={field} className="flex-row items-start gap-1.5 mb-1">
                <Text className="text-rose-400 text-xs leading-4">•</Text>
                <Text className="text-xs text-rose-300 font-medium flex-1 leading-4">{msg}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <Input
          label="Article Title"
          value={formData.title}
          onChangeText={(text) => onChangeField("title", text)}
          error={errors.title}
          charCount={formData.title.length}
          minChars={3}
          maxChars={250}
        />

        <Input
          label="Slug (Identifier)"
          value={formData.slug}
          editable={false}
          helperText="Slug is the immutable URL identifier"
        />

        <Input
          label="Category"
          value={formData.category}
          onChangeText={(text) => onChangeField("category", text)}
          error={errors.category}
          helperText="Minimum 2 characters"
        />

        <Input
          label="Executive Summary / Excerpt"
          value={formData.excerpt}
          onChangeText={(text) => onChangeField("excerpt", text)}
          error={errors.excerpt}
          charCount={formData.excerpt.length}
          minChars={10}
          maxChars={500}
          multiline
          numberOfLines={3}
        />

        <Input
          label="Full Content (Markdown)"
          value={formData.content}
          onChangeText={(text) => onChangeField("content", text)}
          error={errors.content}
          charCount={formData.content.length}
          minChars={20}
          multiline
          numberOfLines={10}
        />

        <Input
          label="Tags"
          value={formData.tags}
          onChangeText={(text) => onChangeField("tags", text)}
          helperText="Comma separated values (optional)"
        />

        <View className="flex-row items-center gap-3 mt-2 mb-10">
          <Button
            title="Discard"
            onPress={onCancel}
            variant="outline"
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button
            title={isSubmitting ? "Saving..." : "Save Changes"}
            onPress={onSubmit}
            variant="primary"
            className="flex-2"
            loading={isSubmitting}
            icon={<Ionicons name="checkmark-circle-outline" size={16} color="#040e24" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
