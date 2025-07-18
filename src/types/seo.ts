import React, { useState } from 'react';
import { Search, Globe, Zap, Smartphone, FileText, AlertTriangle, CheckCircle, XCircle, Download, ExternalLink, BarChart3, Users, Share2, Settings } from 'lucide-react';
import { SEOAnalyzer } from './services/seoAnalyzer';
import { SEOAnalysis, SEOIssue } from './types/seo';
import { CrawlProgress } from './components/CrawlProgress';
import { PagesList } from './components/PagesList';

function App() {
  const [url, setUrl] = useState('');
  const [maxPages, setMaxPages] = useState(50);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [error, setError] = useState('');
  const [crawlProgress, setCrawlProgress] = useState({
    isActive: false,
    currentPage: '',
    pagesFound: 0,
    pagesCrawled: 0,
    phase: 'initializing' as 'initializing' | 'discovery' | 'sitemap' | 'crawling' | 'analyzing' | 'complete',
    startTime: 0,
    estimatedTimeRemaining: null as number | null,
    crawlSpeed: 0,
    errorCount: 0,
    queueSize: 0,
    currentDepth: 0,
    maxDepth: 0,
    robotsTxtFound: false,
  });

  const analyzeWebsite = async () => {
    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const analyzer = new SEOAnalyzer();
      const result = await analyzer.analyzeSite(url, isUnlimited ? -1 : maxPages, setCrawlProgress);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze website. Please try again.');
    } finally {
      setLoading(false);
      setCrawlProgress(prev => ({ ...prev, isActive: false, phase: 'complete' }));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${styles[impact as keyof typeof styles]}`;
  };

  const exportReport = () => {
    if (!analysis) return;
    
    const reportData = {
      url: analysis.url,
      scanTime: analysis.scanTime,
      overallScore: analysis.overallScore,
      scores: analysis.scores,
      crawlStats: analysis.crawlStats,
      issues: analysis.issues,
      pages: analysis.pages.map(page => ({
        url: page.url,
        title: page.title,
        statusCode: page.statusCode,
        loadTime: page.loadTime,
        wordCount: page.wordCount,
        metaDescription: page.metaDescription ? 'Present' : 'Missing',
        h1Count: page.h1Count,
        imageCount: page.imageCount,
        imagesWithoutAlt: page.imagesWithoutAlt
      }))
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SEO Site Crawler</h1>
              <p className="text-gray-600">Comprehensive technical SEO analysis across your entire website</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* URL Input Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={analyzeWebsite}
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? 'Crawling Site...' : 'Analyze Website'}
                </button>
              </div>
            </div>

            {/* Crawl Settings */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Settings className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Crawl Settings</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isUnlimited}
                      onChange={(e) => setIsUnlimited(e.target.checked)}
                      disabled={loading}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Unlimited pages</span>
                  </label>
                </div>
                
                {!isUnlimited && (
                  <div className="flex items-center gap-2">
                    <label htmlFor="maxPages" className="text-sm text-gray-700">
                      Max pages:
                    </label>
                    <select
                      id="maxPages"
                      value={maxPages}
                      onChange={(e) => setMaxPages(Number(e.target.value))}
                      disabled={loading}
                      className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={10}>10 pages</option>
                      <option value={25}>25 pages</option>
                      <option value={50}>50 pages</option>
                      <option value={100}>100 pages</option>
                      <option value={250}>250 pages</option>
                      <option value={500}>500 pages</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-500">
              {isUnlimited 
                ? "We'll crawl your entire website following internal links and sitemap entries. This may take several minutes for large sites."
                : `We'll crawl up to ${maxPages} pages of your website, prioritizing important pages from sitemaps and internal links.`
              }
            </p>
            
            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}
          </div>
        </div>

        {/* Crawl Progress */}
        <CrawlProgress {...crawlProgress} />

        {/* Analysis Results */}
        {analysis && !loading && (
          <div className="space-y-8">
            {/* Overall Score & Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Site Analysis Results</h2>
                  <p className="text-gray-600">Analyzed: {analysis.url}</p>
                  <p className="text-sm text-gray-500">Completed: {analysis.scanTime}</p>
                </div>
                <button
                  onClick={exportReport}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
              </div>

              {/* Crawl Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{analysis.crawlStats.totalPages}</div>
                  <div className="text-xs text-gray-600">Pages Crawled</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{analysis.crawlStats.crawledPages}</div>
                  <div className="text-xs text-gray-600">Successfully Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">{analysis.crawlStats.uniqueUrls}</div>
                  <div className="text-xs text-gray-600">URLs Discovered</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">{analysis.crawlStats.errorPages}</div>
                  <div className="text-xs text-gray-600">Error Pages</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-600">{analysis.crawlStats.avgLoadTime.toFixed(1)}s</div>
                  <div className="text-xs text-gray-600">Avg Load Time</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-2">
                  <div className={`${getScoreBackground(analysis.overallScore)} rounded-xl p-6 text-center`}>
                    <div className={`text-4xl font-bold ${getScoreColor(analysis.overallScore)} mb-2`}>
                      {analysis.overallScore}
                    </div>
                    <p className="text-gray-700 font-medium">Overall SEO Score</p>
                  </div>
                </div>

                <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      <span className="font-medium text-gray-700">Technical</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.scores.technical)}`}>
                      {analysis.scores.technical}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-700">Content</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.scores.content)}`}>
                      {analysis.scores.content}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-yellow-600" />
                      <span className="font-medium text-gray-700">Performance</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.scores.performance)}`}>
                      {analysis.scores.performance}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-700">Mobile</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.scores.mobile)}`}>
                      {analysis.scores.mobile}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-5 h-5 text-indigo-600" />
                      <span className="font-medium text-gray-700">Accessibility</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.scores.accessibility)}`}>
                      {analysis.scores.accessibility}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Share2 className="w-5 h-5 text-pink-600" />
                      <span className="font-medium text-gray-700">Social</span>
                    </div>
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.scores.social)}`}>
                      {analysis.scores.social}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Issues List */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Site-wide Issues & Recommendations</h3>
              <div className="space-y-4">
                {analysis.issues.map((issue, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="font-medium text-gray-900">{issue.issue}</h4>
                          <span className={getImpactBadge(issue.impact)}>
                            {issue.impact} impact
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {issue.category}
                          </span>
                          {issue.count && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded font-medium">
                              {issue.count} affected {issue.count === 1 ? 'page' : 'pages'}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{issue.suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pages List */}
            <PagesList pages={analysis.pages} />

            {/* Technical Insights */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Technical Insights</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{analysis.technicalInsights.structuredData}</div>
                  <div className="text-sm text-gray-600">Pages with Schema</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">{analysis.technicalInsights.mobileViewport}</div>
                  <div className="text-sm text-gray-600">Mobile Optimized</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">{analysis.technicalInsights.duplicateTitles}</div>
                  <div className="text-sm text-gray-600">Duplicate Titles</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">{analysis.technicalInsights.orphanPages}</div>
                  <div className="text-sm text-gray-600">Orphan Pages</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(analysis.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">PageSpeed Insights</p>
                    <p className="text-sm text-gray-600">Check detailed performance metrics</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </a>

                <a
                  href={`https://search.google.com/test/mobile-friendly?url=${encodeURIComponent(analysis.url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Mobile-Friendly Test</p>
                    <p className="text-sm text-gray-600">Verify mobile compatibility</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;