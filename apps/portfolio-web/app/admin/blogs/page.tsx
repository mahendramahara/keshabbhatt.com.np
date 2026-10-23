import type { Metadata } from "next";
import { BlogListManager } from "@/components/admin";

export const metadata: Metadata = {
  title: "All Articles | Keshab Bhatt Admin",
  robots: { index: false, follow: false },
};

export default function AdminBlogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
          Executive Articles & Insights
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Review published articles, manage drafts, filter across categories, and track readership
        </p>
      </div>

      <BlogListManager />
    </div>
  );
}
