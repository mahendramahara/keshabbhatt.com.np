import { siteUrl } from "@/config/env";
import type { Locale } from "@keshab-bhatt/types";

/**
 * Returns strictly matching, self-referential canonical and alternate language links.
 * 
 * Rules:
 * - Default language (en) lives at the root / (or /articles, /articles/[slug]).
 * - Nepali language (ne) lives at /ne (or /ne/articles, /ne/articles/[slug]).
 * - Canonical strictly points to the current page's own URL (preventing "points to a different page").
 * - hreflang includes the current page itself with proper code (preventing "Self-referential alternate link is missing").
 */
export function getSeoAlternates(pathWithoutLocale = "", locale: Locale = "en") {
  const normalized = pathWithoutLocale.replace(/^\/+/, "");
  const cleanPath = normalized ? `/${normalized}` : "";

  // English URL (no /en prefix, matching Next.js canonical)
  const enUrl = `${siteUrl}${cleanPath}`;
  
  // Nepali URL (/ne prefix)
  const neUrl = `${siteUrl}/ne${cleanPath}`;

  const canonical = locale === "ne" ? neUrl : enUrl;

  return {
    canonical,
    languages: {
      en: enUrl,
      ne: neUrl,
      "x-default": enUrl,
    },
  };
}
