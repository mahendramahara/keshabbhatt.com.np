function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://keshabbhatt.com.np"
).replace(/\/+$/, "");

export function absoluteUrl(path = ""): string {
  return `${siteUrl}${path}`;
}
