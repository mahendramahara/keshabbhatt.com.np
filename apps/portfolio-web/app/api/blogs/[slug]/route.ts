import { NextRequest } from "next/server";
import { BlogController } from "@/controllers";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  return BlogController.getBlogBySlug(request, slug);
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  return BlogController.updateBlog(request, slug);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  return BlogController.updateBlog(request, slug);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { slug } = await context.params;
  return BlogController.deleteBlog(request, slug);
}
