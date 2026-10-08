import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  mapPrismaBlogToBlogPost,
  generateSlug,
} from "@/models";
import { getArticlesData } from "@keshab-bhatt/content";
import type {
  BlogPost,
  CreateBlogInput,
  UpdateBlogInput,
  BlogQueryParams,
  PaginationMeta,
  Locale,
} from "@keshab-bhatt/types";

// In-memory store used as graceful fallback if database is ever unavailable
const inMemoryFallbackBlogs: BlogPost[] = [];

/**
 * Seeds in-memory articles from @keshab-bhatt/content for graceful fallback.
 */
function getFallbackInitialData(locale: Locale = "en"): BlogPost[] {
  if (inMemoryFallbackBlogs.length > 0) {
    return inMemoryFallbackBlogs.filter((b) => !b.locale || b.locale === locale);
  }

  const enArticles = getArticlesData("en").items;
  const neArticles = getArticlesData("ne").items;

  const mappedEn: BlogPost[] = enArticles.map((art) => ({
    id: art.id,
    slug: art.slug || art.id,
    title: art.title,
    excerpt: art.summary,
    content: (art.content || [art.keyArgument, art.implications]).join("\n\n"),
    category: art.category,
    tags: [art.category, "Finance", "Strategy"],
    isPublished: true,
    publishedAt: art.date || new Date().toISOString(),
    updatedAt: art.date || new Date().toISOString(),
    locale: "en",
    seoTitle: art.title,
    seoDescription: art.summary,
    viewCount: 120,
    author: {
      name: "Keshab Datt Bhatt",
      role: "Management & Financial Sector Professional",
    },
  }));

  const mappedNe: BlogPost[] = neArticles.map((art) => ({
    id: art.id,
    slug: art.slug || art.id,
    title: art.title,
    excerpt: art.summary,
    content: (art.content || [art.keyArgument, art.implications]).join("\n\n"),
    category: art.category,
    tags: [art.category, "वित्तीय", "रणनीति"],
    isPublished: true,
    publishedAt: art.date || new Date().toISOString(),
    updatedAt: art.date || new Date().toISOString(),
    locale: "ne",
    seoTitle: art.title,
    seoDescription: art.summary,
    viewCount: 95,
    author: {
      name: "केशव दत्त भट्ट",
      role: "व्यवस्थापन तथा वित्तीय क्षेत्र विज्ञ",
    },
  }));

  inMemoryFallbackBlogs.push(...mappedEn, ...mappedNe);
  return inMemoryFallbackBlogs.filter((b) => b.locale === locale);
}

export class BlogService {
  static async getBlogs(params: BlogQueryParams = {}): Promise<{
    data: BlogPost[];
    pagination: PaginationMeta;
  }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const offset = (page - 1) * limit;

    try {
      const where: Prisma.BlogWhereInput = {};

      if (params.locale) {
        where.locale = params.locale;
      }

      if (params.category) {
        where.category = {
          contains: params.category,
          mode: "insensitive",
        };
      }

      if (params.isPublished !== undefined) {
        where.isPublished = params.isPublished;
      } else {
        where.isPublished = true;
      }

      if (params.search) {
        where.OR = [
          { title: { contains: params.search, mode: "insensitive" } },
          { excerpt: { contains: params.search, mode: "insensitive" } },
          { content: { contains: params.search, mode: "insensitive" } },
        ];
      }

      if (params.tag) {
        where.tags = { has: params.tag };
      }

      const orderBy: Prisma.BlogOrderByWithRelationInput = {};
      const sortCol = params.sortBy || "publishedAt";
      const orderDir = params.sortOrder || "desc";

      if (sortCol === "title") orderBy.title = orderDir;
      else if (sortCol === "viewCount") orderBy.viewCount = orderDir;
      else if (sortCol === "createdAt") orderBy.createdAt = orderDir;
      else orderBy.publishedAt = orderDir;

      const [total, blogs] = await Promise.all([
        prisma.blog.count({ where }),
        prisma.blog.findMany({
          where,
          orderBy,
          skip: offset,
          take: limit,
        }),
      ]);

      const totalPages = Math.ceil(total / limit) || 1;
      const mappedPosts = blogs.map(mapPrismaBlogToBlogPost);

      return {
        data: mappedPosts,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        },
      };
    } catch (error) {
      console.warn("Prisma getBlogs fallback to in-memory:", error);
      return this.getFallbackPaginated(params, page, limit);
    }
  }

  static async getBlogBySlug(slug: string, locale?: Locale): Promise<BlogPost | null> {
    try {
      if (locale) {
        const blog = await prisma.blog.findUnique({
          where: {
            slug_locale: {
              slug,
              locale,
            },
          },
        });
        if (blog) {
          return mapPrismaBlogToBlogPost(blog);
        }
      }

      const blog = await prisma.blog.findFirst({
        where: {
          slug,
          ...(locale ? { locale } : {}),
        },
      });

      if (blog) {
        return mapPrismaBlogToBlogPost(blog);
      }
    } catch (error) {
      console.warn(`Prisma getBlogBySlug (${slug}) fallback:`, error);
    }

    const currentLocale = locale || "en";
    const all = inMemoryFallbackBlogs.length > 0 ? inMemoryFallbackBlogs : getFallbackInitialData(currentLocale);
    return all.find((b) => (b.slug === slug || b.id === slug) && (!locale || b.locale === locale)) || null;
  }

  static async getBlogById(id: string): Promise<BlogPost | null> {
    try {
      const blog = await prisma.blog.findUnique({
        where: { id },
      });

      if (blog) {
        return mapPrismaBlogToBlogPost(blog);
      }
    } catch (error) {
      console.warn(`Prisma getBlogById (${id}) fallback:`, error);
    }

    const all = inMemoryFallbackBlogs.length > 0 ? inMemoryFallbackBlogs : getFallbackInitialData("en");
    return all.find((b) => b.id === id) || null;
  }

  static async createBlog(input: CreateBlogInput): Promise<BlogPost> {
    const slug = input.slug || generateSlug(input.title);

    try {
      const created = await prisma.blog.create({
        data: {
          slug,
          title: input.title,
          excerpt: input.excerpt,
          content: input.content,
          coverImage: input.coverImage || null,
          category: input.category,
          tags: input.tags || [],
          isPublished: input.isPublished ?? true,
          publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
          locale: input.locale || "en",
          seoTitle: input.seoTitle || input.title,
          seoDescription: input.seoDescription || input.excerpt,
          canonicalUrl: input.canonicalUrl || null,
          ogImage: input.ogImage || null,
          authorName: input.author?.name || "Keshab Datt Bhatt",
          authorRole: input.author?.role || "Management & Financial Sector Professional",
          authorAvatar: input.author?.avatarUrl || null,
        },
      });

      return mapPrismaBlogToBlogPost(created);
    } catch (error) {
      console.warn("Prisma createBlog fallback to in-memory:", error);
      const newPost: BlogPost = {
        id: `local-${Date.now()}`,
        slug,
        title: input.title,
        excerpt: input.excerpt,
        content: input.content,
        coverImage: input.coverImage,
        category: input.category,
        tags: input.tags || [],
        isPublished: input.isPublished ?? true,
        publishedAt: input.publishedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        locale: input.locale || "en",
        seoTitle: input.seoTitle || input.title,
        seoDescription: input.seoDescription || input.excerpt,
        canonicalUrl: input.canonicalUrl,
        ogImage: input.ogImage,
        viewCount: 0,
        author: {
          name: input.author?.name || "Keshab Datt Bhatt",
          role: input.author?.role || "Management & Financial Sector Professional",
          avatarUrl: input.author?.avatarUrl,
        },
      };

      inMemoryFallbackBlogs.unshift(newPost);
      return newPost;
    }
  }

  static async updateBlog(slugOrId: string, input: UpdateBlogInput): Promise<BlogPost | null> {
    try {
      const updateData: Prisma.BlogUpdateInput = {};

      if (input.title !== undefined) updateData.title = input.title;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
      if (input.content !== undefined) updateData.content = input.content;
      if (input.coverImage !== undefined) updateData.coverImage = input.coverImage || null;
      if (input.category !== undefined) updateData.category = input.category;
      if (input.tags !== undefined) updateData.tags = input.tags;
      if (input.isPublished !== undefined) updateData.isPublished = input.isPublished;
      if (input.publishedAt !== undefined) updateData.publishedAt = new Date(input.publishedAt);
      if (input.locale !== undefined) updateData.locale = input.locale;
      if (input.seoTitle !== undefined) updateData.seoTitle = input.seoTitle || null;
      if (input.seoDescription !== undefined) updateData.seoDescription = input.seoDescription || null;
      if (input.canonicalUrl !== undefined) updateData.canonicalUrl = input.canonicalUrl || null;
      if (input.ogImage !== undefined) updateData.ogImage = input.ogImage || null;

      if (input.author) {
        if (input.author.name !== undefined) updateData.authorName = input.author.name;
        if (input.author.role !== undefined) updateData.authorRole = input.author.role;
        if (input.author.avatarUrl !== undefined) updateData.authorAvatar = input.author.avatarUrl || null;
      }

      const existing = await prisma.blog.findFirst({
        where: {
          OR: [{ id: slugOrId }, { slug: slugOrId }],
        },
      });

      if (!existing) {
        return null;
      }

      const updated = await prisma.blog.update({
        where: { id: existing.id },
        data: updateData,
      });

      return mapPrismaBlogToBlogPost(updated);
    } catch (error) {
      console.warn(`Prisma updateBlog (${slugOrId}) fallback:`, error);
      const all = inMemoryFallbackBlogs.length > 0 ? inMemoryFallbackBlogs : getFallbackInitialData("en");
      const index = all.findIndex((b) => b.slug === slugOrId || b.id === slugOrId);
      if (index === -1) return null;

      const existing = all[index];
      const updated: BlogPost = {
        ...existing,
        ...input,
        updatedAt: new Date().toISOString(),
      };
      all[index] = updated;
      return updated;
    }
  }

  static async deleteBlog(slugOrId: string): Promise<boolean> {
    try {
      const existing = await prisma.blog.findFirst({
        where: {
          OR: [{ id: slugOrId }, { slug: slugOrId }],
        },
      });

      if (!existing) {
        return false;
      }

      await prisma.blog.delete({
        where: { id: existing.id },
      });
      return true;
    } catch (error) {
      console.warn(`Prisma deleteBlog (${slugOrId}) fallback:`, error);
      const all = inMemoryFallbackBlogs.length > 0 ? inMemoryFallbackBlogs : getFallbackInitialData("en");
      const index = all.findIndex((b) => b.slug === slugOrId || b.id === slugOrId);
      if (index === -1) return false;
      all.splice(index, 1);
      return true;
    }
  }

  static async incrementViews(slug: string): Promise<void> {
    try {
      const existing = await prisma.blog.findFirst({
        where: { slug },
      });

      if (existing) {
        await prisma.blog.update({
          where: { id: existing.id },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        });
      }
    } catch {
      // Non-critical metric increment
    }
  }

  /**
   * Helper for in-memory paginated fallback queries.
   */
  private static getFallbackPaginated(
    params: BlogQueryParams,
    page: number,
    limit: number
  ): { data: BlogPost[]; pagination: PaginationMeta } {
    const currentLocale = params.locale || "en";
    let list = inMemoryFallbackBlogs.length > 0 ? inMemoryFallbackBlogs : getFallbackInitialData(currentLocale);

    if (params.locale) {
      list = list.filter((b) => b.locale === params.locale);
    }

    if (params.category) {
      const c = params.category.toLowerCase();
      list = list.filter((b) => b.category.toLowerCase().includes(c));
    }

    if (params.search) {
      const s = params.search.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(s) ||
          b.excerpt.toLowerCase().includes(s) ||
          b.content.toLowerCase().includes(s)
      );
    }

    if (params.tag) {
      list = list.filter((b) => b.tags.some((t) => t.toLowerCase() === params.tag?.toLowerCase()));
    }

    if (params.isPublished !== undefined) {
      list = list.filter((b) => b.isPublished === params.isPublished);
    }

    const total = list.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginated = list.slice(offset, offset + limit);

    return {
      data: paginated,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages,
      },
    };
  }
}
