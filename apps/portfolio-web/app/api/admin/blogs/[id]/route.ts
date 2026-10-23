import { NextRequest } from "next/server";
import { BlogController } from "@/controllers";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { apiUnauthorized } from "@/utils";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  const auth = getAuthenticatedAdmin(request);
  if (!auth) return apiUnauthorized();
  const { id } = await context.params;
  return BlogController.getBlogBySlug(request, id);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const auth = getAuthenticatedAdmin(request);
  if (!auth) return apiUnauthorized();
  const { id } = await context.params;
  return BlogController.updateBlog(request, id);
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const auth = getAuthenticatedAdmin(request);
  if (!auth) return apiUnauthorized();
  const { id } = await context.params;
  return BlogController.deleteBlog(request, id);
}
