-- =====================================================================
-- Migration: Create Blogs Management Table with RLS and Seed Data
-- Application: Keshab Datt Bhatt Portfolio & Mobile CMS API
-- Date: 2026-10-06
-- =====================================================================

-- 1. Create blogs table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    is_published BOOLEAN NOT NULL DEFAULT true,
    published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'ne')),
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    og_image TEXT,
    author_name TEXT NOT NULL DEFAULT 'Keshab Datt Bhatt',
    author_role TEXT NOT NULL DEFAULT 'Management & Financial Sector Professional',
    author_avatar TEXT,
    view_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Create performance indexes
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published_locale ON public.blogs(is_published, locale, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_category ON public.blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_tags ON public.blogs USING GIN(tags);

-- 3. Automatic updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_blogs_updated_at ON public.blogs;
CREATE TRIGGER trigger_set_blogs_updated_at
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- 4. RPC function to safely increment view count without race conditions
CREATE OR REPLACE FUNCTION public.increment_blog_views(blog_slug TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE public.blogs
    SET view_count = view_count + 1
    WHERE slug = blog_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Row Level Security (RLS) setup
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users to read published blogs
DROP POLICY IF EXISTS "Public can view published blogs" ON public.blogs;
CREATE POLICY "Public can view published blogs"
    ON public.blogs
    FOR SELECT
    USING (is_published = true);

-- Allow service role full administrative access (used by server route handlers)
DROP POLICY IF EXISTS "Service role has full access" ON public.blogs;
CREATE POLICY "Service role has full access"
    ON public.blogs
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role')
    WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR auth.role() = 'service_role');

-- =====================================================================
-- 6. Initial Seed Data
-- =====================================================================

INSERT INTO public.blogs (
    slug,
    title,
    excerpt,
    content,
    category,
    tags,
    is_published,
    published_at,
    locale,
    seo_title,
    seo_description,
    author_name,
    author_role,
    view_count
) VALUES
(
    'commercial-banking-nepal-margin-defense',
    'Banking & Financial Services: Margin Defense & Liquidity Discipline',
    'An in-depth perspective on managing net interest margins (NIM), asset-liability matching, and credit risk during cyclical monetary tightening.',
    E'## The Strategic Imperative of Margin Defense\n\nIn the evolving landscape of commercial banking in Nepal, fluctuating base rates and liquidity volatility place unprecedented pressure on net interest margins.\n\n### 1. Structural Asset-Liability Management\nCommercial institutions must transcend basic spread chasing and enforce disciplined asset-liability duration matching. When short-term interbank liquidity contracts, institutions that relied heavily on volatile corporate call deposits face immediate margin compression.\n\n### 2. Credit Risk and Capital Preservation\nUnder Nepal Rastra Bank regulatory capital adequacy frameworks, capital conservation is not merely compliance; it is strategic defense. Proactive loan stress testing and calibrated loan-to-value ratios safeguard resilience against counterparty defaults.\n\n### 3. Sustainable Profitability\nInstitutions that prioritize high-quality retail deposit mobilization over short-term volume expansion consistently achieve superior return on assets (ROA) across market cycles.',
    'Banking & Financial Services',
    ARRAY['Banking', 'Finance', 'Liquidity', 'NRB', 'Asset-Liability Management'],
    true,
    '2026-09-15T00:00:00Z',
    'en',
    'Commercial Banking Nepal - Margin Defense & Liquidity Discipline',
    'Strategic analysis of commercial banking margin management, ALM, and regulatory capital compliance.',
    'Keshab Datt Bhatt',
    'Management & Financial Sector Professional',
    240
),
(
    'capital-markets-nepse-efficiency-reforms',
    'Capital Markets & Investment: Valuation Frameworks & Market Efficiency',
    'Empirical inquiry into secondary market pricing behaviors, market microstructure anomalies, and the case for institutional market-making in NEPSE.',
    E'## Structural Maturity in Capital Markets\n\nDeveloping equity markets often oscillate between retail sentiment-driven momentum and macroeconomic fundamentals. For NEPSE to mature into an efficient capital-allocation platform, structural governance must advance in lockstep with trading infrastructure.\n\n### 1. The Role of Institutional Market Makers\nCurrently, high retail participation rates amplify cyclical volatility. Introducing dedicated institutional market-making and quantitative liquidity providers stabilizes bid-ask spreads during market drawdowns.\n\n### 2. Rigorous Fundamental Valuation\nInvestors and fund managers must anchor decisions to discounted cash flow (DCF) models, normalized return on equity (ROE), and risk-adjusted cost of capital, rather than speculative rumors.\n\n### 3. Market Integrity & Information Transparency\nConsistent corporate disclosure and strict insider-trading enforcement build retail trust and attract patient institutional capital.',
    'Capital Markets & Investment',
    ARRAY['Capital Markets', 'NEPSE', 'Equities', 'Valuation', 'Stock Market'],
    true,
    '2026-08-28T00:00:00Z',
    'en',
    'Capital Markets & NEPSE Efficiency - Keshab Datt Bhatt',
    'Valuation frameworks, institutional market-making, and structural reforms for secondary market efficiency in Nepal.',
    'Keshab Datt Bhatt',
    'Management & Financial Sector Professional',
    185
),
(
    'corporate-strategy-financial-leadership',
    'Business Strategy & Management: Corporate Turnaround & Operational Excellence',
    'Practical methodologies for capital allocation, internal control architecture, and agile strategic leadership across complex operating environments.',
    E'## The Convergence of Strategy and Financial Discipline\n\nStrategy without financial measurement is hallucination; financial management without strategic vision is administrative bookkeeping. High-performing organizations bridge this chasm through disciplined strategic execution.\n\n### 1. Capital Allocation Priority\nEvery capital expenditure must pass rigorous internal hurdle rate tests. Organizations must ruthlessly sunset low-yielding initiatives and redirect capital toward compounding core advantages.\n\n### 2. Operational Accountability\nClear KPI scorecards tied to cash flow conversion and operational velocity eliminate bureaucratic drag. Real-time dashboards enable rapid executive pivot before issues compound.\n\n### 3. People & Ethical Governance\nEnduring corporate turnarounds are ultimately human achievements. Instilling a culture of ethical stewardship and cross-functional leadership ensures long-term institutional resilience.',
    'Business Strategy & Management',
    ARRAY['Corporate Strategy', 'Leadership', 'Capital Allocation', 'Governance', 'Operations'],
    true,
    '2026-07-12T00:00:00Z',
    'en',
    'Corporate Strategy & Financial Leadership - Keshab Datt Bhatt',
    'Methodologies for capital allocation, organizational turnarounds, and executive stewardship.',
    'Keshab Datt Bhatt',
    'Management & Financial Sector Professional',
    155
),
(
    'nepali-banking-pranali-margin-nepal',
    'बैंकिङ तथा वित्तीय सेवा: मार्जिन व्यवस्थापन र तरलता अनुशासन',
    'चक्रिय मौद्रिक कडाइको समयमा खुद ब्याज मार्जिन (NIM), सम्पत्ति-दायित्व व्यवस्थापन र कर्जा जोखिम व्यवस्थापनसम्बन्धी गहन विश्लेषण।',
    E'## नेपालको बैंकिङ क्षेत्रमा मार्जिन रक्षाको रणनीतिक महत्त्व\n\nनेपालको वाणिज्य बैंकिङ क्षेत्रमा आधार दरको उतारचढाव र तरलता अभावको समयमा खुद ब्याज मार्जिन (NIM) व्यवस्थापन सबैभन्दा संवेदनशील चुनौती बनेको छ।\n\n### १. संस्थागत सम्पत्ति तथा दायित्व व्यवस्थापन\nवाणिज्य बैंकहरूले केवल निक्षेप सङ्कलनको परिमाणमा मात्र केन्द्रित नभई समयावधि र लागतको सन्तुलित व्यवस्थापन गर्नुपर्दछ।\n\n### २. पुँजीको सुरक्षा तथा जोखिम न्यूनीकरण\nनेपाल राष्ट्र बैंकको पुँजी पर्याप्तता निर्देशिकाअनुसार जोखिम भारित सम्पत्तिको कुशल व्यवस्थापन गर्नु दीर्घकालीन संस्थागत स्थायित्वको आधार हो।',
    'बैंकिङ तथा वित्तीय सेवा',
    ARRAY['बैंकिङ', 'वित्तीय सेवा', 'तरलता', 'नेपाल राष्ट्र बैंक'],
    true,
    '2026-09-15T00:00:00Z',
    'ne',
    'बैंकिङ तथा वित्तीय सेवा - केशव दत्त भट्ट',
    'नेपालको बैंकिङ क्षेत्रमा मार्जिन व्यवस्थापन र तरलता अनुशासनसम्बन्धी विश्लेषणात्मक लेख।',
    'केशव दत्त भट्ट',
    'व्यवस्थापन तथा वित्तीय क्षेत्र विज्ञ',
    110
)
ON CONFLICT (slug) DO NOTHING;
