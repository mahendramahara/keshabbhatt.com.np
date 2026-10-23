import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogService } from "@/services";
import { BlogEditorForm } from "@/components/admin";

export const dynamic = "force-dynamic";

interface EditBlogPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Edit Article | Keshab Bhatt Admin",
  robots: { index: false, follow: false },
};

export default async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const blog = await BlogService.getBlogBySlug(id);

  if (!blog) {
    notFound();
  }

  return <BlogEditorForm initialBlog={blog} isEditing={true} />;
}
