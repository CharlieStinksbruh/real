import { SEOAnalysis, SEOIssue, PageAnalysis } from '../types/seo';

export class SEOAnalyzer {
  private baseUrl: string = '';
  private crawledUrls: Set<string> = new Set();
  private maxPages: number = 50;
  private pages: PageAnalysis[] = [];
  private domain: string = '';
  private discoveredUrls: Set<string> = new Set();
  private internalLinkGraph: Map<string, Set<string>> = new Map();

  async analyzeSite(url: string): Promise<SEOAnalysis> {
    this.baseUrl = new URL(url).origin;
    this.domain = new URL(url).hostname;
    this.crawledUrls.clear();
    this.pages = [];
    this.discoveredUrls.clear();
    this.internalLinkGraph.clear();

    // Start comprehensive crawling process
    await this.crawlSiteComprehensively(url);
    
    // Analyze all pages and generate detailed issues
    const issues = this.generateComprehensiveIssues();
    const scores = this.calculateDetailedScores(issues);
    const technicalInsights = this.generateTechnicalInsights();
    
    return {
      url,
      overallScore: Math.round((scores.technical + scores.content + scores.performance + scores.mobile + scores.accessibility + scores.social) / 6),
      scores,
      issues,
      pages: this.pages,
      crawlStats: this.generateCrawlStats(),
      technicalInsights,
      scanTime: new Date().toLocaleString()
    };
  }

  private async crawlSiteComprehensively(startUrl: string): Promise<void> {
    const urlsToVisit: string[] = [startUrl];
    const processedUrls = new Set<string>();
    
    // First, get URLs from sitemap and robots.txt
    const sitemapUrls = await this.getSitemapUrls(startUrl);
    if (sitemapUrls.length > 0) {
      console.log(`Found ${sitemapUrls.length} URLs from sitemap`);
      urlsToVisit.push(...sitemapUrls.slice(0, this.maxPages));
    }
    
    let currentIndex = 0;
    
    while (currentIndex < urlsToVisit.length && this.pages.length < this.maxPages) {
      const currentUrl = urlsToVisit[currentIndex];
      currentIndex++;
      
      if (processedUrls.has(currentUrl)) continue;
      processedUrls.add(currentUrl);
      this.crawledUrls.add(currentUrl);

      try {
        console.log(`Analyzing page ${this.pages.length + 1}: ${currentUrl}`);
        const pageAnalysis = await this.analyzePageComprehensively(currentUrl);
        this.pages.push(pageAnalysis);

        // Extract and add new URLs from this page
        if (pageAnalysis.statusCode === 200 && this.pages.length < this.maxPages) {
          const newUrls = await this.extractAllLinksFromPage(currentUrl, pageAnalysis.htmlContent || '');
          
          // Add internal links to our graph for analysis
          this.internalLinkGraph.set(currentUrl, new Set(newUrls));
          
          for (const newUrl of newUrls) {
            this.discoveredUrls.add(newUrl);
            if (!processedUrls.has(newUrl) && urlsToVisit.length < this.maxPages * 3) {
              urlsToVisit.push(newUrl);
            }
          }
        }
      } catch (error) {
        console.error(`Failed to analyze ${currentUrl}:`, error);
        // Record failed pages with more detail
        this.pages.push(this.createDetailedErrorPage(currentUrl, 0, 0));
      }

      // Respectful delay
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log(`Crawling complete. Analyzed ${this.pages.length} pages, discovered ${this.discoveredUrls.size} total URLs`);
  }

  private async getSitemapUrls(baseUrl: string): Promise<string[]> {
    const sitemapUrls: string[] = [];
    const possibleSitemaps = [
      `${this.baseUrl}/sitemap.xml`,
      `${this.baseUrl}/sitemap_index.xml`,
      `${this.baseUrl}/wp-sitemap.xml`,
      `${this.baseUrl}/sitemap-index.xml`,
      `${this.baseUrl}/robots.txt`
    ];

    for (const sitemapUrl of possibleSitemaps) {
      try {
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(sitemapUrl)}`;
        const response = await fetch(proxyUrl);
        
        if (response.ok) {
          const data = await response.json();
          const content = data.contents;
          
          if (sitemapUrl.endsWith('.xml')) {
            const urls = this.parseXMLSitemap(content);
            sitemapUrls.push(...urls);
            console.log(`Found ${urls.length} URLs in ${sitemapUrl}`);
          } else if (sitemapUrl.endsWith('robots.txt')) {
            const robotsSitemaps = this.extractSitemapsFromRobots(content);
            for (const robotsSitemapUrl of robotsSitemaps) {
              try {
                const sitemapProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(robotsSitemapUrl)}`;
                const sitemapResponse = await fetch(sitemapProxyUrl);
                if (sitemapResponse.ok) {
                  const sitemapData = await sitemapResponse.json();
                  const urls = this.parseXMLSitemap(sitemapData.contents);
                  sitemapUrls.push(...urls);
                  console.log(`Found ${urls.length} URLs in robots.txt sitemap: ${robotsSitemapUrl}`);
                }
              } catch (e) {
                continue;
              }
            }
          }
        }
      } catch (error) {
        continue;
      }
    }

    return [...new Set(sitemapUrls)]
      .filter(url => {
        try {
          return new URL(url).hostname === this.domain;
        } catch {
          return false;
        }
      })
      .slice(0, this.maxPages);
  }

  private parseXMLSitemap(xmlContent: string): string[] {
    const urls: string[] = [];
    
    // Parse XML sitemap using regex for both regular sitemaps and sitemap indexes
    const urlMatches = xmlContent.match(/<loc>(.*?)<\/loc>/g);
    
    if (urlMatches) {
      urlMatches.forEach(match => {
        const url = match.replace(/<\/?loc>/g, '').trim();
        if (url && url.startsWith('http')) {
          urls.push(url);
        }
      });
    }

    return urls;
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
      
      if (!response.ok) {
        return this.createDetailedErrorPage(url, response.status, loadTime);
      }

      const data = await response.json();
      const html = data.contents;
      const statusCode = data.status?.http_code || 200;
      
      return this.parseHTMLContentComprehensively(url, html, loadTime, statusCode);
      
    } catch (error) {
      const loadTime = (Date.now() - startTime) / 1000;
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
      issues: []
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

      return {
        url,
        title,
        titleLength,
        metaDescription,
        metaDescriptionLength,
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
        htmlContent: html
      };
    } catch (error) {
      return this.createDetailedErrorPage(url, statusCode, loadTime);
    }
  }

  private async extractAllLinksFromPage(pageUrl: string, html: string): Promise<string[]> {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const links = doc.querySelectorAll('a[href]');
      const discoveredUrls: string[] = [];
      
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
          try {
            const absoluteUrl = new URL(href, pageUrl);
            
            // Only include URLs from the same domain
            if (absoluteUrl.hostname === this.domain) {
              const cleanUrl = absoluteUrl.origin + absoluteUrl.pathname;
              
              // Filter out files and admin paths
              if (!cleanUrl.match(/\.(pdf|jpg|jpeg|png|gif|css|js|ico|xml|txt|zip|doc|docx)$/i) &&
                  !cleanUrl.includes('/wp-admin') &&
                  !cleanUrl.includes('/admin') &&
                  !cleanUrl.includes('/wp-content/') &&
                  !cleanUrl.includes('/wp-includes/')) {
                discoveredUrls.push(cleanUrl);
              }
            }
          } catch {
            // Invalid URL, skip
          }
        }
      });
      
      return [...new Set(discoveredUrls)];
      
    } catch (error) {
      return [];
    }
  }

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

    const pagesWithoutCanonical = this.pages.filter(p => !p.canonicalUrl && p.statusCode === 200);
    if (pagesWithoutCanonical.length > 0) {
      issues.push({
        type: 'warning',
        category: 'Technical',
        issue: 'Missing canonical URLs',
        suggestion: 'Add canonical tags to prevent duplicate content issues and consolidate page authority',
        impact: 'medium',
        count: pagesWithoutCanonical.length
      });
    }

    const pagesWithoutViewport = this.pages.filter(p => !p.viewport && p.statusCode === 200);
    if (pagesWithoutViewport.length > 0) {
      issues.push({
        type: 'error',
        category: 'Mobile',
        issue: 'Missing viewport meta tags',
        suggestion: 'Add viewport meta tags for proper mobile rendering and responsive design',
        impact: 'high',
        count: pagesWithoutViewport.length
      });
    }

    // Content Issues
    const totalImagesWithoutAlt = this.pages.reduce((sum, p) => sum + (p.statusCode === 200 ? p.imagesWithoutAlt : 0), 0);
    if (totalImagesWithoutAlt > 0) {
      issues.push({
        type: 'warning',
        category: 'Accessibility',
        issue: 'Images missing alt text',
        suggestion: 'Add descriptive alt text to all images for better accessibility and SEO',
        impact: 'medium',
        count: totalImagesWithoutAlt
      });
    }

    const shortContentPages = this.pages.filter(p => p.wordCount < 300 && p.statusCode === 200);
    if (shortContentPages.length > 0) {
      issues.push({
        type: 'warning',
        category: 'Content',
        issue: 'Thin content detected',
        suggestion: 'Expand content to at least 300 words for better search engine understanding',
        impact: 'medium',
        count: shortContentPages.length
      });
    }

    // Social Media Issues
    const pagesWithoutOG = this.pages.filter(p => !p.ogTitle && !p.ogDescription && p.statusCode === 200);
    if (pagesWithoutOG.length > 0) {
      issues.push({
        type: 'warning',
        category: 'Social',
        issue: 'Missing Open Graph tags',
        suggestion: 'Add Open Graph meta tags to improve social media sharing appearance',
        impact: 'medium',
        count: pagesWithoutOG.length
      });
    }

    const pagesWithoutTwitterCard = this.pages.filter(p => !p.twitterCard && p.statusCode === 200);
    if (pagesWithoutTwitterCard.length > 0) {
      issues.push({
        type: 'warning',
        category: 'Social',
        issue: 'Missing Twitter Card tags',
        suggestion: 'Add Twitter Card meta tags to optimize Twitter sharing appearance',
        impact: 'low',
        count: pagesWithoutTwitterCard.length
      });
    }

    // Performance Issues
    const slowPages = this.pages.filter(p => p.loadTime > 3 && p.statusCode === 200);
    if (slowPages.length > 0) {
      issues.push({
        type: 'warning',
        category: 'Performance',
        issue: 'Slow loading pages detected',
        suggestion: 'Optimize images, minify CSS/JS, enable compression, and consider CDN implementation',
        impact: 'high',
        count: slowPages.length
      });
    }

    // Success items
    const successfulPages = this.pages.filter(p => p.statusCode === 200);
    if (successfulPages.length > 0) {
      issues.push({
        type: 'success',
        category: 'Technical',
        issue: `${successfulPages.length} pages successfully analyzed`,
        suggestion: 'Great! These pages are accessible and loading properly for search engines',
        impact: 'low'
      });
    }

    const pagesWithSchema = this.pages.filter(p => p.schemaMarkup.length > 0 && p.statusCode === 200);
    if (pagesWithSchema.length > 0) {
      issues.push({
        type: 'success',
        category: 'Technical',
        issue: `${pagesWithSchema.length} pages have structured data`,
        suggestion: 'Excellent! Structured data helps search engines understand your content better',
        impact: 'low'
      });
    }

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
      avgWordCount: successfulPages.reduce((sum, p) => sum + p.wordCount, 0) / successfulPages.length || 0
    };
  }

  private generateTechnicalInsights() {
    const successfulPages = this.pages.filter(p => p.statusCode === 200);
    
    return {
      hasRobotsTxt: true, // We checked for it
      hasSitemap: this.discoveredUrls.size > this.pages.length, // More URLs discovered than crawled
      sslEnabled: this.pages.filter(p => p.sslEnabled).length === this.pages.length,
      mobileViewport: successfulPages.filter(p => p.viewport).length,
      structuredData: successfulPages.filter(p => p.schemaMarkup.length > 0).length,
      duplicateTitles: this.findDuplicateTitles().length,
      duplicateMetas: this.findDuplicateMetas().length,
      brokenInternalLinks: this.pages.filter(p => p.statusCode >= 400).length,
      orphanPages: this.findOrphanPages().length
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
      
      const deduction = issue.impact === 'high' ? 15 : issue.impact === 'medium' ? 8 : 3;
      const multiplier = issue.count ? Math.min(issue.count * 0.1, 1.2) : 1;
      
      switch (issue.category.toLowerCase()) {
        case 'technical':
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