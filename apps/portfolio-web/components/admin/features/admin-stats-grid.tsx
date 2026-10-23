"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  FolderTree,
  Users,
  Eye,
  CheckCircle,
  Clock,
  PenSquare,
  ShieldAlert,
} from "lucide-react";
import { AdminStatsCard, AdminButton, AdminCard } from "../ui";

export interface AdminStatsData {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalCategories: number;
  totalViews: number;
  totalAdmins: number;
  superAdminCount: number;
}

export const AdminStatsGrid: React.FC = () => {
  const [stats, setStats] = useState<AdminStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setStats(json.data);
        }
      })
      .catch((err) => console.error("Failed to load admin stats:", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          title="Total Articles"
          value={isLoading ? "..." : stats?.totalBlogs || 0}
          subtitle={`${stats?.publishedBlogs || 0} published, ${stats?.draftBlogs || 0} drafts`}
          icon={<FileText className="w-5 h-5" />}
        />

        <AdminStatsCard
          title="Categories"
          value={isLoading ? "..." : stats?.totalCategories || 0}
          subtitle="Normalized taxonomy"
          icon={<FolderTree className="w-5 h-5" />}
        />

        <AdminStatsCard
          title="Total Readers"
          value={isLoading ? "..." : (stats?.totalViews || 0).toLocaleString()}
          subtitle="Combined article views"
          icon={<Eye className="w-5 h-5" />}
        />

        <AdminStatsCard
          title="System Admins"
          value={isLoading ? "..." : stats?.totalAdmins || 0}
          subtitle={`${stats?.superAdminCount || 1} Super Admin`}
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      {/* Quick Actions Panel */}
      <AdminCard
        title="Quick Management Actions"
        subtitle="Common administrator tasks and content generation workflows"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/admin/blogs/new" className="block">
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-card-inner)] hover:bg-[var(--accent-gold-soft)]/20 transition-all flex items-center gap-3 group">
              <div className="p-2.5 rounded-lg bg-[var(--accent-gold)] text-[var(--btn-primary-text)] font-bold">
                <PenSquare className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--accent-gold)]">
                  Write New Article
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Use executive rich text editor
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/categories" className="block">
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-card-inner)] hover:bg-[var(--accent-gold-soft)]/20 transition-all flex items-center gap-3 group">
              <div className="p-2.5 rounded-lg bg-blue-600 text-white font-bold">
                <FolderTree className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--accent-gold)]">
                  Manage Categories
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Structure financial topics
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/admins" className="block">
            <div className="p-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] bg-[var(--bg-card-inner)] hover:bg-[var(--accent-gold-soft)]/20 transition-all flex items-center gap-3 group">
              <div className="p-2.5 rounded-lg bg-emerald-600 text-white font-bold">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--accent-gold)]">
                  Manage Admin Users
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Control permissions & accounts
                </div>
              </div>
            </div>
          </Link>
        </div>
      </AdminCard>
    </div>
  );
};

export default AdminStatsGrid;
