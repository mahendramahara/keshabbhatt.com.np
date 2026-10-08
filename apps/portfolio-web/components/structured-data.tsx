import React from "react";
import type { Locale } from "@keshab-bhatt/types";
import {
  generatePersonJsonLd,
  generateWebSiteJsonLd,
  generateProfilePageJsonLd,
  generateBreadcrumbJsonLd
} from "@keshab-bhatt/content";

interface StructuredDataProps {
  locale: Locale;
}

export function StructuredData({ locale }: StructuredDataProps) {
  const person = generatePersonJsonLd(locale);
  const website = generateWebSiteJsonLd(locale);
  const profilePage = generateProfilePageJsonLd(locale);
  const breadcrumb = generateBreadcrumbJsonLd(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}
