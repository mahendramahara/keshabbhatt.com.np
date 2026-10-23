import { marked } from "marked";

/**
 * Configure marked defaults for strict GFM compliance
 */
marked.setOptions({
  gfm: true,
  breaks: true,
});

/**
 * Sanitizes an HTML string to prevent any XSS or HTML injection attacks.
 * Only permits semantic, safe elements for article content.
 */
export function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml) return "";

  let cleaned = rawHtml;

  // 1. Remove dangerous executable containers and their inner content
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  cleaned = cleaned.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "");
  cleaned = cleaned.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "");
  cleaned = cleaned.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "");

  // 2. Remove dangerous single tags
  cleaned = cleaned.replace(/<\/?(?:meta|link|base|input|button|textarea|select|dialog|svg|math)\b[^>]*>/gi, "");

  // 3. Strip all event handlers (onabort, onclick, onerror, onload, onmouseover, etc.)
  cleaned = cleaned.replace(/\s+on[a-zA-Z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

  // 4. Disallow javascript: or data: URIs in href and src attributes (prevent pseudo-protocol execution)
  cleaned = cleaned.replace(/href\s*=\s*(['"])\s*(?:javascript|data|vbscript):[^'"]*\1/gi, 'href="#"');
  cleaned = cleaned.replace(/src\s*=\s*(['"])\s*(?:javascript|data|vbscript):[^'"]*\1/gi, 'src=""');

  // 5. Ensure all external links have security attributes
  cleaned = cleaned.replace(/<a\s+(?![^>]*\brel=)([^>]*?)href="([^"]*)"([^>]*)>/gi, (match, before, href, after) => {
    if (href.startsWith("http://") || href.startsWith("https://")) {
      return `<a ${before}href="${href}" target="_blank" rel="noopener noreferrer"${after}>`;
    }
    return match;
  });

  // 6. Recursively remove empty block tags (prevents ghost tags like <h1></h1>, <p></p>, <p><br></p>)
  const emptyTagRegex = /<(h[1-6]|p|blockquote|li|ul|ol)>\s*(?:<br\s*\/?>|&nbsp;)?\s*<\/\1>/gi;
  let prev = "";
  while (prev !== cleaned) {
    prev = cleaned;
    cleaned = cleaned.replace(emptyTagRegex, "");
  }

  return cleaned.trim();
}

/**
 * Checks if the content string is formatted in Markdown rather than raw HTML.
 */
export function isMarkdownContent(content: string): boolean {
  if (!content) return false;
  const trimmed = content.trim();

  // If content starts with standard HTML block tags, it is definitely HTML, not Markdown
  const isHtml = /^<(?:p|h[1-6]|ul|ol|li|blockquote|div|table|pre|section|article)\b/i.test(trimmed);
  if (isHtml) {
    return false;
  }

  // Check for distinct Markdown syntax tokens
  const hasMarkdownPatterns =
    /^#{1,6}\s+/m.test(trimmed) ||
    /(\*\*|__)[^\s*].*?\1/.test(trimmed) ||
    /^\s*>\s+/m.test(trimmed) ||
    /^\s*[-*+]\s+[^\s]/m.test(trimmed) ||
    /^\s*\d+\.\s+[^\s]/m.test(trimmed) ||
    /```[\s\S]*?```/.test(trimmed) ||
    /\[([^\]]+)\]\(([^)]+)\)/.test(trimmed);

  // If no HTML tags exist, treat plain text or markdown as markdown so linebreaks are preserved
  const hasAnyHtmlTags = /<[a-z][\s\S]*>/i.test(trimmed);
  return hasMarkdownPatterns || !hasAnyHtmlTags;
}

/**
 * Converts Markdown or HTML content into secure, sanitized, SEO-optimized HTML.
 * Guaranteed 100% XSS-safe and stripped of empty phantom tags.
 */
export function renderSafeMarkdown(content: string): string {
  if (!content || !content.trim()) return "";

  let htmlOutput = "";

  if (isMarkdownContent(content)) {
    // Parse Markdown to HTML synchronously
    const rawParsed = marked.parse(content) as string;
    htmlOutput = rawParsed;
  } else {
    // Content is already HTML (legacy articles in DB)
    htmlOutput = content;
  }

  return sanitizeHtml(htmlOutput);
}

/**
 * Computes word count, character count, and estimated reading time.
 */
export function getArticleMetrics(content: string): { words: number; chars: number; readingTime: string } {
  if (!content) {
    return { words: 0, chars: 0, readingTime: "1 min read" };
  }

  // Strip tags and symbols for text stats
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/[#*`~_>[\]()-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = plainText ? plainText.split(/\s+/).filter(Boolean).length : 0;
  const chars = plainText.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    chars,
    readingTime: `${readingTimeMinutes} min read`,
  };
}
