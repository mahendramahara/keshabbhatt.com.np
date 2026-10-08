import type {
  BlogPost,
  CreateBlogInput,
  UpdateBlogInput,
  BlogQueryParams,
  PaginationMeta,
} from "@keshab-bhatt/types";
import type { ApiResponse, ApiPaginatedResponse } from "@/utils";
import { siteUrl } from "@/config/env";

const API_BASE_URL = typeof window !== "undefined" ? "" : siteUrl;

export async function fetchBlogs(
  params: BlogQueryParams = {}
): Promise<{ data: BlogPost[]; pagination: PaginationMeta }> {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  if (params.tag) query.set("tag", params.tag);
  if (params.locale) query.set("locale", params.locale);
  if (params.isPublished !== undefined) query.set("isPublished", String(params.isPublished));
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortOrder) query.set("sortOrder", params.sortOrder);

  const queryString = query.toString();
  const url = `${API_BASE_URL}/api/blogs${queryString ? `?${queryString}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || `Failed to fetch blogs (HTTP ${res.status})`);
  }

  const json: ApiPaginatedResponse<BlogPost> = await res.json();
  return {
    data: json.data,
    pagination: json.pagination,
  };
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost> {
  const url = `${API_BASE_URL}/api/blogs/${encodeURIComponent(slug)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || `Failed to fetch blog '${slug}' (HTTP ${res.status})`);
  }

  const json: ApiResponse<BlogPost> = await res.json();
  return json.data;
}

export async function createBlog(input: CreateBlogInput): Promise<BlogPost> {
  const url = `${API_BASE_URL}/api/blogs`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || `Failed to create blog (HTTP ${res.status})`);
  }

  const json: ApiResponse<BlogPost> = await res.json();
  return json.data;
}

export async function updateBlog(slug: string, input: UpdateBlogInput): Promise<BlogPost> {
  const url = `${API_BASE_URL}/api/blogs/${encodeURIComponent(slug)}`;

  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || `Failed to update blog '${slug}' (HTTP ${res.status})`);
  }

  const json: ApiResponse<BlogPost> = await res.json();
  return json.data;
}

export async function deleteBlog(slug: string): Promise<boolean> {
  const url = `${API_BASE_URL}/api/blogs/${encodeURIComponent(slug)}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || `Failed to delete blog '${slug}' (HTTP ${res.status})`);
  }

  return true;
}
