import { PrismaClient } from "@prisma/client";
import { getArticlesData } from "@keshab-bhatt/content";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding all executive articles from @keshab-bhatt/content into Supabase...");

  const enArticles = getArticlesData("en").items;
  const neArticles = getArticlesData("ne").items;

  console.log(`Found ${enArticles.length} English articles and ${neArticles.length} Nepali articles.`);

  for (const art of enArticles) {
    const slug = art.slug || art.id;
    const content = (art.content && art.content.length > 0)
      ? art.content.join("\n\n")
      : `${art.keyArgument}\n\n${art.implications}`;

    await prisma.blog.upsert({
      where: {
        slug_locale: {
          slug,
          locale: "en",
        },
      },
      update: {
        title: art.title,
        excerpt: art.summary,
        content,
        category: art.category,
        tags: [art.category, "Finance", "Strategy", "Nepal"],
        isPublished: true,
        locale: "en",
        seoTitle: `${art.title} | Keshab Datt Bhatt`,
        seoDescription: art.summary,
        authorName: "Keshab Datt Bhatt",
        authorRole: "Management & Financial Sector Professional",
        viewCount: Math.floor(Math.random() * 150) + 100,
      },
      create: {
        slug,
        title: art.title,
        excerpt: art.summary,
        content,
        category: art.category,
        tags: [art.category, "Finance", "Strategy", "Nepal"],
        isPublished: true,
        locale: "en",
        seoTitle: `${art.title} | Keshab Datt Bhatt`,
        seoDescription: art.summary,
        authorName: "Keshab Datt Bhatt",
        authorRole: "Management & Financial Sector Professional",
        viewCount: Math.floor(Math.random() * 150) + 100,
      },
    });
    console.log(`[EN] Upserted: ${slug}`);
  }

  for (const art of neArticles) {
    const slug = art.slug || art.id;
    const content = (art.content && art.content.length > 0)
      ? art.content.join("\n\n")
      : `${art.keyArgument}\n\n${art.implications}`;

    await prisma.blog.upsert({
      where: {
        slug_locale: {
          slug,
          locale: "ne",
        },
      },
      update: {
        title: art.title,
        excerpt: art.summary,
        content,
        category: art.category,
        tags: [art.category, "बैंकिङ", "पुँजी बजार", "नेपाल"],
        isPublished: true,
        locale: "ne",
        seoTitle: `${art.title} | केशव दत्त भट्ट`,
        seoDescription: art.summary,
        authorName: "केशव दत्त भट्ट",
        authorRole: "व्यवस्थापन तथा वित्तीय क्षेत्र विज्ञ",
        viewCount: Math.floor(Math.random() * 120) + 80,
      },
      create: {
        slug,
        title: art.title,
        excerpt: art.summary,
        content,
        category: art.category,
        tags: [art.category, "बैंकिङ", "पुँजी बजार", "नेपाल"],
        isPublished: true,
        locale: "ne",
        seoTitle: `${art.title} | केशव दत्त भट्ट`,
        seoDescription: art.summary,
        authorName: "केशव दत्त भट्ट",
        authorRole: "व्यवस्थापन तथा वित्तीय क्षेत्र विज्ञ",
        viewCount: Math.floor(Math.random() * 120) + 80,
      },
    });
    console.log(`[NE] Upserted: ${slug}`);
  }

  await prisma.systemKeepAlive.create({
    data: {
      source: "full-portfolio-seed",
      status: "ready",
    },
  });

  console.log("Full Supabase seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
