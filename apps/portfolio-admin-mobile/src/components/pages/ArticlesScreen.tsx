import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Calendar,
} from "lucide-react-native";
import { useAppTheme } from "@/store/theme-context";
import type { BlogPost, BlogCategory } from "@keshab-bhatt/types";
import { AdminCard } from "../ui/AdminCard";
import { AdminBadge } from "../ui/AdminBadge";
import { AdminButton } from "../ui/AdminButton";
import { AdminInput } from "../ui/AdminInput";
import { AdminFilterTabs } from "../ui/AdminFilterTabs";
import { AdminModal } from "../ui/AdminModal";
import { AdminEmptyState } from "../ui/AdminEmptyState";

export interface ArticlesScreenProps {
  blogs: BlogPost[];
  categories: BlogCategory[];
  isLoading: boolean;
  onRefresh: () => void;
  onCreateBlog: (data: Partial<BlogPost>) => Promise<void>;
  onUpdateBlog: (id: string, data: Partial<BlogPost>) => Promise<void>;
  onDeleteBlog: (id: string) => Promise<void>;
}

export const ArticlesScreen: React.FC<ArticlesScreenProps> = ({
  blogs,
  categories,
  isLoading,
  onRefresh,
  onCreateBlog,
  onUpdateBlog,
  onDeleteBlog,
}) => {
  const { colors } = useAppTheme();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formExcerpt, setFormExcerpt] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formLocale, setFormLocale] = useState<"en" | "ne">("en");
  const [formPublished, setFormPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter tabs definition
  const filterTabs = useMemo(() => {
    return [
      { id: "all", label: "All", count: blogs.length },
      { id: "en", label: "English", count: blogs.filter((b) => b.locale === "en").length },
      { id: "ne", label: "Nepali", count: blogs.filter((b) => b.locale === "ne").length },
      { id: "published", label: "Published", count: blogs.filter((b) => b.isPublished).length },
    ];
  }, [blogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      // Tab filter
      if (activeFilter === "en" && blog.locale !== "en") return false;
      if (activeFilter === "ne" && blog.locale !== "ne") return false;
      if (activeFilter === "published" && !blog.isPublished) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = blog.title.toLowerCase().includes(query);
        const matchesCategory = blog.category?.toLowerCase().includes(query);
        const matchesExcerpt = blog.excerpt?.toLowerCase().includes(query);
        return matchesTitle || matchesCategory || matchesExcerpt;
      }

      return true;
    });
  }, [blogs, activeFilter, searchQuery]);

  const handleOpenCreateModal = () => {
    setEditingBlogId(null);
    setFormTitle("");
    setFormSlug("");
    setFormExcerpt("");
    setFormContent("");
    setFormCategory(categories[0]?.name || "Banking & Financial Services");
    setFormLocale("en");
    setFormPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (blog: BlogPost) => {
    setEditingBlogId(blog.id);
    setFormTitle(blog.title);
    setFormSlug(blog.slug);
    setFormExcerpt(blog.excerpt);
    setFormContent(blog.content);
    setFormCategory(blog.category);
    setFormLocale((blog.locale as "en" | "ne") || "en");
    setFormPublished(blog.isPublished);
    setIsModalOpen(true);
  };

  const handleSaveArticle = async () => {
    if (!formTitle.trim()) {
      Alert.alert("Required", "Article title is required.");
      return;
    }
    if (!formExcerpt.trim()) {
      Alert.alert("Required", "Article summary/excerpt is required.");
      return;
    }
    if (!formContent.trim()) {
      Alert.alert("Required", "Article content is required.");
      return;
    }

    const slug =
      formSlug.trim() ||
      formTitle
        .toLowerCase()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    setIsSubmitting(true);
    try {
      const payload: Partial<BlogPost> = {
        title: formTitle.trim(),
        slug,
        excerpt: formExcerpt.trim(),
        content: formContent.trim(),
        category: formCategory,
        locale: formLocale,
        isPublished: formPublished,
        tags: [formCategory, formLocale === "ne" ? "वित्तीय" : "Finance"],
      };

      if (editingBlogId) {
        await onUpdateBlog(editingBlogId, payload);
      } else {
        await onCreateBlog(payload);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      Alert.alert("Save Failed", err.message || "Could not save article.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (blog: BlogPost) => {
    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to permanently delete "${blog.title.slice(0, 40)}..."?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await onDeleteBlog(blog.id);
            } catch (err: any) {
              Alert.alert("Delete Failed", err.message || "Failed to delete article.");
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 px-4 pt-3">
      {/* Search & New Article Action */}
      <View className="flex-row items-center gap-2.5 mb-2.5">
        <View className="flex-1">
          <AdminInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search articles by title..."
            icon={<Search size={16} color={colors.textMuted} />}
          />
        </View>
        <AdminButton
          title="New"
          onPress={handleOpenCreateModal}
          variant="gold"
          size="md"
          icon={<Plus size={16} color="#040e24" />}
        />
      </View>

      {/* Filter Tabs */}
      <AdminFilterTabs
        tabs={filterTabs}
        activeTab={activeFilter}
        onTabChange={setActiveFilter}
        className="mb-3"
      />

      {/* Articles FlatList */}
      <FlatList
        data={filteredBlogs}
        keyExtractor={(item) => item.id || item.slug}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor={colors.gold}
          />
        }
        ListEmptyComponent={
          <AdminEmptyState
            title="No Articles Found"
            subtitle="Try adjusting your search query or language filter."
            actionTitle="Create First Article"
            onAction={handleOpenCreateModal}
          />
        }
        renderItem={({ item }) => (
          <AdminCard className="mb-3 p-4">
            {/* Badges Bar */}
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-1.5 flex-wrap flex-1 mr-2">
                <AdminBadge
                  label={item.locale === "ne" ? "Nepali" : "English"}
                  variant={item.locale === "ne" ? "info" : "gold"}
                  size="sm"
                />
                <AdminBadge
                  label={item.category || "General"}
                  variant="neutral"
                  size="sm"
                />
              </View>

              <View className="flex-row items-center gap-1">
                <View
                  style={{
                    backgroundColor: item.isPublished ? colors.success : colors.textMuted,
                  }}
                  className="w-2 h-2 rounded-full"
                />
                <Text style={{ color: colors.textMuted }} className="text-[11px] font-semibold">
                  {item.isPublished ? "Published" : "Draft"}
                </Text>
              </View>
            </View>

            {/* Title */}
            <Text style={{ color: colors.textMain }} className="font-bold text-base tracking-tight mb-1">
              {item.title}
            </Text>

            {/* Excerpt */}
            <Text style={{ color: colors.textSecondary }} className="text-xs leading-relaxed mb-3" numberOfLines={2}>
              {item.excerpt}
            </Text>

            {/* Footer & Actions */}
            <View
              style={{
                borderTopColor: colors.surfaceBorder,
                borderTopWidth: 1,
              }}
              className="pt-2.5 flex-row items-center justify-between"
            >
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Eye size={12} color={colors.textMuted} />
                  <Text style={{ color: colors.textMuted }} className="text-[11px]">
                    {item.viewCount || 0}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Calendar size={12} color={colors.textMuted} />
                  <Text style={{ color: colors.textMuted }} className="text-[11px]">
                    {item.publishedAt ? item.publishedAt.slice(0, 10) : "Recent"}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={() => handleOpenEditModal(item)}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: colors.backgroundSecondary,
                    borderColor: colors.surfaceBorder,
                    borderWidth: 1,
                  }}
                  className="px-2.5 py-1 rounded-lg flex-row items-center gap-1"
                >
                  <Edit2 size={12} color={colors.textSecondary} />
                  <Text style={{ color: colors.textSecondary }} className="text-xs font-semibold">
                    Edit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDelete(item)}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: colors.dangerSoft,
                    borderColor: colors.dangerBorder,
                    borderWidth: 1,
                  }}
                  className="px-2.5 py-1 rounded-lg flex-row items-center gap-1"
                >
                  <Trash2 size={12} color={colors.danger} />
                  <Text style={{ color: colors.danger }} className="text-xs font-semibold">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </AdminCard>
        )}
      />

      {/* Create / Edit Article Modal */}
      <AdminModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBlogId ? "Edit Research Article" : "Write New Research Article"}
        footer={
          <View className="flex-row gap-2.5 pb-2">
            <AdminButton
              title="Cancel"
              onPress={() => setIsModalOpen(false)}
              variant="outline"
              size="md"
              className="flex-1"
            />
            <AdminButton
              title={editingBlogId ? "Update Article" : "Publish Article"}
              onPress={handleSaveArticle}
              variant="gold"
              size="md"
              loading={isSubmitting}
              className="flex-1"
            />
          </View>
        }
      >
        <View className="space-y-3.5 pb-4">
          <AdminInput
            label="Article Title *"
            value={formTitle}
            onChangeText={(text) => {
              setFormTitle(text);
              if (!editingBlogId) {
                setFormSlug(
                  text
                    .toLowerCase()
                    .replace(/[\s\W-]+/g, "-")
                    .replace(/^-+|-+$/g, "")
                );
              }
            }}
            placeholder="e.g. Modernizing Banking Operations"
          />

          <AdminInput
            label="URL Slug"
            value={formSlug}
            onChangeText={setFormSlug}
            placeholder="e.g. modernizing-banking-operations"
          />

          {/* Language Selector */}
          <View className="space-y-1">
            <Text style={{ color: colors.textMuted }} className="text-xs font-semibold uppercase tracking-wider">
              Language *
            </Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setFormLocale("en")}
                activeOpacity={0.7}
                style={{
                  backgroundColor: formLocale === "en" ? colors.gold : colors.inputBg,
                  borderColor: formLocale === "en" ? colors.gold : colors.surfaceBorder,
                  borderWidth: 1,
                }}
                className="flex-1 py-2 rounded-xl items-center"
              >
                <Text
                  style={{
                    color: formLocale === "en" ? "#040e24" : colors.textSecondary,
                    fontWeight: "700",
                  }}
                  className="text-xs"
                >
                  English
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setFormLocale("ne")}
                activeOpacity={0.7}
                style={{
                  backgroundColor: formLocale === "ne" ? colors.gold : colors.inputBg,
                  borderColor: formLocale === "ne" ? colors.gold : colors.surfaceBorder,
                  borderWidth: 1,
                }}
                className="flex-1 py-2 rounded-xl items-center"
              >
                <Text
                  style={{
                    color: formLocale === "ne" ? "#040e24" : colors.textSecondary,
                    fontWeight: "700",
                  }}
                  className="text-xs"
                >
                  नेपाली (Nepali)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Category Picker Pills */}
          <View className="space-y-1.5">
            <Text style={{ color: colors.textMuted }} className="text-xs font-semibold uppercase tracking-wider">
              Category *
            </Text>
            <View className="flex-row flex-wrap gap-1.5">
              {categories.map((cat) => {
                const isSelected = formCategory === cat.name;
                return (
                  <TouchableOpacity
                    key={cat.id || cat.slug}
                    onPress={() => setFormCategory(cat.name)}
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: isSelected ? colors.gold : colors.inputBg,
                      borderColor: isSelected ? colors.gold : colors.surfaceBorder,
                      borderWidth: 1,
                    }}
                    className="px-2.5 py-1.5 rounded-lg"
                  >
                    <Text
                      style={{
                        color: isSelected ? "#040e24" : colors.textSecondary,
                        fontSize: 11,
                        fontWeight: isSelected ? "700" : "500",
                      }}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <AdminInput
            label="Summary / Excerpt *"
            value={formExcerpt}
            onChangeText={setFormExcerpt}
            placeholder="Key takeaway and thesis summary..."
            multiline
            numberOfLines={3}
          />

          <AdminInput
            label="Full Article Content (Markdown) *"
            value={formContent}
            onChangeText={setFormContent}
            placeholder="Detailed sections, analysis, and recommendations..."
            multiline
            numberOfLines={8}
          />

          {/* Published Toggle */}
          <View
            style={{
              backgroundColor: colors.inputBg,
              borderColor: colors.surfaceBorder,
              borderWidth: 1,
            }}
            className="flex-row items-center justify-between p-3 rounded-xl"
          >
            <View>
              <Text style={{ color: colors.textMain }} className="text-xs font-bold">
                Publish Immediately
              </Text>
              <Text style={{ color: colors.textMuted }} className="text-[11px]">
                Visible on public portfolio immediately
              </Text>
            </View>
            <Switch
              value={formPublished}
              onValueChange={setFormPublished}
              trackColor={{ false: colors.surfaceBorder, true: colors.gold }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </AdminModal>
    </View>
  );
};

export default ArticlesScreen;
