export type Locale = "en" | "ne";

export type ThemeMode = "light" | "dark" | "system";

export type ThemePalette = "navy-gold" | "slate-corporate" | "emerald-wealth";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
}

export interface HeroSectionData {
  quote: string;
  badge: string;
  name: string;
  nameHighlight: string;
  subtitle: string;
  description: string;
  tags: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
  downloadCvText: string;
  cvUrl: string;
  connectLinkedInText: string;
  linkedInUrl: string;
  contactQuickInfo: {
    location: string;
    email: string;
    phone: string;
    linkedIn: string;
  };
  pillars: string[];
}

export interface ExecutiveProfileData {
  title: string;
  body: string;
  readMoreText: string;
  readMoreUrl: string;
}

export interface ValuePropositionData {
  title: string;
  body: string;
  tags: string[];
  workflow: string[];
  featuredQuote: {
    text: string;
    author: string;
  };
}

export interface ExpertiseItem {
  id: string;
  title: string;
  icon: string;
}

export interface PhilosophyItem {
  id: number;
  text: string;
}

export interface LeadershipApproachData {
  title: string;
  summary: string;
  traits: Array<{
    id: string;
    title: string;
    icon: string;
  }>;
}

export interface ManagementCapabilityItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface CapitalMarketPerspectiveData {
  title: string;
  columns: string[][];
}

export interface AnalyticalFrameworkStep {
  step: number;
  name: string;
}

export interface AnalyticalFrameworkData {
  title: string;
  steps: AnalyticalFrameworkStep[];
  appliedToLeft: string[];
  appliedToRight: string[];
}

export interface FoundationExperienceItem {
  id: string;
  title: string;
  duration: string;
  category: string;
  gainedTitle?: string;
  gainedPoints: string[];
}

export interface InstitutionalExperienceItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  scope: string;
  gainedPoints: string[];
  skills: string[];
}

export interface ProfessionalExperienceItem {
  id: string;
  organization: string;
  position: string;
  period: string;
  location?: string;
  roleType?: string;
  tagline?: string;
  responsibilities: string[];
  strategicImpact: string;
  leadershipScope: string;
  keyAchievements?: string[];
  skills?: string[];
}

export interface WorkResearchItem {
  id: number;
  title: string;
  context: string;
  objective: string;
  approach: string;
  findings: string;
  outcome: string;
  actionText: string;
  url: string;
}

export interface ArticlePreviewItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  keyArgument: string;
  implications: string;
  actionText: string;
  url: string;
  slug?: string;
  date?: string;
  readTime?: string;
  content?: string[];
  author?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  field: string;
}

export interface KeyCompetencyCategory {
  category: string;
  skills: string[];
}

export interface ContactSectionData {
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  cardTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedInUrl: string;
  linkedInDisplay: string;
  qrNotice: string;
}

export interface FooterData {
  tagline: string;
  quote: string;
  links: NavigationItem[];
  copyright: string;
}

export interface PortfolioData {
  nav: NavigationItem[];
  hero: HeroSectionData;
  executiveProfile: ExecutiveProfileData;
  valueProposition: ValuePropositionData;
  areasOfExpertise: {
    sectionTitle: string;
    items: ExpertiseItem[];
  };
  professionalPhilosophy: {
    sectionTitle: string;
    items: PhilosophyItem[];
  };
  leadershipApproach: LeadershipApproachData;
  managementCapabilities: {
    sectionTitle: string;
    items: ManagementCapabilityItem[];
  };
  capitalMarketPerspective: CapitalMarketPerspectiveData;
  analyticalFramework: AnalyticalFrameworkData;
  experienceSection: {
    title: string;
    subtitle?: string;
    foundationTitle?: string;
    foundationItems?: FoundationExperienceItem[];
    institutionalTitle?: string;
    institutionalItems?: InstitutionalExperienceItem[];
    items: ProfessionalExperienceItem[];
  };
  selectedWorkAndResearch: {
    title: string;
    items: WorkResearchItem[];
  };
  articlesAndInsights: {
    title: string;
    items: ArticlePreviewItem[];
  };
  researchInterests: {
    title: string;
    items: string[];
  };
  education: {
    title: string;
    items: EducationItem[];
  };
  certifications: {
    title: string;
    items: string[];
  };
  keyCompetencies: {
    title: string;
    categories: KeyCompetencyCategory[];
  };
  contact: ContactSectionData;
  footer: FooterData;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  isPublished: boolean;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl?: string;
  ogImage?: string;
  locale?: Locale;
  viewCount?: number;
  author: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}

export interface CreateBlogInput {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  isPublished?: boolean;
  publishedAt?: string;
  locale?: Locale;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
  author?: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
}

export type UpdateBlogInput = Partial<CreateBlogInput>;

export interface BlogQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  tag?: string;
  isPublished?: boolean;
  locale?: Locale;
  sortBy?: "publishedAt" | "title" | "viewCount" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

