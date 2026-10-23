import mongoose, { Schema, Document, Model } from "mongoose";
import type { BlogCategory } from "@keshab-bhatt/types";

export interface IBlogCategoryDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  color?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  toSafeObject(blogCount?: number): BlogCategory;
}

const BlogCategorySchema = new Schema<IBlogCategoryDocument>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be valid kebab-case"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    color: {
      type: String,
      trim: true,
      default: "#c98516", // Navy gold default
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

BlogCategorySchema.methods.toSafeObject = function (blogCount?: number): BlogCategory {
  return {
    id: this._id.toString(),
    name: this.name,
    slug: this.slug,
    description: this.description || undefined,
    color: this.color || undefined,
    order: this.order,
    blogCount,
    createdAt: this.createdAt ? this.createdAt.toISOString() : undefined,
    updatedAt: this.updatedAt ? this.updatedAt.toISOString() : undefined,
  };
};

export const BlogCategoryModel: Model<IBlogCategoryDocument> =
  (mongoose.models.BlogCategory as Model<IBlogCategoryDocument>) ||
  mongoose.model<IBlogCategoryDocument>("BlogCategory", BlogCategorySchema);

export default BlogCategoryModel;
