import { connectDatabase } from "@/config/database";
import { BlogModel, BlogCategoryModel, generateSlug } from "@/models";
import type {
  BlogPost,
  CreateBlogInput,
  UpdateBlogInput,
  BlogQueryParams,
  PaginationMeta,
  Locale,
} from "@keshab-bhatt/types";

export class BlogService {
  /**
   * Retrieve paginated blog posts with strict filtering from the database.
   * Zero demo / dummy fallback data.
   */
  static async getBlogs(params: BlogQueryParams = {}): Promise<{
    data: BlogPost[];
    pagination: PaginationMeta;
  }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    try {
      await connectDatabase();

      // Build MongoDB query filter
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const filter: Record<string, any> = {};

      if (params.locale) {
        filter.locale = params.locale;
      }

      if (params.category) {
        filter.categoryName = { $regex: params.category, $options: "i" };
      }

      if (params.isPublished !== undefined) {
        filter.isPublished = params.isPublished;
      }

      if (params.tag) {
        filter.tags = { $in: [params.tag] };
      }

      if (params.search) {
        filter.$or = [
          { title: { $regex: params.search, $options: "i" } },
          { excerpt: { $regex: params.search, $options: "i" } },
          { content: { $regex: params.search, $options: "i" } },
        ];
      }

      // Sort
      const sortBy = params.sortBy || "publishedAt";
      const sortOrder = params.sortOrder === "asc" ? 1 : -1;
      const sortOption: Record<string, 1 | -1> = { [sortBy]: sortOrder };

      const [blogs, total] = await Promise.all([
        BlogModel.find(filter)
          .sort(sortOption)
          .skip(skip)
          .limit(limit)
          .populate("category", "name slug color")
          .exec(),
        BlogModel.countDocuments(filter).exec(),
      ]);

      const totalPages = Math.ceil(total / limit) || 1;

      return {
        data: blogs.map((doc) => doc.toSafeObject()),
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages,
        },
      };
    } catch (error) {
      console.error("[BlogService] MongoDB read failed:", error);
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 1,
          hasMore: false,
        },
      };
    }
  }

  /**
   * Get single blog by slug or ID with locale filtering strictly from database.
   * If not present in DB, returns null (triggers 404).
   */
  static async getBlogBySlug(slugOrId: string, locale?: Locale): Promise<BlogPost | null> {
    try {
      await connectDatabase();

      const query: Record<string, unknown> = { slug: slugOrId };
      if (locale) query.locale = locale;

      let blog = await BlogModel.findOne(query)
        .populate("category", "name slug color")
        .exec();

      if (!blog && !locale) {
        blog = await BlogModel.findOne({ slug: slugOrId })
          .populate("category", "name slug color")
          .exec();
      }

      if (!blog && slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
        blog = await BlogModel.findById(slugOrId)
          .populate("category", "name slug color")
          .exec();
      }

      if (!blog) {
        return null;
      }

      return blog.toSafeObject();
    } catch (error) {
      console.error(`[BlogService] Error fetching blog ${slugOrId}:`, error);
      return null;
    }
  }

  /**
   * Create a new blog post
   */
  static async createBlog(input: CreateBlogInput): Promise<BlogPost> {
    await connectDatabase();

    const slug = input.slug ? input.slug.trim().toLowerCase() : generateSlug(input.title);

    // Resolve category reference
    let categoryRef = undefined;
    let categoryName = input.category;

    if (input.category) {
      // Check if input.category is an ObjectId or category name
      if (input.category.match(/^[0-9a-fA-F]{24}$/)) {
        const foundCat = await BlogCategoryModel.findById(input.category);
        if (foundCat) {
          categoryRef = foundCat._id;
          categoryName = foundCat.name;
        }
      } else {
        const foundCat = await BlogCategoryModel.findOne({
          $or: [
            { name: { $regex: `^${input.category}$`, $options: "i" } },
            { slug: input.category.toLowerCase() },
          ],
        });
        if (foundCat) {
          categoryRef = foundCat._id;
          categoryName = foundCat.name;
        }
      }
    }

    const doc = await BlogModel.create({
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      coverImage: input.coverImage || null,
      category: categoryRef,
      categoryName: categoryName || "Uncategorized",
      tags: input.tags || [],
      isPublished: input.isPublished !== undefined ? input.isPublished : true,
      publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
      locale: input.locale || "en",
      seoTitle: input.seoTitle || input.title,
      seoDescription: input.seoDescription || input.excerpt,
      canonicalUrl: input.canonicalUrl || null,
      ogImage: input.ogImage || null,
      author: {
        name: input.author?.name || "Keshab Datt Bhatt",
        role: input.author?.role || "Management & Financial Sector Professional",
        avatarUrl: input.author?.avatarUrl || null,
      },
    });

    return doc.toSafeObject();
  }

  /**
   * Update an existing blog
   */
  static async updateBlog(slugOrId: string, input: UpdateBlogInput): Promise<BlogPost | null> {
    await connectDatabase();

    let query: Record<string, unknown> = { slug: slugOrId };
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: slugOrId };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.slug !== undefined) updateData.slug = input.slug.trim().toLowerCase();
    if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
    if (input.content !== undefined) updateData.content = input.content;
    if (input.coverImage !== undefined) updateData.coverImage = input.coverImage || null;
    if (input.tags !== undefined) updateData.tags = input.tags;
    if (input.isPublished !== undefined) updateData.isPublished = input.isPublished;
    if (input.publishedAt !== undefined) updateData.publishedAt = new Date(input.publishedAt);
    if (input.locale !== undefined) updateData.locale = input.locale;
    if (input.seoTitle !== undefined) updateData.seoTitle = input.seoTitle;
    if (input.seoDescription !== undefined) updateData.seoDescription = input.seoDescription;
    if (input.canonicalUrl !== undefined) updateData.canonicalUrl = input.canonicalUrl;
    if (input.ogImage !== undefined) updateData.ogImage = input.ogImage;

    if (input.category) {
      if (input.category.match(/^[0-9a-fA-F]{24}$/)) {
        const foundCat = await BlogCategoryModel.findById(input.category);
        if (foundCat) {
          updateData.category = foundCat._id;
          updateData.categoryName = foundCat.name;
        }
      } else {
        const foundCat = await BlogCategoryModel.findOne({
          $or: [
            { name: { $regex: `^${input.category}$`, $options: "i" } },
            { slug: input.category.toLowerCase() },
          ],
        });
        if (foundCat) {
          updateData.category = foundCat._id;
          updateData.categoryName = foundCat.name;
        } else {
          updateData.categoryName = input.category;
        }
      }
    }

    if (input.author) {
      if (input.author.name) updateData["author.name"] = input.author.name;
      if (input.author.role) updateData["author.role"] = input.author.role;
      if (input.author.avatarUrl !== undefined) updateData["author.avatarUrl"] = input.author.avatarUrl;
    }

    const updated = await BlogModel.findOneAndUpdate(query, { $set: updateData }, { new: true })
      .populate("category", "name slug color")
      .exec();

    if (!updated) return null;
    return updated.toSafeObject();
  }

  /**
   * Delete a blog post
   */
  static async deleteBlog(slugOrId: string): Promise<boolean> {
    await connectDatabase();

    let query: Record<string, unknown> = { slug: slugOrId };
    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      query = { _id: slugOrId };
    }

    const res = await BlogModel.findOneAndDelete(query).exec();
    return Boolean(res);
  }

  /**
   * Increment blog view count
   */
  static async incrementViews(slug: string): Promise<void> {
    try {
      await connectDatabase();
      await BlogModel.updateOne({ slug }, { $inc: { viewCount: 1 } }).exec();
    } catch {
      // Fire and forget
    }
  }

  /**
   * Get administrative stats
   */
  static async getStats() {
    try {
      await connectDatabase();
      const [totalBlogs, publishedBlogs, draftBlogs, totalCategories, viewAggregation] =
        await Promise.all([
          BlogModel.countDocuments(),
          BlogModel.countDocuments({ isPublished: true }),
          BlogModel.countDocuments({ isPublished: false }),
          BlogCategoryModel.countDocuments(),
          BlogModel.aggregate([
            { $group: { _id: null, totalViews: { $sum: "$viewCount" } } },
          ]),
        ]);

      const totalViews = viewAggregation[0]?.totalViews || 0;

      return {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        totalCategories,
        totalViews,
      };
    } catch {
      return {
        totalBlogs: 0,
        publishedBlogs: 0,
        draftBlogs: 0,
        totalCategories: 0,
        totalViews: 0,
      };
    }
  }
}

export default BlogService;
