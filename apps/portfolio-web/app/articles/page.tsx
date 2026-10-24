import ArticlesPage, { generateMetadata as generateArticlesMetadata } from "../[locale]/articles/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return generateArticlesMetadata({ params: Promise.resolve({ locale: "en" }) });
}

export default async function DefaultArticlesPage() {
  return ArticlesPage({ params: Promise.resolve({ locale: "en" }) });
}
