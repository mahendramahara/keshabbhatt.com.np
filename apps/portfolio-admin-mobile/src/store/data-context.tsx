import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { BlogPost, BlogCategory, AdminUser } from "@keshab-bhatt/types";
import {
  apiGetDashboardStats,
  apiGetBlogs,
  apiCreateBlog,
  apiUpdateBlog,
  apiDeleteBlog,
  apiGetCategories,
  apiCreateCategory,
  apiUpdateCategory,
  apiDeleteCategory,
  apiGetAdmins,
  apiCreateAdmin,
  apiDeleteAdmin,
  apiGetCvs,
  apiActivateCv,
  apiDeleteCv,
  type DashboardStats,
  type MobileCvItem,
} from "@/services/api";
import { useAuth } from "./auth-context";

interface DataContextValue {
  stats: DashboardStats | null;
  blogs: BlogPost[];
  categories: BlogCategory[];
  admins: AdminUser[];
  cvs: MobileCvItem[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  createBlog: (data: Partial<BlogPost>) => Promise<void>;
  updateBlog: (id: string, data: Partial<BlogPost>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  createCategory: (data: Partial<BlogCategory>) => Promise<void>;
  updateCategory: (id: string, data: Partial<BlogCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  createAdmin: (data: Partial<AdminUser> & { password?: string }) => Promise<void>;
  deleteAdmin: (id: string) => Promise<void>;
  activateCv: (id: string) => Promise<void>;
  deleteCv: (id: string) => Promise<void>;
}

const DataContext = createContext<DataContextValue>({
  stats: null,
  blogs: [],
  categories: [],
  admins: [],
  cvs: [],
  isLoading: false,
  refreshData: async () => {},
  createBlog: async () => {},
  updateBlog: async () => {},
  deleteBlog: async () => {},
  createCategory: async () => {},
  updateCategory: async () => {},
  deleteCategory: async () => {},
  createAdmin: async () => {},
  deleteAdmin: async () => {},
  activateCv: async () => {},
  deleteCv: async () => {},
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [cvs, setCvs] = useState<MobileCvItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(async () => {
    if (!admin) return;
    setIsLoading(true);
    try {
      const [statsRes, blogsRes, catsRes, adminsRes, cvsRes] = await Promise.allSettled([
        apiGetDashboardStats(),
        apiGetBlogs(),
        apiGetCategories(),
        apiGetAdmins(),
        apiGetCvs(),
      ]);

      if (statsRes.status === "fulfilled") setStats(statsRes.value);
      if (blogsRes.status === "fulfilled") setBlogs(blogsRes.value);
      if (catsRes.status === "fulfilled") setCategories(catsRes.value);
      if (adminsRes.status === "fulfilled") setAdmins(adminsRes.value);
      if (cvsRes.status === "fulfilled") setCvs(cvsRes.value);
    } catch (e) {
      console.warn("[DataContext] Error refreshing data:", e);
    } finally {
      setIsLoading(false);
    }
  }, [admin]);

  useEffect(() => {
    if (admin) {
      refreshData();
    }
  }, [admin, refreshData]);

  const createBlog = async (data: Partial<BlogPost>) => {
    const created = await apiCreateBlog(data);
    setBlogs((prev) => [created, ...prev]);
    await refreshData();
  };

  const updateBlog = async (id: string, data: Partial<BlogPost>) => {
    const updated = await apiUpdateBlog(id, data);
    setBlogs((prev) => prev.map((b) => (b.id === id ? updated : b)));
    await refreshData();
  };

  const deleteBlog = async (id: string) => {
    await apiDeleteBlog(id);
    setBlogs((prev) => prev.filter((b) => b.id !== id));
    await refreshData();
  };

  const createCategory = async (data: Partial<BlogCategory>) => {
    const created = await apiCreateCategory(data);
    setCategories((prev) => [...prev, created]);
    await refreshData();
  };

  const updateCategory = async (id: string, data: Partial<BlogCategory>) => {
    const updated = await apiUpdateCategory(id, data);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    await refreshData();
  };

  const deleteCategory = async (id: string) => {
    await apiDeleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    await refreshData();
  };

  const createAdmin = async (data: Partial<AdminUser> & { password?: string }) => {
    const created = await apiCreateAdmin(data);
    setAdmins((prev) => [...prev, created]);
    await refreshData();
  };

  const deleteAdmin = async (id: string) => {
    await apiDeleteAdmin(id);
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    await refreshData();
  };

  const activateCv = async (id: string) => {
    await apiActivateCv(id);
    setCvs((prev) =>
      prev.map((c) => ({
        ...c,
        isActive: c.id === id,
      }))
    );
    await refreshData();
  };

  const deleteCv = async (id: string) => {
    await apiDeleteCv(id);
    setCvs((prev) => prev.filter((c) => c.id !== id));
    await refreshData();
  };

  return (
    <DataContext.Provider
      value={{
        stats,
        blogs,
        categories,
        admins,
        cvs,
        isLoading,
        refreshData,
        createBlog,
        updateBlog,
        deleteBlog,
        createCategory,
        updateCategory,
        deleteCategory,
        createAdmin,
        deleteAdmin,
        activateCv,
        deleteCv,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export function useAdminData(): DataContextValue {
  return useContext(DataContext);
}
