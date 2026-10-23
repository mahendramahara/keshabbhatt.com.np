import type { Metadata } from "next";
import { BlogEditorForm } from "@/components/admin";

export const metadata: Metadata = {
  title: "Write New Article | Keshab Bhatt Admin",
  robots: { index: false, follow: false },
};

export default function NewBlogPage() {
  return <BlogEditorForm />;
}
