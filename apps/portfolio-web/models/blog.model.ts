import mongoose, { Schema, Document, Model, Types } from "mongoose";
import type { BlogPost, Locale } from "@keshab-bhatt/types";

export interface IBlogDocument extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: Types.ObjectId | string;
  categoryName: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: Date;
  updatedAt: Date;
  createdAt: Date;
  locale: Locale;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  viewCount: number;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  toSafeObject(): BlogPost;
}

export function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return baseSlug || `article-${Date.now()}`;
}

const BlogSchema = new Schema<IBlogDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 250,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      trim: true,
      maxlength: 500,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    coverImage: {
      type: String,
      default: null,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogCategory",
      required: false,
    },
    categoryName: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    locale: {
      type: String,
      enum: ["en", "ne"],
      default: "en",
      index: true,
    },
    seoTitle: {
      type: String,
      maxlength: 150,
    },
    seoDescription: {
      type: String,
      maxlength: 300,
    },
    canonicalUrl: {
      type: String,
    },
    ogImage: {
      type: String,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    author: {
      name: {
        type: String,
        default: "Keshab Datt Bhatt",
      },
      role: {
        type: String,
        default: "Management & Financial Sector Professional",
      },
      avatarUrl: {
        type: String,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes
BlogSchema.index({ slug: 1, locale: 1 }, { unique: true });
BlogSchema.index({ isPublished: 1, locale: 1, publishedAt: -1 });

BlogSchema.methods.toSafeObject = function (): BlogPost {
  return {
    id: this._id.toString(),
    slug: this.slug,
    title: this.title,
    excerpt: this.excerpt,
    content: this.content,
    coverImage: this.coverImage || undefined,
    category: this.categoryName,
    tags: Array.isArray(this.tags) ? this.tags : [],
    isPublished: this.isPublished,
    publishedAt: this.publishedAt ? this.publishedAt.toISOString() : new Date().toISOString(),
    updatedAt: this.updatedAt ? this.updatedAt.toISOString() : new Date().toISOString(),
    locale: (this.locale as Locale) || "en",
    seoTitle: this.seoTitle || this.title,
    seoDescription: this.seoDescription || this.excerpt,
    canonicalUrl: this.canonicalUrl || undefined,
    ogImage: this.ogImage || undefined,
    viewCount: this.viewCount || 0,
    author: {
      name: this.author?.name || "Keshab Datt Bhatt",
      role: this.author?.role || "Management & Financial Sector Professional",
      avatarUrl: this.author?.avatarUrl || undefined,
    },
  };
};

export const BlogModel: Model<IBlogDocument> =
  (mongoose.models.Blog as Model<IBlogDocument>) ||
  mongoose.model<IBlogDocument>("Blog", BlogSchema);

export default BlogModel;
