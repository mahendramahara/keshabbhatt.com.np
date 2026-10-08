import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { BlogPost } from "@keshab-bhatt/types";
import { Badge } from "./Badge";
import { Ionicons } from "@expo/vector-icons";

interface BlogCardProps {
  blog: BlogPost;
  onPress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function BlogCard({ blog, onPress, onEdit, onDelete }: BlogCardProps) {
  const isNepali = blog.locale === "ne";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 mb-3.5 shadow-sm space-y-2.5"
    >
      <View className="flex-row items-center justify-between">
        <Badge
          label={blog.category}
          variant={blog.category.includes("Banking") || blog.category.includes("बैंकिङ") ? "blue" : "gold"}
        />
        <View className="flex-row items-center gap-1.5">
          <Badge label={isNepali ? "नेपाली" : "EN"} variant="slate" />
          <View className="flex-row items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded-full">
            <Ionicons name="eye-outline" size={11} color="#94a3b8" />
            <Text className="text-[10px] text-slate-400 font-medium">
              {blog.viewCount || 0}
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-base font-bold text-slate-100 leading-snug">
        {blog.title}
      </Text>

      <Text className="text-xs text-slate-400 leading-relaxed" numberOfLines={2}>
        {blog.excerpt}
      </Text>

      <View className="flex-row items-center justify-between pt-2 border-t border-slate-800/80">
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="calendar-outline" size={12} color="#94a3b8" />
          <Text className="text-[11px] text-slate-400">
            {blog.publishedAt ? blog.publishedAt.split("T")[0] : "Recent"}
          </Text>
        </View>

        <View className="flex-row items-center gap-2">
          {onEdit ? (
            <TouchableOpacity
              onPress={onEdit}
              className="p-1.5 bg-slate-800 rounded-lg"
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={14} color="#f3e8b4" />
            </TouchableOpacity>
          ) : null}

          {onDelete ? (
            <TouchableOpacity
              onPress={onDelete}
              className="p-1.5 bg-rose-950/80 rounded-lg"
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={14} color="#fda4af" />
            </TouchableOpacity>
          ) : null}

          <View className="flex-row items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg">
            <Text className="text-[11px] font-semibold text-amber-300">
              {isNepali ? "हेर्नुहोस्" : "Read"}
            </Text>
            <Ionicons name="chevron-forward" size={12} color="#d4af37" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
