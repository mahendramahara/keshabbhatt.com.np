import { CategoryController } from "@/controllers";

export const dynamic = "force-dynamic";

export async function GET() {
  return CategoryController.getCategories();
}
