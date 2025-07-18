import React, { useState } from 'react';
import { Search, User, LogOut, Settings, BarChart3 } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HomePage } from './components/HomePage';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { SEOAnalyzer } from './services/seoAnalyzer';
import { SEOAnalysis, SEOIssue } from './types/seo';
import { CrawlProgress } from './components/CrawlProgress';
import { PagesList } from './components/PagesList';
import { TechnicalInsights } from './components/TechnicalInsights';
import { IssuesBreakdown } from './components/IssuesBreakdown';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { ContentAnalysis } from './components/ContentAnalysis';
import { SocialMediaAnalysis } from './components/SocialMediaAnalysis';

function AppContent() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'analyzer' | 'admin'>('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // SEO Analyzer state
  const [url, setUrl] = useState('');
  const [maxPages, setMaxPages] = useState(50);
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [crawlDelay, setCrawlDelay] = useState(200);
  const [followExternalLinks, setFollowExternalLinks] = useState(false);
  const [includeImages, setIncludeImages] = useState(false);
  const [respectRobots, setRespectRobots] = useState(true);
  const [maxDepth, setMaxDepth] = useState(10);
  const [loading, setLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [analyzer, setAnalyzer] = useState<SEOAnalyzer | null>(null);
  const [crawlProgress, setCrawlProgress] = useState({
    isActive: false,
    currentPage: '',
    pagesFound: 0,
    pagesCrawled: 0,
    queueSize: 0,
    phase: 'initializing' as 'initializing' | 'sitemap' | 'crawling' | 'analyzing' | 'complete',
    startTime: 0,
    estimatedTimeRemaining: null as number | null,
    crawlSpeed: 0,
    errorCount: 0,
    currentDepth: 0,
    maxDepth: 0,
    robotsTxtFound: false,
    sitemapFound: false,
    sitemapCount: 0,
    bytesProcessed: 0,
    avgResponseTime: 0,
    successRate: 0,
    duplicatesFound: 0,
    redirectsFound: 0,
    currentUrl: '',
    discoveryRate: 0,
    memoryUsage: 0,
    networkRequests: 0
  });

  const handleStartAnalysis = () => {
    setCurrentView('analyzer');
  };

  const handleLogin = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const analyzeWebsite = async () => {
    if (!url) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);
    setIsPaused(false);

    try {
      const seoAnalyzer = new SEOAnalyzer();
      setAnalyzer(seoAnalyzer);
      
      const crawlOptions = {
        maxPages: isUnlimited ? -1 : maxPages,
        crawlDelay,
        followExternalLinks,
        includeImages,
        respectRobots,
        maxDepth
      };

      const result = await seoAnalyzer.analyzeSite(url, crawlOptions, setCrawlProgress);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze website. Please check the URL and try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
      setAnalyzer(null);
      setCrawlProgress(prev => ({ ...prev, isActive: false, phase: 'complete' }));
    }
  };

  const pauseCrawl = () => {
    if (analyzer) {
      analyzer.pauseCrawl();
      setIsPaused(true);
    }
  };

  const resumeCrawl = () => {
    if (analyzer) {
      analyzer.resumeCrawl();
      setIsPaused(false);
    }
  };

  const stopCrawl = () => {
    if (analyzer) {
      analyzer.stopCrawl();
      setLoading(false);
      setAnalyzer(null);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600';
    if (score >= 80) return 'text-green-600';
    if (score >= 70) return 'text-lime-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200';
    if (score >= 80) return 'bg-gradient-to-br from-green-50 to-green-100 border-green-200';
    if (score >= 70) return 'bg-gradient-to-br from-lime-50 to-lime-100 border-lime-200';
    if (score >= 60) return 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200';
    if (score >= 50) return 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200';
    return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
  };

  const exportReport = (format: 'json' | 'csv' | 'pdf') => {
    if (!analysis) return;
    
    if (format === 'json') {
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
          imagesWithoutAlt: page.imagesWithoutAlt,
          technicalScore: page.technicalScore,
          contentScore: page.contentScore,
          performanceScore: page.performanceScore
        })),
        technicalInsights: analysis.technicalInsights
      };
      
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `seo-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(downloadUrl);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'technical', label: 'Technical', icon: Settings },
    { id: 'content', label: 'Content', icon: Search },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'social', label: 'Social', icon: Search },
    { id: 'pages', label: 'Pages', icon: Search },
    { id: 'insights', label: 'Insights', icon: BarChart3 }
  ];

  if (currentView === 'admin' && user?.role === 'admin') {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    AnalyseThat
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">SEO Analysis Platform</p>
                </div>
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              {currentView !== 'home' && (
                <button
                  onClick={() => setCurrentView('home')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                >
                  Home
                </button>
              )}
              
              {user ? (
                <div className="flex items-center gap-4">
                  {user.role === 'admin' && (
                    <button
                      onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors font-medium"
                    >
                      <Settings className="w-4 h-4" />
                      Admin
                    </button>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-xl">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.subscription}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLogin('login')}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleLogin('register')}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {currentView === 'home' ? (
        <HomePage onStartAnalysis={handleStartAnalysis} />
      ) : (
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* SEO Analyzer Interface */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 mb-8 border border-white/20">
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <label htmlFor="url" className="block text-sm font-semibold text-gray-700 mb-3">
                    Website URL to Analyze
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg font-medium bg-white/50"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="flex items-end">
                  {!loading ? (
                    <button
                      onClick={analyzeWebsite}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Start Analysis
                      </div>
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      {!isPaused ? (
                        <button
                          onClick={pauseCrawl}
                          className="bg-yellow-500 text-white px-6 py-4 rounded-2xl hover:bg-yellow-600 transition-all duration-200 font-semibold shadow-lg"
                        >
                          Pause
                        </button>
                      ) : (
                        <button
                          onClick={resumeCrawl}
                          className="bg-green-500 text-white px-6 py-4 rounded-2xl hover:bg-green-600 transition-all duration-200 font-semibold shadow-lg"
                        >
                          Resume
                        </button>
                      )}
                      <button
                        onClick={stopCrawl}
                        className="bg-red-500 text-white px-6 py-4 rounded-2xl hover:bg-red-600 transition-all duration-200 font-semibold shadow-lg"
                      >
                        Stop
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="w-5 h-5 text-gray-600" />
                  <span className="text-lg font-semibold text-gray-800">Advanced Crawl Configuration</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Crawl Scope</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isUnlimited}
                          onChange={(e) => setIsUnlimited(e.target.checked)}
                          disabled={loading}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Unlimited pages (entire site)</span>
                      </div>
                      
                      {!isUnlimited && (
                        <select
                          value={maxPages}
                          onChange={(e) => setMaxPages(Number(e.target.value))}
                          disabled={loading}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 font-medium bg-white/50"
                        >
                          <option value={10}>10 pages</option>
                          <option value={25}>25 pages</option>
                          <option value={50}>50 pages</option>
                          <option value={100}>100 pages</option>
                          <option value={250}>250 pages</option>
                          <option value={500}>500 pages</option>
                          <option value={1000}>1,000 pages</option>
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Crawl Behavior</label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Crawl delay (ms)</span>
                        <select
                          value={crawlDelay}
                          onChange={(e) => setCrawlDelay(Number(e.target.value))}
                          disabled={loading}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={100}>100ms (Fast)</option>
                          <option value={200}>200ms (Normal)</option>
                          <option value={500}>500ms (Polite)</option>
                          <option value={1000}>1000ms (Conservative)</option>
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Max depth</span>
                        <select
                          value={maxDepth}
                          onChange={(e) => setMaxDepth(Number(e.target.value))}
                          disabled={loading}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value={5}>5 levels</option>
                          <option value={10}>10 levels</option>
                          <option value={15}>15 levels</option>
                          <option value={20}>20 levels</option>
                          <option value={-1}>Unlimited</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Advanced Options</label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={respectRobots}
                          onChange={(e) => setRespectRobots(e.target.checked)}
                          disabled={loading}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Respect robots.txt</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={followExternalLinks}
                          onChange={(e) => setFollowExternalLinks(e.target.checked)}
                          disabled={loading}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Follow external links</span>
                      </label>
                      
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={includeImages}
                          onChange={(e) => setIncludeImages(e.target.checked)}
                          disabled={loading}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">Include image analysis</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Crawl Progress */}
          <CrawlProgress {...crawlProgress} />

          {/* Analysis Results */}
          {analysis && !loading && (
            <div className="space-y-8">
              {/* Results sections would go here - same as before */}
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">SEO Analysis Results</h2>
                    <div className="space-y-1">
                      <p className="text-gray-600 font-medium">Analyzed: <span className="text-blue-600">{analysis.url}</span></p>
                      <p className="text-sm text-gray-500">Completed: {analysis.scanTime} • Duration: {Math.round(analysis.crawlDuration)}s</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900">{analysis.pages.length}</div>
                      <div className="text-sm text-gray-500">Pages Analyzed</div>
                    </div>
                  </div>
                </div>

                {/* Score Display */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="lg:col-span-1">
                    <div className={`${getScoreBackground(analysis.overallScore)} rounded-3xl p-8 text-center border-2 shadow-lg`}>
                      <div className={`text-6xl font-bold ${getScoreColor(analysis.overallScore)} mb-3`}>
                        {analysis.overallScore}
                      </div>
                      <p className="text-gray-700 font-semibold text-lg mb-2">Overall SEO Score</p>
                      <div className="w-full bg-white/50 rounded-full h-3 mb-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-1000 ${analysis.overallScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : analysis.overallScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
                          style={{ width: `${analysis.overallScore}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        {analysis.overallScore >= 90 ? 'Excellent' : 
                         analysis.overallScore >= 80 ? 'Very Good' :
                         analysis.overallScore >= 70 ? 'Good' :
                         analysis.overallScore >= 60 ? 'Fair' : 'Needs Improvement'}
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { key: 'technical', label: 'Technical', color: 'blue' },
                      { key: 'content', label: 'Content', color: 'green' },
                      { key: 'performance', label: 'Performance', color: 'yellow' },
                      { key: 'mobile', label: 'Mobile', color: 'purple' },
                      { key: 'accessibility', label: 'Accessibility', color: 'indigo' },
                      { key: 'social', label: 'Social', color: 'pink' }
                    ].map(({ key, label, color }) => {
                      const score = analysis.scores[key as keyof typeof analysis.scores];
                      return (
                        <div key={key} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="font-semibold text-gray-700">{label}</span>
                          </div>
                          <div className={`text-3xl font-bold ${getScoreColor(score)} mb-2`}>
                            {score}
                          </div>
                          <div className="w-full bg-white/60 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-1000 ${score >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' : score >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-red-600'}`}
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="border-b border-gray-200">
                  <nav className="flex overflow-x-auto">
                    {tabs.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex items-center gap-3 px-6 py-4 font-semibold transition-all duration-200 whitespace-nowrap ${
                          activeTab === id
                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {label}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-8">
                  {activeTab === 'overview' && (
                    <IssuesBreakdown issues={analysis.issues} />
                  )}
                  
                  {activeTab === 'technical' && (
                    <TechnicalInsights insights={analysis.technicalInsights} pages={analysis.pages} />
                  )}
                  
                  {activeTab === 'content' && (
                    <ContentAnalysis pages={analysis.pages} />
                  )}
                  
                  {activeTab === 'performance' && (
                    <PerformanceMetrics pages={analysis.pages} crawlStats={analysis.crawlStats} />
                  )}
                  
                  {activeTab === 'social' && (
                    <SocialMediaAnalysis pages={analysis.pages} />
                  )}
                  
                  {activeTab === 'pages' && (
                    <PagesList pages={analysis.pages} />
                  )}
                  
                  {activeTab === 'insights' && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900">Advanced SEO Insights</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-3">Content Quality</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-700">Avg Word Count:</span>
                              <span className="font-medium text-blue-900">{Math.round(analysis.crawlStats.avgWordCount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-blue-700">Content Pages:</span>
                              <span className="font-medium text-blue-900">{analysis.pages.filter(p => p.wordCount > 300).length}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;