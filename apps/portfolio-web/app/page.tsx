import LocalizedPortfolioPage, { generateMetadata as generateLocaleMetadata } from "./[locale]/page";

export async function generateMetadata() {
  return generateLocaleMetadata({ params: Promise.resolve({ locale: "en" }) });
}

export default async function RootPage() {
  return LocalizedPortfolioPage({ params: Promise.resolve({ locale: "en" }) });
}
