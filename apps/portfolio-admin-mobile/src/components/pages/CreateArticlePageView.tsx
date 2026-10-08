import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export interface CreateArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  locale: "en" | "ne";
  tags: string;
}

export interface CreateArticlePageViewProps {
  formData: CreateArticleFormData;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onChangeField: (field: keyof CreateArticleFormData, value: string) => void;
  onGenerateSlug: () => void;
  onSubmit: () => void;
  onReset: () => void;
}

const POPULAR_CATEGORIES = [
  "Core Banking & FinTech",
  "Digital Payments",
  "Cybersecurity & Resilience",
  "Regulatory & Governance",
  "AI & Banking Analytics",
];

export function CreateArticlePageView({
  formData,
  errors,
  isSubmitting,
  onChangeField,
  onGenerateSlug,
  onSubmit,
  onReset,
}: CreateArticlePageViewProps) {
  const errorCount = Object.keys(errors).length;

  return (
    <ScrollView className="flex-1 bg-slate-950 px-4 py-4" keyboardShouldPersistTaps="handled">
      <View className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="create-outline" size={18} color="#d4af37" />
          <Text className="text-base font-bold text-slate-100">
            Publish New Article
          </Text>
        </View>
        <Text className="text-xs text-slate-400">
          Draft executive articles and publish directly to Keshab Bhatt's portfolio via Supabase PostgreSQL.
        </Text>
      </View>

      {errorCount > 0 ? (
        <View className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-4 mb-4">
          <View className="flex-row items-center gap-2 mb-1.5">
            <Ionicons name="alert-circle-outline" size={18} color="#f43f5e" />
            <Text className="text-xs font-bold text-rose-300 uppercase tracking-wider">
              Validation Requirements ({errorCount})
            </Text>
          </View>
          <Text className="text-xs text-rose-200 mb-2">
            Please resolve the following requirements to publish:
          </Text>
          {Object.entries(errors).map(([field, msg]) => (
            <View key={field} className="flex-row items-start gap-1.5 mb-1">
              <Text className="text-rose-400 text-xs leading-4">•</Text>
              <Text className="text-xs text-rose-300 font-medium flex-1 leading-4">{msg}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <View className="mb-4">
        <Text className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Language / Edition
        </Text>
        <View className="flex-row gap-3">
          <TouchableOpacity
            onPress={() => onChangeField("locale", "en")}
            activeOpacity={0.8}
            className={`flex-1 py-3 px-4 rounded-xl border flex-row items-center justify-center gap-2 ${
              formData.locale === "en"
                ? "bg-amber-500/20 border-amber-400"
                : "bg-slate-900 border-slate-800"
            }`}
          >
            <Ionicons
              name="globe-outline"
              size={16}
              color={formData.locale === "en" ? "#d4af37" : "#94a3b8"}
            />
            <Text
              className={`text-xs font-semibold ${
                formData.locale === "en" ? "text-amber-300" : "text-slate-400"
              }`}
            >
              English Edition
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onChangeField("locale", "ne")}
            activeOpacity={0.8}
            className={`flex-1 py-3 px-4 rounded-xl border flex-row items-center justify-center gap-2 ${
              formData.locale === "ne"
                ? "bg-amber-500/20 border-amber-400"
                : "bg-slate-900 border-slate-800"
            }`}
          >
            <Ionicons
              name="language-outline"
              size={16}
              color={formData.locale === "ne" ? "#d4af37" : "#94a3b8"}
            />
            <Text
              className={`text-xs font-semibold ${
                formData.locale === "ne" ? "text-amber-300" : "text-slate-400"
              }`}
            >
              Nepali Edition
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Input
        label="Article Title"
        placeholder={formData.locale === "ne" ? "लेखको शीर्षक प्रविष्ट गर्नुहोस्..." : "e.g. Modernizing Banking Infrastructure in Nepal"}
        value={formData.title}
        onChangeText={(text) => onChangeField("title", text)}
        error={errors.title}
        charCount={formData.title.length}
        minChars={3}
        maxChars={250}
      />

      <View className="mb-4">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            URL Slug
          </Text>
          <TouchableOpacity onPress={onGenerateSlug} activeOpacity={0.7} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
            <Text className="text-[11px] font-semibold text-amber-300">
              Auto Generate
            </Text>
          </TouchableOpacity>
        </View>
        <Input
          placeholder="e.g. modernizing-banking-infrastructure"
          value={formData.slug}
          onChangeText={(text) => onChangeField("slug", text)}
          error={errors.slug}
          helperText="Lowercase letters, numbers, and hyphens (min 3 characters)"
          autoCapitalize="none"
        />
      </View>

      <View className="mb-4">
        <Text className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Category
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2 -mx-1 px-1 flex-row">
          {POPULAR_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => onChangeField("category", cat)}
              activeOpacity={0.7}
              className={`mr-2 px-3 py-1.5 rounded-full border ${
                formData.category === cat
                  ? "bg-amber-400 border-amber-400"
                  : "bg-slate-900 border-slate-800"
              }`}
            >
              <Text
                className={`text-[11px] font-semibold ${
                  formData.category === cat ? "text-slate-950" : "text-slate-300"
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Input
          placeholder="Or enter custom category (min 2 characters)..."
          value={formData.category}
          onChangeText={(text) => onChangeField("category", text)}
          error={errors.category}
        />
      </View>

      <Input
        label="Executive Summary / Excerpt"
        placeholder="Brief overview for cards and search indexing (min 10 characters)..."
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
        label="Full Article Content (Markdown)"
        placeholder="Comprehensive article content (min 20 characters). Markdown supported..."
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
        placeholder="FinTech, CoreBanking, Security, Nepal"
        value={formData.tags}
        onChangeText={(text) => onChangeField("tags", text)}
        helperText="Separate multiple tags with commas (optional)"
        error={errors.tags}
      />

      <View className="flex-row items-center gap-3 mt-2 mb-12">
        <Button
          title="Reset Form"
          onPress={onReset}
          variant="outline"
          className="flex-1"
          disabled={isSubmitting}
        />
        <Button
          title={isSubmitting ? "Publishing..." : "Publish to Supabase"}
          onPress={onSubmit}
          variant="primary"
          className="flex-2"
          loading={isSubmitting}
          icon={<Ionicons name="cloud-upload-outline" size={16} color="#0f172a" />}
        />
      </View>
    </ScrollView>
  );
}
