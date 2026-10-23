import { NextRequest } from "next/server";
import { CategoryService } from "@/services";
import { blogCategorySchema } from "@keshab-bhatt/validation";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { apiSuccess, apiError, apiValidationError, apiUnauthorized, apiNotFound } from "@/utils";
import type { CreateBlogCategoryInput, UpdateBlogCategoryInput } from "@keshab-bhatt/types";

export class CategoryController {
  /**
   * List all categories
   */
  static async getCategories() {
    try {
      const categories = await CategoryService.getCategories();
      return apiSuccess(categories, "Categories retrieved successfully.");
    } catch (error) {
      console.error("[CategoryController.getCategories] Error:", error);
      return apiError("Failed to retrieve categories.", "CATEGORY_FETCH_ERROR", 500);
    }
  }

  /**
   * Create category (Admin only)
   */
  static async createCategory(req: NextRequest) {
    try {
      const auth = getAuthenticatedAdmin(req);
      if (!auth) {
        return apiUnauthorized();
      }

      const body = await req.json().catch(() => null);
      if (!body) {
        return apiError("Request body must be valid JSON.", "INVALID_JSON", 400);
      }

      const parseResult = blogCategorySchema.safeParse(body);
      if (!parseResult.success) {
        return apiValidationError(parseResult.error.flatten());
      }

      const input = parseResult.data as CreateBlogCategoryInput;
      const created = await CategoryService.createCategory(input);

      return apiSuccess(created, "Category created successfully.", 201);
    } catch (error) {
      console.error("[CategoryController.createCategory] Error:", error);
      return apiError(
        error instanceof Error ? error.message : "Failed to create category.",
        "CATEGORY_CREATE_ERROR",
        400
      );
    }
  }

  /**
   * Update category (Admin only)
   */
  static async updateCategory(req: NextRequest, id: string) {
    try {
      const auth = getAuthenticatedAdmin(req);
      if (!auth) {
        return apiUnauthorized();
      }

      const body = await req.json().catch(() => null);
      if (!body) {
        return apiError("Request body must be valid JSON.", "INVALID_JSON", 400);
      }

      const parseResult = blogCategorySchema.partial().safeParse(body);
      if (!parseResult.success) {
        return apiValidationError(parseResult.error.flatten());
      }

      const input = parseResult.data as UpdateBlogCategoryInput;
      const updated = await CategoryService.updateCategory(id, input);

      if (!updated) {
        return apiNotFound(`Category with ID '${id}'`);
      }

      return apiSuccess(updated, "Category updated successfully.");
    } catch (error) {
      console.error(`[CategoryController.updateCategory] (${id}) Error:`, error);
      return apiError(
        error instanceof Error ? error.message : "Failed to update category.",
        "CATEGORY_UPDATE_ERROR",
        400
      );
    }
  }

  /**
   * Delete category (Admin only)
   */
  static async deleteCategory(req: NextRequest, id: string) {
    try {
      const auth = getAuthenticatedAdmin(req);
      if (!auth) {
        return apiUnauthorized();
      }

      await CategoryService.deleteCategory(id);
      return apiSuccess({ deleted: true, id }, "Category deleted successfully.");
    } catch (error) {
      console.error(`[CategoryController.deleteCategory] (${id}) Error:`, error);
      return apiError(
        error instanceof Error ? error.message : "Failed to delete category.",
        "CATEGORY_DELETE_ERROR",
        400
      );
    }
  }
}

export default CategoryController;
