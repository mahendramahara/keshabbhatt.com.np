import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must contain at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  subject: z
    .string()
    .min(3, "Subject must contain at least 3 characters")
    .max(150),
  message: z
    .string()
    .min(10, "Message must contain at least 10 characters")
    .max(2000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const projectFilterSchema = z.object({
  category: z.enum(["all", "web", "mobile", "system", "cloud"]).default("all"),
  technology: z.string().optional(),
  featuredOnly: z.boolean().optional(),
});

export type ProjectFilterInput = z.infer<typeof projectFilterSchema>;

export const createBlogSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(250, "Title cannot exceed 250 characters"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens")
    .optional(),
  excerpt: z
    .string({ required_error: "Excerpt is required" })
    .min(10, "Excerpt must be at least 10 characters")
    .max(500, "Excerpt cannot exceed 500 characters"),
  content: z
    .string({ required_error: "Content is required" })
    .min(20, "Content must be at least 20 characters"),
  coverImage: z.string().url("Cover image must be a valid URL").optional().or(z.literal("")),
  category: z
    .string({ required_error: "Category is required" })
    .min(2, "Category must be at least 2 characters")
    .max(100),
  tags: z.array(z.string().min(1)).default([]),
  isPublished: z.boolean().default(true),
  publishedAt: z.string().datetime().optional(),
  locale: z.enum(["en", "ne"]).default("en"),
  seoTitle: z.string().max(150).optional(),
  seoDescription: z.string().max(300).optional(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  ogImage: z.string().url().optional().or(z.literal("")),
  author: z
    .object({
      name: z.string().default("Keshab Datt Bhatt"),
      role: z.string().default("Management & Financial Sector Professional"),
      avatarUrl: z.string().optional(),
    })
    .default({
      name: "Keshab Datt Bhatt",
      role: "Management & Financial Sector Professional",
    }),
});

export type CreateBlogSchemaInput = z.infer<typeof createBlogSchema>;

export const updateBlogSchema = createBlogSchema.partial();

export type UpdateBlogSchemaInput = z.infer<typeof updateBlogSchema>;

export const blogQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  category: z.string().optional(),
  search: z.string().optional(),
  tag: z.string().optional(),
  isPublished: z
    .enum(["true", "false", "all"])
    .transform((val) => (val === "all" ? undefined : val === "true"))
    .optional(),
  locale: z.enum(["en", "ne"]).optional(),
  sortBy: z.enum(["publishedAt", "title", "viewCount", "createdAt"]).default("publishedAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type BlogQuerySchemaInput = z.infer<typeof blogQuerySchema>;

