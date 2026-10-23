import { NextRequest } from "next/server";
import { BlogController } from "@/controllers";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { apiUnauthorized } from "@/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = getAuthenticatedAdmin(request);
  if (!auth) {
    return apiUnauthorized();
  }
  return BlogController.getBlogs(request);
}

export async function POST(request: NextRequest) {
  const auth = getAuthenticatedAdmin(request);
  if (!auth) {
    return apiUnauthorized();
  }
  return BlogController.createBlog(request);
}
