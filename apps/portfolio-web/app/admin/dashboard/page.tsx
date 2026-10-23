import type { Metadata } from "next";
import { AdminStatsGrid } from "@/components/admin";

export const metadata: Metadata = {
  title: "Dashboard Overview | Keshab Bhatt Admin",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
          Executive Dashboard
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Real-time metrics, article engagement, and content management control center
        </p>
      </div>

      <AdminStatsGrid />
    </div>
  );
}
