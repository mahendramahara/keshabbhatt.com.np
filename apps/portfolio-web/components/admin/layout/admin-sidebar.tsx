"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  FileText,
  FileUp,
  PenSquare,
  Users,
  Database,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";
import type { AdminUser } from "@keshab-bhatt/types";

export interface AdminSidebarProps {
  currentAdmin?: AdminUser | null;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentAdmin,
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();

  const navLinks = [
    {
      title: "Overview",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="w-4 h-4" />,
      exact: true,
    },
    {
      title: "Blog Categories",
      href: "/admin/categories",
      icon: <FolderTree className="w-4 h-4" />,
      badge: "Structure",
    },
    {
      title: "All Articles",
      href: "/admin/blogs",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      title: "Write Article",
      href: "/admin/blogs/new",
      icon: <PenSquare className="w-4 h-4" />,
      highlight: true,
    },
    {
      title: "Executive CV",
      href: "/admin/cv",
      icon: <FileUp className="w-4 h-4" />,
      badge: "PDF",
    },
    {
      title: "Admin Users",
      href: "/admin/admins",
      icon: <Users className="w-4 h-4" />,
      superAdminOnly: true,
    },
  ];

  const isLinkActive = (href: string, exact = false) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    if (href === "/admin/blogs/new") {
      return pathname === "/admin/blogs/new";
    }
    if (href === "/admin/blogs") {
      return (
        pathname === "/admin/blogs" ||
        (pathname.startsWith("/admin/blogs/") && pathname !== "/admin/blogs/new")
      );
    }
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--bg-card)] border-r border-[var(--border-subtle)] w-72 shrink-0 select-none">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] xl:hidden">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-[var(--text-main)]">Navigation</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-inner)]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
            Content & Administration
          </div>
          <nav className="space-y-1">
            {navLinks.map((item) => {
              if (item.superAdminOnly && currentAdmin?.role !== "superadmin") {
                return null;
              }

              const active = isLinkActive(item.href, item.exact);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-[var(--accent-gold)] text-[var(--btn-primary-text)] font-semibold shadow-sm"
                      : "text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={active ? "text-[var(--btn-primary-text)]" : "text-[var(--text-muted)]"}>
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </div>

                  {item.badge && !active && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--bg-card-inner)] text-[var(--text-muted)] border border-[var(--border-subtle)]">
                      {item.badge}
                    </span>
                  )}

                  {item.highlight && !active && (
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)] animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Quick Database & Infrastructure Card */}
        <div className="p-3.5 rounded-xl bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
              <span>MongoDB ORM</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Active
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
            Connected via Mongoose with normalized Category and Blog architecture.
          </p>
        </div>

        {/* Live Site Preview Link */}
        <div className="pt-2 border-t border-[var(--border-subtle)]">
          <Link
            href="/en/articles"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-medium text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            <span>Preview Articles Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </Link>
        </div>
      </div>

      {/* Footer Info in Sidebar */}
      <div className="p-4 border-t border-[var(--border-subtle)] text-[11px] text-[var(--text-muted)] flex items-center justify-between">
        <span>Keshab Bhatt Admin</span>
        <span className="font-mono text-[10px]">v1.0.0</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Left Sidebar (Independent scrollable panel) */}
      <aside className="hidden xl:flex flex-col h-full shrink-0 select-none">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-in Drawer from Left */}
      {isOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex justify-start">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminSidebar;
