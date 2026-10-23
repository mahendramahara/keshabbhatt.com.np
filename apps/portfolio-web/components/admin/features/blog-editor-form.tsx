"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Globe,
  Tag,
} from "lucide-react";
import type { BlogPost, BlogCategory, CreateBlogInput } from "@keshab-bhatt/types";
import {
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminCard,
  AdminRichEditor,
} from "../ui";
import { toast } from "sonner";

export interface BlogEditorFormProps {
  initialBlog?: BlogPost;
  isEditing?: boolean;
}

export const BlogEditorForm: React.FC<BlogEditorFormProps> = ({
  initialBlog,
  isEditing = false,
}) => {
  const router = useRouter();
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSeoSettings, setShowSeoSettings] = useState(false);

  // Form State
  const [title, setTitle] = useState(initialBlog?.title || "");
  const [slug, setSlug] = useState(initialBlog?.slug || "");
  const [category, setCategory] = useState(initialBlog?.category || "");
  const [locale, setLocale] = useState<"en" | "ne">(initialBlog?.locale || "en");
  const [excerpt, setExcerpt] = useState(initialBlog?.excerpt || "");
  const [content, setContent] = useState(initialBlog?.content || "");
  const [tagsInput, setTagsInput] = useState(initialBlog?.tags?.join(", ") || "");
  const [isPublished, setIsPublished] = useState(
    initialBlog?.isPublished !== undefined ? initialBlog.isPublished : true
  );

  // Author State
  const [authorName, setAuthorName] = useState(
    initialBlog?.author?.name || "Keshab Datt Bhatt"
  );
  const [authorRole, setAuthorRole] = useState(
    initialBlog?.author?.role || "Management & Financial Sector Professional"
  );

  // SEO State
  const [seoTitle, setSeoTitle] = useState(initialBlog?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialBlog?.seoDescription || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialBlog?.canonicalUrl || "");

  // Auto-slug generator
  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && (!slug || slug === slugify(title))) {
      setSlug(slugify(val));
    }
    if (!seoTitle || seoTitle === title) {
      setSeoTitle(val);
    }
  };

  const handleExcerptChange = (val: string) => {
    setExcerpt(val);
    if (!seoDescription || seoDescription === excerpt) {
      setSeoDescription(val.slice(0, 160));
    }
  };

  // Fetch categories for normalized selection
  useEffect(() => {
    fetch("/api/admin/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setCategories(json.data);
          setCategory((curr) => {
            if (!curr && json.data.length > 0 && !initialBlog) {
              return json.data[0].name;
            }
            return curr;
          });
        }
      })
      .catch((err) => console.error("Error loading categories:", err))
      .finally(() => setIsLoadingCategories(false));
  }, [initialBlog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("Please enter an article title.");
      return;
    }

    if (!category) {
      setErrorMessage("Please select a category for this article.");
      return;
    }

    if (!excerpt.trim()) {
      setErrorMessage("Please provide a concise excerpt or executive summary.");
      return;
    }

    const hasMeaningfulContent = content.replace(/<[^>]*>/g, "").trim().length > 0;
    if (!hasMeaningfulContent) {
      setErrorMessage("Please write article content in the editor.");
      return;
    }

    setIsSubmitting(true);

    try {
      const tagsArray = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload: CreateBlogInput = {
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        category,
        locale,
        excerpt: excerpt.trim(),
        content,
        tags: tagsArray,
        isPublished,
        seoTitle: seoTitle.trim() || title.trim(),
        seoDescription: seoDescription.trim() || excerpt.trim(),
        canonicalUrl: canonicalUrl.trim() || undefined,
        author: {
          name: authorName.trim(),
          role: authorRole.trim(),
        },
      };

      const url = isEditing && initialBlog?.slug
        ? `/api/admin/blogs/${initialBlog.id || initialBlog.slug}`
        : "/api/admin/blogs";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error?.message || "Failed to save article");
      }

      const msg = isEditing
        ? `Article "${title}" updated successfully.`
        : `Article "${title}" published successfully.`;

      setSuccessMessage(msg);
      toast.success(msg);

      setTimeout(() => {
        router.push("/admin/blogs");
        router.refresh();
      }, 1000);
    } catch (err) {
      const errText = err instanceof Error ? err.message : "Error saving blog post";
      setErrorMessage(errText);
      toast.error(errText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = categories.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
      {/* Top Bar with Navigation & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs">
            <AdminButton variant="secondary" size="sm" icon={<ArrowLeft className="w-4 h-4" />}>
              Back to Articles
            </AdminButton>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[var(--text-main)]">
              {isEditing ? "Edit Article" : "Write Executive Article"}
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              {isEditing
                ? "Update and publish revisions for this insight"
                : "Create strategic insight with categorized metadata and rich text formatting"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Published switch */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold select-none px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)]">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded text-[var(--accent-gold)] accent-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
            />
            <span className={isPublished ? "text-emerald-500 font-bold" : "text-amber-500"}>
              {isPublished ? "Publish (Live)" : "Save as Draft"}
            </span>
          </label>

          <AdminButton
            type="submit"
            variant="primary"
            size="md"
            icon={<Save className="w-4 h-4" />}
            isLoading={isSubmitting}
          >
            {isEditing ? "Save Changes" : isPublished ? "Publish Article" : "Save Draft"}
          </AdminButton>
        </div>
      </div>

      {/* Alert Messages */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Content Card */}
      <AdminCard title="Core Article Details">
        <div className="space-y-4">
          {/* Title */}
          <AdminInput
            label="Article Title"
            placeholder="e.g. Navigating NEPSE Capital Markets: Policy Imperatives and Fiscal Resilience"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
          />

          {/* URL Slug & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminInput
              label="URL Slug"
              placeholder="e.g. navigating-nepse-capital-markets"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              helperText="Determines article URL path: /articles/[slug]"
              required
            />

            <AdminSelect
              label="Category (Normalized)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categoryOptions}
              placeholder={isLoadingCategories ? "Loading categories..." : "Select Category"}
              helperText="Categorization configured in Blog Categories menu"
              required
            />
          </div>

          {/* Language & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdminSelect
              label="Article Language"
              value={locale}
              onChange={(e) => setLocale(e.target.value as "en" | "ne")}
              options={[
                { value: "en", label: "English (Default)" },
                { value: "ne", label: "नेपाली (Nepali Language)" },
              ]}
            />

            <AdminInput
              label="Tags (Comma Separated)"
              placeholder="Finance, NEPSE, Banking, Strategy"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              leftIcon={<Tag className="w-4 h-4" />}
            />
          </div>

          {/* Excerpt */}
          <AdminTextarea
            label="Executive Excerpt / Summary"
            placeholder="Provide a concise 2-3 sentence strategic executive summary of this analysis..."
            value={excerpt}
            onChange={(e) => handleExcerptChange(e.target.value)}
            rows={3}
            required
          />

          {/* Rich Text Editor */}
          <div className="pt-2">
            <AdminRichEditor
              label="Article Body (Rich Text & HTML Editor)"
              value={content}
              onChange={setContent}
              placeholder="Start drafting your article... Use the toolbar above for headings, bold/italics, quotes, code blocks, lists, hyperlinks, and text formatting."
              minHeight="420px"
            />
          </div>
        </div>
      </AdminCard>

      {/* Author Configuration Card */}
      <AdminCard title="Author Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput
            label="Author Name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
          <AdminInput
            label="Author Title / Role"
            value={authorRole}
            onChange={(e) => setAuthorRole(e.target.value)}
          />
        </div>
      </AdminCard>

      {/* Collapsible SEO & Metadata Accordion */}
      <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSeoSettings(!showSeoSettings)}
          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[var(--bg-card-hover)] transition-colors"
        >
          <div>
            <div className="text-sm font-semibold text-[var(--text-main)] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>Search Engine Optimization (SEO) & OpenGraph</span>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Customize title tags, meta descriptions, and canonical URLs for Google indexing
            </p>
          </div>
          {showSeoSettings ? (
            <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
          )}
        </button>

        {showSeoSettings && (
          <div className="p-5 border-t border-[var(--border-subtle)] space-y-4 bg-[var(--bg-card-inner)]/40">
            <AdminInput
              label="Meta Title Tag"
              placeholder="Overrides default page title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              helperText={`${seoTitle.length}/60 recommended characters`}
            />

            <AdminTextarea
              label="Meta Description"
              placeholder="Search engine snippet preview..."
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={2}
              helperText={`${seoDescription.length}/160 recommended characters`}
            />

            <AdminInput
              label="Canonical URL (Optional)"
              placeholder="https://keshabbhatt.com.np/articles/..."
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Link href="/admin/blogs">
          <AdminButton variant="secondary" size="md">
            Cancel
          </AdminButton>
        </Link>
        <AdminButton
          type="submit"
          variant="primary"
          size="md"
          icon={<Save className="w-4 h-4" />}
          isLoading={isSubmitting}
        >
          {isEditing ? "Save Changes" : isPublished ? "Publish Article" : "Save Draft"}
        </AdminButton>
      </div>
    </form>
  );
};

export default BlogEditorForm;
