import LocalizedPortfolioPage, { generateMetadata as generateLocaleMetadata } from "./[locale]/page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return generateLocaleMetadata({ params: Promise.resolve({ locale: "en" }) });
}

export default async function RootPage() {
  return LocalizedPortfolioPage({ params: Promise.resolve({ locale: "en" }) });
}
