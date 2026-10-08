import React from "react";
import { View, Text, ScrollView, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { BlogPost } from "@keshab-bhatt/types";
import { StatCard } from "../ui/StatCard";
import { BlogCard } from "../ui/BlogCard";
import { Button } from "../ui/Button";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { EmptyState } from "../ui/EmptyState";

export interface DashboardPageViewProps {
  totalArticles: number;
  englishCount: number;
  nepaliCount: number;
  totalViews: number;
  recentArticles: BlogPost[];
  isLoading: boolean;
  onRefresh: () => void;
  onSelectBlog: (slug: string) => void;
  onEditBlog: (slug: string) => void;
  onDeleteBlog: (slug: string) => void;
  onGoToArticles: () => void;
  onGoToCreate: () => void;
  onGoToHealth: () => void;
}

export function DashboardPageView({
  totalArticles,
  englishCount,
  nepaliCount,
  totalViews,
  recentArticles,
  isLoading,
  onRefresh,
  onSelectBlog,
  onEditBlog,
  onDeleteBlog,
  onGoToArticles,
  onGoToCreate,
  onGoToHealth,
}: DashboardPageViewProps) {
  if (isLoading && recentArticles.length === 0) {
    return <LoadingSpinner message="Loading dashboard statistics..." />;
  }

  return (
    <ScrollView
      className="flex-1 bg-slate-950 px-4 py-4"
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#d4af37" />
      }
    >
      <View className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-5 shadow-lg">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <View className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <Text className="text-xs font-semibold text-amber-300 uppercase tracking-widest">
              Executive Portfolio CMS
            </Text>
          </View>
          <Text className="text-[11px] text-slate-400 font-mono">Koteshwor 32, Kathmandu, Nepal</Text>
        </View>

        <Text className="text-xl font-bold text-slate-100 mb-1">
          Keshab Datt Bhatt
        </Text>
        <Text className="text-xs text-slate-400 leading-relaxed mb-4">
          Senior Banking Technology Leader. Oversee, draft, and publish bilingual thought leadership articles across Core Banking, FinTech, and Enterprise Security.
        </Text>

        <View className="flex-row items-center gap-2.5">
          <Button
            title="Compose Article"
            onPress={onGoToCreate}
            variant="primary"
            className="flex-1"
            icon={<Ionicons name="create-outline" size={14} color="#040e24" />}
          />
          <Button
            title="Database Ping"
            onPress={onGoToHealth}
            variant="secondary"
            className="flex-1"
            icon={<Ionicons name="cloud-outline" size={14} color="#cbd5e1" />}
          />
        </View>
      </View>

      <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
        Key Metrics & Performance
      </Text>

      <View className="flex-row gap-3 mb-3">
        <StatCard
          title="Total Articles"
          value={totalArticles}
          subtitle="In Supabase PostgreSQL"
          icon={<Ionicons name="document-text" size={18} color="#d4af37" />}
        />
        <StatCard
          title="Total Readers"
          value={totalViews}
          subtitle="Portfolio Impressions"
          icon={<Ionicons name="trending-up" size={18} color="#38bdf8" />}
        />
      </View>

      <View className="flex-row gap-3 mb-5">
        <StatCard
          title="English Posts"
          value={englishCount}
          subtitle="International Edition"
          icon={<Ionicons name="globe-outline" size={18} color="#a78bfa" />}
        />
        <StatCard
          title="नेपाली लेख"
          value={nepaliCount}
          subtitle="नेपाली भाषा संस्करण"
          icon={<Ionicons name="language-outline" size={18} color="#34d399" />}
        />
      </View>

      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Recently Published Articles
        </Text>
        <Button
          title="View All"
          onPress={onGoToArticles}
          variant="outline"
          className="py-1 px-3"
        />
      </View>

      {recentArticles.length === 0 ? (
        <EmptyState
          title="No Articles Seeded Yet"
          description="Your Supabase database does not have articles or the local server is offline."
          actionText="Publish First Article"
          onAction={onGoToCreate}
        />
      ) : (
        recentArticles.map((blog) => (
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
