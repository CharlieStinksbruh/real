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
    
    addFeedback('Initialization', `🚀 Starting comprehensive SEO analysis for ${normalizedDomain}`, 'info');
    
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
      // Step 1: Discover initial URLs
      scanSession.status = 'scanning';
      setCurrentScan({ ...scanSession });
      
      addFeedback('Discovery', '🔍 Discovering URLs from sitemaps and robots.txt...', 'info');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const initialUrls = await discoverInitialURLs(normalizedDomain, addFeedback);
      
      addFeedback('Discovery', `✅ Found ${initialUrls.length} initial pages to analyze`, 'success');
      
      const allUrls = new Set(initialUrls);
      const results: SEOScanResult[] = [];
      const processedUrls = new Set<string>();
      
      scanSession.totalPages = initialUrls.length;
      setCurrentScan({ ...scanSession });
      
      // Step 2: Process initial pages and discover more
      addFeedback('Deep Crawling', '🕷️ Starting deep crawl with link discovery...', 'info');
      
      const urlsToProcess = [...initialUrls];
      let currentIndex = 0;
      
      while (currentIndex < urlsToProcess.length && currentIndex < 100) { // Limit total pages
        const url = urlsToProcess[currentIndex];
        
        if (processedUrls.has(url)) {
          currentIndex++;
          continue;
        }
        
        processedUrls.add(url);
        const urlPath = new URL(url).pathname;
        
        addFeedback('Scanning', `📄 Analyzing page ${currentIndex + 1}: ${urlPath}`, 'info');
        
        try {
          const result = await scanURL(url, addFeedback);
          results.push(result);
          
          // Discover additional URLs from this page
          addFeedback('Link Discovery', `🔗 Discovering internal links from ${urlPath}...`, 'info');
          const newUrls = await discoverURLsFromPage(url, normalizedDomain, addFeedback);
          
          let newUrlsAdded = 0;
          newUrls.forEach(newUrl => {
            if (!allUrls.has(newUrl) && !processedUrls.has(newUrl) && allUrls.size < 150) {
              allUrls.add(newUrl);
              urlsToProcess.push(newUrl);
              newUrlsAdded++;
            }
          });
          
          if (newUrlsAdded > 0) {
            addFeedback('Discovery', `🎯 Found ${newUrlsAdded} new pages from ${urlPath} (Total: ${allUrls.size})`, 'success');
            scanSession.totalPages = Math.min(allUrls.size, 100);
          }
          
          // Detailed feedback about the page analysis
          const scoreColor = result.score >= 80 ? 'success' : result.score >= 60 ? 'warning' : 'error';
          const criticalIssues = result.issues.filter(i => i.type === 'error').length;
          const warnings = result.issues.filter(i => i.type === 'warning').length;
          
          addFeedback('Analysis', `📊 ${urlPath} scored ${result.score}/100 (${criticalIssues} errors, ${warnings} warnings)`, scoreColor);
          
          if (result.title) {
            addFeedback('Content', `📝 Title: "${result.title}" (${result.title.length} chars)`, 'info');
          }
          
          if (result.metaDescription) {
            addFeedback('Content', `📄 Meta description: ${result.metaDescription.length} characters`, 'info');
          } else {
            addFeedback('Content', `⚠️ Missing meta description on ${urlPath}`, 'warning');
          }
          
          if (result.h1Count === 0) {
            addFeedback('Structure', `❌ No H1 tag found on ${urlPath}`, 'error');
          } else if (result.h1Count > 1) {
            addFeedback('Structure', `⚠️ Multiple H1 tags (${result.h1Count}) on ${urlPath}`, 'warning');
          }
          
          if (result.imagesWithoutAlt > 0) {
            addFeedback('Accessibility', `🖼️ ${result.imagesWithoutAlt}/${result.imageCount} images missing alt text on ${urlPath}`, 'warning');
          }
          
          if (result.loadTime > 3000) {
            addFeedback('Performance', `🐌 Slow load time (${Math.round(result.loadTime)}ms) on ${urlPath}`, 'error');
          } else if (result.loadTime > 1000) {
            addFeedback('Performance', `⏱️ Load time: ${Math.round(result.loadTime)}ms on ${urlPath}`, 'warning');
          }
          
          scanSession.scannedPages = currentIndex + 1;
          scanSession.results = results;
          setCurrentScan({ ...scanSession });
          
          // Respectful delay between requests
          await new Promise(resolve => setTimeout(resolve, 1500));
          
        } catch (error) {
          addFeedback('Error', `❌ Failed to analyze ${urlPath}: ${error}`, 'error');
          console.error(`Failed to scan ${url}:`, error);
        }
        
        currentIndex++;
      }
      
      scanSession.status = 'completed';
      scanSession.completedAt = new Date().toISOString();
      setCurrentScan({ ...scanSession });
      
      // Final comprehensive summary
      const avgScore = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length) : 0;
      const totalIssues = results.reduce((acc, r) => acc + r.issues.length, 0);
      const criticalIssues = results.reduce((acc, r) => acc + r.issues.filter(i => i.type === 'error').length, 0);
      const warnings = results.reduce((acc, r) => acc + r.issues.filter(i => i.type === 'warning').length, 0);
      const totalImages = results.reduce((acc, r) => acc + r.imageCount, 0);
      const imagesWithoutAlt = results.reduce((acc, r) => acc + r.imagesWithoutAlt, 0);
      const avgLoadTime = results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.loadTime, 0) / results.length) : 0;
      
      addFeedback('Complete', `🎉 Deep crawl completed! Analyzed ${results.length} pages from ${allUrls.size} discovered URLs`, 'success');
      addFeedback('Summary', `📈 Average SEO score: ${avgScore}/100`, avgScore >= 80 ? 'success' : avgScore >= 60 ? 'warning' : 'error');
      addFeedback('Issues', `🔍 Found ${totalIssues} total issues: ${criticalIssues} critical, ${warnings} warnings`, criticalIssues > 0 ? 'error' : 'info');
      addFeedback('Performance', `⚡ Average load time: ${avgLoadTime}ms across all pages`, avgLoadTime > 3000 ? 'error' : avgLoadTime > 1000 ? 'warning' : 'success');
      addFeedback('Accessibility', `🖼️ Image optimization: ${totalImages - imagesWithoutAlt}/${totalImages} images have alt text`, imagesWithoutAlt > 0 ? 'warning' : 'success');
      
    } catch (error) {
      console.error('Scan failed:', error);
      addFeedback('Error', `💥 Scan failed: ${error}`, 'error');
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

async function discoverInitialURLs(domain: string, addFeedback: (stage: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void): Promise<string[]> {
  const urls = new Set<string>();
  const baseUrl = new URL(domain);
  
  try {
    // Step 1: Try multiple sitemap locations
    addFeedback('Sitemap Discovery', '🗺️ Searching for XML sitemaps...', 'info');
    const sitemapUrls = await fetchSitemapUrls(domain, addFeedback);
    sitemapUrls.forEach(url => urls.add(url));
    
    if (sitemapUrls.length > 0) {
      addFeedback('Sitemap Discovery', `✅ Found ${sitemapUrls.length} URLs from sitemaps`, 'success');
    } else {
      addFeedback('Sitemap Discovery', '⚠️ No sitemaps found, will crawl from homepage', 'warning');
    }
    
    // Step 2: Crawl from homepage
    addFeedback('Link Crawling', '🏠 Crawling internal links from homepage...', 'info');
    const homepageUrls = await crawlFromHomepage(domain, addFeedback);
    homepageUrls.forEach(url => urls.add(url));
    
    // Step 3: Try common page patterns
    addFeedback('Pattern Discovery', '🔍 Checking common page patterns...', 'info');
    const commonPages = await discoverCommonPages(domain, addFeedback);
    commonPages.forEach(url => urls.add(url));
    
    // Ensure we have at least the homepage
    urls.add(domain);
    
  } catch (error) {
    addFeedback('Discovery Error', `❌ Error during URL discovery: ${error}`, 'error');
    console.error('Error discovering URLs:', error);
    urls.add(domain);
  }
  
  // Convert to array and prioritize
  const urlArray = Array.from(urls);
  const prioritizedUrls = prioritizeUrls(urlArray, domain);
  
  return prioritizedUrls.slice(0, 25); // Start with initial batch
}

async function discoverURLsFromPage(pageUrl: string, baseDomain: string, addFeedback: (stage: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void): Promise<string[]> {
  const urls = new Set<string>();
  
  try {
    const htmlContent = await fetchWithProxy(pageUrl);
    
    if (htmlContent) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const links = doc.getElementsByTagName('a');
      const baseUrl = new URL(baseDomain);
      
      let discoveredCount = 0;
      
      for (let i = 0; i < links.length; i++) {
        const href = links[i].getAttribute('href');
        if (href) {
          try {
            const url = new URL(href, pageUrl);
            // Only include internal links from the same domain
            if (url.hostname === baseUrl.hostname && !isExcludedPath(url.pathname)) {
              const cleanUrl = url.origin + url.pathname; // Remove query params and fragments
              if (!urls.has(cleanUrl)) {
                urls.add(cleanUrl);
                discoveredCount++;
              }
            }
          } catch (error) {
            // Invalid URL, skip
          }
        }
      }
      
      // Also check for links in navigation menus, footers, etc.
      const navElements = doc.querySelectorAll('nav a, .menu a, .navigation a, footer a, .footer a');
      navElements.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          try {
            const url = new URL(href, pageUrl);
            if (url.hostname === baseUrl.hostname && !isExcludedPath(url.pathname)) {
              const cleanUrl = url.origin + url.pathname;
              if (!urls.has(cleanUrl)) {
                urls.add(cleanUrl);
                discoveredCount++;
              }
            }
          } catch (error) {
            // Invalid URL, skip
          }
        }
      });
      
      if (discoveredCount > 0) {
        const pagePath = new URL(pageUrl).pathname;
        addFeedback('Link Discovery', `🔗 Discovered ${discoveredCount} internal links from ${pagePath}`, 'success');
      }
    }
  } catch (error) {
    // Silently continue - this is additional discovery
  }
  
  return Array.from(urls);
}

async function fetchSitemapUrls(domain: string, addFeedback: (stage: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void): Promise<string[]> {
  const urls: string[] = [];
  const sitemapUrls = [
    `${domain}/sitemap.xml`,
    `${domain}/sitemap_index.xml`,
    `${domain}/sitemaps.xml`,
    `${domain}/sitemap-index.xml`,
    `${domain}/wp-sitemap.xml`,
    `${domain}/sitemap1.xml`
  ];
  
  for (const sitemapUrl of sitemapUrls) {
    try {
      const htmlContent = await fetchWithProxy(sitemapUrl);
      
      if (htmlContent) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(htmlContent, 'text/xml');
        
        // Check for XML parsing errors
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) continue;
        
        // Check for sitemap index
        const sitemapElements = xmlDoc.getElementsByTagName('sitemap');
        if (sitemapElements.length > 0) {
          addFeedback('Sitemap Index', `📋 Found sitemap index with ${sitemapElements.length} sitemaps`, 'success');
          
          // This is a sitemap index, fetch individual sitemaps
          for (let i = 0; i < Math.min(sitemapElements.length, 5); i++) {
            const locElement = sitemapElements[i].getElementsByTagName('loc')[0];
            if (locElement) {
              const subSitemapUrls = await fetchSitemapUrls(locElement.textContent || '', addFeedback);
              urls.push(...subSitemapUrls);
            }
          }
        } else {
          // Regular sitemap with URLs
          const urlElements = xmlDoc.getElementsByTagName('url');
          
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
      // Continue to next sitemap
    }
  }
  
  return urls;
}

async function crawlFromHomepage(domain: string, addFeedback: (stage: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void): Promise<string[]> {
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
            if (url.hostname === baseUrl.hostname && !isExcludedPath(url.pathname)) {
              urls.add(url.toString());
              internalLinkCount++;
            }
          } catch (error) {
            // Invalid URL, skip
          }
        }
      }
      
      if (internalLinkCount > 0) {
        addFeedback('Link Crawling', `🔗 Found ${internalLinkCount} internal links on homepage`, 'success');
      }
    }
  } catch (error) {
    addFeedback('Crawl Error', `❌ Failed to crawl homepage: ${error}`, 'error');
  }
  
  return Array.from(urls);
}

async function discoverCommonPages(domain: string, addFeedback: (stage: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void): Promise<string[]> {
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
    '/careers',
    '/team',
    '/portfolio',
    '/gallery',
    '/testimonials',
    '/faq'
  ];
  
  const foundUrls: string[] = [];
  
  for (const path of commonPaths) {
    const testUrl = `${domain}${path}`;
    try {
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
    addFeedback('Pattern Discovery', `📄 Found ${foundUrls.length} common pages`, 'success');
  }
  
  return foundUrls;
}

function prioritizeUrls(urls: string[], domain: string): string[] {
  const baseUrl = new URL(domain);
  
  return urls.sort((a, b) => {
    const pathA = new URL(a).pathname;
    const pathB = new URL(b).pathname;
    
    // Prioritize homepage
    if (pathA === '/') return -1;
    if (pathB === '/') return 1;
    
    // Prioritize important pages
    const importantPaths = ['/about', '/contact', '/services', '/products', '/blog'];
    const aImportant = importantPaths.some(path => pathA.startsWith(path));
    const bImportant = importantPaths.some(path => pathB.startsWith(path));
    
    if (aImportant && !bImportant) return -1;
    if (!aImportant && bImportant) return 1;
    
    // Prioritize shorter paths
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
    '.js',
    '.ico',
    '/search',
    '/tag/',
    '/category/',
    '/author/',
    '/page/',
    '?',
    '#'
  ];
  
  return excludedPatterns.some(pattern => pathname.includes(pattern));
}

async function scanURL(url: string, addFeedback: (stage: string, message: string, type?: 'info' | 'success' | 'warning' | 'error') => void): Promise<SEOScanResult> {
  const startTime = Date.now();
  
  try {
    const htmlContent = await fetchWithProxy(url);
    const loadTime = Date.now() - startTime;
    
    if (!htmlContent) {
      return createErrorResult(url, 0, loadTime);
    }
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    return analyzeDocument(url, doc, 200, loadTime);
    
  } catch (error) {
    const loadTime = Date.now() - startTime;
    console.error(`Failed to scan ${url}:`, error);
    return createErrorResult(url, 0, loadTime);
  }
}

async function fetchWithProxy(url: string): Promise<string | null> {
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://cors-anywhere.herokuapp.com/${url}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
  ];
  
  for (const proxyUrl of proxies) {
    try {
      const response = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response.ok) {
        if (proxyUrl.includes('allorigins.win')) {
          const data = await response.json();
          if (data.status && data.status.http_code === 200) {
            return data.contents;
          }
        } else {
          return await response.text();
        }
      }
    } catch (error) {
      continue;
    }
  }
  
  return null;
}

function analyzeDocument(url: string, doc: Document, status: number, loadTime: number): SEOScanResult {
  const issues: SEOIssue[] = [];
  
  // Get basic elements
  const title = doc.querySelector('title')?.textContent?.trim() || '';
  const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
  const h1Elements = doc.querySelectorAll('h1');
  const h2Elements = doc.querySelectorAll('h2');
  const h3Elements = doc.querySelectorAll('h3');
  const images = doc.querySelectorAll('img');
  const links = doc.querySelectorAll('a');
  
  // Advanced SEO elements
  const canonicalLink = doc.querySelector('link[rel="canonical"]');
  const metaRobots = doc.querySelector('meta[name="robots"]');
  const ogTitle = doc.querySelector('meta[property="og:title"]');
  const ogDescription = doc.querySelector('meta[property="og:description"]');
  const ogImage = doc.querySelector('meta[property="og:image"]');
  const twitterCard = doc.querySelector('meta[name="twitter:card"]');
  const structuredData = doc.querySelectorAll('script[type="application/ld+json"]');
  const viewport = doc.querySelector('meta[name="viewport"]');
  const metaKeywords = doc.querySelector('meta[name="keywords"]');
  const favicon = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
  const langAttr = doc.documentElement.getAttribute('lang');
  
  // Content analysis
  const bodyText = doc.body?.textContent || '';
  const wordCount = bodyText.trim().split(/\s+/).filter(word => word.length > 0).length;
  const pageSize = new Blob([doc.documentElement.outerHTML]).size;
  
  // Analyze title
  if (!title) {
    issues.push({
      type: 'error',
      message: 'Missing page title - Critical SEO issue that severely impacts search rankings. Every page must have a unique, descriptive title tag.',
      element: 'title'
    });
  } else {
    if (title.length < 30) {
      issues.push({
        type: 'warning',
        message: `Title too short (${title.length} characters) - Should be 30-60 characters for optimal SEO. Short titles may not fully describe the page content and miss keyword opportunities.`,
        element: 'title'
      });
    } else if (title.length > 60) {
      issues.push({
        type: 'warning',
        message: `Title too long (${title.length} characters) - May be truncated in search results. Keep titles under 60 characters to ensure full visibility in SERPs.`,
        element: 'title'
      });
    }
    
    // Check for duplicate words in title
    const titleWords = title.toLowerCase().split(/\s+/);
    const duplicateWords = titleWords.filter((word, index) => titleWords.indexOf(word) !== index);
    if (duplicateWords.length > 0) {
      issues.push({
        type: 'info',
        message: `Title contains duplicate words: "${duplicateWords.join(', ')}" - Consider removing redundancy to improve keyword efficiency.`,
        element: 'title'
      });
    }
  }
  
  // Analyze meta description
  if (!metaDescription) {
    issues.push({
      type: 'error',
      message: 'Missing meta description - Critical for click-through rates from search results. Meta descriptions act as ad copy in search results and significantly impact user engagement.',
      element: 'meta[name="description"]'
    });
  } else {
    if (metaDescription.length < 120) {
      issues.push({
        type: 'warning',
        message: `Meta description too short (${metaDescription.length} characters) - Should be 120-160 characters to maximize SERP real estate and provide comprehensive page summary.`,
        element: 'meta[name="description"]'
      });
    } else if (metaDescription.length > 160) {
      issues.push({
        type: 'warning',
        message: `Meta description too long (${metaDescription.length} characters) - Will be truncated in search results. Keep under 160 characters for full visibility.`,
        element: 'meta[name="description"]'
      });
    }
    
    // Check if meta description is just the title repeated
    if (metaDescription.toLowerCase() === title.toLowerCase()) {
      issues.push({
        type: 'warning',
        message: 'Meta description is identical to page title - Should provide additional context and compelling reasons to click, not duplicate the title.',
        element: 'meta[name="description"]'
      });
    }
  }
  
  // Analyze H1 tags
  if (h1Elements.length === 0) {
    issues.push({
      type: 'error',
      message: 'Missing H1 tag - Critical for content structure and SEO. H1 tags help search engines understand the main topic of the page and improve accessibility.',
      element: 'h1'
    });
  } else if (h1Elements.length > 1) {
    issues.push({
      type: 'warning',
      message: `Multiple H1 tags found (${h1Elements.length}) - Should have only one H1 per page for proper heading hierarchy. Multiple H1s can confuse search engines about page focus.`,
      element: 'h1'
    });
  } else {
    const h1Text = h1Elements[0].textContent?.trim() || '';
    if (h1Text.length < 10) {
      issues.push({
        type: 'warning',
        message: `H1 tag too short (${h1Text.length} characters) - Should be descriptive and contain primary keywords. Short H1s may not adequately describe page content.`,
        element: 'h1'
      });
    } else if (h1Text.length > 70) {
      issues.push({
        type: 'info',
        message: `H1 tag quite long (${h1Text.length} characters) - Consider keeping H1s concise while maintaining descriptiveness for better user experience.`,
        element: 'h1'
      });
    }
    
    // Check if H1 is similar to title
    if (title && h1Text.toLowerCase() === title.toLowerCase()) {
      issues.push({
        type: 'info',
        message: 'H1 tag is identical to page title - While not necessarily bad, consider slight variations to target additional keywords.',
        element: 'h1'
      });
    }
  }
  
  // Analyze heading structure
  if (h2Elements.length === 0 && wordCount > 300) {
    issues.push({
      type: 'warning',
      message: 'No H2 tags found on content-heavy page - Proper heading hierarchy (H1, H2, H3) improves content structure, readability, and SEO.',
      element: 'h2'
    });
  }
  
  // Analyze images
  let imagesWithoutAlt = 0;
  let imagesWithEmptyAlt = 0;
  let imagesWithGoodAlt = 0;
  
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    const src = img.getAttribute('src');
    
    if (!alt) {
      imagesWithoutAlt++;
    } else if (alt.trim() === '') {
      imagesWithEmptyAlt++;
    } else if (alt.length < 5) {
      issues.push({
        type: 'info',
        message: `Image alt text too short: "${alt}" - Alt text should be descriptive for better accessibility and SEO value.`,
        element: 'img'
      });
    } else if (alt.length > 125) {
      issues.push({
        type: 'info',
        message: `Image alt text too long (${alt.length} chars) - Keep alt text under 125 characters for optimal screen reader experience.`,
        element: 'img'
      });
    } else {
      imagesWithGoodAlt++;
    }
    
    // Check for lazy loading
    if (!img.hasAttribute('loading') && images.length > 3) {
      issues.push({
        type: 'info',
        message: 'Consider adding lazy loading to images (loading="lazy") to improve page performance, especially for images below the fold.',
        element: 'img'
      });
    }
  });
  
  if (imagesWithoutAlt > 0) {
    issues.push({
      type: 'error',
      message: `${imagesWithoutAlt} of ${images.length} images missing alt attributes - Critical accessibility issue that also impacts SEO. All images must have alt text for screen readers and search engines.`,
      element: 'img'
    });
  }
  
  if (imagesWithEmptyAlt > 0) {
    issues.push({
      type: 'warning',
      message: `${imagesWithEmptyAlt} images have empty alt attributes - Empty alt="" should only be used for decorative images. Content images need descriptive alt text.`,
      element: 'img'
    });
  }
  
  // Analyze links
  const baseUrl = new URL(url);
  let internalLinks = 0;
  let externalLinks = 0;
  let linksWithoutText = 0;
  let externalLinksWithoutNofollow = 0;
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    const linkText = link.textContent?.trim() || '';
    const rel = link.getAttribute('rel') || '';
    
    if (!linkText && !link.querySelector('img')) {
      linksWithoutText++;
    }
    
    if (href) {
      try {
        const linkUrl = new URL(href, url);
        if (linkUrl.hostname === baseUrl.hostname) {
          internalLinks++;
        } else {
          externalLinks++;
          if (!rel.includes('nofollow') && !rel.includes('sponsored') && !rel.includes('ugc')) {
            externalLinksWithoutNofollow++;
          }
        }
      } catch (error) {
        // Invalid URL
      }
    }
    
    // Check for generic link text
    const genericTexts = ['click here', 'read more', 'more', 'here', 'link'];
    if (genericTexts.includes(linkText.toLowerCase())) {
      issues.push({
        type: 'warning',
        message: `Generic link text found: "${linkText}" - Use descriptive link text that explains the destination for better SEO and accessibility.`,
        element: 'a'
      });
    }
  });
  
  if (linksWithoutText > 0) {
    issues.push({
      type: 'warning',
      message: `${linksWithoutText} links without text content - Links should have descriptive text or alt text on linked images for accessibility.`,
      element: 'a'
    });
  }
  
  if (internalLinks < 3 && wordCount > 300) {
    issues.push({
      type: 'info',
      message: `Low internal linking (${internalLinks} links) - Internal links help distribute page authority and improve site navigation. Consider adding relevant internal links.`,
      element: 'a'
    });
  }
  
  // Technical SEO checks
  if (!canonicalLink) {
    issues.push({
      type: 'warning',
      message: 'Missing canonical URL - Important for preventing duplicate content issues. Add <link rel="canonical" href="..."> to specify the preferred version of this page.',
      element: 'link[rel="canonical"]'
    });
  } else {
    const canonicalUrl = canonicalLink.getAttribute('href');
    if (canonicalUrl && canonicalUrl !== url) {
      issues.push({
        type: 'info',
        message: `Canonical URL points to different page: ${canonicalUrl} - Ensure this is intentional to avoid indexing issues.`,
        element: 'link[rel="canonical"]'
      });
    }
  }
  
  if (!viewport) {
    issues.push({
      type: 'error',
      message: 'Missing viewport meta tag - Critical for mobile optimization. Add <meta name="viewport" content="width=device-width, initial-scale=1"> for proper mobile display.',
      element: 'meta[name="viewport"]'
    });
  } else {
    const viewportContent = viewport.getAttribute('content') || '';
    if (!viewportContent.includes('width=device-width')) {
      issues.push({
        type: 'warning',
        message: 'Viewport meta tag missing "width=device-width" - Essential for responsive design and mobile SEO.',
        element: 'meta[name="viewport"]'
      });
    }
  }
  
  if (!langAttr) {
    issues.push({
      type: 'warning',
      message: 'Missing language declaration - Add lang attribute to <html> tag (e.g., <html lang="en">) for better accessibility and international SEO.',
      element: 'html'
    });
  }
  
  if (!favicon) {
    issues.push({
      type: 'info',
      message: 'Missing favicon - While not critical for SEO, favicons improve user experience and brand recognition in browser tabs and bookmarks.',
      element: 'link[rel="icon"]'
    });
  }
  
  // Open Graph and Social Media
  if (!ogTitle) {
    issues.push({
      type: 'warning',
      message: 'Missing Open Graph title - Important for social media sharing appearance. Add <meta property="og:title" content="..."> for better social engagement.',
      element: 'meta[property="og:title"]'
    });
  }
  
  if (!ogDescription) {
    issues.push({
      type: 'warning',
      message: 'Missing Open Graph description - Affects how your page appears when shared on social media. Add <meta property="og:description" content="...">.',
      element: 'meta[property="og:description"]'
    });
  }
  
  if (!ogImage) {
    issues.push({
      type: 'info',
      message: 'Missing Open Graph image - Social media posts without images get less engagement. Add <meta property="og:image" content="...">.',
      element: 'meta[property="og:image"]'
    });
  }
  
  if (!twitterCard) {
    issues.push({
      type: 'info',
      message: 'Missing Twitter Card meta tags - Enhance Twitter sharing with <meta name="twitter:card" content="summary_large_image">.',
      element: 'meta[name="twitter:card"]'
    });
  }
  
  // Structured Data
  if (structuredData.length === 0) {
    issues.push({
      type: 'info',
      message: 'No structured data found - Schema markup helps search engines understand your content better and can enable rich snippets in search results.',
      element: 'script[type="application/ld+json"]'
    });
  } else {
    // Validate JSON-LD
    structuredData.forEach((script, index) => {
      try {
        JSON.parse(script.textContent || '');
      } catch (error) {
        issues.push({
          type: 'error',
          message: `Invalid JSON-LD structured data (script ${index + 1}) - Syntax error in structured data can prevent rich snippets.`,
          element: 'script[type="application/ld+json"]'
        });
      }
    });
  }
  
  // Content Quality Analysis
  if (wordCount < 300) {
    issues.push({
      type: 'warning',
      message: `Thin content (${wordCount} words) - Pages with less than 300 words may be considered thin content by search engines. Consider adding more valuable, relevant content.`,
      element: 'content'
    });
  } else if (wordCount > 2000) {
    issues.push({
      type: 'info',
      message: `Long content (${wordCount} words) - Consider breaking very long content into sections with proper headings for better readability and user experience.`,
      element: 'content'
    });
  }
  
  // Performance Analysis
  if (loadTime > 3000) {
    issues.push({
      type: 'error',
      message: `Very slow page load time (${Math.round(loadTime)}ms) - Critical performance issue. Pages should load in under 3 seconds. Optimize images, minify CSS/JS, and consider CDN.`,
      element: 'performance'
    });
  } else if (loadTime > 1000) {
    issues.push({
      type: 'warning',
      message: `Slow page load time (${Math.round(loadTime)}ms) - Page speed affects SEO rankings and user experience. Aim for under 1 second load time.`,
      element: 'performance'
    });
  }
  
  if (pageSize > 1000000) { // 1MB
    issues.push({
      type: 'warning',
      message: `Large page size (${(pageSize / 1024 / 1024).toFixed(1)}MB) - Large pages load slowly and consume more bandwidth. Optimize images and remove unnecessary code.`,
      element: 'performance'
    });
  }
  
  // Security checks
  if (url.startsWith('http://')) {
    issues.push({
      type: 'error',
      message: 'Page not served over HTTPS - Critical security and SEO issue. Search engines prefer secure sites and browsers warn users about non-secure pages.',
      element: 'security'
    });
  }
  
  // Calculate comprehensive score
  let score = 100;
  
  // Major penalties
  score -= issues.filter(i => i.type === 'error').length * 12;
  score -= issues.filter(i => i.type === 'warning').length * 6;
  score -= issues.filter(i => i.type === 'info').length * 2;
  
  // Performance penalty
  if (loadTime > 3000) score -= 15;
  else if (loadTime > 1000) score -= 8;
  
  // Content quality bonus/penalty
  if (wordCount >= 300 && wordCount <= 2000) score += 5;
  if (wordCount < 100) score -= 10;
  
  // Technical SEO bonuses
  if (canonicalLink) score += 3;
  if (metaRobots) score += 2;
  if (ogTitle && ogDescription) score += 4;
  if (structuredData.length > 0) score += 6;
  if (h1Elements.length === 1) score += 4;
  if (title.length >= 30 && title.length <= 60) score += 4;
  if (metaDescription && metaDescription.length >= 120 && metaDescription.length <= 160) score += 4;
  if (viewport) score += 6;
  if (langAttr) score += 3;
  if (imagesWithGoodAlt === images.length && images.length > 0) score += 5;
  if (internalLinks >= 3) score += 3;
  if (url.startsWith('https://')) score += 5;
  
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
    status: 200,
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
      message: status === 0 
        ? 'Failed to fetch page content - Page may be blocked by CORS policy, server may be down, or URL may be inaccessible. Check if the URL is correct and publicly accessible.'
        : `HTTP ${status} error - Page returned an error status. This could indicate a broken link, server error, or access restriction that prevents proper indexing by search engines.`,
      element: 'page'
    }],
    score: 0
  };
}