import { NextRequest } from "next/server";
import { BlogService } from "@/services";
import {
  blogQuerySchema,
  createBlogSchema,
  updateBlogSchema,
} from "@keshab-bhatt/validation";
import {
  apiSuccess,
  apiPaginated,
  apiError,
  apiValidationError,
  apiNotFound,
} from "@/utils";
import type { CreateBlogInput, UpdateBlogInput } from "@keshab-bhatt/types";

export class BlogController {
  static async getBlogs(req: NextRequest) {
    try {
      const url = new URL(req.url);
      const queryParams = Object.fromEntries(url.searchParams.entries());

      const validationResult = blogQuerySchema.safeParse(queryParams);
      if (!validationResult.success) {
        return apiValidationError(validationResult.error.flatten());
      }

      const params = validationResult.data;
      const { data, pagination } = await BlogService.getBlogs(params);

      return apiPaginated(data, pagination, "Blog posts retrieved successfully.");
    } catch (error) {
      console.error("Error in BlogController.getBlogs:", error);
      return apiError(
        error instanceof Error ? error.message : "Failed to retrieve blog posts.",
        "BLOG_FETCH_ERROR",
        500
      );
    }
  }

  static async createBlog(req: NextRequest) {
    try {
      const body = await req.json().catch(() => null);
      if (!body) {
        return apiError("Request body must be valid JSON.", "INVALID_JSON", 400);
      }

      const validationResult = createBlogSchema.safeParse(body);
      if (!validationResult.success) {
        return apiValidationError(validationResult.error.flatten());
      }

      const input = validationResult.data as CreateBlogInput;
      const createdBlog = await BlogService.createBlog(input);

      return apiSuccess(createdBlog, "Blog post created successfully.", 201);
    } catch (error) {
      console.error("Error in BlogController.createBlog:", error);
      return apiError(
        error instanceof Error ? error.message : "Failed to create blog post.",
        "BLOG_CREATE_ERROR",
        500
      );
    }
  }

  static async getBlogBySlug(_req: NextRequest, slug: string) {
    try {
      if (!slug || slug.trim() === "") {
        return apiValidationError({ slug: "Slug parameter is required." });
      }

      const blog = await BlogService.getBlogBySlug(slug);
      if (!blog) {
        return apiNotFound(`Blog with slug '${slug}'`);
      }

      // Fire and forget view increment
      BlogService.incrementViews(slug).catch(() => {});

      return apiSuccess(blog, "Blog post retrieved successfully.");
    } catch (error) {
      console.error(`Error in BlogController.getBlogBySlug (${slug}):`, error);
      return apiError(
        error instanceof Error ? error.message : "Failed to retrieve blog post.",
        "BLOG_FETCH_BY_SLUG_ERROR",
        500
      );
    }
  }

  static async updateBlog(req: NextRequest, slug: string) {
    try {
      if (!slug || slug.trim() === "") {
        return apiValidationError({ slug: "Slug parameter is required." });
      }

      const body = await req.json().catch(() => null);
      if (!body) {
        return apiError("Request body must be valid JSON.", "INVALID_JSON", 400);
      }

      const validationResult = updateBlogSchema.safeParse(body);
      if (!validationResult.success) {
        return apiValidationError(validationResult.error.flatten());
      }

      const input = validationResult.data as UpdateBlogInput;
      const updatedBlog = await BlogService.updateBlog(slug, input);

      if (!updatedBlog) {
        return apiNotFound(`Blog post with identifier '${slug}'`);
      }

      return apiSuccess(updatedBlog, "Blog post updated successfully.");
    } catch (error) {
      console.error(`Error in BlogController.updateBlog (${slug}):`, error);
      return apiError(
        error instanceof Error ? error.message : "Failed to update blog post.",
        "BLOG_UPDATE_ERROR",
        500
      );
    }
  }

  static async deleteBlog(_req: NextRequest, slug: string) {
    try {
      if (!slug || slug.trim() === "") {
        return apiValidationError({ slug: "Slug parameter is required." });
      }

      const deleted = await BlogService.deleteBlog(slug);
      if (!deleted) {
        return apiNotFound(`Blog post with identifier '${slug}'`);
      }

      return apiSuccess({ deleted: true, slug }, "Blog post deleted successfully.");
    } catch (error) {
      console.error(`Error in BlogController.deleteBlog (${slug}):`, error);
      return apiError(
        error instanceof Error ? error.message : "Failed to delete blog post.",
        "BLOG_DELETE_ERROR",
        500
      );
    }
  }
}
