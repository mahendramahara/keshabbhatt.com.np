import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BlogPost } from "@keshab-bhatt/types";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { webUrl } from "../../config/env";

export interface ArticleDetailViewProps {
  blog: BlogPost;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export function ArticleDetailView({
  blog,
  onBack,
  onEdit,
  onDelete,
  isDeleting,
}: ArticleDetailViewProps) {
  const isNepali = blog.locale === "ne";

  const handleOpenOnWeb = () => {
    const localePath = blog.locale === "ne" ? "ne" : "en";
    Linking.openURL(webUrl(`/${localePath}/articles/${blog.slug}`)).catch(() => {});
  };

  return (
    <View className="flex-1 bg-slate-950">
      <View className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          className="p-2 bg-slate-800/80 rounded-xl flex-row items-center gap-1.5"
        >
          <Ionicons name="arrow-back" size={18} color="#f8fafc" />
          <Text className="text-xs font-semibold text-slate-200">Back</Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={onEdit}
            activeOpacity={0.7}
            className="p-2 bg-slate-800 rounded-xl"
          >
            <Ionicons name="create-outline" size={18} color="#d4af37" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            activeOpacity={0.7}
            className="p-2 bg-rose-950/80 rounded-xl"
            disabled={isDeleting}
          >
            <Ionicons name="trash-outline" size={18} color="#fda4af" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        <View className="flex-row items-center justify-between mb-3">
          <Badge
            label={blog.category}
            variant={blog.category.includes("Banking") || blog.category.includes("बैंकिङ") ? "blue" : "gold"}
          />
          <View className="flex-row items-center gap-2">
            <Badge label={isNepali ? "नेपाली संस्करण" : "English"} variant="slate" />
            <View className="flex-row items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
              <Ionicons name="eye-outline" size={12} color="#94a3b8" />
              <Text className="text-[11px] text-slate-400 font-mono">
                {blog.viewCount || 0} views
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-xl font-bold text-slate-100 leading-snug mb-3">
          {blog.title}
        </Text>

        <View className="flex-row items-center gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-2xl mb-4">
          <View className="w-10 h-10 rounded-full overflow-hidden border border-amber-400/80 bg-slate-950">
            <Image
              source={require("../../../assets/images/logo.png")}
              className="w-full h-full object-cover"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-bold text-slate-200">
              {typeof blog.author === "object" && blog.author ? blog.author.name : (blog.author || "Keshab Datt Bhatt")}
            </Text>
            <Text className="text-[11px] text-slate-400">
              {blog.publishedAt ? blog.publishedAt.split("T")[0] : "Published"} •{" "}
              {Math.max(1, Math.ceil((blog.content || "").split(/\s+/).length / 200))} min read
            </Text>
          </View>
        </View>

        {blog.excerpt ? (
          <View className="p-3.5 bg-amber-500/10 border-l-4 border-amber-400 rounded-r-xl mb-5">
            <Text className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              Executive Abstract
            </Text>
            <Text className="text-xs text-slate-300 leading-relaxed italic">
              &ldquo;{blog.excerpt}&rdquo;
            </Text>
          </View>
        ) : null}

        <View className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-5">
          <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Article Content
          </Text>
          <Text className="text-sm text-slate-200 leading-relaxed">
            {blog.content}
          </Text>
        </View>

        {blog.tags && blog.tags.length > 0 ? (
          <View className="mb-5">
            <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Topic Tags
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <View
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
                >
                  <Text className="text-[11px] text-slate-300 font-medium">#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View className="flex-row items-center gap-3 mb-10">
          <Button
            title="Edit Article"
            onPress={onEdit}
            variant="primary"
            className="flex-1"
            icon={<Ionicons name="create-outline" size={16} color="#040e24" />}
          />
          <Button
            title="Open Live Web"
            onPress={handleOpenOnWeb}
            variant="outline"
            className="flex-1"
            icon={<Ionicons name="open-outline" size={16} color="#94a3b8" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
