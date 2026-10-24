import ArticleDetailPage, {
  generateMetadata as generateDetailMetadata,
  generateStaticParams as generateDetailStaticParams,
} from "../../[locale]/articles/[slug]/page";

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const allParams = await generateDetailStaticParams();
  return allParams.filter((p) => p.locale === "en").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return generateDetailMetadata({ params: Promise.resolve({ locale: "en", slug }) });
}

export default async function DefaultArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  return ArticleDetailPage({ params: Promise.resolve({ locale: "en", slug }) });
}
