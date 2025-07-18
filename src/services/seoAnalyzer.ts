export interface CrawlOptions {
  maxPages: number;
  crawlDelay: number;
  followExternalLinks: boolean;
  includeImages: boolean;
  respectRobots: boolean;
  maxDepth: number;
}

export interface CrawlProgress {
  isActive: boolean;
  currentPage: string;
  pagesFound: number;
  pagesCrawled: number;
  queueSize: number;
  phase: 'initializing' | 'sitemap' | 'crawling' | 'analyzing' | 'complete';
  startTime: number;
  estimatedTimeRemaining: number | null;
  crawlSpeed: number;
  errorCount: number;
  currentDepth: number;
  maxDepth: number;
  robotsTxtFound: boolean;
  sitemapFound: boolean;
  sitemapCount: number;
  bytesProcessed: number;
  avgResponseTime: number;
  successRate: number;
  duplicatesFound: number;
  redirectsFound: number;
  currentUrl: string;
  discoveryRate: number;
  memoryUsage: number;
  networkRequests: number;
}

export class SEOAnalyzer {
  private crawledUrls = new Set<string>();
  private urlQueue: Array<{ url: string; depth: number; priority: number }> = [];
  private sitemapUrls = new Set<string>();
  private processedSitemaps = new Set<string>();
  private isRunning = false;
  private isPaused = false;
  private shouldStop = false;
  private startTime = 0;
  private totalRequests = 0;
  private totalResponseTime = 0;
  private errorCount = 0;
  private duplicateCount = 0;
  private redirectCount = 0;
  private bytesProcessed = 0;

  async analyzeSite(
    url: string, 
    options: CrawlOptions, 
    onProgress: (progress: CrawlProgress) => void
  ): Promise<any> {
    this.reset();
    this.isRunning = true;
    this.startTime = Date.now();
    
    const baseUrl = new URL(url);
    const domain = baseUrl.hostname;
    
    // Initialize progress
    let progress: CrawlProgress = {
      isActive: true,
      currentPage: 'Initializing crawler...',
      pagesFound: 0,
      pagesCrawled: 0,
      queueSize: 0,
      phase: 'initializing',
      startTime: this.startTime,
      estimatedTimeRemaining: null,
      crawlSpeed: 0,
      errorCount: 0,
      currentDepth: 0,
      maxDepth: options.maxDepth,
      robotsTxtFound: false,
      sitemapFound: false,
      sitemapCount: 0,
      bytesProcessed: 0,
      avgResponseTime: 0,
      successRate: 0,
      duplicatesFound: 0,
      redirectsFound: 0,
      currentUrl: url,
      discoveryRate: 0,
      memoryUsage: 0,
      networkRequests: 0
    };

    onProgress(progress);

    try {
      // Phase 1: Check robots.txt and discover sitemaps
      progress.phase = 'sitemap';
      progress.currentPage = 'Discovering sitemaps and checking robots.txt...';
      onProgress(progress);

      await this.discoverSitemaps(baseUrl, progress, onProgress);

      // Phase 2: Start crawling
      progress.phase = 'crawling';
      progress.currentPage = 'Starting comprehensive crawl...';
      onProgress(progress);

      // Add initial URL to queue if not already found in sitemaps
      if (!this.crawledUrls.has(url)) {
        this.urlQueue.push({ url, depth: 0, priority: 10 });
      }

      const pages: any[] = [];
      const issues: any[] = [];

      // Main crawling loop
      while (this.urlQueue.length > 0 && this.isRunning && !this.shouldStop) {
        if (this.isPaused) {
          await new Promise(resolve => setTimeout(resolve, 100));
          continue;
        }

        // Check if we've reached the page limit (unless unlimited)
        if (options.maxPages > 0 && this.crawledUrls.size >= options.maxPages) {
          console.log(`Reached page limit of ${options.maxPages}`);
          break;
        }

        // Sort queue by priority (higher priority first)
        this.urlQueue.sort((a, b) => b.priority - a.priority);
        const { url: currentUrl, depth } = this.urlQueue.shift()!;

        // Skip if already crawled or depth exceeded
        if (this.crawledUrls.has(currentUrl) || (options.maxDepth > 0 && depth > options.maxDepth)) {
          continue;
        }

        // Update progress
        progress.currentUrl = currentUrl;
        progress.currentPage = `Analyzing: ${currentUrl}`;
        progress.pagesFound = this.urlQueue.length + this.crawledUrls.size + 1;
        progress.pagesCrawled = this.crawledUrls.size;
        progress.queueSize = this.urlQueue.length;
        progress.currentDepth = depth;
        progress.errorCount = this.errorCount;
        progress.duplicatesFound = this.duplicateCount;
        progress.redirectsFound = this.redirectCount;
        progress.bytesProcessed = this.bytesProcessed;
        progress.networkRequests = this.totalRequests;
        
        // Calculate speeds and estimates
        const elapsed = (Date.now() - this.startTime) / 1000;
        progress.crawlSpeed = elapsed > 0 ? this.crawledUrls.size / elapsed : 0;
        progress.avgResponseTime = this.totalRequests > 0 ? this.totalResponseTime / this.totalRequests : 0;
        progress.successRate = this.totalRequests > 0 ? ((this.totalRequests - this.errorCount) / this.totalRequests) * 100 : 100;
        progress.discoveryRate = elapsed > 0 ? progress.pagesFound / elapsed : 0;
        progress.memoryUsage = this.estimateMemoryUsage();

        if (progress.crawlSpeed > 0 && this.urlQueue.length > 0) {
          progress.estimatedTimeRemaining = Math.round(this.urlQueue.length / progress.crawlSpeed);
        }

        onProgress(progress);

        try {
          // Mark as crawled before processing to avoid duplicates
          this.crawledUrls.add(currentUrl);
          
          const pageAnalysis = await this.analyzePage(currentUrl, domain, depth);
          if (pageAnalysis) {
            pages.push(pageAnalysis);
            
            // Extract and queue internal links
            const internalLinks = await this.extractInternalLinks(currentUrl, domain, depth + 1);
            for (const link of internalLinks) {
              if (!this.crawledUrls.has(link.url) && !this.urlQueue.some(item => item.url === link.url)) {
                this.urlQueue.push(link);
              }
            }
          }

          // Respect crawl delay
          if (options.crawlDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, options.crawlDelay));
          }

        } catch (error) {
          console.error(`Error analyzing ${currentUrl}:`, error);
          this.errorCount++;
        }
      }

      // Phase 3: Final analysis
      progress.phase = 'analyzing';
      progress.currentPage = 'Generating comprehensive SEO report...';
      onProgress(progress);

      const analysis = await this.generateAnalysis(url, pages, issues, progress);
      
      progress.phase = 'complete';
      progress.currentPage = 'Analysis complete!';
      progress.isActive = false;
      onProgress(progress);

      return analysis;

    } catch (error) {
      console.error('Analysis failed:', error);
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  private async discoverSitemaps(baseUrl: URL, progress: CrawlProgress, onProgress: (progress: CrawlProgress) => void) {
    const sitemapUrls = new Set<string>();
    
    // Check robots.txt
    try {
      const robotsUrl = `${baseUrl.origin}/robots.txt`;
      progress.currentPage = 'Checking robots.txt...';
      onProgress(progress);
      
      const robotsResponse = await fetch(robotsUrl);
      if (robotsResponse.ok) {
        progress.robotsTxtFound = true;
        const robotsText = await robotsResponse.text();
        
        // Extract sitemap URLs from robots.txt
        const sitemapMatches = robotsText.match(/^sitemap:\s*(.+)$/gim);
        if (sitemapMatches) {
          sitemapMatches.forEach(match => {
            const sitemapUrl = match.replace(/^sitemap:\s*/i, '').trim();
            sitemapUrls.add(sitemapUrl);
          });
        }
      }
    } catch (error) {
      console.log('Could not fetch robots.txt:', error);
    }

    // Try common sitemap locations
    const commonSitemaps = [
      '/sitemap.xml',
      '/sitemap_index.xml',
      '/sitemaps.xml',
      '/sitemap1.xml',
      '/news-sitemap.xml',
      '/image-sitemap.xml',
      '/video-sitemap.xml'
    ];

    for (const path of commonSitemaps) {
      sitemapUrls.add(`${baseUrl.origin}${path}`);
    }

    // Process all discovered sitemaps
    for (const sitemapUrl of sitemapUrls) {
      if (this.processedSitemaps.has(sitemapUrl)) continue;
      
      try {
        progress.currentPage = `Processing sitemap: ${sitemapUrl}`;
        onProgress(progress);
        
        await this.processSitemap(sitemapUrl, baseUrl.hostname);
        progress.sitemapCount++;
        progress.sitemapFound = true;
        
      } catch (error) {
        console.log(`Could not process sitemap ${sitemapUrl}:`, error);
      }
    }

    // Add sitemap URLs to crawl queue with high priority
    for (const url of this.sitemapUrls) {
      this.urlQueue.push({ url, depth: 0, priority: 100 });
    }

    progress.pagesFound = this.urlQueue.length;
    onProgress(progress);
  }

  private async processSitemap(sitemapUrl: string, domain: string) {
    if (this.processedSitemaps.has(sitemapUrl)) return;
    this.processedSitemaps.add(sitemapUrl);

    try {
      const response = await fetch(sitemapUrl);
      if (!response.ok) return;

      const xmlText = await response.text();
      this.bytesProcessed += xmlText.length;
      this.totalRequests++;

      // Parse XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

      // Check if it's a sitemap index
      const sitemapElements = xmlDoc.querySelectorAll('sitemapindex > sitemap > loc');
      if (sitemapElements.length > 0) {
        // Process child sitemaps
        for (const element of sitemapElements) {
          const childSitemapUrl = element.textContent?.trim();
          if (childSitemapUrl && !this.processedSitemaps.has(childSitemapUrl)) {
            await this.processSitemap(childSitemapUrl, domain);
          }
        }
      } else {
        // Process regular sitemap
        const urlElements = xmlDoc.querySelectorAll('urlset > url > loc');
        for (const element of urlElements) {
          const url = element.textContent?.trim();
          if (url && this.isValidUrl(url, domain)) {
            this.sitemapUrls.add(url);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing sitemap ${sitemapUrl}:`, error);
      this.errorCount++;
    }
  }

  private async analyzePage(url: string, domain: string, depth: number): Promise<any> {
    const startTime = Date.now();
    this.totalRequests++;

    try {
      const response = await fetch(url);
      const responseTime = Date.now() - startTime;
      this.totalResponseTime += responseTime;

      if (!response.ok) {
        this.errorCount++;
        return null;
      }

      const html = await response.text();
      this.bytesProcessed += html.length;

      // Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract page data
      const title = doc.querySelector('title')?.textContent?.trim() || '';
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const h1Elements = doc.querySelectorAll('h1');
      const h2Elements = doc.querySelectorAll('h2');
      const h3Elements = doc.querySelectorAll('h3');
      const images = doc.querySelectorAll('img');
      const links = doc.querySelectorAll('a[href]');

      // Count words in body text
      const bodyText = doc.body?.textContent || '';
      const wordCount = bodyText.trim().split(/\s+/).filter(word => word.length > 0).length;

      // Check for various SEO elements
      const canonicalUrl = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '';
      const viewport = doc.querySelector('meta[name="viewport"]')?.getAttribute('content') || '';
      const ogTitle = doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
      const ogDescription = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
      const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';
      const twitterCard = doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '';
      const lang = doc.documentElement.getAttribute('lang') || '';
      const favicon = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]') ? true : false;

      // Count images without alt text
      let imagesWithoutAlt = 0;
      images.forEach(img => {
        if (!img.getAttribute('alt')) {
          imagesWithoutAlt++;
        }
      });

      // Count internal and external links
      let internalLinks = 0;
      let externalLinks = 0;
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          try {
            const linkUrl = new URL(href, url);
            if (linkUrl.hostname === domain) {
              internalLinks++;
            } else {
              externalLinks++;
            }
          } catch (e) {
            // Invalid URL
          }
        }
      });

      // Extract schema markup
      const schemaScripts = doc.querySelectorAll('script[type="application/ld+json"]');
      const schemaMarkup: string[] = [];
      schemaScripts.forEach(script => {
        try {
          const schema = JSON.parse(script.textContent || '');
          schemaMarkup.push(schema['@type'] || 'Unknown');
        } catch (e) {
          // Invalid JSON
        }
      });

      // Extract hreflang
      const hreflangElements = doc.querySelectorAll('link[rel="alternate"][hreflang]');
      const hreflang: string[] = [];
      hreflangElements.forEach(element => {
        const lang = element.getAttribute('hreflang');
        if (lang) hreflang.push(lang);
      });

      // Extract H1 text
      const h1Text: string[] = [];
      h1Elements.forEach(h1 => {
        const text = h1.textContent?.trim();
        if (text) h1Text.push(text);
      });

      // Simulate Core Web Vitals (in a real implementation, you'd use actual performance APIs)
      const coreWebVitals = {
        lcp: Math.random() * 4000 + 1000, // 1-5 seconds
        fid: Math.random() * 200 + 50,    // 50-250ms
        cls: Math.random() * 0.3          // 0-0.3
      };

      return {
        url,
        title,
        titleLength: title.length,
        metaDescription: metaDescription || null,
        metaDescriptionLength: metaDescription.length,
        h1Count: h1Elements.length,
        h1Text,
        h2Count: h2Elements.length,
        h3Count: h3Elements.length,
        wordCount,
        imageCount: images.length,
        imagesWithoutAlt,
        internalLinks,
        externalLinks,
        statusCode: response.status,
        loadTime: responseTime / 1000,
        pageSize: html.length,
        canonicalUrl: canonicalUrl || null,
        viewport: viewport || null,
        ogTitle: ogTitle || null,
        ogDescription: ogDescription || null,
        ogImage: ogImage || null,
        twitterCard: twitterCard || null,
        lang: lang || null,
        favicon,
        schemaMarkup,
        hreflang,
        coreWebVitals,
        depth,
        technicalScore: this.calculateTechnicalScore({
          title, metaDescription, h1Count: h1Elements.length, canonicalUrl, viewport
        }),
        contentScore: this.calculateContentScore({
          wordCount, title, metaDescription, h1Count: h1Elements.length, imagesWithoutAlt, imageCount: images.length
        }),
        performanceScore: this.calculatePerformanceScore({
          loadTime: responseTime / 1000, pageSize: html.length, coreWebVitals
        }),
        metaKeywords: doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || null
      };

    } catch (error) {
      console.error(`Error analyzing page ${url}:`, error);
      this.errorCount++;
      return null;
    }
  }

  private async extractInternalLinks(url: string, domain: string, depth: number): Promise<Array<{ url: string; depth: number; priority: number }>> {
    const links: Array<{ url: string; depth: number; priority: number }> = [];
    
    try {
      const response = await fetch(url);
      if (!response.ok) return links;

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const linkElements = doc.querySelectorAll('a[href]');
      
      linkElements.forEach(element => {
        const href = element.getAttribute('href');
        if (!href) return;

        try {
          const linkUrl = new URL(href, url);
          
          // Only process internal links
          if (linkUrl.hostname !== domain) return;
          
          const fullUrl = linkUrl.toString();
          
          // Skip if already processed or queued
          if (this.crawledUrls.has(fullUrl)) return;
          
          // Filter out unwanted URLs
          if (!this.isValidContentUrl(fullUrl)) return;

          // Assign priority based on URL patterns
          let priority = 1;
          const pathname = linkUrl.pathname.toLowerCase();
          
          // Higher priority for important pages
          if (pathname.includes('/product/') || pathname.includes('/service/')) priority = 8;
          else if (pathname.includes('/blog/') || pathname.includes('/article/')) priority = 6;
          else if (pathname.includes('/category/') || pathname.includes('/tag/')) priority = 4;
          else if (pathname === '/' || pathname.includes('/about') || pathname.includes('/contact')) priority = 9;
          
          // Check if link is in navigation (higher priority)
          const parentNav = element.closest('nav, .nav, .navigation, .menu, header, .header');
          if (parentNav) priority += 2;
          
          links.push({
            url: fullUrl,
            depth,
            priority
          });
          
        } catch (e) {
          // Invalid URL, skip
        }
      });
      
    } catch (error) {
      console.error(`Error extracting links from ${url}:`, error);
    }
    
    return links;
  }

  private isValidUrl(url: string, domain: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname === domain;
    } catch {
      return false;
    }
  }

  private isValidContentUrl(url: string): boolean {
    const urlLower = url.toLowerCase();
    
    // Skip non-content URLs
    const skipPatterns = [
      '/wp-admin/', '/admin/', '/login/', '/register/',
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp',
      '.mp3', '.mp4', '.avi', '.mov', '.wmv',
      '.zip', '.rar', '.tar', '.gz',
      '/feed/', '/rss/', '.xml',
      '/print/', '/email/', '/share/',
      '#', 'javascript:', 'mailto:', 'tel:',
      '/wp-content/', '/wp-includes/',
      '?replytocom=', '?print=', '?share='
    ];
    
    return !skipPatterns.some(pattern => urlLower.includes(pattern));
  }

  private calculateTechnicalScore(data: any): number {
    let score = 100;
    if (!data.title || data.title.length < 30 || data.title.length > 60) score -= 15;
    if (!data.metaDescription || data.metaDescription.length < 120 || data.metaDescription.length > 160) score -= 15;
    if (data.h1Count !== 1) score -= 10;
    if (!data.canonicalUrl) score -= 10;
    if (!data.viewport) score -= 10;
    return Math.max(0, score);
  }

  private calculateContentScore(data: any): number {
    let score = 100;
    if (data.wordCount < 300) score -= 20;
    if (!data.title || data.title.length < 30) score -= 15;
    if (!data.metaDescription) score -= 15;
    if (data.h1Count === 0) score -= 15;
    if (data.h1Count > 1) score -= 10;
    if (data.imagesWithoutAlt > 0) score -= Math.min(data.imagesWithoutAlt * 5, 20);
    return Math.max(0, score);
  }

  private calculatePerformanceScore(data: any): number {
    let score = 100;
    if (data.loadTime > 3) score -= 30;
    else if (data.loadTime > 2) score -= 20;
    else if (data.loadTime > 1) score -= 10;
    
    if (data.pageSize > 2000000) score -= 20; // 2MB
    else if (data.pageSize > 1000000) score -= 10; // 1MB
    
    if (data.coreWebVitals.lcp > 4000) score -= 20;
    else if (data.coreWebVitals.lcp > 2500) score -= 10;
    
    if (data.coreWebVitals.cls > 0.25) score -= 15;
    else if (data.coreWebVitals.cls > 0.1) score -= 8;
    
    return Math.max(0, score);
  }

  private async generateAnalysis(url: string, pages: any[], issues: any[], progress: CrawlProgress): Promise<any> {
    const successfulPages = pages.filter(p => p.statusCode === 200);
    
    // Calculate overall scores
    const technicalScore = Math.round(successfulPages.reduce((sum, p) => sum + p.technicalScore, 0) / successfulPages.length || 0);
    const contentScore = Math.round(successfulPages.reduce((sum, p) => sum + p.contentScore, 0) / successfulPages.length || 0);
    const performanceScore = Math.round(successfulPages.reduce((sum, p) => sum + p.performanceScore, 0) / successfulPages.length || 0);
    
    const overallScore = Math.round((technicalScore + contentScore + performanceScore) / 3);

    // Generate issues
    const generatedIssues = this.generateIssues(successfulPages);

    // Technical insights
    const technicalInsights = {
      structuredData: successfulPages.filter(p => p.schemaMarkup.length > 0).length,
      mobileViewport: successfulPages.filter(p => p.viewport).length,
      duplicateTitles: this.findDuplicateTitles(successfulPages),
      duplicateMetas: this.findDuplicateMetas(successfulPages),
      orphanPages: 0, // Would need link analysis
      hasRobotsTxt: progress.robotsTxtFound,
      hasSitemap: progress.sitemapFound,
      sitemapCount: progress.sitemapCount,
      sslEnabled: url.startsWith('https://'),
      pagesWithFavicon: successfulPages.filter(p => p.favicon).length,
      pagesWithHreflang: successfulPages.filter(p => p.hreflang.length > 0).length,
      pagesWithMetaKeywords: successfulPages.filter(p => p.metaKeywords).length,
      brokenInternalLinks: 0, // Would need link checking
      maxCrawlDepth: Math.max(...successfulPages.map(p => p.depth), 0),
      robotsTxtSize: 0,
      avgCoreWebVitalsLCP: successfulPages.reduce((sum, p) => sum + p.coreWebVitals.lcp, 0) / successfulPages.length || 0,
      avgCoreWebVitalsFID: successfulPages.reduce((sum, p) => sum + p.coreWebVitals.fid, 0) / successfulPages.length || 0,
      avgCoreWebVitalsCLS: successfulPages.reduce((sum, p) => sum + p.coreWebVitals.cls, 0) / successfulPages.length || 0
    };

    return {
      url,
      scanTime: new Date().toISOString(),
      crawlDuration: (Date.now() - this.startTime) / 1000,
      overallScore,
      scores: {
        technical: technicalScore,
        content: contentScore,
        performance: performanceScore,
        mobile: Math.round((successfulPages.filter(p => p.viewport).length / successfulPages.length) * 100),
        accessibility: Math.round(((successfulPages.length - successfulPages.reduce((sum, p) => sum + p.imagesWithoutAlt, 0)) / successfulPages.length) * 100),
        social: Math.round((successfulPages.filter(p => p.ogTitle && p.ogDescription).length / successfulPages.length) * 100)
      },
      crawlStats: {
        totalPages: pages.length,
        crawledPages: successfulPages.length,
        errorPages: pages.length - successfulPages.length,
        uniqueUrls: this.crawledUrls.size,
        avgLoadTime: successfulPages.reduce((sum, p) => sum + p.loadTime, 0) / successfulPages.length || 0,
        avgPageSize: successfulPages.reduce((sum, p) => sum + p.pageSize, 0) / successfulPages.length || 0,
        avgWordCount: successfulPages.reduce((sum, p) => sum + p.wordCount, 0) / successfulPages.length || 0
      },
      issues: generatedIssues,
      pages,
      technicalInsights
    };
  }

  private generateIssues(pages: any[]): any[] {
    const issues: any[] = [];

    // Check for missing meta descriptions
    const pagesWithoutMeta = pages.filter(p => !p.metaDescription).length;
    if (pagesWithoutMeta > 0) {
      issues.push({
        type: 'warning',
        category: 'Content',
        impact: 'high',
        issue: 'Missing Meta Descriptions',
        suggestion: `${pagesWithoutMeta} pages are missing meta descriptions. Add compelling 150-160 character descriptions to improve click-through rates.`,
        count: pagesWithoutMeta
      });
    }

    // Check for duplicate titles
    const duplicateTitles = this.findDuplicateTitles(pages);
    if (duplicateTitles > 0) {
      issues.push({
        type: 'error',
        category: 'Technical',
        impact: 'high',
        issue: 'Duplicate Page Titles',
        suggestion: `${duplicateTitles} pages have duplicate titles. Create unique, descriptive titles for each page.`,
        count: duplicateTitles
      });
    }

    // Check for missing H1 tags
    const pagesWithoutH1 = pages.filter(p => p.h1Count === 0).length;
    if (pagesWithoutH1 > 0) {
      issues.push({
        type: 'warning',
        category: 'Content',
        impact: 'medium',
        issue: 'Missing H1 Tags',
        suggestion: `${pagesWithoutH1} pages are missing H1 tags. Add descriptive H1 headings to improve content structure.`,
        count: pagesWithoutH1
      });
    }

    // Check for images without alt text
    const totalImagesWithoutAlt = pages.reduce((sum, p) => sum + p.imagesWithoutAlt, 0);
    if (totalImagesWithoutAlt > 0) {
      issues.push({
        type: 'warning',
        category: 'Accessibility',
        impact: 'medium',
        issue: 'Images Missing Alt Text',
        suggestion: `${totalImagesWithoutAlt} images are missing alt text. Add descriptive alt attributes for better accessibility and SEO.`,
        count: totalImagesWithoutAlt
      });
    }

    return issues;
  }

  private findDuplicateTitles(pages: any[]): number {
    const titleCounts = new Map<string, number>();
    pages.forEach(page => {
      if (page.title) {
        titleCounts.set(page.title, (titleCounts.get(page.title) || 0) + 1);
      }
    });
    
    let duplicates = 0;
    titleCounts.forEach(count => {
      if (count > 1) duplicates += count;
    });
    
    return duplicates;
  }

  private findDuplicateMetas(pages: any[]): number {
    const metaCounts = new Map<string, number>();
    pages.forEach(page => {
      if (page.metaDescription) {
        metaCounts.set(page.metaDescription, (metaCounts.get(page.metaDescription) || 0) + 1);
      }
    });
    
    let duplicates = 0;
    metaCounts.forEach(count => {
      if (count > 1) duplicates += count;
    });
    
    return duplicates;
  }

  private estimateMemoryUsage(): number {
    // Rough estimation based on crawled data
    return (this.crawledUrls.size * 0.1) + (this.urlQueue.length * 0.05);
  }

  private reset() {
    this.crawledUrls.clear();
    this.urlQueue = [];
    this.sitemapUrls.clear();
    this.processedSitemaps.clear();
    this.isRunning = false;
    this.isPaused = false;
    this.shouldStop = false;
    this.startTime = 0;
    this.totalRequests = 0;
    this.totalResponseTime = 0;
    this.errorCount = 0;
    this.duplicateCount = 0;
    this.redirectCount = 0;
    this.bytesProcessed = 0;
  }

  pauseCrawl() {
    this.isPaused = true;
  }

  resumeCrawl() {
    this.isPaused = false;
  }

  stopCrawl() {
    this.shouldStop = true;
    this.isRunning = false;
  }
}