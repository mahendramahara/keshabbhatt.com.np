import type { MetadataRoute } from "next";
import { BlogService } from "@/services";
import { siteUrl as baseUrl } from "@/config/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/en`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
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
          en: `${baseUrl}/en`,
          ne: `${baseUrl}/ne`,
        },
      },
    },
    {
      url: `${baseUrl}/en/articles`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/articles`,
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
          en: `${baseUrl}/en/articles`,
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
        const locale = blog.locale || "en";
        const otherLocale = locale === "en" ? "ne" : "en";
        return {
          url: `${baseUrl}/${locale}/articles/${blog.slug}`,
          lastModified: blog.updatedAt || currentDate,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          alternates: {
            languages: {
              [locale]: `${baseUrl}/${locale}/articles/${blog.slug}`,
              [otherLocale]: `${baseUrl}/${otherLocale}/articles/${blog.slug}`,
            },
          },
        };
      });
    } else {
      const { getArticlesData } = await import("@keshab-bhatt/content");
      const staticArticles = getArticlesData("en").items;
      articleRoutes = staticArticles.flatMap((art) => [
        {
          url: `${baseUrl}/en/articles/${art.slug}`,
          lastModified: currentDate,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          alternates: {
            languages: {
              en: `${baseUrl}/en/articles/${art.slug}`,
              ne: `${baseUrl}/ne/articles/${art.slug}`,
            },
          },
        },
        {
          url: `${baseUrl}/ne/articles/${art.slug}`,
          lastModified: currentDate,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          alternates: {
            languages: {
              en: `${baseUrl}/en/articles/${art.slug}`,
              ne: `${baseUrl}/ne/articles/${art.slug}`,
            },
          },
        },
      ]);
    }
  } catch (error) {
    console.warn("Sitemap: loading dynamic blogs failed, falling back to static articles:", error);
    try {
      const { getArticlesData } = await import("@keshab-bhatt/content");
      const staticArticles = getArticlesData("en").items;
      articleRoutes = staticArticles.flatMap((art) => [
        {
          url: `${baseUrl}/en/articles/${art.slug}`,
          lastModified: currentDate,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          alternates: {
            languages: {
              en: `${baseUrl}/en/articles/${art.slug}`,
              ne: `${baseUrl}/ne/articles/${art.slug}`,
            },
          },
        },
        {
          url: `${baseUrl}/ne/articles/${art.slug}`,
          lastModified: currentDate,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          alternates: {
            languages: {
              en: `${baseUrl}/en/articles/${art.slug}`,
              ne: `${baseUrl}/ne/articles/${art.slug}`,
            },
          },
        },
      ]);
    } catch {
      // Fallback only static core routes
    }
  }

  return [...staticRoutes, ...articleRoutes];
}
