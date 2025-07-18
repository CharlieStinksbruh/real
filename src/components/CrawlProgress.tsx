import React from 'react';
import { Globe, Clock, CheckCircle, Search, FileText, BarChart3, Zap, AlertTriangle, Wifi, Database, Shield, Activity, TrendingUp, Cpu, HardDrive, Network, Timer } from 'lucide-react';

interface CrawlProgressProps {
  isActive: boolean;
  currentPage: string;
  pagesFound: number;
  pagesCrawled: number;
  phase: 'initializing' | 'discovery' | 'sitemap' | 'crawling' | 'analyzing' | 'complete';
  startTime: number;
  estimatedTimeRemaining: number | null;
  crawlSpeed: number;
  errorCount: number;
  queueSize: number;
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

export const CrawlProgress: React.FC<CrawlProgressProps> = ({
  isActive,
  currentPage,
  pagesFound,
  pagesCrawled,
  phase,
  startTime,
  estimatedTimeRemaining,
  crawlSpeed,
  errorCount,
  queueSize,
  currentDepth,
  maxDepth,
  robotsTxtFound,
  sitemapFound,
  sitemapCount,
  bytesProcessed,
  avgResponseTime,
  successRate,
  duplicatesFound,
  redirectsFound,
  currentUrl,
  discoveryRate,
  memoryUsage,
  networkRequests
}) => {
  if (!isActive && phase !== 'complete') return null;

  const getPhaseInfo = () => {
    switch (phase) {
      case 'initializing':
        return {
          icon: <Globe className="w-6 h-6 text-white animate-pulse" />,
          title: 'Initializing Advanced SEO Engine',
          description: 'Setting up comprehensive analysis framework and preparing crawl infrastructure...',
          color: 'bg-gradient-to-r from-blue-600 to-blue-700',
          progress: 10
        };
      case 'discovery':
        return {
          icon: <Search className="w-6 h-6 text-white animate-pulse" />,
          title: 'Site Discovery & Configuration Analysis',
          description: 'Analyzing robots.txt, discovering site architecture, and mapping crawl boundaries...',
          color: 'bg-gradient-to-r from-purple-600 to-purple-700',
          progress: 20
        };
      case 'sitemap':
        return {
          icon: <Database className="w-6 h-6 text-white animate-pulse" />,
          title: 'Comprehensive Sitemap Analysis',
          description: 'Processing XML sitemaps, sitemap indexes, and building priority URL queue...',
          color: 'bg-gradient-to-r from-indigo-600 to-indigo-700',
          progress: 35
        };
      case 'crawling':
        return {
          icon: <Activity className="w-6 h-6 text-white animate-spin" />,
          title: 'Intelligent Deep Crawling',
          description: 'Performing comprehensive page analysis with intelligent link discovery and content extraction...',
          color: 'bg-gradient-to-r from-green-600 to-green-700',
          progress: Math.min(85, 35 + (pagesCrawled / Math.max(pagesFound, 1)) * 50)
        };
      case 'analyzing':
        return {
          icon: <BarChart3 className="w-6 h-6 text-white animate-pulse" />,
          title: 'Advanced Technical Analysis',
          description: 'Processing SEO data, generating insights, calculating scores, and building comprehensive report...',
          color: 'bg-gradient-to-r from-orange-600 to-orange-700',
          progress: 90
        };
      default:
        return {
          icon: <CheckCircle className="w-6 h-6 text-white" />,
          title: 'Analysis Complete',
          description: 'Comprehensive SEO audit finished successfully with detailed insights and recommendations',
          color: 'bg-gradient-to-r from-emerald-600 to-emerald-700',
          progress: 100
        };
    }
  };

  const phaseInfo = getPhaseInfo();
  const progressPercentage = pagesFound > 0 ? Math.min((pagesCrawled / pagesFound) * 100, 100) : 0;
  const elapsedTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatSpeed = (speed: number) => {
    if (speed < 1) return `${(speed * 60).toFixed(1)} pages/min`;
    return `${speed.toFixed(1)} pages/sec`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-white/30 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className={`absolute inset-0 ${phaseInfo.color.replace('bg-gradient-to-r', 'bg-gradient-to-br')}`}></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Header with Enhanced Status */}
      <div className="flex items-center gap-6 mb-8 relative z-10">
        <div className={`${phaseInfo.color} p-4 rounded-2xl shadow-xl`}>
          {phaseInfo.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{phaseInfo.title}</h3>
          <p className="text-gray-600 font-medium mb-3">{phaseInfo.description}</p>
          
          {/* Overall Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className={`${phaseInfo.color} h-3 rounded-full transition-all duration-1000 relative overflow-hidden`}
              style={{ width: `${phaseInfo.progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
              <div 
                className="absolute inset-0 bg-white opacity-20"
                style={{
                  animation: 'shimmer 2s infinite linear',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                  transform: 'translateX(-100%)'
                }}
              />
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>Progress: {phaseInfo.progress}%</span>
            <span>{pagesCrawled} / {pagesFound > 0 ? pagesFound : '?'} pages</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-4xl font-bold text-gray-900 mb-1">{pagesCrawled}</div>
          <div className="text-sm text-gray-500 font-medium">Pages Analyzed</div>
          <div className="text-xs text-gray-400 mt-1">
            {successRate.toFixed(1)}% success rate
          </div>
        </div>
      </div>

      {/* Enhanced Real-time Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8 relative z-10">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center border border-blue-200 shadow-lg">
          <Globe className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{pagesFound}</div>
          <div className="text-xs text-blue-700 font-medium">URLs Found</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200 shadow-lg">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{pagesCrawled}</div>
          <div className="text-xs text-green-700 font-medium">Analyzed</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center border border-purple-200 shadow-lg">
          <Timer className="w-6 h-6 text-purple-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-purple-600">{queueSize}</div>
          <div className="text-xs text-purple-700 font-medium">In Queue</div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center border border-orange-200 shadow-lg">
          <TrendingUp className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">{currentDepth}</div>
          <div className="text-xs text-orange-700 font-medium">Current Depth</div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 text-center border border-red-200 shadow-lg">
          <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-600">{errorCount}</div>
          <div className="text-xs text-red-700 font-medium">Errors</div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 text-center border border-indigo-200 shadow-lg">
          <BarChart3 className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-indigo-600">{maxDepth}</div>
          <div className="text-xs text-indigo-700 font-medium">Max Depth</div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-4 text-center border border-pink-200 shadow-lg">
          <Network className="w-6 h-6 text-pink-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-pink-600">{duplicatesFound}</div>
          <div className="text-xs text-pink-700 font-medium">Duplicates</div>
        </div>
        
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-4 text-center border border-teal-200 shadow-lg">
          <HardDrive className="w-6 h-6 text-teal-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-teal-600">{formatBytes(bytesProcessed)}</div>
          <div className="text-xs text-teal-700 font-medium">Data Processed</div>
        </div>
      </div>

      {/* Advanced Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Timing Analysis</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Elapsed:</span>
              <span className="font-bold text-gray-900">{formatTime(elapsedTime)}</span>
            </div>
            {estimatedTimeRemaining && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Remaining:</span>
                <span className="font-bold text-blue-600">{formatTime(estimatedTimeRemaining)}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Response:</span>
              <span className="font-bold text-purple-600">{avgResponseTime.toFixed(0)}ms</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Performance Metrics</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Crawl Speed:</span>
              <span className="font-bold text-green-600">{formatSpeed(crawlSpeed)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Discovery Rate:</span>
              <span className="font-bold text-purple-600">{discoveryRate.toFixed(1)} URLs/s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Success Rate:</span>
              <span className={`font-bold ${successRate >= 95 ? 'text-green-600' : successRate >= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
                {successRate.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">Site Discovery</span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Robots.txt:</span>
              <div className="flex items-center gap-2">
                {robotsTxtFound ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                )}
                <span className={`font-bold text-sm ${robotsTxtFound ? 'text-green-600' : 'text-red-600'}`}>
                  {robotsTxtFound ? 'Found' : 'Missing'}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Sitemaps:</span>
              <div className="flex items-center gap-2">
                {sitemapFound ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                )}
                <span className={`font-bold text-sm ${sitemapFound ? 'text-green-600' : 'text-yellow-600'}`}>
                  {sitemapCount} found
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Redirects:</span>
              <span className="font-bold text-orange-600">{redirectsFound}</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-gray-700">System Resources</span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Memory Usage:</span>
              <span className="font-bold text-indigo-600">{memoryUsage.toFixed(1)} MB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Network Requests:</span>
              <span className="font-bold text-blue-600">{networkRequests}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Data Processed:</span>
              <span className="font-bold text-teal-600">{formatBytes(bytesProcessed)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Current Activity Status */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-lg relative z-10">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Wifi className="w-5 h-5 text-blue-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-700 mb-2">Current Activity:</p>
            <p className="text-sm text-gray-900 break-all leading-relaxed font-medium">{currentPage}</p>
            {currentUrl && currentUrl !== 'Complete' && currentUrl !== 'Error' && (
              <p className="text-xs text-gray-500 mt-2 break-all">
                <span className="font-medium">Processing:</span> {currentUrl}
              </p>
            )}
          </div>
          
          {/* Live Status Indicator */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="text-xs font-medium text-gray-600">
              {isActive ? 'LIVE' : 'IDLE'}
            </span>
          </div>
        </div>
      </div>

      {/* Phase-specific Information */}
      {phase === 'crawling' && pagesFound > 0 && (
        <div className="mt-6 text-sm text-gray-600 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200 relative z-10">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <strong className="text-blue-700 font-semibold">Intelligent Discovery Engine:</strong> Our advanced crawler is actively discovering new pages through 
              comprehensive internal link analysis, sitemap processing, and intelligent content mapping. The system continuously 
              builds a detailed site architecture while analyzing technical SEO elements, content quality metrics, and performance indicators in real-time. 
              <span className="text-blue-600 font-medium"> Total discovered URLs may increase as we explore deeper site structures and follow internal link networks.</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};