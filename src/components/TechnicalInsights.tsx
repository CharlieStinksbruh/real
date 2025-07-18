import React from 'react';
import { Shield, Database, Globe, Smartphone, Search, FileText, AlertTriangle, CheckCircle, XCircle, Clock, Activity, TrendingUp } from 'lucide-react';
import { PageAnalysis } from '../types/seo';

interface TechnicalInsightsProps {
  insights: any;
  pages: PageAnalysis[];
}

export const TechnicalInsights: React.FC<TechnicalInsightsProps> = ({ insights, pages }) => {
  const successfulPages = pages.filter(p => p.statusCode === 200);
  
  const getStatusIcon = (condition: boolean) => {
    return condition ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = total > 0 ? (score / total) * 100 : 0;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical SEO Analysis</h3>
        
        {/* Core Technical Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Site Configuration</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">Robots.txt</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(insights.hasRobotsTxt)}
                  <span className="text-sm font-medium">{insights.hasRobotsTxt ? 'Present' : 'Missing'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">XML Sitemaps</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(insights.hasSitemap)}
                  <span className="text-sm font-medium">{insights.sitemapCount} found</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-700">SSL/HTTPS</span>
                <div className="flex items-center gap-2">
                  {getStatusIcon(insights.sslEnabled)}
                  <span className="text-sm font-medium">{insights.sslEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="w-6 h-6 text-green-600" />
              <h4 className="font-semibold text-green-900">Mobile & Accessibility</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Mobile Viewport</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(insights.mobileViewport, successfulPages.length)}`}>
                    {insights.mobileViewport}
                  </span>
                  <span className="text-sm text-green-600">/ {successfulPages.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Language Declaration</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(successfulPages.filter(p => p.lang).length, successfulPages.length)}`}>
                    {successfulPages.filter(p => p.lang).length}
                  </span>
                  <span className="text-sm text-green-600">/ {successfulPages.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">Favicon Present</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(insights.pagesWithFavicon, successfulPages.length)}`}>
                    {insights.pagesWithFavicon}
                  </span>
                  <span className="text-sm text-green-600">/ {successfulPages.length}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-purple-600" />
              <h4 className="font-semibold text-purple-900">Structured Data</h4>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">Schema Markup</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(insights.structuredData, successfulPages.length)}`}>
                    {insights.structuredData}
                  </span>
                  <span className="text-sm text-purple-600">/ {successfulPages.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">Hreflang Tags</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(insights.pagesWithHreflang, successfulPages.length)}`}>
                    {insights.pagesWithHreflang}
                  </span>
                  <span className="text-sm text-purple-600">/ {successfulPages.length}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-purple-700">Meta Keywords</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(insights.pagesWithMetaKeywords, successfulPages.length)}`}>
                    {insights.pagesWithMetaKeywords}
                  </span>
                  <span className="text-sm text-purple-600">/ {successfulPages.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Quality Issues */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h4 className="font-semibold text-red-900">Content Issues</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-700">Duplicate Titles</span>
                <span className="text-2xl font-bold text-red-600">{insights.duplicateTitles}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-700">Duplicate Meta Descriptions</span>
                <span className="text-2xl font-bold text-red-600">{insights.duplicateMetas}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-700">Broken Internal Links</span>
                <span className="text-2xl font-bold text-red-600">{insights.brokenInternalLinks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-700">Orphan Pages</span>
                <span className="text-2xl font-bold text-red-600">{insights.orphanPages}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-yellow-600" />
              <h4 className="font-semibold text-yellow-900">Core Web Vitals</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-700">Avg LCP (Largest Contentful Paint)</span>
                <span className={`text-lg font-bold ${insights.avgCoreWebVitalsLCP < 2500 ? 'text-green-600' : insights.avgCoreWebVitalsLCP < 4000 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {(insights.avgCoreWebVitalsLCP / 1000).toFixed(1)}s
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-700">Avg FID (First Input Delay)</span>
                <span className={`text-lg font-bold ${insights.avgCoreWebVitalsFID < 100 ? 'text-green-600' : insights.avgCoreWebVitalsFID < 300 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {insights.avgCoreWebVitalsFID.toFixed(0)}ms
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-yellow-700">Avg CLS (Cumulative Layout Shift)</span>
                <span className={`text-lg font-bold ${insights.avgCoreWebVitalsCLS < 0.1 ? 'text-green-600' : insights.avgCoreWebVitalsCLS < 0.25 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {insights.avgCoreWebVitalsCLS.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Site Architecture */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-indigo-600" />
            <h4 className="font-semibold text-indigo-900 text-lg">Site Architecture Analysis</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">{insights.maxCrawlDepth}</div>
              <div className="text-xs text-indigo-700 font-medium">Max Depth</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">{insights.robotsTxtSize}</div>
              <div className="text-xs text-indigo-700 font-medium">Robots.txt Size</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">{insights.sitemapCount}</div>
              <div className="text-xs text-indigo-700 font-medium">Sitemaps Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">{successfulPages.length}</div>
              <div className="text-xs text-indigo-700 font-medium">Crawlable Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">{insights.structuredData}</div>
              <div className="text-xs text-indigo-700 font-medium">With Schema</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">{insights.mobileViewport}</div>
              <div className="text-xs text-indigo-700 font-medium">Mobile Ready</div>
            </div>
          </div>
        </div>

        {/* Technical Recommendations */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-gray-900 text-lg">Priority Technical Recommendations</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-800">High Priority</h5>
              {!insights.hasRobotsTxt && (
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Missing Robots.txt</p>
                    <p className="text-sm text-red-700">Create a robots.txt file to guide search engine crawlers</p>
                  </div>
                </div>
              )}
              {!insights.sslEnabled && (
                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">SSL Not Enabled</p>
                    <p className="text-sm text-red-700">Implement HTTPS across all pages for security and SEO benefits</p>
                  </div>
                </div>
              )}
              {insights.duplicateTitles > 0 && (
                <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">Duplicate Titles Found</p>
                    <p className="text-sm text-orange-700">Create unique, descriptive titles for all {insights.duplicateTitles} affected pages</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-800">Medium Priority</h5>
              {insights.structuredData < successfulPages.length * 0.5 && (
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Limited Structured Data</p>
                    <p className="text-sm text-yellow-700">Add schema markup to more pages for enhanced search results</p>
                  </div>
                </div>
              )}
              {insights.orphanPages > 0 && (
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Orphan Pages Detected</p>
                    <p className="text-sm text-yellow-700">Link to {insights.orphanPages} orphaned pages from your main navigation</p>
                  </div>
                </div>
              )}
              {insights.mobileViewport < successfulPages.length && (
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Mobile Viewport Issues</p>
                    <p className="text-sm text-blue-700">Add viewport meta tags to {successfulPages.length - insights.mobileViewport} pages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};