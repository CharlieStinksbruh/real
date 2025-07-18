import { useState, useCallback } from 'react';
import { SEOScanResult, ScanSession, SEOIssue } from '../types';

interface CrawlFeedback {
  stage: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export function useSEOScanner() {
  const [currentScan, setCurrentScan] = useState<ScanSession | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [crawlFeedback, setCrawlFeedback] = useState<CrawlFeedback[]>([]);

  const addFeedback = (stage: string, message: string, type: CrawlFeedback['type'] = 'info') => {
    const feedback: CrawlFeedback = {
      stage,
      message,
      timestamp: new Date().toLocaleTimeString('en-GB'),
      type
    };
    setCrawlFeedback(prev => [...prev, feedback]);
  };

  const startScan = useCallback(async (domain: string, userId: string) => {
    setIsScanning(true);
    setCrawlFeedback([]);
    
    // Ensure domain has protocol
    const normalizedDomain = domain.startsWith('http') ? domain : `https://${domain}`;
    
    addFeedback('Initialization', `Starting comprehensive SEO analysis for ${normalizedDomain}`, 'info');
    
    const scanSession: ScanSession = {
      id: Date.now().toString(),
      userId,
      domain: normalizedDomain,
      status: 'pending',
      totalPages: 0,
      scannedPages: 0,
      results: [],
      createdAt: new Date().toISOString()
    };
    
    setCurrentScan(scanSession);
    
    try {
      // Step 1: Discover URLs from multiple sources
      scanSession.status = 'scanning';
      setCurrentScan({ ...scanSession });
      
      addFeedback('Discovery', 'Discovering URLs from sitemaps and internal links...', 'info');
      const discoveredUrls = await discoverURLs(normalizedDomain, addFeedback);
      
      scanSession.totalPages = discoveredUrls.length;
      setCurrentScan({ ...scanSession });
      
      addFeedback('Discovery', `Found ${discoveredUrls.length} pages to analyse`, 'success');
      
      // Step 2: Scan each URL with detailed feedback
      const results: SEOScanResult[] = [];
      
      for (let i = 0; i < discoveredUrls.length; i++) {
        const url = discoveredUrls[i];
        const urlPath = new URL(url).pathname;
        
        addFeedback('Scanning', `Analysing page ${i + 1}/${discoveredUrls.length}: ${urlPath}`, 'info');
        
        try {
          const result = await scanURL(url, addFeedback);
          results.push(result);
          
          const scoreColor = result.score >= 80 ? 'success' : result.score >= 60 ? 'warning' : 'error';
          addFeedback('Analysis', `Page scored ${result.score}/100 - ${result.issues.length} issues found`, scoreColor);
          
          scanSession.scannedPages = i + 1;
          scanSession.results = results;
          setCurrentScan({ ...scanSession });
          
          // Respectful delay between requests
          await new Promise(resolve => setTimeout(resolve, 800));
        } catch (error) {
          addFeedback('Error', `Failed to analyse ${urlPath}: ${error}`, 'error');
          console.error(`Failed to scan ${url}:`, error);
        }
      }
      
      scanSession.status = 'completed';
      scanSession.completedAt = new Date().toISOString();
      setCurrentScan({ ...scanSession });
      
      // Final summary
      const avgScore = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length) : 0;
      const totalIssues = results.reduce((acc, r) => acc + r.issues.length, 0);
      
      addFeedback('Complete', `Scan completed! Average score: ${avgScore}/100, Total issues: ${totalIssues}`, 'success');
      
    } catch (error) {
      console.error('Scan failed:', error);
      addFeedback('Error', `Scan failed: ${error}`, 'error');
      scanSession.status = 'failed';
      setCurrentScan({ ...scanSession });
    }
    
    setIsScanning(false);
  }, []);

  return {
    currentScan,
    isScanning,
    startScan,
    crawlFeedback
  };
}

async function discoverURLs(domain: string, addFeedback: (stage: string, message: string, type?: CrawlFeedback['type']) => void): Promise<string[]> {
  const urls = new Set<string>();
  const baseUrl = new URL(domain);
  
  try {
    // Step 1: Try multiple sitemap locations
    addFeedback('Sitemap Discovery', 'Searching for XML sitemaps...', 'info');
    const sitemapUrls = await fetchSitemapUrls(domain, addFeedback);
    sitemapUrls.forEach(url => urls.add(url));
    
    if (sitemapUrls.length > 0) {
      addFeedback('Sitemap Discovery', `Found ${sitemapUrls.length} URLs from sitemaps`, 'success');
    } else {
      addFeedback('Sitemap Discovery', 'No sitemaps found, will crawl from homepage', 'warning');
    }
    
    // Step 2: Crawl from homepage and key pages
    addFeedback('Link Crawling', 'Crawling internal links from homepage...', 'info');
    const homepageUrls = await crawlFromHomepage(domain, addFeedback);
    homepageUrls.forEach(url => urls.add(url));
    
    // Step 3: Try common page patterns
    addFeedback('Pattern Discovery', 'Checking common page patterns...', 'info');
    const commonPages = await discoverCommonPages(domain, addFeedback);
    commonPages.forEach(url => urls.add(url));
    
    // Step 4: Deep crawl from discovered pages (limited)
    if (urls.size < 20) {
      addFeedback('Deep Crawling', 'Performing deep crawl from discovered pages...', 'info');
      const deepUrls = await deepCrawl(Array.from(urls).slice(0, 5), baseUrl, addFeedback);
      deepUrls.forEach(url => urls.add(url));
    }
    
    // Ensure we have at least the homepage
    urls.add(domain);
    
  } catch (error) {
    addFeedback('Discovery Error', `Error during URL discovery: ${error}`, 'error');
    console.error('Error discovering URLs:', error);
    urls.add(domain);
  }
  
  // Convert to array, prioritise important pages, and limit
  const urlArray = Array.from(urls);
  const prioritisedUrls = prioritiseUrls(urlArray, domain);
  
  return prioritisedUrls.slice(0, 100); // Increased limit for more comprehensive scanning
}

async function fetchSitemapUrls(domain: string, addFeedback: (stage: string, message: string, type?: CrawlFeedback['type']) => void): Promise<string[]> {
  const urls: string[] = [];
  const sitemapUrls = [
    `${domain}/sitemap.xml`,
    `${domain}/sitemap_index.xml`,
    `${domain}/sitemaps.xml`,
    `${domain}/sitemap-index.xml`,
    `${domain}/wp-sitemap.xml`, // WordPress
    `${domain}/sitemap1.xml`,
    `${domain}/post-sitemap.xml`,
    `${domain}/page-sitemap.xml`
  ];
  
  for (const sitemapUrl of sitemapUrls) {
    try {
      addFeedback('Sitemap Check', `Checking ${new URL(sitemapUrl).pathname}...`, 'info');
      const htmlContent = await fetchWithProxy(sitemapUrl);
      
      if (htmlContent) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(htmlContent, 'text/xml');
        
        // Check for XML parsing errors
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
          addFeedback('Sitemap Check', `Invalid XML in ${new URL(sitemapUrl).pathname}`, 'warning');
          continue;
        }
        
        // Check for sitemap index
        const sitemapElements = xmlDoc.getElementsByTagName('sitemap');
        if (sitemapElements.length > 0) {
          addFeedback('Sitemap Index', `Found sitemap index with ${sitemapElements.length} sitemaps`, 'success');
          
          // This is a sitemap index, fetch individual sitemaps
          for (let i = 0; i < Math.min(sitemapElements.length, 10); i++) {
            const locElement = sitemapElements[i].getElementsByTagName('loc')[0];
            if (locElement) {
              const subSitemapUrls = await fetchSitemapUrls(locElement.textContent || '', addFeedback);
              urls.push(...subSitemapUrls);
            }
          }
        } else {
          // Regular sitemap with URLs
          const urlElements = xmlDoc.getElementsByTagName('url');
          addFeedback('Sitemap Parse', `Found ${urlElements.length} URLs in sitemap`, 'success');
          
          for (let i = 0; i < urlElements.length; i++) {
            const locElement = urlElements[i].getElementsByTagName('loc')[0];
            if (locElement && locElement.textContent) {
              urls.push(locElement.textContent);
            }
          }
        }
        
        if (urls.length > 0) break; // Found a working sitemap
      }
    } catch (error) {
      addFeedback('Sitemap Error', `Failed to fetch ${new URL(sitemapUrl).pathname}`, 'warning');
      console.error(`Failed to fetch sitemap ${sitemapUrl}:`, error);
    }
  }
  
  return urls;
}

async function crawlFromHomepage(domain: string, addFeedback: (stage: string, message: string, type?: CrawlFeedback['type']) => void): Promise<string[]> {
  const urls = new Set<string>();
  
  try {
    const htmlContent = await fetchWithProxy(domain);
    
    if (htmlContent) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const links = doc.getElementsByTagName('a');
      const baseUrl = new URL(domain);
      
      let internalLinkCount = 0;
      
      for (let i = 0; i < links.length; i++) {
        const href = links[i].getAttribute('href');
        if (href) {
          try {
            const url = new URL(href, domain);
            // Only include internal links from the same domain
            if (url.hostname === baseUrl.hostname && !isExcludedPath(url.pathname)) {
              urls.add(url.toString());
              internalLinkCount++;
            }
          } catch (error) {
            // Invalid URL, skip
          }
        }
      }
      
      addFeedback('Link Crawling', `Found ${internalLinkCount} internal links on homepage`, 'success');
      
      // Also check for navigation menus, footer links, etc.
      const navElements = doc.querySelectorAll('nav a, .menu a, .navigation a, footer a');
      let navLinkCount = 0;
      
      navElements.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          try {
            const url = new URL(href, domain);
            if (url.hostname === baseUrl.hostname && !isExcludedPath(url.pathname)) {
              urls.add(url.toString());
              navLinkCount++;
            }
          } catch (error) {
            // Invalid URL, skip
          }
        }
      });
      
      if (navLinkCount > 0) {
        addFeedback('Navigation Crawl', `Found ${navLinkCount} additional navigation links`, 'success');
      }
    }
  } catch (error) {
    addFeedback('Crawl Error', `Failed to crawl homepage: ${error}`, 'error');
    console.error('Failed to crawl homepage:', error);
  }
  
  return Array.from(urls);
}

async function discoverCommonPages(domain: string, addFeedback: (stage: string, message: string, type?: CrawlFeedback['type']) => void): Promise<string[]> {
  const commonPaths = [
    '/about',
    '/about-us',
    '/contact',
    '/contact-us',
    '/services',
    '/products',
    '/blog',
    '/news',
    '/privacy-policy',
    '/terms-of-service',
    '/terms-and-conditions',
    '/faq',
    '/support',
    '/help'
  ];
  
  const foundUrls: string[] = [];
  
  for (const path of commonPaths) {
    const testUrl = `${domain}${path}`;
    try {
      // Quick HEAD request to check if page exists
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(testUrl)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.status && data.status.http_code === 200) {
          foundUrls.push(testUrl);
        }
      }
    } catch (error) {
      // Silently continue
    }
  }
  
  if (foundUrls.length > 0) {
    addFeedback('Pattern Discovery', `Found ${foundUrls.length} common pages`, 'success');
  }
  
  return foundUrls;
}

async function deepCrawl(seedUrls: string[], baseUrl: URL, addFeedback: (stage: string, message: string, type?: CrawlFeedback['type']) => void): Promise<string[]> {
  const urls = new Set<string>();
  
  for (const seedUrl of seedUrls) {
    try {
      const htmlContent = await fetchWithProxy(seedUrl);
      
      if (htmlContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const links = doc.getElementsByTagName('a');
        
        for (let i = 0; i < Math.min(links.length, 50); i++) { // Limit links per page
          const href = links[i].getAttribute('href');
          if (href) {
            try {
              const url = new URL(href, seedUrl);
              if (url.hostname === baseUrl.hostname && !isExcludedPath(url.pathname)) {
                urls.add(url.toString());
              }
            } catch (error) {
              // Invalid URL, skip
            }
          }
        }
      }
    } catch (error) {
      // Continue with next seed URL
    }
  }
  
  if (urls.size > 0) {
    addFeedback('Deep Crawling', `Discovered ${urls.size} additional pages through deep crawling`, 'success');
  }
  
  return Array.from(urls);
}

function prioritiseUrls(urls: string[], domain: string): string[] {
  const baseUrl = new URL(domain);
  
  return urls.sort((a, b) => {
    const pathA = new URL(a).pathname;
    const pathB = new URL(b).pathname;
    
    // Prioritise homepage
    if (pathA === '/') return -1;
    if (pathB === '/') return 1;
    
    // Prioritise important pages
    const importantPaths = ['/about', '/contact', '/services', '/products', '/blog'];
    const aImportant = importantPaths.some(path => pathA.startsWith(path));
    const bImportant = importantPaths.some(path => pathB.startsWith(path));
    
    if (aImportant && !bImportant) return -1;
    if (!aImportant && bImportant) return 1;
    
    // Prioritise shorter paths (likely more important)
    const aDepth = pathA.split('/').length;
    const bDepth = pathB.split('/').length;
    
    return aDepth - bDepth;
  });
}

function isExcludedPath(pathname: string): boolean {
  const excludedPatterns = [
    '/wp-admin',
    '/admin',
    '/login',
    '/register',
    '/cart',
    '/checkout',
    '/account',
    '/dashboard',
    '/.well-known',
    '/api/',
    '/wp-content',
    '/wp-includes',
    '/feed',
    '/rss',
    '.xml',
    '.pdf',
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.css',
    '.js'
  ];
  
  return excludedPatterns.some(pattern => pathname.includes(pattern));
}

async function scanURL(url: string, addFeedback: (stage: string, message: string, type?: CrawlFeedback['type']) => void): Promise<SEOScanResult> {
  const startTime = Date.now();
  
  try {
    const htmlContent = await fetchWithProxy(url);
    const loadTime = Date.now() - startTime;
    
    if (!htmlContent) {
      addFeedback('Scan Error', `Failed to fetch content for ${new URL(url).pathname}`, 'error');
      return createErrorResult(url, 0, loadTime);
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    return analyzeDocument(url, doc, 200, loadTime, addFeedback);
    
  } catch (error) {
    const loadTime = Date.now() - startTime;
    addFeedback('Scan Error', `Analysis failed for ${new URL(url).pathname}: ${error}`, 'error');
    console.error(`Failed to scan ${url}:`, error);
    return createErrorResult(url, 0, loadTime);
  }
}

async function fetchWithProxy(url: string): Promise<string | null> {
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://cors-anywhere.herokuapp.com/${url}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`
  ];
  
  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (response.ok) {
        if (proxyUrl.includes('allorigins.win')) {
          const data = await response.json();
          if (data.status && data.status.http_code === 200) {
            return data.contents;
          }
        } else if (proxyUrl.includes('codetabs.com')) {
          return await response.text();
        } else {
          return await response.text();
        }
      }
    } catch (error) {
      console.error(`Proxy ${proxyUrl} failed:`, error);
      continue;
    }
  }
  
  return null;
}

function analyzeDocument(url: string, doc: Document, status: number, loadTime: number, addFeedback: (stage: string, message: string, type?: CrawlFeedback['type']) => void): SEOScanResult {
  const issues: SEOIssue[] = [];
  
  // Get basic elements
  const title = doc.querySelector('title')?.textContent?.trim() || '';
  const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
  const h1Elements = doc.querySelectorAll('h1');
  const h2Elements = doc.querySelectorAll('h2');
  const images = doc.querySelectorAll('img');
  const links = doc.querySelectorAll('a');
  
  // Advanced SEO elements
  const metaKeywords = doc.querySelector('meta[name="keywords"]')?.getAttribute('content');
  const canonicalLink = doc.querySelector('link[rel="canonical"]');
  const metaRobots = doc.querySelector('meta[name="robots"]');
  const ogTitle = doc.querySelector('meta[property="og:title"]');
  const ogDescription = doc.querySelector('meta[property="og:description"]');
  const twitterCard = doc.querySelector('meta[name="twitter:card"]');
  const structuredData = doc.querySelectorAll('script[type="application/ld+json"]');
  
  // Analyze title
  if (!title) {
    issues.push({
      type: 'error',
      message: 'Missing page title',
      element: 'title'
    });
  } else {
    if (title.length < 30) {
      issues.push({
        type: 'warning',
        message: `Title too short (${title.length} chars) - should be 30-60 characters`,
        element: 'title'
      });
    } else if (title.length > 60) {
      issues.push({
        type: 'warning',
        message: `Title too long (${title.length} chars) - should be 30-60 characters`,
        element: 'title'
      });
    }
  }
  
  // Analyze meta description
  if (!metaDescription) {
    issues.push({
      type: 'error',
      message: 'Missing meta description',
      element: 'meta[name="description"]'
    });
  } else {
    if (metaDescription.length < 120) {
      issues.push({
        type: 'warning',
        message: `Meta description too short (${metaDescription.length} chars) - should be 120-160 characters`,
        element: 'meta[name="description"]'
      });
    } else if (metaDescription.length > 160) {
      issues.push({
        type: 'warning',
        message: `Meta description too long (${metaDescription.length} chars) - should be 120-160 characters`,
        element: 'meta[name="description"]'
      });
    }
  }
  
  // Analyze H1 tags
  if (h1Elements.length === 0) {
    issues.push({
      type: 'error',
      message: 'Missing H1 tag',
      element: 'h1'
    });
  } else if (h1Elements.length > 1) {
    issues.push({
      type: 'warning',
      message: `Multiple H1 tags found (${h1Elements.length}) - should be only one`,
      element: 'h1'
    });
  }
  
  // Analyze images
  let imagesWithoutAlt = 0;
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    if (!alt || alt.trim() === '') {
      imagesWithoutAlt++;
    }
  });
  
  if (imagesWithoutAlt > 0) {
    issues.push({
      type: 'warning',
      message: `${imagesWithoutAlt} of ${images.length} images missing alt text`,
      element: 'img'
    });
  }
  
  // Analyze links
  const baseUrl = new URL(url);
  let internalLinks = 0;
  let externalLinks = 0;
  let brokenLinks = 0;
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      try {
        const linkUrl = new URL(href, url);
        if (linkUrl.hostname === baseUrl.hostname) {
          internalLinks++;
        } else {
          externalLinks++;
        }
      } catch (error) {
        brokenLinks++;
      }
    }
  });
  
  if (brokenLinks > 0) {
    issues.push({
      type: 'warning',
      message: `${brokenLinks} potentially broken links found`,
      element: 'a'
    });
  }
  
  // Check for canonical URL
  if (!canonicalLink) {
    issues.push({
      type: 'info',
      message: 'Consider adding a canonical URL',
      element: 'link[rel="canonical"]'
    });
  }
  
  // Check for meta robots
  if (!metaRobots) {
    issues.push({
      type: 'info',
      message: 'Consider adding meta robots tag',
      element: 'meta[name="robots"]'
    });
  }
  
  // Check for Open Graph tags
  if (!ogTitle) {
    issues.push({
      type: 'info',
      message: 'Missing Open Graph title for social media sharing',
      element: 'meta[property="og:title"]'
    });
  }
  
  if (!ogDescription) {
    issues.push({
      type: 'info',
      message: 'Missing Open Graph description for social media sharing',
      element: 'meta[property="og:description"]'
    });
  }
  
  // Check for Twitter Card
  if (!twitterCard) {
    issues.push({
      type: 'info',
      message: 'Missing Twitter Card meta tag',
      element: 'meta[name="twitter:card"]'
    });
  }
  
  // Check for structured data
  if (structuredData.length === 0) {
    issues.push({
      type: 'info',
      message: 'No structured data (JSON-LD) found - consider adding for better search results',
      element: 'script[type="application/ld+json"]'
    });
  }
  
  // Performance issues
  if (loadTime > 3000) {
    issues.push({
      type: 'warning',
      message: `Page load time is slow (${Math.round(loadTime)}ms) - should be under 3 seconds`,
      element: 'performance'
    });
  } else if (loadTime > 1000) {
    issues.push({
      type: 'info',
      message: `Page load time could be improved (${Math.round(loadTime)}ms) - aim for under 1 second`,
      element: 'performance'
    });
  }
  
  // Calculate score based on various factors
  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const infoCount = issues.filter(i => i.type === 'info').length;
  
  let score = 100;
  score -= errorCount * 15; // Major penalty for errors
  score -= warningCount * 8; // Medium penalty for warnings
  score -= infoCount * 3; // Small penalty for missing optimizations
  score -= Math.max(0, imagesWithoutAlt * 2); // Penalty for images without alt text
  score -= Math.max(0, (loadTime - 1000) / 100); // Performance penalty
  
  // Bonus points for good practices
  if (canonicalLink) score += 2;
  if (metaRobots) score += 2;
  if (ogTitle && ogDescription) score += 3;
  if (structuredData.length > 0) score += 5;
  if (h1Elements.length === 1) score += 3;
  if (title.length >= 30 && title.length <= 60) score += 3;
  if (metaDescription.length >= 120 && metaDescription.length <= 160) score += 3;
  
  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  
  return {
    id: Date.now().toString() + Math.random(),
    url,
    title,
    metaDescription,
    h1Count: h1Elements.length,
    h2Count: h2Elements.length,
    imageCount: images.length,
    imagesWithoutAlt,
    internalLinks,
    externalLinks,
    loadTime,
    status,
    issues,
    score: finalScore
  };
}

function createErrorResult(url: string, status: number, loadTime: number): SEOScanResult {
  return {
    id: Date.now().toString() + Math.random(),
    url,
    title: undefined,
    metaDescription: undefined,
    h1Count: 0,
    h2Count: 0,
    imageCount: 0,
    imagesWithoutAlt: 0,
    internalLinks: 0,
    externalLinks: 0,
    loadTime,
    status,
    issues: [{
      type: 'error',
      message: status === 0 ? 'Failed to fetch page content' : `HTTP ${status} error`,
      element: 'page'
    }],
    score: 0
  };
}