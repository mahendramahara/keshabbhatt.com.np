import React, { useEffect, useState, useCallback } from "react";
import { Alert, BackHandler } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";

import { MobileApiService, MobileApiError } from "@/services";
import { updateBlogSchema } from "@keshab-bhatt/validation";
import { EditArticlePageView, type CreateArticleFormData } from "@/components/pages";
import { LoadingSpinner, EmptyState, ScreenContainer } from "@/components/ui";

const INITIAL_EDIT_FORM: CreateArticleFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "",
  locale: "en",
  tags: "",
};

export default function EditArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const [formData, setFormData] = useState<CreateArticleFormData>(INITIAL_EDIT_FORM);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = useCallback(() => {
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
        handleCancel();
        return true;
      };
      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [handleCancel])
  );

  useEffect(() => {
    let ignore = false;
    if (!slug) return;

    const fetchDetail = async () => {
      try {
        const data = await MobileApiService.getBlogBySlug(slug);
        if (!ignore) {
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            excerpt: data.excerpt || "",
            content: data.content || "",
            category: data.category || "",
            locale: data.locale || "en",
            tags: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          });
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err.message || "Failed to load article details.");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchDetail();
    return () => {
      ignore = true;
    };
  }, [slug]);

  const handleSubmit = async () => {
    const tagsArray = formData.tags
      ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const candidatePayload = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      tags: tagsArray,
    };

    const clientValidation = updateBlogSchema.safeParse(candidatePayload);
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
      await MobileApiService.updateBlog(slug, clientValidation.data);

      Alert.alert("Success", "Article updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            if (router.canDismiss()) {
              router.dismissAll();
            } else {
              router.replace("/(drawer)" as any);
            }
          },
        },
      ]);
    } catch (err: any) {
      if (err instanceof MobileApiError && Object.keys(err.fieldErrors).length > 0) {
        setFormErrors(err.fieldErrors);
      }
      Alert.alert(
        "Validation Requirements",
        err.message || "Failed to update article. Please review requirements."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="flex-1 bg-slate-950 items-center justify-center">
        <LoadingSpinner message="Loading article for editing..." />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer className="flex-1 bg-slate-950 px-4 justify-center">
        <EmptyState
          title="Could Not Load Article"
          description={error}
          actionText="Go Back"
          onAction={handleCancel}
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="flex-1 bg-slate-950" edges={["top", "bottom"]}>
      <EditArticlePageView
        formData={formData}
        errors={formErrors}
        isSubmitting={isSubmitting}
        onChangeField={(field, val) =>
          setFormData((prev) => ({ ...prev, [field]: val }))
        }
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </ScreenContainer>
  );
}
