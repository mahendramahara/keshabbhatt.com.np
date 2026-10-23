import React from "react";
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from "react-native";
import {
  FileText,
  FolderKanban,
  FileBadge,
  TrendingUp,
  PlusCircle,
  CheckCircle2,
  ChevronRight,
  Eye,
  Calendar,
} from "lucide-react-native";
import { useAppTheme } from "@/store/theme-context";
import { useAuth } from "@/store/auth-context";
import type { DashboardStats } from "@/services/api";
import type { BlogPost } from "@keshab-bhatt/types";
import type { AdminTab } from "@/store/tab-context";
import { AdminCard } from "../ui/AdminCard";
import { AdminStatCard } from "../ui/AdminStatCard";
import { AdminBadge } from "../ui/AdminBadge";

export interface DashboardScreenProps {
  stats: DashboardStats | null;
  recentBlogs: BlogPost[];
  isLoading: boolean;
  onRefresh: () => void;
  onNavigateTab: (tab: AdminTab) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  stats,
  recentBlogs,
  isLoading,
  onRefresh,
  onNavigateTab,
}) => {
  const { colors } = useAppTheme();
  const { admin } = useAuth();

  return (
    <ScrollView
      className="flex-1 px-4 pt-4"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={onRefresh}
          tintColor={colors.gold}
        />
      }
    >
      {/* Welcome Banner */}
      <AdminCard className="mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <Text style={{ color: colors.textMain }} className="font-bold text-lg tracking-tight">
              Welcome, {admin?.name || "Keshab Datt Bhatt"}
            </Text>
          </View>
          <AdminBadge
            label={admin?.role || "superadmin"}
            variant={admin?.role === "superadmin" ? "gold" : "neutral"}
            size="sm"
          />
        </View>
        <Text style={{ color: colors.textMuted }} className="text-xs leading-relaxed">
          Manage your research publications, master-level finance articles, categories, and executive CV from this mobile control center.
        </Text>
      </AdminCard>

      {/* Metrics 2x2 Grid with Consistent Horizontal & Vertical Gap */}
      <View style={{ gap: 12 }} className="mb-3">
        <View style={{ gap: 12 }} className="flex-row">
          <View className="flex-1">
            <AdminStatCard
              title="Total Articles"
              value={stats?.totalBlogs || 0}
              subtitle={`${stats?.publishedBlogs || 0} Published`}
              icon={<FileText size={18} color={colors.gold} />}
              accentColor={colors.gold}
              onPress={() => onNavigateTab("articles")}
            />
          </View>
          <View className="flex-1">
            <AdminStatCard
              title="English Posts"
              value={stats?.enBlogs || 0}
              subtitle="Global Reach"
              icon={<TrendingUp size={18} color="#0284c7" />}
              accentColor="#0284c7"
              onPress={() => onNavigateTab("articles")}
            />
          </View>
        </View>

        <View style={{ gap: 12 }} className="flex-row">
          <View className="flex-1">
            <AdminStatCard
              title="Nepali Posts"
              value={stats?.neBlogs || 0}
              subtitle="नेपाली लेखहरू"
              icon={<FileText size={18} color="#10b981" />}
              accentColor="#10b981"
              onPress={() => onNavigateTab("articles")}
            />
          </View>
          <View className="flex-1">
            <AdminStatCard
              title="Categories"
              value={stats?.totalCategories || 0}
              subtitle="Master Curricula"
              icon={<FolderKanban size={18} color="#7c3aed" />}
              accentColor="#7c3aed"
              onPress={() => onNavigateTab("categories")}
            />
          </View>
        </View>
      </View>

      {/* Active CV Highlight */}
      <AdminCard onPress={() => onNavigateTab("cv")} className="mb-4">
        <View style={{ gap: 12 }} className="flex-row items-center justify-between">
          <View style={{ gap: 12 }} className="flex-row items-center flex-1">
            <View
              style={{ backgroundColor: colors.goldSoft }}
              className="w-10 h-10 rounded-xl items-center justify-center shrink-0"
            >
              <FileBadge size={20} color={colors.gold} />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5">
                <Text style={{ color: colors.textMain }} className="font-bold text-sm">
                  Active Executive CV
                </Text>
                <CheckCircle2 size={14} color={colors.success} />
              </View>
              <Text
                style={{ color: colors.textMuted }}
                className="text-xs font-mono mt-0.5"
                numberOfLines={1}
              >
                {stats?.activeCvName || "keshabbhatt.com.np.pdf"}
              </Text>
            </View>
          </View>
          <AdminBadge label="Active" variant="success" size="sm" />
        </View>
      </AdminCard>

      {/* Quick Action Buttons with Proper Horizontal Gap */}
      <View className="mb-4">
        <Text style={{ color: colors.textMuted }} className="text-xs font-semibold uppercase tracking-wider mb-2.5">
          Quick Actions
        </Text>
        <View style={{ gap: 12 }} className="flex-row">
          <TouchableOpacity
            onPress={() => onNavigateTab("articles")}
            activeOpacity={0.7}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.surfaceBorder,
              borderWidth: 1,
              gap: 8,
            }}
            className="flex-1 p-3 rounded-xl flex-row items-center justify-center"
          >
            <PlusCircle size={16} color={colors.gold} />
            <Text style={{ color: colors.textMain }} className="text-xs font-semibold">
              New Article
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onNavigateTab("categories")}
            activeOpacity={0.7}
            style={{
              backgroundColor: colors.surface,
              borderColor: colors.surfaceBorder,
              borderWidth: 1,
              gap: 8,
            }}
            className="flex-1 p-3 rounded-xl flex-row items-center justify-center"
          >
            <FolderKanban size={16} color={colors.textSecondary} />
            <Text style={{ color: colors.textMain }} className="text-xs font-semibold">
              Categories
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Published Insights Section */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-3 px-0.5">
          <Text style={{ color: colors.textMuted }} className="text-xs font-semibold uppercase tracking-wider">
            Recent Published Insights
          </Text>
          <TouchableOpacity onPress={() => onNavigateTab("articles")} activeOpacity={0.7}>
            <Text style={{ color: colors.gold }} className="text-xs font-bold">
              View All ({recentBlogs.length})
            </Text>
          </TouchableOpacity>
        </View>

        {recentBlogs.length === 0 ? (
          <AdminCard>
            <Text style={{ color: colors.textMuted }} className="text-xs text-center py-4">
              No recent articles found.
            </Text>
          </AdminCard>
        ) : (
          <View style={{ gap: 12 }}>
            {recentBlogs.slice(0, 4).map((blog) => (
              <AdminCard
                key={blog.id || blog.slug}
                onPress={() => onNavigateTab("articles")}
                className="p-4"
              >
                <View style={{ gap: 12 }} className="flex-row items-start justify-between">
                  <View className="flex-1" style={{ gap: 6 }}>
                    {/* Top Row: Language badge + Category tag + Metrics */}
                    <View style={{ gap: 8 }} className="flex-row items-center flex-wrap">
                      <AdminBadge
                        label={blog.locale === "ne" ? "Nepali" : "English"}
                        variant={blog.locale === "ne" ? "info" : "gold"}
                        size="sm"
                      />
                      {blog.category ? (
                        <View
                          style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.surfaceBorder,
                            borderWidth: 1,
                          }}
                          className="px-2 py-0.5 rounded-md"
                        >
                          <Text
                            style={{ color: colors.textSecondary }}
                            className="text-[10px] font-medium"
                            numberOfLines={1}
                          >
                            {typeof blog.category === "string" ? blog.category : (blog.category as any)?.name}
                          </Text>
                        </View>
                      ) : null}

                      <View style={{ gap: 4 }} className="flex-row items-center ml-auto">
                        <Eye size={12} color={colors.textMuted} />
                        <Text style={{ color: colors.textMuted }} className="text-[11px]">
                          {blog.viewCount || 0}
                        </Text>
                      </View>
                    </View>

                    {/* Article Title */}
                    <Text
                      style={{ color: colors.textMain }}
                      className="font-bold text-sm tracking-tight leading-snug"
                      numberOfLines={2}
                    >
                      {blog.title}
                    </Text>

                    {/* Article Excerpt */}
                    {blog.excerpt ? (
                      <Text
                        style={{ color: colors.textSecondary }}
                        className="text-xs leading-relaxed"
                        numberOfLines={2}
                      >
                        {blog.excerpt}
                      </Text>
                    ) : null}

                    {/* Footer Date */}
                    {blog.publishedAt ? (
                      <View style={{ gap: 4 }} className="flex-row items-center mt-1">
                        <Calendar size={11} color={colors.textMuted} />
                        <Text style={{ color: colors.textMuted }} className="text-[10px]">
                          {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Right Chevron for Affordance */}
                  <View className="pt-2 pl-2">
                    <ChevronRight size={18} color={colors.textMuted} />
                  </View>
                </View>
              </AdminCard>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
