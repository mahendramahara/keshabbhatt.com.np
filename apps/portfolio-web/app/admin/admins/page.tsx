import type { Metadata } from "next";
import { AdminUserManager } from "@/components/admin";

export const metadata: Metadata = {
  title: "Administrator Management | Keshab Bhatt Admin",
  robots: { index: false, follow: false },
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
          Administrator Accounts
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Manage system users, assign role privileges, and maintain administrative credentials
        </p>
      </div>

      <AdminUserManager />
    </div>
  );
}
