"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  ExternalLink,
  LogOut,
  Moon,
  Sun,
  Palette,
  User,
  Menu,
} from "lucide-react";
import type { AdminUser, ThemePalette } from "@keshab-bhatt/types";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";
import { useAdminAuth } from "./admin-auth-guard";
import { AdminBadge } from "../ui";

export interface AdminHeaderProps {
  currentAdmin?: AdminUser | null;
  onToggleSidebar?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentAdmin,
  onToggleSidebar,
}) => {
  const { mode, theme, setMode, setTheme } = useTheme();
  const { logout } = useAdminAuth();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    toast.info("Signing out securely...");
    try {
      await logout();
      toast.success("Successfully logged out.");
    } catch (err) {
      console.error("Logout failed:", err);
      setIsLoggingOut(false);
    }
  };

  const toggleDarkMode = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  const palettes: Array<{ id: ThemePalette; label: string; dotColor: string }> = [
    { id: "navy-gold", label: "Navy Gold", dotColor: "#c98516" },
    { id: "slate-corporate", label: "Slate Corporate", dotColor: "#0284c7" },
    { id: "emerald-wealth", label: "Emerald Wealth", dotColor: "#059669" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4 w-full">
        {/* Left: Mobile Navigation Button & Brand Identity */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            title="Open Navigation Menu"
            className="xl:hidden p-2 rounded-lg text-[var(--text-main)] hover:bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            href="/admin/dashboard"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-gold)] flex items-center justify-center text-[var(--btn-primary-text)] font-bold shadow-sm transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-[var(--text-main)] tracking-tight">
                  Keshab Bhatt
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] border border-[var(--accent-gold-border)]">
                  Admin Portal
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] hidden sm:block">
                Financial Sector & Management Intelligence
              </p>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Website */}
          <Link
            href="/en"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-card-inner)] hover:bg-[var(--bg-card-hover)] text-[var(--text-sub)] hover:text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={toggleDarkMode}
            title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] transition-colors"
          >
            {mode === "dark" ? (
              <Sun className="w-4 h-4 text-[var(--accent-gold)]" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* Palette Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              title="Change Color Theme"
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-inner)] border border-[var(--border-subtle)] transition-colors"
            >
              <Palette className="w-4 h-4" />
            </button>

            {isThemeMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-lg p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsThemeMenuOpen(false)}
              >
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Select Theme Palette
                </div>
                {palettes.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setTheme(p.id);
                      setIsThemeMenuOpen(false);
                      toast.success(`Theme switched to ${p.label}`);
                    }}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-colors ${
                      theme === p.id
                        ? "bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] font-bold"
                        : "text-[var(--text-sub)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-inner)]"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: p.dotColor }}
                    />
                    <span>{p.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current Admin Badge & Logout */}
          {currentAdmin && (
            <div className="flex items-center gap-3 pl-3 border-l border-[var(--border-subtle)]">
              {/* User Avatar & Name */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--accent-gold)] to-[var(--accent-gold-hover)] text-[var(--btn-primary-text)] flex items-center justify-center font-bold text-xs shadow-xs">
                    {currentAdmin.name?.charAt(0).toUpperCase() || <User className="w-3.5 h-3.5" />}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-[var(--bg-card)]" />
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-[var(--text-main)] leading-tight">
                    {currentAdmin.name}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] font-mono leading-none mt-0.5">
                    @{currentAdmin.username}
                  </div>
                </div>
              </div>

              {/* Stacked Superadmin Tag (Uperside) & Logout Button */}
              <div className="flex flex-col items-end gap-1">
                <AdminBadge
                  variant={currentAdmin.role === "superadmin" ? "gold" : "default"}
                  size="sm"
                  className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 shadow-2xs"
                >
                  <Shield className="w-2.5 h-2.5" />
                  <span>{currentAdmin.role}</span>
                </AdminBadge>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  title="Sign out securely"
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-red-500 hover:text-red-600 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/35 transition-all cursor-pointer disabled:opacity-60"
                >
                  <LogOut className="w-3 h-3" />
                  <span>{isLoggingOut ? "Exiting..." : "Logout"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
