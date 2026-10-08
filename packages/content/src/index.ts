import type { Locale, PortfolioData } from "@keshab-bhatt/types";

import enSeo from "./data/en/seo.json";
import enNav from "./data/en/navigation.json";
import enHero from "./data/en/hero.json";
import enAbout from "./data/en/about.json";
import enExpertise from "./data/en/expertise.json";
import enLeadership from "./data/en/leadership.json";
import enManagement from "./data/en/management.json";
import enCapitalMarkets from "./data/en/capital-markets.json";
import enExperience from "./data/en/experience.json";
import enResearch from "./data/en/research.json";
import enArticles from "./data/en/articles.json";
import enEducation from "./data/en/education.json";
import enCompetencies from "./data/en/competencies.json";
import enContact from "./data/en/contact.json";

import neSeo from "./data/ne/seo.json";
import neNav from "./data/ne/navigation.json";
import neHero from "./data/ne/hero.json";
import neAbout from "./data/ne/about.json";
import neExpertise from "./data/ne/expertise.json";
import neLeadership from "./data/ne/leadership.json";
import neManagement from "./data/ne/management.json";
import neCapitalMarkets from "./data/ne/capital-markets.json";
import neExperience from "./data/ne/experience.json";
import neResearch from "./data/ne/research.json";
import neArticles from "./data/ne/articles.json";
import neEducation from "./data/ne/education.json";
import neCompetencies from "./data/ne/competencies.json";
import neContact from "./data/ne/contact.json";

export function getSeoConfig(locale: Locale = "en") {
  return locale === "ne" ? neSeo : enSeo;
}

export function getNavigationData(locale: Locale = "en") {
  return locale === "ne" ? neNav : enNav;
}

export function getHeroData(locale: Locale = "en") {
  return locale === "ne" ? neHero : enHero;
}

export function getAboutData(locale: Locale = "en") {
  return locale === "ne" ? neAbout : enAbout;
}

export function getExpertiseData(locale: Locale = "en") {
  return locale === "ne" ? neExpertise : enExpertise;
}

export function getLeadershipData(locale: Locale = "en") {
  return locale === "ne" ? neLeadership : enLeadership;
}

export function getManagementData(locale: Locale = "en") {
  return locale === "ne" ? neManagement : enManagement;
}

export function getCapitalMarketsData(locale: Locale = "en") {
  return locale === "ne" ? neCapitalMarkets : enCapitalMarkets;
}

export function getExperienceData(locale: Locale = "en") {
  return locale === "ne" ? neExperience : enExperience;
}

export function getResearchData(locale: Locale = "en") {
  return locale === "ne" ? neResearch : enResearch;
}

export function getArticlesData(locale: Locale = "en") {
  return locale === "ne" ? neArticles : enArticles;
}

export function getEducationData(locale: Locale = "en") {
  return locale === "ne" ? neEducation : enEducation;
}

export function getCompetenciesData(locale: Locale = "en") {
  return locale === "ne" ? neCompetencies : enCompetencies;
}

export function getContactData(locale: Locale = "en") {
  return locale === "ne" ? neContact : enContact;
}

export function getPortfolioData(locale: Locale = "en"): PortfolioData {
  const isNe = locale === "ne";
  const nav = isNe ? neNav : enNav;
  const hero = isNe ? neHero : enHero;
  const about = isNe ? neAbout : enAbout;
  const expertise = isNe ? neExpertise : enExpertise;
  const leadership = isNe ? neLeadership : enLeadership;
  const management = isNe ? neManagement : enManagement;
  const capital = isNe ? neCapitalMarkets : enCapitalMarkets;
  const experience = isNe ? neExperience : enExperience;
  const research = isNe ? neResearch : enResearch;
  const articles = isNe ? neArticles : enArticles;
  const education = isNe ? neEducation : enEducation;
  const competencies = isNe ? neCompetencies : enCompetencies;
  const contact = isNe ? neContact : enContact;

  return {
    nav: nav.nav,
    hero,
    executiveProfile: about.executiveProfile,
    valueProposition: about.valueProposition,
    areasOfExpertise: expertise.areasOfExpertise,
    professionalPhilosophy: expertise.professionalPhilosophy,
    leadershipApproach: leadership,
    managementCapabilities: {
      sectionTitle: management.title,
      items: management.items
    },
    capitalMarketPerspective: capital.capitalMarketPerspective,
    analyticalFramework: capital.analyticalFramework,
    experienceSection: experience,
    selectedWorkAndResearch: research.selectedWorkAndResearch,
    articlesAndInsights: articles,
    researchInterests: research.researchInterests,
    education: education.education,
    certifications: education.certifications,
    keyCompetencies: competencies,
    contact,
    footer: nav.footer
  };
}

export function generatePersonJsonLd(locale: Locale = "en") {
  const seo = getSeoConfig(locale);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${seo.siteUrl}/#person`,
    name: "Keshab Datt Bhatt",
    alternateName: ["Keshab Bhatt", "केशव दत्त भट्ट", "केशव भट्ट"],
    jobTitle: [
      "Business Consultant",
      "Business Coach",
      "Financial Sector Specialist",
      "Strategic Management Consultant"
    ],
    description: seo.description,
    url: seo.siteUrl,
    image: `${seo.siteUrl}/images/keshab-bhatt-portrait.jpg`,
    sameAs: seo.author.sameAs,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Koteshwor 32",
      addressLocality: "Kathmandu",
      addressCountry: "NP"
    },
    email: "keshabdattb66@gmail.com",
    telephone: "+977-9865718024",
    alumniOf: [
      {
        "@type": "EducationalOrganization",
        name: "Tribhuvan University",
        sameAs: "https://tu.edu.np"
      }
    ],
    knowsAbout: [
      "Banking & Financial Services",
      "Capital Markets & Stock Market",
      "Strategic Management",
      "Business Coaching",
      "Financial Valuation",
      "Corporate Governance",
      "Risk Management"
    ]
  };
}

export function generateWebSiteJsonLd(locale: Locale = "en") {
  const seo = getSeoConfig(locale);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${seo.siteUrl}/#website`,
    url: seo.siteUrl,
    name: seo.siteName,
    description: seo.description,
    inLanguage: locale === "ne" ? "ne-NP" : "en-US",
    publisher: {
      "@id": `${seo.siteUrl}/#person`
    }
  };
}

export function generateProfilePageJsonLd(locale: Locale = "en") {
  const seo = getSeoConfig(locale);
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${seo.siteUrl}/${locale}#webpage`,
    url: `${seo.siteUrl}/${locale}`,
    name: seo.defaultTitle,
    isPartOf: {
      "@id": `${seo.siteUrl}/#website`
    },
    about: {
      "@id": `${seo.siteUrl}/#person`
    },
    description: seo.description,
    inLanguage: locale === "ne" ? "ne-NP" : "en-US"
  };
}

export function generateBreadcrumbJsonLd(locale: Locale = "en") {
  const seo = getSeoConfig(locale);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "ne" ? "गृहपृष्ठ" : "Home",
        item: `${seo.siteUrl}/${locale}`
      }
    ]
  };
}
