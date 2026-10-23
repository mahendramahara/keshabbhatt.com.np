import type { MetadataRoute } from "next";
import { BlogService } from "@/services";
import { siteUrl as baseUrl } from "@/config/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}`,
          ne: `${baseUrl}/ne`,
        },
      },
    },
    {
      url: `${baseUrl}/ne`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}`,
          ne: `${baseUrl}/ne`,
        },
      },
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/articles`,
          ne: `${baseUrl}/ne/articles`,
        },
      },
    },
    {
      url: `${baseUrl}/ne/articles`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
      alternates: {
        languages: {
          en: `${baseUrl}/articles`,
          ne: `${baseUrl}/ne/articles`,
        },
      },
    },
  ];

  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: blogs } = await BlogService.getBlogs({
      limit: 100,
      isPublished: true,
    });

    if (blogs && blogs.length > 0) {
      articleRoutes = blogs.map((blog) => {
        const isNe = blog.locale === "ne";
        const enArticleUrl = `${baseUrl}/articles/${blog.slug}`;
        const neArticleUrl = `${baseUrl}/ne/articles/${blog.slug}`;
        const currentUrl = isNe ? neArticleUrl : enArticleUrl;

        return {
          url: currentUrl,
          lastModified: blog.updatedAt || currentDate,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          alternates: {
            languages: {
              en: enArticleUrl,
              ne: neArticleUrl,
            },
          },
        };
      });
    }
  } catch (error) {
    console.warn("Sitemap: loading dynamic blogs failed:", error);
    articleRoutes = [];
  }

  return [...staticRoutes, ...articleRoutes];
}
