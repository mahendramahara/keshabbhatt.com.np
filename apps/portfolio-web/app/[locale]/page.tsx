import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale, ArticlePreviewItem } from "@keshab-bhatt/types";
import { getPortfolioData, getSeoConfig } from "@keshab-bhatt/content";
import { BlogService } from "@/services";
import { absoluteUrl, siteUrl } from "@/config/env";
import {
  Header,
  HeroSection,
  ExecutiveProfileSection,
  ExpertiseSection,
  LeadershipApproachSection,
  ManagementCapabilitiesSection,
  CapitalPerspectiveSection,
  ProfessionalExperienceSection,
  WorkResearchSection,
  ArticlesSection,
  ResearchEducationSection,
  CompetenciesContactSection,
  Footer,
  StructuredData,
} from "@/components";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ne") {
    return {};
  }

  const currentLocale = locale as Locale;
  const seo = getSeoConfig(currentLocale);
  const isNe = currentLocale === "ne";
  const canonicalUrl = absoluteUrl(`/${currentLocale}`);

  return {
    title: seo.defaultTitle,
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: "Keshab Datt Bhatt", url: siteUrl }],
    creator: "Keshab Datt Bhatt",
    publisher: "Keshab Datt Bhatt",
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "en-US": absoluteUrl("/en"),
        "ne-NP": absoluteUrl("/ne"),
        "x-default": absoluteUrl("/en"),
      },
    },
    openGraph: {
      title: seo.openGraph.title,
      description: seo.openGraph.description,
      url: canonicalUrl,
      siteName: seo.siteName,
      locale: isNe ? "ne_NP" : "en_US",
      alternateLocale: isNe ? ["en_US"] : ["ne_NP"],
      type: "profile",
      images: [
        {
          url: "/images/og-cover.jpg",
          width: 1200,
          height: 630,
          alt: seo.openGraph.images?.[0]?.alt || "Keshab Datt Bhatt - Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.openGraph.title,
      description: seo.openGraph.description,
      images: ["/images/og-cover.jpg"],
    },
  };
}

export default async function LocalizedPortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ne") {
    notFound();
  }

  const currentLocale = locale as Locale;
  const data = getPortfolioData(currentLocale);
  const isNe = currentLocale === "ne";

  let featuredArticles: ArticlePreviewItem[] = data.articlesAndInsights.items;
  try {
    const dynamicBlogs = await BlogService.getBlogs({
      locale: currentLocale,
      isPublished: true,
      limit: 9,
    });
    if (dynamicBlogs.data.length > 0) {
      featuredArticles = dynamicBlogs.data.map((blog) => ({
        id: blog.id,
        slug: blog.slug,
        title: blog.title,
        category: blog.category,
        summary: blog.excerpt,
        keyArgument: blog.excerpt,
        implications: blog.seoDescription || blog.excerpt,
        actionText: isNe ? "लेख पढ्नुहोस्" : "Read Article",
        url: `/${currentLocale}/articles/${blog.slug}`,
        date: blog.publishedAt ? blog.publishedAt.split("T")[0] : undefined,
        readTime: `${Math.max(2, Math.ceil(blog.content.trim().split(/\s+/).length / 180))} min read`,
        content: blog.content.split("\n\n").filter(Boolean),
        author: blog.author.name,
      }));
    }
  } catch (err) {
    console.warn("Failed to load dynamic articles for home page:", err);
  }

  return (
    <>
      <StructuredData locale={currentLocale} />
      <Header
        locale={currentLocale}
        navItems={data.nav}
        downloadCvText={data.hero.downloadCvText}
        cvUrl={data.hero.cvUrl}
      />
      <main className="flex-1">
        <HeroSection data={data.hero} />
        <ExecutiveProfileSection
          profile={data.executiveProfile}
          proposition={data.valueProposition}
        />
        <ExpertiseSection
          expertiseTitle={data.areasOfExpertise.sectionTitle}
          expertiseItems={data.areasOfExpertise.items}
          philosophyTitle={data.professionalPhilosophy.sectionTitle}
          philosophyItems={data.professionalPhilosophy.items}
        />
        <LeadershipApproachSection data={data.leadershipApproach} />
        <ManagementCapabilitiesSection
          title={data.managementCapabilities.sectionTitle}
          items={data.managementCapabilities.items}
        />
        <CapitalPerspectiveSection
          perspective={data.capitalMarketPerspective}
          framework={data.analyticalFramework}
        />
        <ProfessionalExperienceSection
          title={data.experienceSection.title}
          subtitle={data.experienceSection.subtitle}
          foundationTitle={data.experienceSection.foundationTitle}
          foundationItems={data.experienceSection.foundationItems}
          institutionalTitle={data.experienceSection.institutionalTitle}
          institutionalItems={data.experienceSection.institutionalItems}
          items={data.experienceSection.items}
        />
        <WorkResearchSection
          title={data.selectedWorkAndResearch.title}
          subtitle={
            isNe
              ? "व्यावहारिक केस स्टडी, बजार विश्लेषण र संस्थागत परामर्श प्रतिवेदनहरू"
              : "Empirical case studies, market analysis, and corporate advisory deliverables"
          }
          items={data.selectedWorkAndResearch.items}
        />
        <ArticlesSection
          title={data.articlesAndInsights.title}
          subtitle={
            isNe
              ? "बैंकिङ, पुँजी बजार तथा रणनीतिक व्यवस्थापनसम्बन्धी लेख तथा विचारहरू"
              : "Thought leadership, financial sector research, and strategic perspectives on capital markets, banking, and governance."
          }
          viewAllText={isNe ? "सबै लेखहरू हेर्नुहोस्" : "See All Articles by Myself"}
          items={featuredArticles}
          locale={currentLocale}
        />
        <ResearchEducationSection
          researchTitle={data.researchInterests.title}
          researchItems={data.researchInterests.items}
          educationTitle={data.education.title}
          educationItems={data.education.items}
          certificationsTitle={data.certifications.title}
          certificationItems={data.certifications.items}
        />
        <CompetenciesContactSection
          competenciesTitle={data.keyCompetencies.title}
          competencyCategories={data.keyCompetencies.categories}
          contact={data.contact}
        />
      </main>
      <Footer data={data.footer} locale={currentLocale} />
    </>
  );
}
