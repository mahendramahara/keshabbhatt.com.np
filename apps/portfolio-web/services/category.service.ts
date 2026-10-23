import { connectDatabase } from "@/config/database";
import { BlogCategoryModel, BlogModel, generateSlug } from "@/models";
import type {
  BlogCategory,
  CreateBlogCategoryInput,
  UpdateBlogCategoryInput,
} from "@keshab-bhatt/types";

export class CategoryService {
  /**
   * Get all categories with post counts
   */
  static async getCategories(): Promise<BlogCategory[]> {
    await connectDatabase();

    const categories = await BlogCategoryModel.find().sort({ order: 1, name: 1 }).exec();

    // Aggregate blog counts per category
    const counts = await BlogModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    const countMap = new Map<string, number>();
    for (const c of counts) {
      if (c._id) {
        countMap.set(c._id.toString(), c.count);
      }
    }

    return categories.map((cat) => {
      const count = countMap.get(cat._id.toString()) || 0;
      return cat.toSafeObject(count);
    });
  }

  /**
   * Get category by ID or slug
   */
  static async getCategoryByIdOrSlug(idOrSlug: string): Promise<BlogCategory | null> {
    await connectDatabase();

    let category = null;
    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      category = await BlogCategoryModel.findById(idOrSlug).exec();
    }
    if (!category) {
      category = await BlogCategoryModel.findOne({ slug: idOrSlug.toLowerCase() }).exec();
    }

    if (!category) return null;

    const count = await BlogModel.countDocuments({ category: category._id });
    return category.toSafeObject(count);
  }

  /**
   * Create a new category
   */
  static async createCategory(input: CreateBlogCategoryInput): Promise<BlogCategory> {
    await connectDatabase();

    const slug = input.slug
      ? input.slug.trim().toLowerCase()
      : generateSlug(input.name);

    const existing = await BlogCategoryModel.findOne({
      $or: [{ name: input.name.trim() }, { slug }],
    });

    if (existing) {
      throw new Error("Category with this name or slug already exists");
    }

    const created = await BlogCategoryModel.create({
      name: input.name.trim(),
      slug,
      description: input.description || "",
      color: input.color || "#c98516",
      order: input.order || 0,
    });

    return created.toSafeObject(0);
  }

  /**
   * Update category
   */
  static async updateCategory(
    id: string,
    input: UpdateBlogCategoryInput
  ): Promise<BlogCategory | null> {
    await connectDatabase();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {};
    if (input.name !== undefined) updateData.name = input.name.trim();
    if (input.slug !== undefined) updateData.slug = input.slug.trim().toLowerCase();
    if (input.description !== undefined) updateData.description = input.description;
    if (input.color !== undefined) updateData.color = input.color;
    if (input.order !== undefined) updateData.order = input.order;

    const updated = await BlogCategoryModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).exec();

    if (!updated) return null;

    // If category name changed, also update cached categoryName in Blogs
    if (input.name) {
      await BlogModel.updateMany(
        { category: updated._id },
        { $set: { categoryName: updated.name } }
      ).exec();
    }

    const count = await BlogModel.countDocuments({ category: updated._id });
    return updated.toSafeObject(count);
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string): Promise<boolean> {
    await connectDatabase();

    // Check if any blogs use this category
    const blogCount = await BlogModel.countDocuments({ category: id });
    if (blogCount > 0) {
      throw new Error(`Cannot delete category with ${blogCount} assigned blogs. Reassign them first.`);
    }

    const result = await BlogCategoryModel.findByIdAndDelete(id).exec();
    return Boolean(result);
  }
}

export default CategoryService;
