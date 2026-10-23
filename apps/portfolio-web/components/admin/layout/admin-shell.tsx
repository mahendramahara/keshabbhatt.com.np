"use client";

import React, { useState } from "react";
import { AdminHeader } from "./admin-header";
import { AdminSidebar } from "./admin-sidebar";
import { AdminFooter } from "./admin-footer";
import { useAdminAuth } from "./admin-auth-guard";

export interface AdminShellProps {
  children: React.ReactNode;
}

export const AdminShell: React.FC<AdminShellProps> = ({ children }) => {
  const { admin } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-shell-fixed fixed inset-0 flex flex-col bg-[var(--bg-app)] text-[var(--text-main)] overflow-hidden transition-colors select-auto">
      {/* Top Header - Fixed at top */}
      <AdminHeader
        currentAdmin={admin}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Layout Area: Independent Scrolling for Left Sidebar and Page Viewport */}
      <div className="flex-1 flex w-full overflow-hidden min-h-0">
        {/* Left-Side Navigation Sidebar with independent scroll */}
        <AdminSidebar
          currentAdmin={admin}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Viewport with single independent scroll and footer below content */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto flex flex-col overscroll-contain">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="max-w-6xl mx-auto w-full space-y-6">
              {children}
            </div>
          </main>

          {/* Bottom Footer - Located naturally below page content */}
          <AdminFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminShell;
