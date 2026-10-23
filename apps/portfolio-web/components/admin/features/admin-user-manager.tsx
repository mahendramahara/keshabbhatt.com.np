"use client";

import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Shield,
  Trash2,
  Edit2,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import type { AdminUser, AdminRole } from "@keshab-bhatt/types";
import {
  AdminButton,
  AdminInput,
  AdminSelect,
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
import { useAdminAuth } from "../layout/admin-auth-guard";

export const AdminUserManager: React.FC = () => {
  const { admin: currentAdmin } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    role: "admin" as AdminRole,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/admins");
      const json = await res.json();
      if (json.success && json.data) {
        setAdmins(json.data);
      }
    } catch {
      setError("Failed to load administrators list.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => {
      fetchAdmins();
    });
  }, []);

  const openCreateModal = () => {
    setFormData({
      name: "",
      email: "",
      username: "",
      password: "",
      role: "admin",
    });
    setError(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      username: admin.username,
      password: "", // Leave blank to keep unchanged
      role: admin.role,
    });
    setError(null);
    setIsEditOpen(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error?.message || "Failed to create administrator");
      }

      setIsCreateOpen(false);
      setSuccessMessage(`Administrator '${formData.name}' created successfully.`);
      toast.success(`Administrator '${formData.name}' created!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      fetchAdmins();
    } catch (err) {
      const errText = err instanceof Error ? err.message : "Error creating admin";
      setError(errText);
      toast.error(errText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        name: formData.name,
        email: formData.email,
        username: formData.username,
        role: formData.role,
      };

      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      const res = await fetch(`/api/admin/admins/${selectedAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || json.error?.message || "Failed to update administrator");
      }

      setIsEditOpen(false);
      setSuccessMessage(`Administrator '${formData.name}' updated successfully.`);
      toast.success(`Administrator '${formData.name}' updated!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      fetchAdmins();
    } catch (err) {
      const errText = err instanceof Error ? err.message : "Error updating admin";
      setError(errText);
      toast.error(errText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (admin.role === "superadmin") {
      alert("Permission Denied: Super Admin accounts cannot be deleted!");
      return;
    }

    if (!confirm(`Are you sure you want to delete administrator '${admin.name}' (@${admin.username})?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to delete administrator");
      }

      setSuccessMessage(`Administrator '${admin.name}' deleted.`);
      toast.success(`Administrator '${admin.name}' deleted.`);
      setTimeout(() => setSuccessMessage(null), 4000);
      fetchAdmins();
    } catch (err) {
      const errText = err instanceof Error ? err.message : "Error deleting administrator";
      toast.error(errText);
    }
  };

  const isSuperAdmin = currentAdmin?.role === "superadmin";

  return (
    <div className="space-y-6">
      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Admin Card */}
      <AdminCard
        title="System Administrators"
        subtitle="Manage administrative accounts, access credentials, and role privileges"
        action={
          isSuperAdmin ? (
            <AdminButton
              variant="primary"
              size="sm"
              icon={<UserPlus className="w-4 h-4" />}
              onClick={openCreateModal}
            >
              Add Administrator
            </AdminButton>
          ) : (
            <span className="text-xs text-[var(--text-muted)] italic">
              Read-only mode (Super Admin only for modifications)
            </span>
          )
        }
      >
        <AdminTable>
          <AdminTableHeader>
            <tr>
              <AdminTableCell isHeader>Administrator</AdminTableCell>
              <AdminTableCell isHeader>Username</AdminTableCell>
              <AdminTableCell isHeader>Email</AdminTableCell>
              <AdminTableCell isHeader>Role</AdminTableCell>
              <AdminTableCell isHeader>Status</AdminTableCell>
              <AdminTableCell isHeader className="text-right">
                Actions
              </AdminTableCell>
            </tr>
          </AdminTableHeader>

          <AdminTableBody>
            {isLoading ? (
              <AdminTableRow>
                <AdminTableCell className="text-center py-8" isHeader={false}>
                  Loading administrators...
                </AdminTableCell>
              </AdminTableRow>
            ) : admins.length === 0 ? (
              <AdminTableRow>
                <AdminTableCell className="text-center py-8 text-[var(--text-muted)]">
                  No administrators registered.
                </AdminTableCell>
              </AdminTableRow>
            ) : (
              admins.map((adm) => {
                const isSuper = adm.role === "superadmin";
                return (
                  <AdminTableRow key={adm.id}>
                    <AdminTableCell className="font-semibold text-[var(--text-main)]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] flex items-center justify-center font-bold text-xs shrink-0">
                          {adm.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div>{adm.name}</div>
                          {adm.id === currentAdmin?.id && (
                            <span className="text-[10px] text-[var(--accent-gold)] font-medium">
                              (Current Session)
                            </span>
                          )}
                        </div>
                      </div>
                    </AdminTableCell>

                    <AdminTableCell className="font-mono text-xs">
                      @{adm.username}
                    </AdminTableCell>

                    <AdminTableCell>{adm.email}</AdminTableCell>

                    <AdminTableCell>
                      <AdminBadge variant={isSuper ? "gold" : "default"}>
                        {isSuper && <Shield className="w-3 h-3 mr-1" />}
                        {adm.role}
                      </AdminBadge>
                    </AdminTableCell>

                    <AdminTableCell>
                      <AdminBadge variant={adm.isActive ? "success" : "danger"} size="sm">
                        {adm.isActive ? "Active" : "Inactive"}
                      </AdminBadge>
                    </AdminTableCell>

                    <AdminTableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {(isSuperAdmin || adm.id === currentAdmin?.id) && (
                          <AdminButton
                            variant="ghost"
                            size="sm"
                            title="Edit Administrator"
                            onClick={() => openEditModal(adm)}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </AdminButton>
                        )}

                        {isSuper ? (
                          <span
                            title="Super Admin cannot be deleted"
                            className="p-1.5 text-[var(--text-muted)]/40 cursor-not-allowed"
                          >
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        ) : isSuperAdmin ? (
                          <AdminButton
                            variant="ghost"
                            size="sm"
                            title="Delete Administrator"
                            className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={() => handleDelete(adm)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </AdminButton>
                        ) : null}
                      </div>
                    </AdminTableCell>
                  </AdminTableRow>
                );
              })
            )}
          </AdminTableBody>
        </AdminTable>
      </AdminCard>

      {/* Create Admin Modal */}
      <AdminModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add New Administrator"
        description="Create an authorized administrator account to manage articles and categories"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              onClick={handleCreateSubmit}
              isLoading={isSubmitting}
            >
              Create Account
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
            label="Full Name"
            placeholder="e.g. John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <AdminInput
            label="Email Address"
            type="email"
            placeholder="e.g. user@keshabbhatt.com.np"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <AdminInput
            label="Username"
            placeholder="e.g. jdoe"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            helperText="Lowercase alphanumeric, hyphen or underscore"
            required
          />

          <AdminInput
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            helperText="Password will be securely hashed with salt"
            required
          />

          <AdminSelect
            label="Role Privilege"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
            options={[
              { value: "admin", label: "Admin (Manage Articles & Categories)" },
              { value: "superadmin", label: "Super Admin (Full System Control)" },
            ]}
          />
        </form>
      </AdminModal>

      {/* Edit Admin Modal */}
      <AdminModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Edit Administrator: ${selectedAdmin?.name}`}
        description="Update profile details or assign a new password"
        footer={
          <>
            <AdminButton variant="secondary" onClick={() => setIsEditOpen(false)}>
              Cancel
            </AdminButton>
            <AdminButton
              variant="primary"
              onClick={handleEditSubmit}
              isLoading={isSubmitting}
            >
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
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <AdminInput
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <AdminInput
            label="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />

          <AdminInput
            label="Change Password"
            type="password"
            placeholder="Leave blank to keep current password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            helperText="Only fill if you want to reset the password"
          />

          {isSuperAdmin && selectedAdmin?.role !== "superadmin" && (
            <AdminSelect
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
              options={[
                { value: "admin", label: "Admin" },
                { value: "superadmin", label: "Super Admin" },
              ]}
            />
          )}
        </form>
      </AdminModal>
    </div>
  );
};

export default AdminUserManager;
