export interface SEOAnalysis {
  url: string;
  scanTime: string;
  crawlDuration: number;
  overallScore: number;
  scores: {
    technical: number;
    content: number;
    performance: number;
    mobile: number;
    accessibility: number;
    social: number;
  };
  crawlStats: {
    totalPages: number;
    crawledPages: number;
    errorPages: number;
    uniqueUrls: number;
    avgLoadTime: number;
    avgPageSize: number;
    avgWordCount: number;
  };
  issues: SEOIssue[];
  pages: PageAnalysis[];
  technicalInsights: TechnicalInsights;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'success';
  category: string;
  impact: 'critical' | 'high' | 'medium' | 'low';
  issue: string;
  suggestion: string;
  count?: number;
}

export interface PageAnalysis {
  url: string;
  title: string;
  titleLength: number;
  metaDescription: string | null;
  metaDescriptionLength: number;
  h1Count: number;
  h1Text: string[];
  h2Count: number;
  h3Count: number;
  wordCount: number;
  imageCount: number;
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  statusCode: number;
  loadTime: number;
  pageSize: number;
  canonicalUrl: string | null;
  viewport: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  lang: string | null;
  favicon: boolean;
  schemaMarkup: string[];
  hreflang: string[];
  coreWebVitals: {
    lcp: number;
    fid: number;
    cls: number;
  };
  depth: number;
  technicalScore: number;
  contentScore: number;
  performanceScore: number;
  metaKeywords: string | null;
}

export interface TechnicalInsights {
  structuredData: number;
  mobileViewport: number;
  duplicateTitles: number;
  duplicateMetas: number;
  orphanPages: number;
  hasRobotsTxt: boolean;
  hasSitemap: boolean;
  sitemapCount: number;
  sslEnabled: boolean;
  pagesWithFavicon: number;
  pagesWithHreflang: number;
  pagesWithMetaKeywords: number;
  brokenInternalLinks: number;
  maxCrawlDepth: number;
  robotsTxtSize: number;
  avgCoreWebVitalsLCP: number;
  avgCoreWebVitalsFID: number;
  avgCoreWebVitalsCLS: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  subscription: 'free' | 'pro' | 'enterprise';
  analysisCount: number;
  maxAnalyses: number;
}

export interface AnalysisHistory {
  id: string;
  userId: string;
  url: string;
  overallScore: number;
  createdAt: string;
  status: 'completed' | 'failed' | 'in_progress';
  pagesAnalyzed: number;
}