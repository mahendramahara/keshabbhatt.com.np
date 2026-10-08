import type { BlogPost, CreateBlogInput, UpdateBlogInput, Locale } from "@keshab-bhatt/types";
import type { Blog as PrismaBlog } from "@prisma/client";

export interface BlogDatabaseRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  tags: string[];
  is_published: boolean;
  published_at: string;
  updated_at: string;
  locale: "en" | "ne";
  seo_title: string | null;
  seo_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  author_name: string;
  author_role: string;
  author_avatar: string | null;
  view_count: number;
}

export function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return baseSlug || `article-${Date.now()}`;
}

export function mapPrismaBlogToBlogPost(blog: PrismaBlog): BlogPost {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    content: blog.content,
    coverImage: blog.coverImage ?? undefined,
    category: blog.category,
    tags: Array.isArray(blog.tags) ? blog.tags : [],
    isPublished: blog.isPublished,
    publishedAt: blog.publishedAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
    locale: (blog.locale as Locale) || "en",
    seoTitle: blog.seoTitle || blog.title,
    seoDescription: blog.seoDescription || blog.excerpt,
    canonicalUrl: blog.canonicalUrl ?? undefined,
    ogImage: blog.ogImage ?? undefined,
    viewCount: blog.viewCount,
    author: {
      name: blog.authorName,
      role: blog.authorRole,
      avatarUrl: blog.authorAvatar ?? undefined,
    },
  };
}

export function mapDatabaseRowToBlogPost(row: BlogDatabaseRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image ?? undefined,
    category: row.category,
    tags: Array.isArray(row.tags) ? row.tags : [],
    isPublished: row.is_published,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
    locale: (row.locale as Locale) || "en",
    seoTitle: row.seo_title || row.title,
    seoDescription: row.seo_description || row.excerpt,
    canonicalUrl: row.canonical_url ?? undefined,
    ogImage: row.og_image ?? undefined,
    viewCount: row.view_count || 0,
    author: {
      name: row.author_name || "Keshab Datt Bhatt",
      role: row.author_role || "Management & Financial Sector Professional",
      avatarUrl: row.author_avatar ?? undefined,
    },
  };
}

export function mapCreateInputToDatabaseRow(
  input: CreateBlogInput
): Omit<BlogDatabaseRow, "id" | "updated_at" | "view_count"> {
  const now = new Date().toISOString();
  const slug = input.slug || generateSlug(input.title);

  return {
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    cover_image: input.coverImage || null,
    category: input.category,
    tags: input.tags || [],
    is_published: input.isPublished ?? true,
    published_at: input.publishedAt || now,
    locale: (input.locale as "en" | "ne") || "en",
    seo_title: input.seoTitle || input.title,
    seo_description: input.seoDescription || input.excerpt,
    canonical_url: input.canonicalUrl || null,
    og_image: input.ogImage || null,
    author_name: input.author?.name || "Keshab Datt Bhatt",
    author_role: input.author?.role || "Management & Financial Sector Professional",
    author_avatar: input.author?.avatarUrl || null,
  };
}

export function mapUpdateInputToDatabaseRow(
  input: UpdateBlogInput
): Partial<BlogDatabaseRow> {
  const payload: Partial<BlogDatabaseRow> = {
    updated_at: new Date().toISOString(),
  };

  if (input.title !== undefined) payload.title = input.title;
  if (input.slug !== undefined) payload.slug = input.slug;
  if (input.excerpt !== undefined) payload.excerpt = input.excerpt;
  if (input.content !== undefined) payload.content = input.content;
  if (input.coverImage !== undefined) payload.cover_image = input.coverImage || null;
  if (input.category !== undefined) payload.category = input.category;
  if (input.tags !== undefined) payload.tags = input.tags;
  if (input.isPublished !== undefined) payload.is_published = input.isPublished;
  if (input.publishedAt !== undefined) payload.published_at = input.publishedAt;
  if (input.locale !== undefined) payload.locale = input.locale as "en" | "ne";
  if (input.seoTitle !== undefined) payload.seo_title = input.seoTitle || null;
  if (input.seoDescription !== undefined) payload.seo_description = input.seoDescription || null;
  if (input.canonicalUrl !== undefined) payload.canonical_url = input.canonicalUrl || null;
  if (input.ogImage !== undefined) payload.og_image = input.ogImage || null;

  if (input.author) {
    if (input.author.name !== undefined) payload.author_name = input.author.name;
    if (input.author.role !== undefined) payload.author_role = input.author.role;
    if (input.author.avatarUrl !== undefined) payload.author_avatar = input.author.avatarUrl || null;
  }

  return payload;
}
