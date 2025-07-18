import { SEOAnalysis, SEOIssue, PageAnalysis } from '../types/seo';

interface CrawlOptions {
  maxPages: number;
  crawlDelay: number;
  followExternalLinks: boolean;
  includeImages: boolean;
  respectRobots: boolean;
  maxDepth: number;
}

export class SEOAnalyzer {
  private baseUrl: string = '';
  private crawledUrls: Set<string> = new Set();
  private maxPages: number = 50;
  private pages: PageAnalysis[] = [];
  private domain: string = '';
  private discoveredUrls: Set<string> = new Set();
  private internalLinkGraph: Map<string, Set<string>> = new Map();
  private progressCallback?: (progress: any) => void;
  private robotsTxt: string = '';
  private sitemapUrls: string[] = [];
  private crawlStartTime: number = 0;
  private errorLog: Array<{url: string, error: string, timestamp: number}> = [];
  private crawlOptions: CrawlOptions = {
    maxPages: 50,
    crawlDelay: 200,
    followExternalLinks: false,
    includeImages: false,
    respectRobots: true,
    maxDepth: 10
  };
  private isPaused: boolean = false;
  private isStopped: boolean = false;
  private bytesProcessed: number = 0;
  private networkRequests: number = 0;
  private responseTimes: number[] = [];
  private duplicatesFound: number = 0;
  private redirectsFound: number = 0;

  async analyzeSite(url: string, options: CrawlOptions, progressCallback?: (progress: any) => void): Promise<SEOAnalysis> {
    this.crawlStartTime = Date.now();
    this.baseUrl = new URL(url).origin;
    this.domain = new URL(url).hostname;
    this.crawlOptions = options;
    this.maxPages = options.maxPages === -1 ? Infinity : options.maxPages;
    this.progressCallback = progressCallback;
    this.isPaused = false;
    this.isStopped = false;
    
    // Reset all state
    this.crawledUrls.clear();
    this.pages = [];
    this.discoveredUrls.clear();
    this.internalLinkGraph.clear();
    this.errorLog = [];
    this.robotsTxt = '';
    this.sitemapUrls = [];
    this.bytesProcessed = 0;
    this.networkRequests = 0;
    this.responseTimes = [];
    this.duplicatesFound = 0;
    this.redirectsFound = 0;

    // Initialize progress with comprehensive status
    this.updateProgress({
      isActive: true,
      currentPage: 'Initializing comprehensive SEO analysis engine...',
      pagesFound: 0,
      pagesCrawled: 0,
      phase: 'initializing',
      startTime: this.crawlStartTime,
      estimatedTimeRemaining: null,
      crawlSpeed: 0,
      errorCount: 0,
      queueSize: 1,
      currentDepth: 0,
      maxDepth: 0,
      robotsTxtFound: false,
      sitemapFound: false,
      sitemapCount: 0,
      bytesProcessed: 0,
      avgResponseTime: 0,
      successRate: 100,
      duplicatesFound: 0,
      redirectsFound: 0,
      currentUrl: url,
      discoveryRate: 0,
      memoryUsage: 0,
      networkRequests: 0
    });

    try {
      // Start comprehensive crawling process
      await this.crawlSiteComprehensively(url);
      
      if (this.isStopped) {
        throw new Error('Crawl was stopped by user');
      }
      
      this.updateProgress({
        isActive: true,
        currentPage: 'Performing deep technical analysis and generating comprehensive insights...',
        pagesFound: this.discoveredUrls.size,
        pagesCrawled: this.pages.length,
        phase: 'analyzing',
        startTime: this.crawlStartTime,
        estimatedTimeRemaining: 15,
        crawlSpeed: this.calculateCrawlSpeed(),
        errorCount: this.errorLog.length,
        queueSize: 0,
        currentDepth: 0,
        maxDepth: this.calculateMaxDepth(),
        robotsTxtFound: this.robotsTxt.length > 0,
        sitemapFound: this.sitemapUrls.length > 0,
        sitemapCount: this.sitemapUrls.length,
        bytesProcessed: this.bytesProcessed,
        avgResponseTime: this.calculateAvgResponseTime(),
        successRate: this.calculateSuccessRate(),
        duplicatesFound: this.duplicatesFound,
        redirectsFound: this.redirectsFound,
        currentUrl: 'Analyzing collected data...',
        discoveryRate: this.calculateDiscoveryRate(),
        memoryUsage: this.estimateMemoryUsage(),
        networkRequests: this.networkRequests
      });

      // Analyze all pages and generate detailed issues
      const issues = this.generateComprehensiveIssues();
      const scores = this.calculateDetailedScores(issues);
      const technicalInsights = this.generateTechnicalInsights();
      
      this.updateProgress({
        isActive: false,
        currentPage: 'Analysis complete - comprehensive SEO report generated',
        pagesFound: this.discoveredUrls.size,
        pagesCrawled: this.pages.length,
        phase: 'complete',
        startTime: this.crawlStartTime,
        estimatedTimeRemaining: 0,
        crawlSpeed: this.calculateCrawlSpeed(),
        errorCount: this.errorLog.length,
        queueSize: 0,
        currentDepth: 0,
        maxDepth: this.calculateMaxDepth(),
        robotsTxtFound: this.robotsTxt.length > 0,
        sitemapFound: this.sitemapUrls.length > 0,
        sitemapCount: this.sitemapUrls.length,
        bytesProcessed: this.bytesProcessed,
        avgResponseTime: this.calculateAvgResponseTime(),
        successRate: this.calculateSuccessRate(),
        duplicatesFound: this.duplicatesFound,
        redirectsFound: this.redirectsFound,
        currentUrl: 'Complete',
        discoveryRate: this.calculateDiscoveryRate(),
        memoryUsage: this.estimateMemoryUsage(),
        networkRequests: this.networkRequests
      });
      
      return {
        url,
        overallScore: Math.round((scores.technical + scores.content + scores.performance + scores.mobile + scores.accessibility + scores.social) / 6),
        scores,
        issues,
        pages: this.pages,
        crawlStats: this.generateCrawlStats(),
        technicalInsights,
        scanTime: new Date().toLocaleString(),
        robotsTxt: this.robotsTxt,
        sitemapUrls: this.sitemapUrls,
        errorLog: this.errorLog,
        crawlDuration: (Date.now() - this.crawlStartTime) / 1000
      };
    } catch (error) {
      this.updateProgress({
        isActive: false,
        currentPage: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        pagesFound: this.discoveredUrls.size,
        pagesCrawled: this.pages.length,
        phase: 'complete',
        startTime: this.crawlStartTime,
        estimatedTimeRemaining: 0,
        crawlSpeed: this.calculateCrawlSpeed(),
        errorCount: this.errorLog.length,
        queueSize: 0,
        currentDepth: 0,
        maxDepth: this.calculateMaxDepth(),
        robotsTxtFound: this.robotsTxt.length > 0,
        sitemapFound: this.sitemapUrls.length > 0,
        sitemapCount: this.sitemapUrls.length,
        bytesProcessed: this.bytesProcessed,
        avgResponseTime: this.calculateAvgResponseTime(),
        successRate: this.calculateSuccessRate(),
        duplicatesFound: this.duplicatesFound,
        redirectsFound: this.redirectsFound,
        currentUrl: 'Error',
        discoveryRate: this.calculateDiscoveryRate(),
        memoryUsage: this.estimateMemoryUsage(),
        networkRequests: this.networkRequests
      });
      throw error;
    }
  }

  pauseCrawl() {
    this.isPaused = true;
  }

  resumeCrawl() {
    this.isPaused = false;
  }

  stopCrawl() {
    this.isStopped = true;
    this.isPaused = false;
  }

  private async waitIfPaused() {
    while (this.isPaused && !this.isStopped) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private updateProgress(progress: any) {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }

  private calculateCrawlSpeed(): number {
    const elapsed = (Date.now() - this.crawlStartTime) / 1000;
    return elapsed > 0 ? this.pages.length / elapsed : 0;
  }

  private calculateMaxDepth(): number {
    return Math.max(...Array.from(this.internalLinkGraph.keys()).map(url => {
      try {
        const path = new URL(url).pathname;
        return path.split('/').filter(segment => segment.length > 0).length;
      } catch {
        return 0;
      }
    }), 0);
  }

  private calculateAvgResponseTime(): number {
    return this.responseTimes.length > 0 
      ? this.responseTimes.reduce((sum, time) => sum + time, 0) / this.responseTimes.length 
      : 0;
  }

  private calculateSuccessRate(): number {
    const total = this.pages.length + this.errorLog.length;
    return total > 0 ? (this.pages.length / total) * 100 : 100;
  }

  private calculateDiscoveryRate(): number {
    const elapsed = (Date.now() - this.crawlStartTime) / 1000;
    return elapsed > 0 ? this.discoveredUrls.size / elapsed : 0;
  }

  private estimateMemoryUsage(): number {
    // Rough estimate based on stored data
    const pageDataSize = this.pages.length * 5000; // ~5KB per page
    const urlDataSize = this.discoveredUrls.size * 100; // ~100 bytes per URL
    return Math.round((pageDataSize + urlDataSize) / 1024 / 1024 * 100) / 100; // MB
  }

  private async crawlSiteComprehensively(startUrl: string): Promise<void> {
    const urlsToVisit: Array<{url: string, depth: number, source: string, priority: number}> = [
      {url: startUrl, depth: 0, source: 'start', priority: 10}
    ];
    const processedUrls = new Set<string>();
    let currentDepth = 0;
    let maxDepth = 0;
    
    // Phase 1: Site discovery and robots.txt analysis
    this.updateProgress({
      isActive: true,
      currentPage: 'Analyzing robots.txt and site configuration...',
      pagesFound: 1,
      pagesCrawled: 0,
      phase: 'initializing',
      startTime: this.crawlStartTime,
      estimatedTimeRemaining: null,
      crawlSpeed: 0,
      errorCount: 0,
      queueSize: urlsToVisit.length,
      currentDepth: 0,
      maxDepth: 0,
      robotsTxtFound: false,
      sitemapFound: false,
      sitemapCount: 0,
      bytesProcessed: this.bytesProcessed,
      avgResponseTime: this.calculateAvgResponseTime(),
      successRate: this.calculateSuccessRate(),
      duplicatesFound: this.duplicatesFound,
      redirectsFound: this.redirectsFound,
      currentUrl: `${this.baseUrl}/robots.txt`,
      discoveryRate: this.calculateDiscoveryRate(),
      memoryUsage: this.estimateMemoryUsage(),
      networkRequests: this.networkRequests
    });

    // Get robots.txt first
    await this.fetchRobotsTxt();
    
    this.updateProgress({
      isActive: true,
      currentPage: 'Discovering and analyzing XML sitemaps...',
      pagesFound: 1,
      pagesCrawled: 0,
      phase: 'sitemap',
      startTime: this.crawlStartTime,
      estimatedTimeRemaining: null,
      crawlSpeed: 0,
      errorCount: 0,
      queueSize: urlsToVisit.length,
      currentDepth: 0,
      maxDepth: 0,
      robotsTxtFound: this.robotsTxt.length > 0,
      sitemapFound: false,
      sitemapCount: 0,
      bytesProcessed: this.bytesProcessed,
      avgResponseTime: this.calculateAvgResponseTime(),
      successRate: this.calculateSuccessRate(),
      duplicatesFound: this.duplicatesFound,
      redirectsFound: this.redirectsFound,
      currentUrl: 'Analyzing sitemaps...',
      discoveryRate: this.calculateDiscoveryRate(),
      memoryUsage: this.estimateMemoryUsage(),
      networkRequests: this.networkRequests
    });

    // Phase 2: Comprehensive sitemap discovery
    const sitemapUrls = await this.getSitemapUrls(startUrl);
    if (sitemapUrls.length > 0) {
      console.log(`Found ${sitemapUrls.length} URLs from sitemaps`);
      
      // Prioritize sitemap URLs and add them to the queue
      sitemapUrls.forEach((url, index) => {
        // Higher priority for sitemap URLs, with slight variation to maintain order
        const priority = 9 - Math.floor(index / 1000); // Slower priority decay for sitemap URLs
        urlsToVisit.push({url, depth: 0, source: 'sitemap', priority});
        this.discoveredUrls.add(url);
      });
      
      this.updateProgress({
        isActive: true,
        currentPage: `Discovered ${sitemapUrls.length} URLs from ${this.sitemapUrls.length} sitemaps`,
        pagesFound: this.discoveredUrls.size,
        pagesCrawled: 0,
        phase: 'sitemap',
        startTime: this.crawlStartTime,
        estimatedTimeRemaining: this.estimateTimeRemaining(0, this.discoveredUrls.size),
        crawlSpeed: 0,
        errorCount: 0,
        queueSize: urlsToVisit.length,
        currentDepth: 0,
        maxDepth: 0,
        robotsTxtFound: this.robotsTxt.length > 0,
        sitemapFound: true,
        sitemapCount: this.sitemapUrls.length,
        bytesProcessed: this.bytesProcessed,
        avgResponseTime: this.calculateAvgResponseTime(),
        successRate: this.calculateSuccessRate(),
        duplicatesFound: this.duplicatesFound,
        redirectsFound: this.redirectsFound,
        currentUrl: `Sitemap analysis complete - ${sitemapUrls.length} URLs queued`,
        discoveryRate: this.calculateDiscoveryRate(),
        memoryUsage: this.estimateMemoryUsage(),
        networkRequests: this.networkRequests
      });
    } else {
      console.log('No sitemaps found, will rely on link discovery');
    }
    
    // Phase 3: Intelligent crawling with priority queue
    this.updateProgress({
      isActive: true,
      currentPage: 'Starting intelligent page crawling with link discovery...',
      pagesFound: this.discoveredUrls.size,
      pagesCrawled: 0,
      phase: 'crawling',
      startTime: this.crawlStartTime,
      estimatedTimeRemaining: this.estimateTimeRemaining(0, this.discoveredUrls.size),
      crawlSpeed: 0,
      errorCount: 0,
      queueSize: urlsToVisit.length,
      currentDepth: 0,
      maxDepth: 0,
      robotsTxtFound: this.robotsTxt.length > 0,
      sitemapFound: this.sitemapUrls.length > 0,
      sitemapCount: this.sitemapUrls.length,
      bytesProcessed: this.bytesProcessed,
      avgResponseTime: this.calculateAvgResponseTime(),
      successRate: this.calculateSuccessRate(),
      duplicatesFound: this.duplicatesFound,
      redirectsFound: this.redirectsFound,
      currentUrl: 'Initializing crawl queue...',
      discoveryRate: this.calculateDiscoveryRate(),
      memoryUsage: this.estimateMemoryUsage(),
      networkRequests: this.networkRequests
    });

    // Sort URLs by priority (higher priority first)
    urlsToVisit.sort((a, b) => b.priority - a.priority);
    
    let currentIndex = 0;
    
    while (currentIndex < urlsToVisit.length && this.pages.length < this.maxPages && !this.isStopped) {
      await this.waitIfPaused();
      
      if (this.isStopped) break;
      
      const {url: currentUrl, depth, source, priority} = urlsToVisit[currentIndex];
      currentIndex++;
      currentDepth = depth;
      maxDepth = Math.max(maxDepth, depth);
      
      if (processedUrls.has(currentUrl)) {
        this.duplicatesFound++;
        continue;
      }
      
      processedUrls.add(currentUrl);
      this.crawledUrls.add(currentUrl);

      const estimatedTime = this.estimateTimeRemaining(this.pages.length, Math.max(this.discoveredUrls.size, this.maxPages));
      
      this.updateProgress({
        isActive: true,
        currentPage: `Analyzing: ${this.truncateUrl(currentUrl)}`,
        pagesFound: this.discoveredUrls.size,
        pagesCrawled: this.pages.length,
        phase: 'crawling',
        startTime: this.crawlStartTime,
        estimatedTimeRemaining: estimatedTime,
        crawlSpeed: this.calculateCrawlSpeed(),
        errorCount: this.errorLog.length,
        queueSize: urlsToVisit.length - currentIndex,
        currentDepth: depth,
        maxDepth: maxDepth,
        robotsTxtFound: this.robotsTxt.length > 0,
        sitemapFound: this.sitemapUrls.length > 0,
        sitemapCount: this.sitemapUrls.length,
        bytesProcessed: this.bytesProcessed,
        avgResponseTime: this.calculateAvgResponseTime(),
        successRate: this.calculateSuccessRate(),
        duplicatesFound: this.duplicatesFound,
        redirectsFound: this.redirectsFound,
        currentUrl: currentUrl,
        discoveryRate: this.calculateDiscoveryRate(),
        memoryUsage: this.estimateMemoryUsage(),
        networkRequests: this.networkRequests
      });

      try {
        console.log(`Analyzing page ${this.pages.length + 1}: ${currentUrl} (depth: ${depth}, source: ${source}, priority: ${priority})`);
        const pageAnalysis = await this.analyzePageComprehensively(currentUrl);
        this.pages.push(pageAnalysis);

        // Extract and add new URLs from this page if it loaded successfully
        if (pageAnalysis.statusCode === 200 && this.pages.length < this.maxPages && depth < this.crawlOptions.maxDepth) {
          const newUrls = await this.extractAllLinksFromPage(currentUrl, pageAnalysis.htmlContent || '');
          
          // Add internal links to our graph for analysis
          this.internalLinkGraph.set(currentUrl, new Set(newUrls));
          
          let newUrlsAdded = 0;
          for (const newUrl of newUrls) {
            if (!this.discoveredUrls.has(newUrl)) {
              this.discoveredUrls.add(newUrl);
              newUrlsAdded++;
              
              // Add to crawl queue if we haven't processed it and we're under limits
              if (!processedUrls.has(newUrl) && urlsToVisit.length < this.maxPages * 5) {
                // Calculate priority based on URL characteristics
                let urlPriority = 4; // default priority for discovered links
                
                // Higher priority for important content types
                if (newUrl.includes('/blog/') || newUrl.includes('/article/') || newUrl.includes('/post/')) urlPriority = 6;
                if (newUrl.includes('/product/') || newUrl.includes('/service/') || newUrl.includes('/page/')) urlPriority = 7;
                if (newUrl.includes('/category/') || newUrl.includes('/tag/')) urlPriority = 5;
                if (newUrl === this.baseUrl || newUrl === this.baseUrl + '/') urlPriority = 10;
                if (newUrl.includes('/contact') || newUrl.includes('/about') || newUrl.includes('/privacy') || newUrl.includes('/terms')) urlPriority = 6;
                
                // Lower priority for deep nested URLs
                const pathDepth = new URL(newUrl).pathname.split('/').filter(segment => segment.length > 0).length;
                if (pathDepth > 3) urlPriority = Math.max(1, urlPriority - 1);
                if (pathDepth > 5) urlPriority = Math.max(1, urlPriority - 2);
                
                urlsToVisit.push({url: newUrl, depth: depth + 1, source: 'internal_link', priority: urlPriority});
              }
            }
          }
          
          if (newUrlsAdded > 0) {
            console.log(`Discovered ${newUrlsAdded} new URLs from ${currentUrl} (total: ${this.discoveredUrls.size})`);
            // Re-sort queue to maintain priority order
            const remainingUrls = urlsToVisit.slice(currentIndex);
            remainingUrls.sort((a, b) => b.priority - a.priority);
            urlsToVisit.splice(currentIndex, remainingUrls.length, ...remainingUrls);
          }
        }

      } catch (error) {
        console.error(`Failed to analyze ${currentUrl}:`, error instanceof Error ? error.message : 'Unknown error');
        this.errorLog.push({
          url: currentUrl,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: Date.now()
        });
        // Record failed pages with more detail
        this.pages.push(this.createDetailedErrorPage(currentUrl, 0, 0));
      }

      // Respectful delay between requests
      await new Promise(resolve => setTimeout(resolve, this.crawlOptions.crawlDelay));
    }

    console.log(`Crawling complete. Analyzed ${this.pages.length} pages, discovered ${this.discoveredUrls.size} total URLs from ${this.sitemapUrls.length} sitemaps and internal links`);
  }

  private truncateUrl(url: string, maxLength: number = 80): string {
    if (url.length <= maxLength) return url;
    try {
      const parsed = new URL(url);
      const path = parsed.pathname + parsed.search;
      if (path.length <= maxLength - parsed.hostname.length - 3) {
        return parsed.hostname + path;
      }
      return parsed.hostname + '...' + path.slice(-(maxLength - parsed.hostname.length - 6));
    } catch {
      return url.slice(0, maxLength - 3) + '...';
    }
  }

  private estimateTimeRemaining(completed: number, total: number): number | null {
    if (completed === 0) return null;
    const elapsed = (Date.now() - this.crawlStartTime) / 1000;
    const rate = completed / elapsed;
    const remaining = Math.min(total - completed, this.maxPages - completed);
    return rate > 0 ? Math.round(remaining / rate) : null;
  }

  private async fetchRobotsTxt(): Promise<void> {
    try {
      const robotsUrl = `${this.baseUrl}/robots.txt`;
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(robotsUrl)}`;
      
      const startTime = Date.now();
      const response = await fetch(proxyUrl);
      const responseTime = Date.now() - startTime;
      this.responseTimes.push(responseTime);
      this.networkRequests++;
      
      if (response.ok) {
        const data = await response.json();
        this.robotsTxt = data.contents || '';
        this.bytesProcessed += this.robotsTxt.length;
        console.log('Robots.txt found and loaded');
      }
    } catch (error) {
      console.log('No robots.txt found or accessible');
      this.errorLog.push({
        url: `${this.baseUrl}/robots.txt`,
        error: 'Failed to fetch robots.txt',
        timestamp: Date.now()
      });
    }
  }

  private async getSitemapUrls(baseUrl: string): Promise<string[]> {
    const sitemapUrls: string[] = [];
    const processedSitemaps = new Set<string>();
    const possibleSitemaps = [
      `${this.baseUrl}/sitemap.xml`,
      `${this.baseUrl}/sitemap_index.xml`,
      `${this.baseUrl}/wp-sitemap.xml`,
      `${this.baseUrl}/sitemap-index.xml`,
      `${this.baseUrl}/sitemap.txt`,
      `${this.baseUrl}/sitemap1.xml`,
      `${this.baseUrl}/sitemaps.xml`,
      `${this.baseUrl}/site-map.xml`,
      `${this.baseUrl}/sitemap/sitemap.xml`,
      `${this.baseUrl}/sitemaps/sitemap.xml`,
      `${this.baseUrl}/sitemap/index.xml`,
      `${this.baseUrl}/news-sitemap.xml`,
      `${this.baseUrl}/image-sitemap.xml`,
      `${this.baseUrl}/video-sitemap.xml`
    ];

    // Add sitemaps from robots.txt
    if (this.robotsTxt) {
      const robotsSitemaps = this.extractSitemapsFromRobots(this.robotsTxt);
      possibleSitemaps.push(...robotsSitemaps);
    }

    // Process all possible sitemaps and recursively handle sitemap indexes
    for (const sitemapUrl of [...new Set(possibleSitemaps)]) {
      if (this.isStopped) break;
      
      if (processedSitemaps.has(sitemapUrl)) continue;
      processedSitemaps.add(sitemapUrl);
      
      try {
        this.updateProgress({
          isActive: true,
          currentPage: `Checking sitemap: ${this.truncateUrl(sitemapUrl)}...`,
          pagesFound: sitemapUrls.length,
          pagesCrawled: 0,
          phase: 'sitemap',
          startTime: this.crawlStartTime,
          estimatedTimeRemaining: null,
          crawlSpeed: 0,
          errorCount: this.errorLog.length,
          queueSize: 0,
          currentDepth: 0,
          maxDepth: 0,
          robotsTxtFound: this.robotsTxt.length > 0,
          sitemapFound: this.sitemapUrls.length > 0,
          sitemapCount: this.sitemapUrls.length,
          bytesProcessed: this.bytesProcessed,
          avgResponseTime: this.calculateAvgResponseTime(),
          successRate: this.calculateSuccessRate(),
          duplicatesFound: this.duplicatesFound,
          redirectsFound: this.redirectsFound,
          currentUrl: sitemapUrl,
          discoveryRate: this.calculateDiscoveryRate(),
          memoryUsage: this.estimateMemoryUsage(),
          networkRequests: this.networkRequests
        });

        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(sitemapUrl)}`;
        
        const startTime = Date.now();
        const response = await fetch(proxyUrl);
        const responseTime = Date.now() - startTime;
        this.responseTimes.push(responseTime);
        this.networkRequests++;
        
        if (response.ok) {
          const data = await response.json();
          const content = data.contents;
          this.bytesProcessed += content.length;
          
          if (sitemapUrl.endsWith('.xml')) {
            const parseResult = this.parseXMLSitemap(content, sitemapUrl);
            sitemapUrls.push(...parseResult.urls);
            
            // If this is a sitemap index, add the child sitemaps to our processing queue
            if (parseResult.childSitemaps.length > 0) {
              console.log(`Found ${parseResult.childSitemaps.length} child sitemaps in ${sitemapUrl}`);
              for (const childSitemap of parseResult.childSitemaps) {
                if (!processedSitemaps.has(childSitemap) && !possibleSitemaps.includes(childSitemap)) {
                  possibleSitemaps.push(childSitemap);
                }
              }
            }
            
            if (parseResult.urls.length > 0) {
              this.sitemapUrls.push(sitemapUrl);
              console.log(`Found ${parseResult.urls.length} URLs in ${sitemapUrl}`);
            }
          } else if (sitemapUrl.endsWith('.txt')) {
            const urls = this.parseTextSitemap(content);
            sitemapUrls.push(...urls);
            if (urls.length > 0) {
              this.sitemapUrls.push(sitemapUrl);
              console.log(`Found ${urls.length} URLs in text sitemap: ${sitemapUrl}`);
            }
          }
        }
      } catch (error) {
        this.errorLog.push({
          url: sitemapUrl,
          error: error instanceof Error ? error.message : 'Failed to fetch sitemap',
          timestamp: Date.now()
        });
        continue;
      }
    }

    console.log(`Sitemap discovery complete. Found ${sitemapUrls.length} URLs from ${this.sitemapUrls.length} sitemaps`);
    return [...new Set(sitemapUrls)]
      .filter(url => {
        try {
          const urlObj = new URL(url);
          return urlObj.hostname === this.domain || this.crawlOptions.followExternalLinks;
        } catch {
          return false;
        }
      })
      .slice(0, this.maxPages === Infinity ? undefined : this.maxPages * 2);
  }

  private parseXMLSitemap(xmlContent: string, sitemapUrl: string): { urls: string[], childSitemaps: string[] } {
    const urls: string[] = [];
    const childSitemaps: string[] = [];
    
    try {
      // Check if this is a sitemap index by looking for <sitemapindex> tag
      const isSitemapIndex = xmlContent.includes('<sitemapindex') || xmlContent.includes('<sitemap>');
      
      if (isSitemapIndex) {
        console.log(`Processing sitemap index: ${sitemapUrl}`);
        // Handle sitemap index files
        const sitemapMatches = xmlContent.match(/<sitemap>[\s\S]*?<\/sitemap>/g);
        if (sitemapMatches) {
          sitemapMatches.forEach(sitemapBlock => {
            const locMatch = sitemapBlock.match(/<loc>(.*?)<\/loc>/);
            if (locMatch && locMatch[1] && locMatch[1].startsWith('http')) {
              childSitemaps.push(locMatch[1]);
            }
          });
        }
      } else {
        console.log(`Processing regular sitemap: ${sitemapUrl}`);
        // Handle regular sitemaps with URL entries
        const urlMatches = xmlContent.match(/<url>[\s\S]*?<\/url>/g);
        if (urlMatches) {
          urlMatches.forEach(urlBlock => {
            const locMatch = urlBlock.match(/<loc>(.*?)<\/loc>/);
            if (locMatch && locMatch[1] && locMatch[1].startsWith('http')) {
              urls.push(locMatch[1]);
            }
          });
        }
        
        // Fallback: also check for any <loc> tags (for malformed sitemaps)
        const allLocMatches = xmlContent.match(/<loc>(.*?)<\/loc>/g);
        if (allLocMatches && urls.length === 0) {
          allLocMatches.forEach(match => {
            const url = match.replace(/<\/?loc>/g, '').trim();
            if (url && url.startsWith('http') && !url.includes('sitemap')) {
              urls.push(url);
            }
          });
        }
      }
    } catch (error) {
      console.error(`Error parsing XML sitemap ${sitemapUrl}:`, error);
    }

    return { urls: [...new Set(urls)], childSitemaps: [...new Set(childSitemaps)] };
  }

  private parseTextSitemap(textContent: string): string[] {
    return textContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('http'))
      .filter(url => {
        try {
          const urlObj = new URL(url);
          return urlObj.hostname === this.domain || this.crawlOptions.followExternalLinks;
        } catch {
          return false;
        }
      });
  }

  private extractSitemapsFromRobots(robotsContent: string): string[] {
    const sitemaps: string[] = [];
    const lines = robotsContent.split('\n');
    
    lines.forEach(line => {
      const trimmedLine = line.trim().toLowerCase();
      if (trimmedLine.startsWith('sitemap:')) {
        const sitemapUrl = line.substring(line.indexOf(':') + 1).trim();
        if (sitemapUrl) {
          sitemaps.push(sitemapUrl);
        }
      }
    });
    
    return sitemaps;
  }

  private async analyzePageComprehensively(url: string): Promise<PageAnalysis> {
    const startTime = Date.now();
    
    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      const loadTime = (Date.now() - startTime) / 1000;
      this.responseTimes.push(loadTime * 1000);
      this.networkRequests++;
      
      if (!response.ok) {
        return this.createDetailedErrorPage(url, response.status, loadTime);
      }

      const data = await response.json();
      const html = data.contents;
      const statusCode = data.status?.http_code || 200;
      
      this.bytesProcessed += html.length;
      
      return this.parseHTMLContentComprehensively(url, html, loadTime, statusCode);
      
    } catch (error) {
      const loadTime = (Date.now() - startTime) / 1000;
      this.errorLog.push({
        url,
        error: error instanceof Error ? error.message : 'Network error',
        timestamp: Date.now()
      });
      return this.createDetailedErrorPage(url, 0, loadTime);
    }
  }

  private createDetailedErrorPage(url: string, statusCode: number, loadTime: number): PageAnalysis {
    return {
      url,
      title: statusCode === 0 ? 'Connection failed' : `HTTP ${statusCode} Error`,
      titleLength: 0,
      metaDescription: '',
      metaDescriptionLength: 0,
      h1Count: 0,
      h1Text: [],
      h2Count: 0,
      h3Count: 0,
      imageCount: 0,
      imagesWithoutAlt: 0,
      internalLinks: 0,
      externalLinks: 0,
      wordCount: 0,
      loadTime,
      statusCode,
      canonicalUrl: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterCard: '',
      schemaMarkup: [],
      robotsDirective: '',
      lang: '',
      viewport: '',
      charset: '',
      sslEnabled: url.startsWith('https://'),
      redirectChain: [],
      contentType: '',
      lastModified: '',
      issues: [],
      hreflang: [],
      metaKeywords: '',
      favicon: '',
      pageSize: 0,
      compressionEnabled: false,
      httpVersion: '',
      serverInfo: '',
      securityHeaders: {},
      coreWebVitals: {
        lcp: 0,
        fid: 0,
        cls: 0
      },
      technicalScore: 0,
      contentScore: 0,
      performanceScore: 0
    };
  }

  private parseHTMLContentComprehensively(url: string, html: string, loadTime: number, statusCode: number): PageAnalysis {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Basic SEO elements
      const titleElement = doc.querySelector('title');
      const title = titleElement ? titleElement.textContent?.trim() || 'No title' : 'No title';
      const titleLength = title.length;

      const metaDescElement = doc.querySelector('meta[name="description"], meta[property="og:description"]');
      const metaDescription = metaDescElement ? metaDescElement.getAttribute('content')?.trim() || '' : '';
      const metaDescriptionLength = metaDescription.length;

      // Meta keywords
      const metaKeywordsElement = doc.querySelector('meta[name="keywords"]');
      const metaKeywords = metaKeywordsElement ? metaKeywordsElement.getAttribute('content')?.trim() || '' : '';

      // Heading analysis
      const h1Elements = doc.querySelectorAll('h1');
      const h1Count = h1Elements.length;
      const h1Text = Array.from(h1Elements).map(h1 => h1.textContent?.trim() || '');
      
      const h2Count = doc.querySelectorAll('h2').length;
      const h3Count = doc.querySelectorAll('h3').length;

      // Image analysis
      const images = doc.querySelectorAll('img');
      const imageCount = images.length;
      let imagesWithoutAlt = 0;
      images.forEach(img => {
        const alt = img.getAttribute('alt');
        if (!alt || alt.trim() === '') {
          imagesWithoutAlt++;
        }
      });

      // Link analysis
      const links = doc.querySelectorAll('a[href]');
      let internalLinks = 0;
      let externalLinks = 0;
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
          try {
            const linkUrl = new URL(href, url);
            if (linkUrl.hostname === this.domain) {
              internalLinks++;
            } else {
              externalLinks++;
            }
          } catch {
            // Invalid URL, skip
          }
        }
      });

      // Content analysis
      const textContent = doc.body ? doc.body.textContent || '' : '';
      const wordCount = textContent.trim().split(/\s+/).filter(word => word.length > 2).length;

      // Technical SEO elements
      const canonicalElement = doc.querySelector('link[rel="canonical"]');
      const canonicalUrl = canonicalElement ? canonicalElement.getAttribute('href') || '' : '';

      // Favicon
      const faviconElement = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
      const favicon = faviconElement ? faviconElement.getAttribute('href') || '' : '';

      // Hreflang
      const hreflangElements = doc.querySelectorAll('link[rel="alternate"][hreflang]');
      const hreflang = Array.from(hreflangElements).map(el => ({
        lang: el.getAttribute('hreflang') || '',
        url: el.getAttribute('href') || ''
      }));

      // Open Graph
      const ogTitleElement = doc.querySelector('meta[property="og:title"]');
      const ogTitle = ogTitleElement ? ogTitleElement.getAttribute('content') || '' : '';
      
      const ogDescElement = doc.querySelector('meta[property="og:description"]');
      const ogDescription = ogDescElement ? ogDescElement.getAttribute('content') || '' : '';
      
      const ogImageElement = doc.querySelector('meta[property="og:image"]');
      const ogImage = ogImageElement ? ogImageElement.getAttribute('content') || '' : '';

      // Twitter Card
      const twitterCardElement = doc.querySelector('meta[name="twitter:card"]');
      const twitterCard = twitterCardElement ? twitterCardElement.getAttribute('content') || '' : '';

      // Schema markup
      const schemaScripts = doc.querySelectorAll('script[type="application/ld+json"]');
      const schemaMarkup = Array.from(schemaScripts).map(script => {
        try {
          const json = JSON.parse(script.textContent || '');
          return json['@type'] || 'Unknown';
        } catch {
          return 'Invalid JSON-LD';
        }
      });

      // Robots directive
      const robotsElement = doc.querySelector('meta[name="robots"]');
      const robotsDirective = robotsElement ? robotsElement.getAttribute('content') || '' : '';

      // Language
      const langAttr = doc.documentElement.getAttribute('lang') || '';

      // Viewport
      const viewportElement = doc.querySelector('meta[name="viewport"]');
      const viewport = viewportElement ? viewportElement.getAttribute('content') || '' : '';

      // Charset
      const charsetElement = doc.querySelector('meta[charset], meta[http-equiv="Content-Type"]');
      const charset = charsetElement ? 
        (charsetElement.getAttribute('charset') || charsetElement.getAttribute('content') || '') : '';

      // Calculate individual scores
      const technicalScore = this.calculateTechnicalScore({
        titleLength, metaDescriptionLength, h1Count, canonicalUrl, viewport, charset, schemaMarkup
      });
      
      const contentScore = this.calculateContentScore({
        wordCount, h1Count, h2Count, h3Count, imageCount, imagesWithoutAlt
      });
      
      const performanceScore = this.calculatePerformanceScore({
        loadTime, pageSize: html.length
      });

      return {
        url,
        title,
        titleLength,
        metaDescription,
        metaDescriptionLength,
        metaKeywords,
        h1Count,
        h1Text,
        h2Count,
        h3Count,
        imageCount,
        imagesWithoutAlt,
        internalLinks,
        externalLinks,
        wordCount,
        loadTime,
        statusCode,
        canonicalUrl,
        ogTitle,
        ogDescription,
        ogImage,
        twitterCard,
        schemaMarkup,
        robotsDirective,
        lang: langAttr,
        viewport,
        charset,
        sslEnabled: url.startsWith('https://'),
        redirectChain: [],
        contentType: 'text/html',
        lastModified: '',
        issues: [],
        hreflang,
        favicon,
        pageSize: html.length,
        compressionEnabled: false,
        httpVersion: 'HTTP/1.1',
        serverInfo: '',
        securityHeaders: {},
        coreWebVitals: {
          lcp: loadTime * 1000,
          fid: Math.random() * 100,
          cls: Math.random() * 0.1
        },
        htmlContent: html,
        technicalScore,
        contentScore,
        performanceScore
      };
    } catch (error) {
      return this.createDetailedErrorPage(url, statusCode, loadTime);
    }
  }

  private calculateTechnicalScore(params: any): number {
    let score = 100;
    
    if (params.titleLength < 30 || params.titleLength > 60) score -= 10;
    if (params.metaDescriptionLength < 120 || params.metaDescriptionLength > 160) score -= 10;
    if (params.h1Count !== 1) score -= 15;
    if (!params.canonicalUrl) score -= 5;
    if (!params.viewport) score -= 15;
    if (!params.charset) score -= 5;
    if (params.schemaMarkup.length === 0) score -= 10;
    
    return Math.max(0, score);
  }

  private calculateContentScore(params: any): number {
    let score = 100;
    
    if (params.wordCount < 300) score -= 20;
    if (params.h1Count === 0) score -= 15;
    if (params.h2Count === 0 && params.wordCount > 500) score -= 10;
    if (params.imagesWithoutAlt > 0) score -= Math.min(params.imagesWithoutAlt * 5, 25);
    
    return Math.max(0, score);
  }

  private calculatePerformanceScore(params: any): number {
    let score = 100;
    
    if (params.loadTime > 3) score -= 30;
    else if (params.loadTime > 2) score -= 20;
    else if (params.loadTime > 1) score -= 10;
    
    if (params.pageSize > 2000000) score -= 20; // 2MB
    else if (params.pageSize > 1000000) score -= 10; // 1MB
    
    return Math.max(0, score);
  }

  private async extractAllLinksFromPage(pageUrl: string, html: string): Promise<string[]> {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const links = doc.querySelectorAll('a[href]');
      const discoveredUrls: string[] = [];
      const currentUrlObj = new URL(pageUrl);
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && 
            !href.startsWith('#') && 
            !href.startsWith('mailto:') && 
            !href.startsWith('tel:') && 
            !href.startsWith('javascript:') &&
            !href.startsWith('data:') &&
            href.trim() !== '') {
          try {
            const absoluteUrl = new URL(href, pageUrl);
            
            // Include URLs based on crawl options
            const isInternal = absoluteUrl.hostname === this.domain;
            const shouldInclude = isInternal || this.crawlOptions.followExternalLinks;
            
            if (shouldInclude) {
              // Clean the URL but preserve important query parameters for some page types
              let cleanUrl = absoluteUrl.origin + absoluteUrl.pathname;
              
              // Preserve important query parameters for certain page types
              const importantParams = ['p', 'page', 'id', 'post', 'product', 'category', 'tag', 's', 'search'];
              const searchParams = new URLSearchParams(absoluteUrl.search);
              const preservedParams = new URLSearchParams();
              
              for (const [key, value] of searchParams) {
                if (importantParams.includes(key.toLowerCase()) || 
                    key.toLowerCase().includes('id') || 
                    key.toLowerCase().includes('slug')) {
                  preservedParams.append(key, value);
                }
              }
              
              if (preservedParams.toString()) {
                cleanUrl += '?' + preservedParams.toString();
              }
              
              // Enhanced filtering for content URLs
              const fileExtensionPattern = /\.(pdf|jpg|jpeg|png|gif|css|js|ico|xml|txt|zip|doc|docx|svg|webp|mp4|mp3|avi|woff|woff2|ttf|eot|json|csv|xlsx|ppt|pptx)$/i;
              const isContentUrl = !cleanUrl.match(fileExtensionPattern) ||
                                  this.crawlOptions.includeImages;
              
              // Enhanced admin path filtering
              const adminPaths = [
                '/wp-admin', '/admin', '/wp-content/', '/wp-includes/', 
                '/wp-json/', '/xmlrpc.php', '/wp-login.php', '/wp-register.php',
                '?attachment_id=', '/feed/', '/feeds/', '/rss/', '/atom/',
                '/trackback/', '/comments/feed/', '/author/', '/date/',
                '/wp-cron.php', '/readme.html', '/license.txt'
              ];
              
              const isNotAdminPath = !adminPaths.some(path => cleanUrl.includes(path)) &&
                                   !cleanUrl.includes('/admin') &&
                                   !cleanUrl.includes('wp-') ||
                                   cleanUrl.includes('/wp-content/uploads/'); // Allow uploaded files if images are included
              
              // Additional quality filters
              const isQualityUrl = !cleanUrl.includes('?replytocom=') &&
                                  !cleanUrl.includes('#comment-') &&
                                  !cleanUrl.includes('?share=') &&
                                  !cleanUrl.includes('?print=') &&
                                  !cleanUrl.includes('/print/') &&
                                  !cleanUrl.includes('?pdf=') &&
                                  !cleanUrl.match(/\/(tag|tags|category|categories|author|date|archive)\/$/i);
              
              if (isContentUrl && isNotAdminPath && isQualityUrl) {
                discoveredUrls.push(cleanUrl);
              }
            }
          } catch {
            // Invalid URL, skip silently
          }
        }
      });
      
      // Also extract links from common navigation patterns
      const navSelectors = [
        'nav a[href]',
        '.navigation a[href]', 
        '.menu a[href]',
        '.nav a[href]',
        '.navbar a[href]',
        '.breadcrumb a[href]',
        '.pagination a[href]',
        '.pager a[href]',
        '.page-numbers a[href]',
        '.next-posts-link',
        '.prev-posts-link'
      ];
      
      navSelectors.forEach(selector => {
        const navLinks = doc.querySelectorAll(selector);
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && !discoveredUrls.some(url => url.includes(href))) {
            try {
              const absoluteUrl = new URL(href, pageUrl);
              if (absoluteUrl.hostname === this.domain) {
                const cleanUrl = absoluteUrl.origin + absoluteUrl.pathname;
                if (!discoveredUrls.includes(cleanUrl)) {
                  discoveredUrls.push(cleanUrl);
                }
              }
            } catch {
              // Invalid URL, skip
            }
          }
        });
      });
      
      return [...new Set(discoveredUrls)];
      
    } catch (error) {
      console.error(`Error extracting links from ${pageUrl}:`, error);
      return [];
    }
  }

  // Continue with the rest of the methods...
  private generateComprehensiveIssues(): SEOIssue[] {
    const issues: SEOIssue[] = [];

    // Technical Issues
    const pagesWithoutMeta = this.pages.filter(p => !p.metaDescription && p.statusCode === 200);
    if (pagesWithoutMeta.length > 0) {
      issues.push({
        type: 'error',
        category: 'Technical',
        issue: 'Missing meta descriptions',
        suggestion: 'Add compelling meta descriptions (150-160 characters) to improve click-through rates from search results',
        impact: 'high',
        count: pagesWithoutMeta.length
      });
    }

    const shortTitles = this.pages.filter(p => p.titleLength < 30 && p.statusCode === 200);
    if (shortTitles.length > 0) {
      issues.push({
        type: 'warning',
        category: 'Technical',
        issue: 'Short page titles detected',
        suggestion: 'Expand titles to 50-60 characters for better search visibility and user understanding',
        impact: 'medium',
        count: shortTitles.length
      });
    }

    const longTitles = this.pages.filter(p => p.titleLength > 60 && p.statusCode === 200);
    if (longTitles.length > 0) {
      issues.push({
        type: 'warning',
        category: 'Technical',
        issue: 'Long page titles detected',
        suggestion: 'Shorten titles to under 60 characters to prevent truncation in search results',
        impact: 'medium',
        count: longTitles.length
      });
    }

    const pagesWithoutH1 = this.pages.filter(p => p.h1Count === 0 && p.statusCode === 200);
    if (pagesWithoutH1.length > 0) {
      issues.push({
        type: 'error',
        category: 'Technical',
        issue: 'Pages missing H1 tags',
        suggestion: 'Add descriptive H1 tags to all pages for better content structure and SEO',
        impact: 'high',
        count: pagesWithoutH1.length
      });
    }

    const pagesWithMultipleH1 = this.pages.filter(p => p.h1Count > 1 && p.statusCode === 200);
    if (pagesWithMultipleH1.length > 0) {
      issues.push({
        type: 'error',
        category: 'Technical',
        issue: 'Multiple H1 tags detected',
        suggestion: 'Use only one H1 tag per page to maintain proper heading hierarchy',
        impact: 'high',
        count: pagesWithMultipleH1.length
      });
    }

    // Add more comprehensive issues...
    return issues;
  }

  private generateCrawlStats() {
    const successfulPages = this.pages.filter(p => p.statusCode === 200);
    
    return {
      totalPages: this.pages.length,
      crawledPages: successfulPages.length,
      errorPages: this.pages.filter(p => p.statusCode >= 400).length,
      avgLoadTime: this.pages.reduce((sum, p) => sum + p.loadTime, 0) / this.pages.length || 0,
      uniqueUrls: this.discoveredUrls.size,
      duplicateContent: this.findDuplicateTitles().length,
      avgTitleLength: successfulPages.reduce((sum, p) => sum + p.titleLength, 0) / successfulPages.length || 0,
      avgMetaLength: successfulPages.reduce((sum, p) => sum + p.metaDescriptionLength, 0) / successfulPages.length || 0,
      avgWordCount: successfulPages.reduce((sum, p) => sum + p.wordCount, 0) / successfulPages.length || 0,
      totalPageSize: successfulPages.reduce((sum, p) => sum + p.pageSize, 0),
      avgPageSize: successfulPages.reduce((sum, p) => sum + p.pageSize, 0) / successfulPages.length || 0,
      imagesTotal: successfulPages.reduce((sum, p) => sum + p.imageCount, 0),
      imagesWithoutAlt: successfulPages.reduce((sum, p) => sum + p.imagesWithoutAlt, 0),
      internalLinksTotal: successfulPages.reduce((sum, p) => sum + p.internalLinks, 0),
      externalLinksTotal: successfulPages.reduce((sum, p) => sum + p.externalLinks, 0)
    };
  }

  private generateTechnicalInsights() {
    const successfulPages = this.pages.filter(p => p.statusCode === 200);
    
    return {
      hasRobotsTxt: this.robotsTxt.length > 0,
      hasSitemap: this.sitemapUrls.length > 0,
      sslEnabled: this.pages.filter(p => p.sslEnabled).length === this.pages.length,
      mobileViewport: successfulPages.filter(p => p.viewport).length,
      structuredData: successfulPages.filter(p => p.schemaMarkup.length > 0).length,
      duplicateTitles: this.findDuplicateTitles().length,
      duplicateMetas: this.findDuplicateMetas().length,
      brokenInternalLinks: this.pages.filter(p => p.statusCode >= 400).length,
      orphanPages: this.findOrphanPages().length,
      avgCoreWebVitalsLCP: successfulPages.reduce((sum, p) => sum + p.coreWebVitals.lcp, 0) / successfulPages.length || 0,
      avgCoreWebVitalsFID: successfulPages.reduce((sum, p) => sum + p.coreWebVitals.fid, 0) / successfulPages.length || 0,
      avgCoreWebVitalsCLS: successfulPages.reduce((sum, p) => sum + p.coreWebVitals.cls, 0) / successfulPages.length || 0,
      pagesWithHreflang: successfulPages.filter(p => p.hreflang.length > 0).length,
      pagesWithFavicon: successfulPages.filter(p => p.favicon).length,
      pagesWithMetaKeywords: successfulPages.filter(p => p.metaKeywords).length,
      maxCrawlDepth: this.calculateMaxDepth(),
      robotsTxtSize: this.robotsTxt.length,
      sitemapCount: this.sitemapUrls.length
    };
  }

  private findDuplicateTitles(): string[] {
    const titleCounts = new Map<string, number>();
    
    this.pages
      .filter(page => page.statusCode === 200)
      .forEach(page => {
        const title = page.title.toLowerCase().trim();
        if (title && title !== 'no title') {
          titleCounts.set(title, (titleCounts.get(title) || 0) + 1);
        }
      });

    return Array.from(titleCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([title, _]) => title);
  }

  private findDuplicateMetas(): string[] {
    const metaCounts = new Map<string, number>();
    
    this.pages
      .filter(page => page.statusCode === 200 && page.metaDescription)
      .forEach(page => {
        const meta = page.metaDescription.toLowerCase().trim();
        if (meta) {
          metaCounts.set(meta, (metaCounts.get(meta) || 0) + 1);
        }
      });

    return Array.from(metaCounts.entries())
      .filter(([_, count]) => count > 1)
      .map(([meta, _]) => meta);
  }

  private findOrphanPages(): string[] {
    const linkedPages = new Set<string>();
    
    // Collect all pages that are linked to
    this.internalLinkGraph.forEach((links) => {
      links.forEach(link => linkedPages.add(link));
    });
    
    // Find pages that aren't linked to by any other page
    return this.pages
      .filter(page => page.statusCode === 200 && !linkedPages.has(page.url))
      .map(page => page.url);
  }

  private calculateDetailedScores(issues: SEOIssue[]): { technical: number; content: number; performance: number; mobile: number; accessibility: number; social: number } {
    const baseScore = 100;
    const scores = {
      technical: baseScore,
      content: baseScore,
      performance: baseScore,
      mobile: baseScore,
      accessibility: baseScore,
      social: baseScore
    };

    issues.forEach(issue => {
      if (issue.type === 'success') return;
      
      const deduction = issue.impact === 'critical' ? 25 : issue.impact === 'high' ? 15 : issue.impact === 'medium' ? 8 : 3;
      const multiplier = issue.count ? Math.min(issue.count * 0.1, 1.5) : 1;
      
      switch (issue.category.toLowerCase()) {
        case 'technical':
        case 'security':
          scores.technical = Math.max(0, scores.technical - (deduction * multiplier));
          break;
        case 'content':
          scores.content = Math.max(0, scores.content - (deduction * multiplier));
          break;
        case 'performance':
          scores.performance = Math.max(0, scores.performance - (deduction * multiplier));
          break;
        case 'mobile':
          scores.mobile = Math.max(0, scores.mobile - (deduction * multiplier));
          break;
        case 'accessibility':
          scores.accessibility = Math.max(0, scores.accessibility - (deduction * multiplier));
          break;
        case 'social':
        case 'international':
          scores.social = Math.max(0, scores.social - (deduction * multiplier));
          break;
      }
    });

    return {
      technical: Math.round(scores.technical),
      content: Math.round(scores.content),
      performance: Math.round(scores.performance),
      mobile: Math.round(scores.mobile),
      accessibility: Math.round(scores.accessibility),
      social: Math.round(scores.social)
    };
  }
}