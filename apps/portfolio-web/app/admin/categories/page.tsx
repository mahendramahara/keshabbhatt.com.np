import type { Metadata } from "next";
import { CategoryManager } from "@/components/admin";

export const metadata: Metadata = {
  title: "Blog Categories | Keshab Bhatt Admin",
  robots: { index: false, follow: false },
};

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
          Blog Categories Taxonomy
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">
          Define normalized topics, customize color indicators, and organize published articles
        </p>
      </div>

      <CategoryManager />
    </div>
  );
}
