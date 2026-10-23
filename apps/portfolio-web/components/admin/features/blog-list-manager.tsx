"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  PenSquare,
  Search,
  Filter,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  Calendar,
  Globe,
} from "lucide-react";
import type { BlogPost, BlogCategory } from "@keshab-bhatt/types";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
  AdminBadge,
  AdminCard,
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
} from "../ui";
import { toast } from "sonner";

export const BlogListManager: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLocale, setSelectedLocale] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory) params.set("category", selectedCategory);
      if (selectedStatus !== "all") params.set("isPublished", selectedStatus === "published" ? "true" : "false");
      if (selectedLocale) params.set("locale", selectedLocale);
      params.set("limit", "100");

      const res = await fetch(`/api/admin/blogs?${params.toString()}`);
      const json = await res.json();
      if (json.success && json.data) {
        setBlogs(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      if (json.success && json.data) {
        setCategories(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => {
      fetchCategories();
    });
  }, []);

  useEffect(() => {
    void Promise.resolve().then(() => {
      fetchBlogs();
    });
  }, [search, selectedCategory, selectedStatus, selectedLocale]);

  const handleDelete = async (blog: BlogPost) => {
    if (!confirm(`Are you sure you want to delete article: "${blog.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/blogs/${blog.id || blog.slug}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to delete article");
      }

      setSuccessMessage(`Article "${blog.title}" has been deleted.`);
      toast.success(`Article "${blog.title}" deleted.`);
      setTimeout(() => setSuccessMessage(null), 4000);
      fetchBlogs();
    } catch (err) {
      const errText = err instanceof Error ? err.message : "Error deleting blog";
      toast.error(errText);
    }
  };

  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map((c) => ({ value: c.name, label: c.name })),
  ];

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Header and Filter Card */}
      <AdminCard
        title="Articles & Executive Insights"
        subtitle="Manage, filter, publish, and draft strategic analysis and leadership articles"
        action={
          <Link href="/admin/blogs/new">
            <AdminButton variant="primary" size="sm" icon={<PenSquare className="w-4 h-4" />}>
              Write Article
            </AdminButton>
          </Link>
        }
      >
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <AdminInput
              placeholder="Search by title or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />

            <AdminSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categoryOptions}
            />

            <AdminSelect
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "published", label: "Published Only" },
                { value: "draft", label: "Drafts Only" },
              ]}
            />

            <AdminSelect
              value={selectedLocale}
              onChange={(e) => setSelectedLocale(e.target.value)}
              options={[
                { value: "", label: "All Languages (EN / NE)" },
                { value: "en", label: "English Only" },
                { value: "ne", label: "Nepali Only" },
              ]}
            />
          </div>

          {/* Blogs Table */}
          <AdminTable>
            <AdminTableHeader>
              <tr>
                <AdminTableCell isHeader>Article Title</AdminTableCell>
                <AdminTableCell isHeader>Category</AdminTableCell>
                <AdminTableCell isHeader>Language</AdminTableCell>
                <AdminTableCell isHeader>Status</AdminTableCell>
                <AdminTableCell isHeader>Views</AdminTableCell>
                <AdminTableCell isHeader>Date</AdminTableCell>
                <AdminTableCell isHeader className="text-right">
                  Actions
                </AdminTableCell>
              </tr>
            </AdminTableHeader>

            <AdminTableBody>
              {isLoading ? (
                <AdminTableRow>
                  <AdminTableCell className="text-center py-8" isHeader={false}>
                    Loading articles...
                  </AdminTableCell>
                </AdminTableRow>
              ) : blogs.length === 0 ? (
                <AdminTableRow>
                  <AdminTableCell className="text-center py-8 text-[var(--text-muted)]">
                    No articles found matching the current filters.
                  </AdminTableCell>
                </AdminTableRow>
              ) : (
                blogs.map((blog) => (
                  <AdminTableRow key={blog.id || blog.slug}>
                    <AdminTableCell className="font-semibold text-[var(--text-main)] max-w-sm">
                      <div className="line-clamp-1">{blog.title}</div>
                      <div className="text-xs font-normal text-[var(--text-muted)] line-clamp-1">
                        {blog.excerpt}
                      </div>
                    </AdminTableCell>

                    <AdminTableCell>
                      <AdminBadge variant="gold" size="sm">
                        {blog.category}
                      </AdminBadge>
                    </AdminTableCell>

                    <AdminTableCell>
                      <span className="inline-flex items-center gap-1 text-xs uppercase font-mono px-2 py-0.5 rounded bg-[var(--bg-card-inner)] border border-[var(--border-subtle)]">
                        <Globe className="w-3 h-3 text-[var(--accent-gold)]" />
                        {blog.locale || "en"}
                      </span>
                    </AdminTableCell>

                    <AdminTableCell>
                      <AdminBadge variant={blog.isPublished ? "success" : "warning"} size="sm">
                        {blog.isPublished ? "Live" : "Draft"}
                      </AdminBadge>
                    </AdminTableCell>

                    <AdminTableCell className="text-xs font-mono">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[var(--text-muted)]" />
                        {(blog.viewCount || 0).toLocaleString()}
                      </span>
                    </AdminTableCell>

                    <AdminTableCell className="text-xs text-[var(--text-muted)] whitespace-nowrap">
                      {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "—"}
                    </AdminTableCell>

                    <AdminTableCell className="text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/articles/${blog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View live article"
                        >
                          <AdminButton variant="ghost" size="sm">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </AdminButton>
                        </Link>

                        <Link href={`/admin/blogs/${blog.id || blog.slug}/edit`} title="Edit article">
                          <AdminButton variant="ghost" size="sm">
                            <Edit className="w-3.5 h-3.5" />
                          </AdminButton>
                        </Link>

                        <AdminButton
                          variant="ghost"
                          size="sm"
                          title="Delete article"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={() => handleDelete(blog)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </AdminButton>
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                ))
              )}
            </AdminTableBody>
          </AdminTable>
        </div>
      </AdminCard>
    </div>
  );
};

export default BlogListManager;
