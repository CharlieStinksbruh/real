export interface SEOIssue {
  type: 'error' | 'warning' | 'success';
  category: string;
  issue: string;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  page?: string;
  count?: number;
}

export interface PageAnalysis {
  url: string;
  title: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  h1Count: number;
  h1Text: string[];
  h2Count: number;
  h3Count: number;
  imageCount: number;
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  wordCount: number;
  loadTime: number;
  statusCode: number;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  schemaMarkup: string[];
  robotsDirective: string;
  lang: string;
  viewport: string;
  charset: string;
  sslEnabled: boolean;
  redirectChain: string[];
  contentType: string;
  lastModified: string;
  issues: SEOIssue[];
  htmlContent?: string;
}

export interface SEOAnalysis {
  url: string;
  overallScore: number;
  scores: {
    technical: number;
    content: number;
    performance: number;
    mobile: number;
    accessibility: number;
    social: number;
  };
  issues: SEOIssue[];
  pages: PageAnalysis[];
  crawlStats: {
    totalPages: number;
    crawledPages: number;
    errorPages: number;
    avgLoadTime: number;
    uniqueUrls: number;
    duplicateContent: number;
    avgTitleLength: number;
    avgMetaLength: number;
    avgWordCount: number;
  };
  technicalInsights: {
    hasRobotsTxt: boolean;
    hasSitemap: boolean;
    sslEnabled: boolean;
    mobileViewport: number;
    structuredData: number;
    duplicateTitles: number;
    duplicateMetas: number;
    brokenInternalLinks: number;
    orphanPages: number;
  };
  scanTime: string;
}