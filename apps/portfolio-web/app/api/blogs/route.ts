import { NextRequest } from "next/server";
import { BlogController } from "@/controllers";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return BlogController.getBlogs(request);
}

export async function POST(request: NextRequest) {
  return BlogController.createBlog(request);
}
