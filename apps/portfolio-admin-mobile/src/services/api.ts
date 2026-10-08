import type { BlogPost, CreateBlogInput, UpdateBlogInput, PaginationMeta } from "@keshab-bhatt/types";
import { apiBaseUrl as API_BASE_URL } from "../config/env";

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  locale?: "en" | "ne";
  tag?: string;
}

export interface BlogsApiResponse {
  success: boolean;
  data: BlogPost[];
  pagination: PaginationMeta;
  message?: string;
}

export interface SingleBlogApiResponse {
  success: boolean;
  data: BlogPost;
  message?: string;
}

export interface KeepAliveResponse {
  success: boolean;
  timestamp: string;
  message: string;
}

export class MobileApiError extends Error {
  code?: string;
  fieldErrors: Record<string, string>;
  details?: unknown;

  constructor(
    message: string,
    code?: string,
    fieldErrors: Record<string, string> = {},
    details?: unknown
  ) {
    super(message);
    this.name = "MobileApiError";
    this.code = code;
    this.fieldErrors = fieldErrors;
    this.details = details;
  }
}

function extractFieldErrors(details: unknown): Record<string, string> {
  const result: Record<string, string> = {};
  if (!details || typeof details !== "object") return result;

  const fieldErrors = (details as { fieldErrors?: Record<string, string[]> }).fieldErrors;
  if (fieldErrors && typeof fieldErrors === "object") {
    for (const [key, val] of Object.entries(fieldErrors)) {
      if (Array.isArray(val) && val.length > 0) {
        result[key] = val[0];
      }
    }
  }

  return result;
}

export class MobileApiService {
  static async getBlogs(params: GetBlogsParams = {}): Promise<{
    data: BlogPost[];
    pagination: PaginationMeta;
  }> {
    const query = new URLSearchParams();
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    if (params.category && params.category !== "all") query.set("category", params.category);
    if (params.search) query.set("search", params.search);
    if (params.locale) query.set("locale", params.locale);
    if (params.tag) query.set("tag", params.tag);

    const queryString = query.toString();
    const url = `${API_BASE_URL}/api/blogs${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to load blogs (HTTP ${response.status})`);
    }

    const json: BlogsApiResponse = await response.json();
    return {
      data: json.data || [],
      pagination: json.pagination || {
        page: 1,
        limit: 10,
        total: json.data?.length || 0,
        totalPages: 1,
        hasMore: false,
      },
    };
  }

  static async getBlogBySlug(slug: string): Promise<BlogPost> {
    const url = `${API_BASE_URL}/api/blogs/${encodeURIComponent(slug)}`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to load article '${slug}'`);
    }

    const json: SingleBlogApiResponse = await response.json();
    return json.data;
  }

  static async createBlog(input: CreateBlogInput): Promise<BlogPost> {
    const url = `${API_BASE_URL}/api/blogs`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const message = err?.error?.message || `Failed to create article (HTTP ${response.status})`;
      const fieldErrors = extractFieldErrors(err?.error?.details);
      throw new MobileApiError(message, err?.error?.code, fieldErrors, err?.error?.details);
    }

    const json: SingleBlogApiResponse = await response.json();
    return json.data;
  }

  static async updateBlog(slug: string, input: UpdateBlogInput): Promise<BlogPost> {
    const url = `${API_BASE_URL}/api/blogs/${encodeURIComponent(slug)}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const message = err?.error?.message || `Failed to update article (HTTP ${response.status})`;
      const fieldErrors = extractFieldErrors(err?.error?.details);
      throw new MobileApiError(message, err?.error?.code, fieldErrors, err?.error?.details);
    }

    const json: SingleBlogApiResponse = await response.json();
    return json.data;
  }

  static async deleteBlog(slug: string): Promise<boolean> {
    const url = `${API_BASE_URL}/api/blogs/${encodeURIComponent(slug)}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete article '${slug}'`);
    }

    return true;
  }

  static async checkKeepAlive(): Promise<KeepAliveResponse> {
    const url = `${API_BASE_URL}/api/cron/keep-alive`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Keep-alive check failed (HTTP ${response.status})`);
    }
    return response.json();
  }
}
