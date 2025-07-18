export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  subscription?: 'free' | 'pro' | 'enterprise';
}

export interface SEOScanResult {
  id: string;
  url: string;
  title?: string;
  metaDescription?: string;
  h1Count: number;
  h2Count: number;
  imageCount: number;
  imagesWithoutAlt: number;
  internalLinks: number;
  externalLinks: number;
  loadTime: number;
  status: number;
  issues: SEOIssue[];
  score: number;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
}

export interface ScanSession {
  id: string;
  userId: string;
  domain: string;
  status: 'pending' | 'scanning' | 'completed' | 'failed';
  totalPages: number;
  scannedPages: number;
  results: SEOScanResult[];
  createdAt: string;
  completedAt?: string;
}