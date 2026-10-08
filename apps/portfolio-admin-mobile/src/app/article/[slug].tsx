import React, { useEffect, useState, useCallback } from "react";
import { View, Alert, BackHandler } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import type { BlogPost } from "@keshab-bhatt/types";

import { MobileApiService } from "@/services";
import { ArticleDetailView } from "@/components/pages";
import { LoadingSpinner, EmptyState, ScreenContainer } from "@/components/ui";

export default function ArticleDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else if (router.canDismiss()) {
      router.dismissAll();
    } else {
      router.replace("/(drawer)" as any);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleBack();
        return true;
      };
      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [handleBack])
  );

  const loadBlog = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await MobileApiService.getBlogBySlug(slug);
      setBlog(data);
    } catch (err: any) {
      setError(err.message || "Failed to load article.");
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadBlog();
  }, [loadBlog]);

  const handleDelete = () => {
    if (!blog) return;
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete article "${blog.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await MobileApiService.deleteBlog(blog.slug);
              Alert.alert("Deleted", "Article removed successfully.");
              if (router.canDismiss()) {
                router.dismissAll();
              } else {
                router.replace("/(drawer)" as any);
              }
            } catch (err: any) {
              Alert.alert("Error", err.message || "Failed to delete article.");
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    if (!blog) return;
    router.push(`/article/edit/${blog.slug}` as any);
  };

  if (isLoading) {
    return (
      <ScreenContainer className="flex-1 bg-slate-950 items-center justify-center">
        <LoadingSpinner message="Loading article from Supabase..." />
      </ScreenContainer>
    );
  }

  if (error || !blog) {
    return (
      <ScreenContainer className="flex-1 bg-slate-950 px-4 justify-center">
        <EmptyState
          title="Article Not Found"
          description={error || `Could not find article with slug "${slug}".`}
          actionText="Go Back"
          onAction={handleBack}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1 bg-slate-950" edges={["top", "bottom"]}>
      <ArticleDetailView
        blog={blog}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </ScreenContainer>
  );
}
