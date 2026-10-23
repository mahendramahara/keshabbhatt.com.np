import { NextRequest } from "next/server";
import { CategoryController } from "@/controllers";

export const dynamic = "force-dynamic";

export async function GET() {
  return CategoryController.getCategories();
}

export async function POST(request: NextRequest) {
  return CategoryController.createCategory(request);
}
