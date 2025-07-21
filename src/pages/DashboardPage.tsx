import React, { useState } from 'react';
import { 
  Search, 
  BarChart3, 
  Globe, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Eye,
  Activity,
  Zap,
  Target,
  Shield,
  FileText,
  Users,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSEOScanner } from '../hooks/useSEOScanner';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

export function DashboardPage() {
  const { user } = useAuth();
  const { currentScan, isScanning, startScan, crawlFeedback } = useSEOScanner();
  const [domain, setDomain] = useState('');

  const handleStartScan = () => {
    if (domain && user) {
      startScan(domain, user.id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                SEO Dashboard
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Welcome back, <span className="font-semibold text-blue-600">{user?.name}</span>. Let's analyze your website's performance.
              </p>
            </div>
          </div>
        </div>

        {/* Scan Input */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Start New Analysis</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="https://example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={isScanning}
                className="h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-2xl"
              />
            </div>
            <Button 
              onClick={handleStartScan}
              disabled={!domain || isScanning}
              loading={isScanning}
              className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl shadow-lg"
            >
              {isScanning ? 'Analyzing...' : 'Analyze Website'}
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <p className="text-sm text-blue-800 font-medium">
              🚀 Our advanced crawler will discover pages from sitemaps, follow internal links, and perform comprehensive SEO analysis across your entire website.
            </p>
          </div>
        </div>

        {/* Scan Progress */}
        {currentScan && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Main Progress Card */}
            <div className="lg:col-span-3">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg">
                      <Globe className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Analyzing: {new URL(currentScan.domain).hostname}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className={`w-3 h-3 rounded-full ${isScanning ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        <span className="text-sm font-medium text-gray-600">
                          {currentScan.status === 'completed' ? 'Analysis Complete' : 'Live Analysis'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {currentScan.scannedPages}
                    </div>
                    <div className="text-sm text-gray-500 font-medium">Pages Analyzed</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-gray-700">Progress</span>
                    <span className="font-medium text-gray-700">{currentScan.scannedPages} / {currentScan.totalPages} pages</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 relative overflow-hidden"
                      style={{ 
                        width: currentScan.totalPages > 0 
                          ? `${(currentScan.scannedPages / currentScan.totalPages) * 100}%` 
                          : '0%' 
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                {currentScan.results.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center border border-blue-200">
                      <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{currentScan.results.length}</div>
                      <div className="text-xs text-blue-700 font-medium">Pages Scanned</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200">
                      <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round(currentScan.results.reduce((acc, r) => acc + r.score, 0) / currentScan.results.length)}
                      </div>
                      <div className="text-xs text-green-700 font-medium">Average Score</div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 text-center border border-red-200">
                      <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-600">
                        {currentScan.results.reduce((acc, r) => acc + r.issues.length, 0)}
                      </div>
                      <div className="text-xs text-red-700 font-medium">Issues Found</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center border border-purple-200">
                      <BarChart3 className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">
                        {currentScan.results.reduce((acc, r) => acc + r.internalLinks, 0)}
                      </div>
                      <div className="text-xs text-purple-700 font-medium">Internal Links</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Live Feedback Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 h-full">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-xl">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Live Updates</h3>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {crawlFeedback.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-sm">Analysis updates will appear here...</p>
                    </div>
                  ) : (
                    crawlFeedback.slice(-8).reverse().map((feedback, index) => (
                      <div key={index} className={`p-3 rounded-2xl border ${
                        feedback.type === 'success' ? 'bg-green-50 border-green-200' :
                        feedback.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                        feedback.type === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-start space-x-2">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            feedback.type === 'success' ? 'bg-green-500' :
                            feedback.type === 'warning' ? 'bg-yellow-500' :
                            feedback.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`font-semibold text-sm ${
                                feedback.type === 'success' ? 'text-green-900' :
                                feedback.type === 'warning' ? 'text-yellow-900' :
                                feedback.type === 'error' ? 'text-red-900' : 'text-blue-900'
                              }`}>
                                {feedback.stage}
                              </span>
                              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{feedback.timestamp}</span>
                            </div>
                            <p className={`text-xs mt-1 ${
                              feedback.type === 'success' ? 'text-green-700' :
                              feedback.type === 'warning' ? 'text-yellow-700' :
                              feedback.type === 'error' ? 'text-red-700' : 'text-gray-600'
                            }`}>
                              {feedback.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Table */}
        {currentScan && currentScan.results.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Detailed Analysis Results</h2>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Page</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">SEO Score</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Issues</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Performance</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentScan.results.map((result) => (
                    <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {result.status === 200 ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-gray-900 truncate">
                              {result.title || 'No title'}
                            </div>
                            <div className="text-sm text-blue-600 hover:text-blue-800 truncate">
                              {new URL(result.url).pathname}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className={`text-2xl font-bold ${
                            result.score >= 80 ? 'text-green-600' :
                            result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {result.score}
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                result.score >= 80 ? 'bg-green-500' :
                                result.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${result.score}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          {result.issues.filter(i => i.type === 'error').length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 font-medium">
                              {result.issues.filter(i => i.type === 'error').length} errors
                            </span>
                          )}
                          {result.issues.filter(i => i.type === 'warning').length > 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 font-medium ml-1">
                              {result.issues.filter(i => i.type === 'warning').length} warnings
                            </span>
                          )}
                          {result.issues.length === 0 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 font-medium">
                              No issues
                            </span>
                          )}
                        </div>
                        
                        {/* Detailed Issues */}
                        {result.issues.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {result.issues.slice(0, 3).map((issue, idx) => (
                              <div key={idx} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                <span className="font-medium">{issue.type}:</span> {issue.message}
                              </div>
                            ))}
                            {result.issues.length > 3 && (
                              <div className="text-xs text-gray-500 italic">
                                +{result.issues.length - 3} more issues
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm font-medium ${
                              result.loadTime < 1000 ? 'text-green-600' :
                              result.loadTime < 2000 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {Math.round(result.loadTime)}ms
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {result.status}
                            </span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="space-y-1 text-xs text-gray-600">
                          <div>H1: {result.h1Count}, H2: {result.h2Count}</div>
                          <div>Images: {result.imageCount} ({result.imagesWithoutAlt} no alt)</div>
                          <div>Links: {result.internalLinks} internal, {result.externalLinks} external</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!currentScan && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-12 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-blue-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Analyze Your Website?</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Enter a website URL above to start your comprehensive SEO analysis with intelligent crawling and detailed insights.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="bg-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-blue-900 mb-2">Smart Discovery</h4>
                  <p className="text-sm text-blue-700">Automatically finds pages via sitemaps and internal links</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
                  <div className="bg-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-purple-900 mb-2">Deep Analysis</h4>
                  <p className="text-sm text-purple-700">Comprehensive technical and content SEO evaluation</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                  <div className="bg-green-600 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-bold text-green-900 mb-2">Actionable Insights</h4>
                  <p className="text-sm text-green-700">Get prioritized recommendations to improve rankings</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}