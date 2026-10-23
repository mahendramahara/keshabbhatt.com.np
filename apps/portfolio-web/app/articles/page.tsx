import ArticlesPage, { generateMetadata as generateArticlesMetadata } from "../[locale]/articles/page";

export async function generateMetadata() {
  return generateArticlesMetadata({ params: Promise.resolve({ locale: "en" }) });
}

export default async function DefaultArticlesPage() {
  return ArticlesPage({ params: Promise.resolve({ locale: "en" }) });
}
