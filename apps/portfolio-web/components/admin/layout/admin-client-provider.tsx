"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { AdminAuthGuard } from "./admin-auth-guard";
import { AdminShell } from "./admin-shell";

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-main)] flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}

export function AdminClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminAuthGuard>
        <AdminLayoutInner>{children}</AdminLayoutInner>
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
            },
          }}
        />
      </AdminAuthGuard>
    </ThemeProvider>
  );
}

export default AdminClientProvider;
