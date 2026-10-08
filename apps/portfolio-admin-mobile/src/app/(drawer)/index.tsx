import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Alert, BackHandler } from "react-native";
import { useRouter, useNavigation, useFocusEffect } from "expo-router";
import type { DrawerNavigationProp } from "expo-router/drawer";
import type { BlogPost } from "@keshab-bhatt/types";

import { useTab } from "@/store/tab-context";
import { MobileApiService, MobileApiError } from "@/services";
import { createBlogSchema } from "@keshab-bhatt/validation";

import { AppHeader, TopTabBar, ScreenContainer } from "@/components/ui";
import {
  DashboardPageView,
  ArticlesPageView,
  CreateArticlePageView,
  CloudSyncPageView,
  type CreateArticleFormData,
} from "@/components/pages";

const INITIAL_FORM: CreateArticleFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Core Banking & FinTech",
  locale: "en",
  tags: "",
};

export default function MainCmsScreen() {
  const router = useRouter();
  const navigation = useNavigation<DrawerNavigationProp<Record<string, undefined>>>();
  const { activeTab, setActiveTab } = useTab();

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocale, setSelectedLocale] = useState<"all" | "en" | "ne">("all");

  const [formData, setFormData] = useState<CreateArticleFormData>(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isPinging, setIsPinging] = useState(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [lastCheckResult, setLastCheckResult] = useState<{
    success: boolean;
    message: string;
    timestamp: string;
  } | null>(null);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await MobileApiService.getBlogs({ limit: 50 });
      setBlogs(res.data);
    } catch (err: any) {
      console.warn("Error loading blogs:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (activeTab !== "home") {
          setActiveTab("home");
          return true;
        }

        Alert.alert(
          "Exit App",
          "Are you sure you want to close and exit the application?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Exit",
              style: "destructive",
              onPress: () => BackHandler.exitApp(),
            },
          ]
        );
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription.remove();
    }, [activeTab, setActiveTab])
  );

  const totalArticles = blogs.length;
  const englishCount = useMemo(
    () => blogs.filter((b) => b.locale === "en" || !b.locale).length,
    [blogs]
  );
  const nepaliCount = useMemo(
    () => blogs.filter((b) => b.locale === "ne").length,
    [blogs]
  );
  const totalViews = useMemo(
    () => blogs.reduce((acc, b) => acc + (b.viewCount || 0), 0),
    [blogs]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [blogs]);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((b) => {
      if (selectedCategory !== "all" && b.category !== selectedCategory) {
        return false;
      }
      if (selectedLocale !== "all" && b.locale !== selectedLocale) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = b.title.toLowerCase().includes(q);
        const matchesExcerpt = b.excerpt?.toLowerCase().includes(q);
        const matchesTags = b.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesExcerpt && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [blogs, selectedCategory, selectedLocale, searchQuery]);

  const handleOpenDrawer = () => {
    navigation.openDrawer();
  };

  const handleToggleLocale = () => {
    setSelectedLocale((prev) => (prev === "en" ? "ne" : "en"));
    if (activeTab !== "articles") {
      setActiveTab("articles");
    }
  };

  const handleDeleteBlog = (slug: string) => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete article "${slug}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await MobileApiService.deleteBlog(slug);
              setBlogs((prev) => prev.filter((b) => b.slug !== slug));
              Alert.alert("Success", "Article deleted successfully.");
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to delete article.");
            }
          },
        },
      ]
    );
  };

  const handleGenerateSlug = () => {
    if (!formData.title) return;
    const generated = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData((prev) => ({ ...prev, slug: generated }));
  };

  const handleCreateSubmit = async () => {
    const tagsArray = formData.tags
      ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const candidatePayload = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || undefined,
      category: formData.category.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      locale: formData.locale,
      tags: tagsArray,
      author: {
        name: "Keshab Datt Bhatt",
        role: "Management & Financial Sector Professional",
      },
    };

    const clientValidation = createBlogSchema.safeParse(candidatePayload);
    if (!clientValidation.success) {
      const fieldErrors: Record<string, string> = {};
      const flattened = clientValidation.error.flatten().fieldErrors;
      for (const [key, msgList] of Object.entries(flattened)) {
        if (Array.isArray(msgList) && msgList.length > 0) {
          fieldErrors[key] = msgList[0];
        }
      }
      setFormErrors(fieldErrors);

      const errorMessages = Object.values(fieldErrors).join("\n• ");
      Alert.alert(
        "Validation Requirements",
        `Please satisfy the following requirements:\n\n• ${errorMessages}`
      );
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const newArticle = await MobileApiService.createBlog(clientValidation.data);

      setBlogs((prev) => [newArticle, ...prev]);
      setFormData(INITIAL_FORM);
      setActiveTab("home");
      Alert.alert("Success", "Article published successfully to Supabase!", [
        {
          text: "OK",
          onPress: () => setActiveTab("home"),
        },
      ]);
    } catch (err: any) {
      if (err instanceof MobileApiError && Object.keys(err.fieldErrors).length > 0) {
        setFormErrors(err.fieldErrors);
      }
      Alert.alert(
        "Validation Requirements",
        err.message || "Failed to publish article. Please review form entries."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerKeepAlive = async () => {
    setIsPinging(true);
    const start = Date.now();
    try {
      const res = await MobileApiService.checkKeepAlive();
      const elapsed = Date.now() - start;
      setLatencyMs(elapsed);
      setLastCheckResult({
        success: true,
        message: res.message || "Supabase database ping responded successfully.",
        timestamp: new Date().toLocaleTimeString(),
      });
      Alert.alert("Keep-Alive Succeeded", `Ping responded in ${elapsed}ms.`);
    } catch (err: any) {
      setLastCheckResult({
        success: false,
        message: err.message || "Failed to reach server.",
        timestamp: new Date().toLocaleTimeString(),
      });
      Alert.alert("Ping Failed", err.message || "Server did not respond.");
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <ScreenContainer className="flex-1 bg-slate-950">
      <AppHeader
        onOpenDrawer={handleOpenDrawer}
        onRefresh={fetchBlogs}
        currentLocale={selectedLocale === "ne" ? "ne" : "en"}
        onToggleLocale={handleToggleLocale}
      />

      <TopTabBar activeTab={activeTab} onSelectTab={setActiveTab} />

      <View className="flex-1">
        {activeTab === "home" ? (
          <DashboardPageView
            totalArticles={totalArticles}
            englishCount={englishCount}
            nepaliCount={nepaliCount}
            totalViews={totalViews}
            recentArticles={blogs.slice(0, 4)}
            isLoading={isLoading}
            onRefresh={fetchBlogs}
            onSelectBlog={(slug) => router.push(`/article/${slug}` as any)}
            onEditBlog={(slug) => router.push(`/article/edit/${slug}` as any)}
            onDeleteBlog={handleDeleteBlog}
            onGoToArticles={() => setActiveTab("articles")}
            onGoToCreate={() => setActiveTab("create")}
            onGoToHealth={() => setActiveTab("health")}
          />
        ) : activeTab === "articles" ? (
          <ArticlesPageView
            blogs={filteredBlogs}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            categories={categories}
            onSelectCategory={setSelectedCategory}
            selectedLocale={selectedLocale}
            onSelectLocale={setSelectedLocale}
            isLoading={isLoading}
            onRefresh={fetchBlogs}
            onSelectBlog={(slug) => router.push(`/article/${slug}` as any)}
            onEditBlog={(slug) => router.push(`/article/edit/${slug}` as any)}
            onDeleteBlog={handleDeleteBlog}
            onGoToCreate={() => setActiveTab("create")}
          />
        ) : activeTab === "create" ? (
          <CreateArticlePageView
            formData={formData}
            errors={formErrors}
            isSubmitting={isSubmitting}
            onChangeField={(field, val) =>
              setFormData((prev) => ({ ...prev, [field]: val }))
            }
            onGenerateSlug={handleGenerateSlug}
            onSubmit={handleCreateSubmit}
            onReset={() => {
              setFormData(INITIAL_FORM);
              setFormErrors({});
            }}
          />
        ) : activeTab === "health" ? (
          <CloudSyncPageView
            isChecking={isPinging}
            lastCheckResult={lastCheckResult}
            latencyMs={latencyMs}
            onTriggerKeepAlive={handleTriggerKeepAlive}
            totalArticles={totalArticles}
          />
        ) : null}
      </View>
    </ScreenContainer>
  );
}
