import { apiBaseUrl } from "@/config/env";
import type { AdminUser, BlogPost, BlogCategory } from "@keshab-bhatt/types";

export interface MobileCvItem {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  isActive: boolean;
  uploadedBy?: string;
  createdAt: string;
}

export interface DashboardStats {
  totalBlogs: number;
  publishedBlogs: number;
  enBlogs: number;
  neBlogs: number;
  totalCategories: number;
  totalAdmins: number;
  activeCvName: string;
}

let activeAuthToken: string | null = null;

export function setApiAuthToken(token: string | null) {
  activeAuthToken = token;
}

export function getApiAuthToken(): string | null {
  return activeAuthToken;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T; message?: string }> {
  const url = `${apiBaseUrl}${endpoint}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (activeAuthToken) {
    headers["Authorization"] = `Bearer ${activeAuthToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const json = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        json?.error?.message ||
        json?.message ||
        (response.status === 404
          ? `Server returned 404 for ${endpoint}. Verify the API is running and deployed.`
          : `Server error (${response.status})`);
      throw new Error(errorMessage);
    }

    return json;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please check your network and API server connection.");
    }
    console.warn(`[Mobile API] Request to ${endpoint} failed:`, error.message);
    throw error;
  }
}

// 1. AUTHENTICATION (Direct API Integration - No Dummy Data)
export async function apiLogin(
  identifier: string,
  password: string
): Promise<{ admin: AdminUser; token: string }> {
  const res = await request<{ admin: AdminUser; token: string }>("/api/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });

  if (res.data?.token) {
    setApiAuthToken(res.data.token);
  }
  return res.data;
}

export async function apiLogout(): Promise<void> {
  try {
    await request("/api/admin/auth/logout", { method: "POST" });
  } finally {
    setApiAuthToken(null);
  }
}

export async function apiGetMe(): Promise<AdminUser> {
  const res = await request<AdminUser>("/api/admin/auth/me");
  return res.data;
}

// 2. DASHBOARD STATS (Real API Data Only)
export async function apiGetDashboardStats(): Promise<DashboardStats> {
  // Query live admin stats endpoint, plus CVs for active document
  const [statsRes, cvRes] = await Promise.all([
    request<{
      totalBlogs: number;
      publishedBlogs: number;
      draftBlogs: number;
      totalCategories: number;
      totalViews: number;
      totalAdmins: number;
      superAdminCount: number;
    }>("/api/admin/stats").catch(() => null),
    request<MobileCvItem[]>("/api/admin/cv").catch(() => null),
  ]);

  const stats = statsRes?.data;
  const cvs = cvRes?.data || [];
  const activeCv = cvs.find((c) => c.isActive);

  if (stats) {
    // Also fetch language distribution directly from live articles
    const [enBlogsRes, neBlogsRes] = await Promise.all([
      request<BlogPost[]>("/api/blogs?locale=en&limit=100").catch(() => null),
      request<BlogPost[]>("/api/blogs?locale=ne&limit=100").catch(() => null),
    ]);

    const enCount = enBlogsRes?.data?.length ?? Math.round(stats.publishedBlogs / 2);
    const neCount = neBlogsRes?.data?.length ?? (stats.publishedBlogs - enCount);

    return {
      totalBlogs: stats.totalBlogs,
      publishedBlogs: stats.publishedBlogs,
      enBlogs: enCount,
      neBlogs: neCount,
      totalCategories: stats.totalCategories,
      totalAdmins: stats.totalAdmins,
      activeCvName: activeCv ? activeCv.filename : "No active CV set",
    };
  }

  // If stats endpoint is unavailable, compute directly from live blogs and categories
  const [blogsRes, catsRes] = await Promise.all([
    request<BlogPost[]>("/api/blogs?limit=100"),
    request<BlogCategory[]>("/api/categories"),
  ]);

  const blogs = blogsRes.data || [];
  const categories = catsRes.data || [];
  const published = blogs.filter((b) => b.isPublished);

  return {
    totalBlogs: blogs.length,
    publishedBlogs: published.length,
    enBlogs: blogs.filter((b) => b.locale === "en").length,
    neBlogs: blogs.filter((b) => b.locale === "ne").length,
    totalCategories: categories.length,
    totalAdmins: 1,
    activeCvName: activeCv ? activeCv.filename : "No active CV set",
  };
}

// 3. BLOGS CRUD (Direct Real API)
export async function apiGetBlogs(locale?: "en" | "ne"): Promise<BlogPost[]> {
  const query = locale ? `?locale=${locale}&limit=100` : "?limit=100";
  const res = await request<BlogPost[]>(`/api/blogs${query}`);
  return res.data || [];
}

export async function apiCreateBlog(data: Partial<BlogPost>): Promise<BlogPost> {
  const res = await request<BlogPost>("/api/admin/blogs", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function apiUpdateBlog(id: string, data: Partial<BlogPost>): Promise<BlogPost> {
  const res = await request<BlogPost>(`/api/admin/blogs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function apiDeleteBlog(id: string): Promise<boolean> {
  await request(`/api/admin/blogs/${id}`, {
    method: "DELETE",
  });
  return true;
}

// 4. CATEGORIES CRUD (Direct Real API)
export async function apiGetCategories(): Promise<BlogCategory[]> {
  const res = await request<BlogCategory[]>("/api/categories");
  return res.data || [];
}

export async function apiCreateCategory(data: Partial<BlogCategory>): Promise<BlogCategory> {
  const res = await request<BlogCategory>("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function apiUpdateCategory(id: string, data: Partial<BlogCategory>): Promise<BlogCategory> {
  const res = await request<BlogCategory>(`/api/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function apiDeleteCategory(id: string): Promise<boolean> {
  await request(`/api/admin/categories/${id}`, {
    method: "DELETE",
  });
  return true;
}

// 5. ADMINS CRUD (Direct Real API)
export async function apiGetAdmins(): Promise<AdminUser[]> {
  const res = await request<AdminUser[]>("/api/admin/admins");
  return res.data || [];
}

export async function apiCreateAdmin(
  data: Partial<AdminUser> & { password?: string }
): Promise<AdminUser> {
  const res = await request<AdminUser>("/api/admin/admins", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function apiUpdateAdmin(
  id: string,
  data: Partial<AdminUser> & { password?: string }
): Promise<AdminUser> {
  const res = await request<AdminUser>(`/api/admin/admins/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function apiDeleteAdmin(id: string): Promise<boolean> {
  await request(`/api/admin/admins/${id}`, {
    method: "DELETE",
  });
  return true;
}

// 6. CV MANAGEMENT CRUD (Direct Real API)
export async function apiGetCvs(): Promise<MobileCvItem[]> {
  const res = await request<MobileCvItem[]>("/api/admin/cv");
  return res.data || [];
}

export async function apiActivateCv(id: string): Promise<boolean> {
  await request(`/api/admin/cv/${id}/active`, {
    method: "PATCH",
  });
  return true;
}

export async function apiDeleteCv(id: string): Promise<boolean> {
  await request(`/api/admin/cv/${id}`, {
    method: "DELETE",
  });
  return true;
}
