import React from 'react';
import { Zap, Clock, Activity, TrendingUp, AlertTriangle, CheckCircle, BarChart3, Gauge } from 'lucide-react';
import { PageAnalysis } from '../types/seo';

interface PerformanceMetricsProps {
  pages: PageAnalysis[];
  crawlStats: any;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ pages, crawlStats }) => {
  const successfulPages = pages.filter(p => p.statusCode === 200);
  
  const performanceStats = {
    avgLoadTime: crawlStats.avgLoadTime,
    fastPages: successfulPages.filter(p => p.loadTime < 1).length,
    moderatePages: successfulPages.filter(p => p.loadTime >= 1 && p.loadTime < 3).length,
    slowPages: successfulPages.filter(p => p.loadTime >= 3).length,
    avgPageSize: crawlStats.avgPageSize,
    largePages: successfulPages.filter(p => p.pageSize > 1000000).length, // >1MB
    avgLCP: successfulPages.reduce((sum, p) => sum + p.coreWebVitals.lcp, 0) / successfulPages.length || 0,
    avgFID: successfulPages.reduce((sum, p) => sum + p.coreWebVitals.fid, 0) / successfulPages.length || 0,
    avgCLS: successfulPages.reduce((sum, p) => sum + p.coreWebVitals.cls, 0) / successfulPages.length || 0,
    goodLCP: successfulPages.filter(p => p.coreWebVitals.lcp < 2500).length,
    goodFID: successfulPages.filter(p => p.coreWebVitals.fid < 100).length,
    goodCLS: successfulPages.filter(p => p.coreWebVitals.cls < 0.1).length
  };

  const getPerformanceScore = (page: PageAnalysis) => {
    let score = 100;
    if (page.loadTime > 3) score -= 30;
    else if (page.loadTime > 2) score -= 20;
    else if (page.loadTime > 1) score -= 10;
    
    if (page.pageSize > 2000000) score -= 20; // 2MB
    else if (page.pageSize > 1000000) score -= 10; // 1MB
    
    if (page.coreWebVitals.lcp > 4000) score -= 20;
    else if (page.coreWebVitals.lcp > 2500) score -= 10;
    
    if (page.coreWebVitals.cls > 0.25) score -= 15;
    else if (page.coreWebVitals.cls > 0.1) score -= 8;
    
    return Math.max(0, score);
  };

  const performanceDistribution = {
    excellent: successfulPages.filter(p => getPerformanceScore(p) >= 90).length,
    good: successfulPages.filter(p => getPerformanceScore(p) >= 70 && getPerformanceScore(p) < 90).length,
    fair: successfulPages.filter(p => getPerformanceScore(p) >= 50 && getPerformanceScore(p) < 70).length,
    poor: successfulPages.filter(p => getPerformanceScore(p) < 50).length
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const getScoreColor = (score: number, good: number, warning: number) => {
    if (score >= good) return 'text-green-600';
    if (score >= warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCWVColor = (metric: string, value: number) => {
    switch (metric) {
      case 'lcp':
        if (value < 2500) return 'text-green-600';
        if (value < 4000) return 'text-yellow-600';
        return 'text-red-600';
      case 'fid':
        if (value < 100) return 'text-green-600';
        if (value < 300) return 'text-yellow-600';
        return 'text-red-600';
      case 'cls':
        if (value < 0.1) return 'text-green-600';
        if (value < 0.25) return 'text-yellow-600';
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Performance Analysis</h3>
        
        {/* Performance Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center border border-blue-200">
            <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${getScoreColor(performanceStats.avgLoadTime, 1, 2)}`}>
              {performanceStats.avgLoadTime.toFixed(1)}s
            </div>
            <div className="text-xs text-blue-700 font-medium">Avg Load Time</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200">
            <Zap className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{performanceStats.fastPages}</div>
            <div className="text-xs text-green-700 font-medium">Fast Pages (&lt;1s)</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 text-center border border-yellow-200">
            <Activity className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{performanceStats.moderatePages}</div>
            <div className="text-xs text-yellow-700 font-medium">Moderate (1-3s)</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 text-center border border-red-200">
            <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{performanceStats.slowPages}</div>
            <div className="text-xs text-red-700 font-medium">Slow Pages (&gt;3s)</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center border border-purple-200">
            <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{formatBytes(performanceStats.avgPageSize)}</div>
            <div className="text-xs text-purple-700 font-medium">Avg Page Size</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center border border-orange-200">
            <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{performanceStats.largePages}</div>
            <div className="text-xs text-orange-700 font-medium">Large Pages (&gt;1MB)</div>
          </div>
        </div>

        {/* Core Web Vitals */}
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Gauge className="w-6 h-6 text-indigo-600" />
            <h4 className="font-semibold text-indigo-900 text-lg">Core Web Vitals Analysis</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-indigo-200">
              <div className="text-center mb-4">
                <h5 className="font-semibold text-gray-800 mb-2">Largest Contentful Paint (LCP)</h5>
                <div className={`text-4xl font-bold ${getCWVColor('lcp', performanceStats.avgLCP)} mb-2`}>
                  {(performanceStats.avgLCP / 1000).toFixed(1)}s
                </div>
                <p className="text-sm text-gray-600">Average loading performance</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Good (&lt;2.5s):</span>
                  <span className="font-medium">{performanceStats.goodLCP} pages</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-700">Needs Improvement:</span>
                  <span className="font-medium">{successfulPages.filter(p => p.coreWebVitals.lcp >= 2500 && p.coreWebVitals.lcp < 4000).length} pages</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-700">Poor (&gt;4s):</span>
                  <span className="font-medium">{successfulPages.filter(p => p.coreWebVitals.lcp >= 4000).length} pages</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-indigo-200">
              <div className="text-center mb-4">
                <h5 className="font-semibold text-gray-800 mb-2">First Input Delay (FID)</h5>
                <div className={`text-4xl font-bold ${getCWVColor('fid', performanceStats.avgFID)} mb-2`}>
                  {performanceStats.avgFID.toFixed(0)}ms
                </div>
                <p className="text-sm text-gray-600">Average interactivity</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Good (&lt;100ms):</span>
                  <span className="font-medium">{performanceStats.goodFID} pages</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-700">Needs Improvement:</span>
                  <span className="font-medium">{successfulPages.filter(p => p.coreWebVitals.fid >= 100 && p.coreWebVitals.fid < 300).length} pages</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-700">Poor (&gt;300ms):</span>
                  <span className="font-medium">{successfulPages.filter(p => p.coreWebVitals.fid >= 300).length} pages</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-indigo-200">
              <div className="text-center mb-4">
                <h5 className="font-semibold text-gray-800 mb-2">Cumulative Layout Shift (CLS)</h5>
                <div className={`text-4xl font-bold ${getCWVColor('cls', performanceStats.avgCLS)} mb-2`}>
                  {performanceStats.avgCLS.toFixed(3)}
                </div>
                <p className="text-sm text-gray-600">Average visual stability</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Good (&lt;0.1):</span>
                  <span className="font-medium">{performanceStats.goodCLS} pages</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-yellow-700">Needs Improvement:</span>
                  <span className="font-medium">{successfulPages.filter(p => p.coreWebVitals.cls >= 0.1 && p.coreWebVitals.cls < 0.25).length} pages</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-700">Poor (&gt;0.25):</span>
                  <span className="font-medium">{successfulPages.filter(p => p.coreWebVitals.cls >= 0.25).length} pages</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Distribution */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-gray-600" />
            <h4 className="font-semibold text-gray-900 text-lg">Performance Score Distribution</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-100 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">{performanceDistribution.excellent}</div>
              <div className="text-sm font-medium text-green-700">Excellent (90-100)</div>
              <div className="text-xs text-green-600 mt-1">
                {((performanceDistribution.excellent / successfulPages.length) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{performanceDistribution.good}</div>
              <div className="text-sm font-medium text-blue-700">Good (70-89)</div>
              <div className="text-xs text-blue-600 mt-1">
                {((performanceDistribution.good / successfulPages.length) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-100 rounded-xl border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{performanceDistribution.fair}</div>
              <div className="text-sm font-medium text-yellow-700">Fair (50-69)</div>
              <div className="text-xs text-yellow-600 mt-1">
                {((performanceDistribution.fair / successfulPages.length) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-4 bg-red-100 rounded-xl border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-2">{performanceDistribution.poor}</div>
              <div className="text-sm font-medium text-red-700">Poor (0-49)</div>
              <div className="text-xs text-red-600 mt-1">
                {((performanceDistribution.poor / successfulPages.length) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Performance Recommendations */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-gray-900 text-lg">Performance Optimization Recommendations</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-800">Critical Performance Issues</h5>
              
              {performanceStats.slowPages > 0 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Slow Loading Pages</p>
                    <p className="text-sm text-red-700">
                      {performanceStats.slowPages} pages load in over 3 seconds. 
                      Optimize images, minify CSS/JS, enable compression, and consider a CDN.
                    </p>
                  </div>
                </div>
              )}

              {performanceStats.largePages > 0 && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">Large Page Sizes</p>
                    <p className="text-sm text-orange-700">
                      {performanceStats.largePages} pages exceed 1MB. 
                      Compress images, minify code, and remove unnecessary resources.
                    </p>
                  </div>
                </div>
              )}

              {performanceStats.avgLCP > 2500 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Poor LCP Performance</p>
                    <p className="text-sm text-red-700">
                      Average LCP is {(performanceStats.avgLCP / 1000).toFixed(1)}s. 
                      Optimize largest content elements, improve server response times, and preload critical resources.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-800">Optimization Opportunities</h5>
              
              {performanceStats.avgCLS > 0.1 && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Layout Stability Issues</p>
                    <p className="text-sm text-yellow-700">
                      Average CLS is {performanceStats.avgCLS.toFixed(3)}. 
                      Set dimensions for images and ads, avoid inserting content above existing content.
                    </p>
                  </div>
                </div>
              )}

              {performanceStats.avgFID > 100 && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Interactivity Delays</p>
                    <p className="text-sm text-yellow-700">
                      Average FID is {performanceStats.avgFID.toFixed(0)}ms. 
                      Reduce JavaScript execution time, split code, and remove unused JavaScript.
                    </p>
                  </div>
                </div>
              )}

              {performanceStats.fastPages > 0 && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Fast Loading Pages</p>
                    <p className="text-sm text-green-700">
                      {performanceStats.fastPages} pages load in under 1 second. 
                      Great job! Apply similar optimization techniques to slower pages.
                    </p>
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