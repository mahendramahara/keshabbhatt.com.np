"use client";

import React, { useState, useEffect } from "react";
import {
  FolderPlus,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  FileText,
} from "lucide-react";
import type { BlogCategory, CreateBlogCategoryInput } from "@keshab-bhatt/types";
import {
  AdminButton,
  AdminInput,
  AdminTextarea,
  AdminBadge,
  AdminModal,
  AdminCard,
  AdminTable,
  AdminTableHeader,
  AdminTableBody,
  AdminTableRow,
  AdminTableCell,
} from "../ui";
import { toast } from "sonner";

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null);

  // Form State
  const [formData, setFormData] = useState<CreateBlogCategoryInput>({
    name: "",
    slug: "",
    description: "",
    color: "#c98516",
    order: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const json = await res.json();
      if (json.success && json.data) {
        setCategories(json.data);
      }
    } catch {
      setError("Failed to fetch categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => {
      fetchCategories();
    });
  }, []);

  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug === "" || prev.slug === generateSlugFromName(prev.name) ? generateSlugFromName(name) : prev.slug,
    }));
  };

  const openCreateModal = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#c98516",
      order: categories.length + 1,
    });
    setError(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (cat: BlogCategory) => {
    setSelectedCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      color: cat.color || "#c98516",
      order: cat.order || 0,
    });
    setError(null);
    setIsEditOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error?.message || "Failed to create category");
      }

      setIsCreateOpen(false);
      setSuccessMessage(`Category '${formData.name}' created successfully.`);
      toast.success(`Category '${formData.name}' created successfully!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      fetchCategories();
    } catch (err) {
      const errText = err instanceof Error ? err.message : "Error creating category";
      setError(errText);
      toast.error(errText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/categories/${selectedCategory.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error?.message || "Failed to update category");
      }

      setIsEditOpen(false);
      setSuccessMessage(`Category '${formData.name}' updated successfully.`);
      toast.success(`Category '${formData.name}' updated successfully!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      fetchCategories();
    } catch (err) {
      const errText = err instanceof Error ? err.message : "Error updating category";
      setError(errText);
      toast.error(errText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cat: BlogCategory) => {
    if (cat.blogCount && cat.blogCount > 0) {
      alert(`Cannot delete '${cat.name}' because it contains ${cat.blogCount} published article(s). Please reassign or delete those articles first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete category '${cat.name}'?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to delete category");
      }

      setSuccessMessage(`Category '${cat.name}' deleted.`);
      toast.success(`Category '${cat.name}' deleted.`);
      setTimeout(() => setSuccessMessage(null), 4000);
      fetchCategories();
    } catch (err) {
      const errText = err instanceof Error ? err.message : "Error deleting category";
      toast.error(errText);
    }
  };

  const swatchColors = [
    "#c98516", // Navy Gold
    "#1d4ed8", // Corporate Blue
    "#059669", // Emerald
    "#7c3aed", // Violet
    "#d97706", // Amber
    "#e11d48", // Crimson
    "#0284c7", // Sky
    "#4f46e5", // Indigo
  ];

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <AdminCard
        title="Blog Categories"
        subtitle="Normalized article classification hierarchy powering front-end filtering"
        action={
          <AdminButton
            variant="primary"
            size="sm"
            icon={<FolderPlus className="w-4 h-4" />}
            onClick={openCreateModal}
          >
            Create Category
          </AdminButton>
        }
      >
        <AdminTable>
          <AdminTableHeader>
            <tr>
              <AdminTableCell isHeader>Category Name</AdminTableCell>
              <AdminTableCell isHeader>Slug / URL Identifier</AdminTableCell>
              <AdminTableCell isHeader>Description</AdminTableCell>
              <AdminTableCell isHeader>Articles Count</AdminTableCell>
              <AdminTableCell isHeader>Display Order</AdminTableCell>
              <AdminTableCell isHeader className="text-right">
                Actions
              </AdminTableCell>
            </tr>
          </AdminTableHeader>

          <AdminTableBody>
            {isLoading ? (
              <AdminTableRow>
                <AdminTableCell className="text-center py-8" isHeader={false}>
                  Loading categories...
                </AdminTableCell>
              </AdminTableRow>
            ) : categories.length === 0 ? (
              <AdminTableRow>
                <AdminTableCell className="text-center py-8 text-[var(--text-muted)]">
                  No categories created yet. Click &apos;Create Category&apos; above.
                </AdminTableCell>
              </AdminTableRow>
            ) : (
              categories.map((cat) => (
                <AdminTableRow key={cat.id}>
                  <AdminTableCell className="font-semibold text-[var(--text-main)]">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: cat.color || "#c98516" }}
                      />
                      <span>{cat.name}</span>
                    </div>
                  </AdminTableCell>

                  <AdminTableCell className="font-mono text-xs text-[var(--accent-gold)]">
                    /{cat.slug}
                  </AdminTableCell>

                  <AdminTableCell className="max-w-xs truncate text-xs text-[var(--text-muted)]">
                    {cat.description || "—"}
                  </AdminTableCell>

                  <AdminTableCell>
                    <AdminBadge variant="default" size="sm">
                      <FileText className="w-3 h-3 mr-1" />
                      {cat.blogCount || 0} {cat.blogCount === 1 ? "article" : "articles"}
                    </AdminBadge>
                  </AdminTableCell>

                  <AdminTableCell className="font-mono text-xs">{cat.order || 0}</AdminTableCell>

                  <AdminTableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <AdminButton
                        variant="ghost"
                        size="sm"
                        title="Edit Category"
                        onClick={() => openEditModal(cat)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </AdminButton>

                      <AdminButton
                        variant="ghost"
                        size="sm"
                        title="Delete Category"
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        onClick={() => handleDelete(cat)}
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
      </AdminCard>

      {/* Create Modal */}
      <AdminModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Blog Category"
        description="Add a new taxonomy category to organize professional articles and research"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleCreateSubmit} isLoading={isSubmitting}>
              Create Category
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <AdminInput
            label="Category Name"
            placeholder="e.g. Capital Markets, Banking Strategy"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />

          <AdminInput
            label="URL Slug"
            placeholder="e.g. capital-markets"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            helperText="Lowercase alphanumeric characters and hyphens only"
            required
          />

          <AdminTextarea
            label="Description (Optional)"
            placeholder="Brief explanation of topics covered in this category"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          {/* Color Tag Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)]">
              Tag Accent Color
            </label>
            <div className="flex items-center gap-2">
              {swatchColors.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: hex })}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    formData.color === hex ? "scale-125 ring-2 ring-offset-2 ring-[var(--accent-gold)]" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
              <input
                type="color"
                value={formData.color || "#c98516"}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent ml-2"
                title="Custom color"
              />
            </div>
          </div>

          <AdminInput
            label="Sort Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
            helperText="Lower numbers appear first in navigations"
          />
        </form>
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit Category: ${selectedCategory?.name}`}
        description="Update category name, URL slug, or presentation color"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsEditOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton variant="primary" onClick={handleEditSubmit} isLoading={isSubmitting}>
              Save Changes
            </AdminButton>
          </>
        }
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <AdminInput
            label="Category Name"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            required
          />

          <AdminInput
            label="URL Slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
          />

          <AdminTextarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-sub)]">
              Tag Accent Color
            </label>
            <div className="flex items-center gap-2">
              {swatchColors.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: hex })}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    formData.color === hex ? "scale-125 ring-2 ring-offset-2 ring-[var(--accent-gold)]" : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
              <input
                type="color"
                value={formData.color || "#c98516"}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-7 h-7 rounded-lg cursor-pointer border-0 bg-transparent ml-2"
                title="Custom color"
              />
            </div>
          </div>

          <AdminInput
            label="Sort Order"
            type="number"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
          />
        </form>
      </AdminModal>
    </div>
  );
};

export default CategoryManager;
