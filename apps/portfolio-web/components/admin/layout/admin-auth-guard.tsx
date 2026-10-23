"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { AdminUser } from "@keshab-bhatt/types";

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  refreshAdmin: () => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  isLoading: true,
  refreshAdmin: async () => {},
  logout: async () => {},
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  const fetchCurrentAdmin = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/auth/me", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
        cache: "no-store",
      });

      if (!res.ok) {
        setAdmin(null);
        if (!isLoginPage) {
          window.location.replace("/admin/login");
        }
        return;
      }

      const json = await res.json();
      if (json.success && json.data) {
        setAdmin(json.data);
        if (isLoginPage) {
          router.replace("/admin/dashboard");
        }
      } else {
        setAdmin(null);
        if (!isLoginPage) {
          window.location.replace("/admin/login");
        }
      }
    } catch {
      setAdmin(null);
      if (!isLoginPage) {
        window.location.replace("/admin/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoginPage, router]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setAdmin(null);
    try {
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
        },
      });
    } catch (err) {
      console.error("Logout network call error:", err);
    } finally {
      // Invalidate history state so pressing Back never returns to authenticated admin
      window.location.replace("/admin/login");
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    void Promise.resolve().then(() => {
      if (!ignore) {
        fetchCurrentAdmin();
      }
    });
    return () => {
      ignore = true;
    };
  }, [fetchCurrentAdmin, pathname]);

  // Handle browser back/forward and bfcache restoration
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted || !admin) {
        fetchCurrentAdmin();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [admin, fetchCurrentAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-gold)]" />
        <p className="text-xs font-semibold text-[var(--text-muted)] tracking-wider uppercase">
          Verifying Admin Credentials...
        </p>
      </div>
    );
  }

  // If not logged in and not on login page, prevent flash of content
  if (!admin && !isLoginPage) {
    return null;
  }

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        refreshAdmin: fetchCurrentAdmin,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthGuard;
