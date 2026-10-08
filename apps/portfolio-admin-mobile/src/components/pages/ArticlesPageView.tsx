import React from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BlogPost } from "@keshab-bhatt/types";
import { BlogCard } from "../ui/BlogCard";
import { EmptyState } from "../ui/EmptyState";
import { LoadingSpinner } from "../ui/LoadingSpinner";

export interface ArticlesPageViewProps {
  blogs: BlogPost[];
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedCategory: string;
  categories: string[];
  onSelectCategory: (cat: string) => void;
  selectedLocale: "all" | "en" | "ne";
  onSelectLocale: (loc: "all" | "en" | "ne") => void;
  isLoading: boolean;
  onRefresh: () => void;
  onSelectBlog: (slug: string) => void;
  onEditBlog: (slug: string) => void;
  onDeleteBlog: (slug: string) => void;
  onGoToCreate: () => void;
}

export function ArticlesPageView({
  blogs,
  searchQuery,
  onSearchChange,
  selectedCategory,
  categories,
  onSelectCategory,
  selectedLocale,
  onSelectLocale,
  isLoading,
  onRefresh,
  onSelectBlog,
  onEditBlog,
  onDeleteBlog,
  onGoToCreate,
}: ArticlesPageViewProps) {
  return (
    <ScrollView
      className="flex-1 bg-slate-950 px-4 py-3"
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#d4af37" />
      }
    >
      <View className="flex-row items-center bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 mb-3">
        <Ionicons name="search-outline" size={18} color="#94a3b8" />
        <TextInput
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search articles by title, tag, or topic..."
          placeholderTextColor="#64748b"
          className="flex-1 ml-2 text-xs text-slate-100"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => onSearchChange("")} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={16} color="#94a3b8" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View className="flex-row items-center gap-2 mb-3">
        {(["all", "en", "ne"] as const).map((locale) => {
          const isSelected = selectedLocale === locale;
          const labels: Record<string, string> = {
            all: "All Languages",
            en: "English",
            ne: "नेपाली",
          };

          return (
            <TouchableOpacity
              key={locale}
              onPress={() => onSelectLocale(locale)}
              activeOpacity={0.75}
              className={`px-3 py-1.5 rounded-lg border ${
                isSelected
                  ? "bg-amber-500/20 border-amber-400"
                  : "bg-slate-900 border-slate-800"
              }`}
            >
              <Text
                className={`text-[11px] font-semibold ${
                  isSelected ? "text-amber-300" : "text-slate-400"
                }`}
              >
                {labels[locale]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4 -mx-1 px-1 flex-row"
      >
        <TouchableOpacity
          onPress={() => onSelectCategory("all")}
          activeOpacity={0.75}
          className={`mr-2 px-3 py-1.5 rounded-full border ${
            selectedCategory === "all"
              ? "bg-slate-100 border-slate-100"
              : "bg-slate-900 border-slate-800"
          }`}
        >
          <Text
            className={`text-[11px] font-semibold ${
              selectedCategory === "all" ? "text-slate-950" : "text-slate-300"
            }`}
          >
            All Categories
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.75}
              className={`mr-2 px-3 py-1.5 rounded-full border ${
                isSelected
                  ? "bg-amber-400 border-amber-400"
                  : "bg-slate-900 border-slate-800"
              }`}
            >
              <Text
                className={`text-[11px] font-semibold ${
                  isSelected ? "text-slate-950" : "text-slate-300"
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Articles ({blogs.length})
        </Text>
        {selectedCategory !== "all" || selectedLocale !== "all" || searchQuery ? (
          <TouchableOpacity
            onPress={() => {
              onSelectCategory("all");
              onSelectLocale("all");
              onSearchChange("");
            }}
          >
            <Text className="text-[11px] text-amber-300 font-semibold">
              Reset Filters
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {isLoading && blogs.length === 0 ? (
        <LoadingSpinner message="Loading articles..." />
      ) : blogs.length === 0 ? (
        <EmptyState
          title="No Articles Match Your Criteria"
          description="Try clearing your search query or selecting a different category."
          actionText="Create New Article"
          onAction={onGoToCreate}
        />
      ) : (
        blogs.map((blog) => (
          <BlogCard
            key={blog.id || blog.slug}
            blog={blog}
            onPress={() => onSelectBlog(blog.slug)}
            onEdit={() => onEditBlog(blog.slug)}
            onDelete={() => onDeleteBlog(blog.slug)}
          />
        ))
      )}

      <View className="h-10" />
    </ScrollView>
  );
}
