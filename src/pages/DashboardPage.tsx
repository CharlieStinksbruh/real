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
  MessageCircle,
  Activity
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">SEO Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}. Let's analyse your website's SEO performance.
          </p>
        </div>

        {/* Scan Input */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Start New Analysis</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="url"
                  placeholder="https://example.co.uk"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  disabled={isScanning}
                />
              </div>
              <Button 
                onClick={handleStartScan}
                disabled={!domain || isScanning}
                loading={isScanning}
                className="sm:w-auto"
              >
                {isScanning ? 'Scanning...' : 'Start Analysis'}
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Enter your website URL to begin comprehensive SEO analysis including sitemap discovery and internal link crawling.
            </p>
          </CardContent>
        </Card>

        {/* Scan Progress */}
        {currentScan && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <h2 className="text-xl font-semibold">Scanning: {currentScan.domain}</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {currentScan.status === 'completed' ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{currentScan.scannedPages} / {currentScan.totalPages} pages</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: currentScan.totalPages > 0 
                            ? `${(currentScan.scannedPages / currentScan.totalPages) * 100}%` 
                            : '0%' 
                        }}
                      ></div>
                    </div>
                  </div>

                  {currentScan.results.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-blue-600 font-medium">Pages Scanned</p>
                            <p className="text-2xl font-bold text-blue-700">{currentScan.results.length}</p>
                          </div>
                          <Eye className="h-8 w-8 text-blue-500" />
                        </div>
                      </div>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-green-600 font-medium">Average Score</p>
                            <p className="text-2xl font-bold text-green-700">
                              {Math.round(currentScan.results.reduce((acc, r) => acc + r.score, 0) / currentScan.results.length)}
                            </p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-green-500" />
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-yellow-600 font-medium">Issues Found</p>
                            <p className="text-2xl font-bold text-yellow-700">
                              {currentScan.results.reduce((acc, r) => acc + r.issues.length, 0)}
                            </p>
                          </div>
                          <AlertTriangle className="h-8 w-8 text-yellow-500" />
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-purple-600 font-medium">Internal Links</p>
                            <p className="text-2xl font-bold text-purple-700">
                              {currentScan.results.reduce((acc, r) => acc + r.internalLinks, 0)}
                            </p>
                          </div>
                          <BarChart3 className="h-8 w-8 text-purple-500" />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Live Feedback Panel */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">Live Feedback</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {crawlFeedback.length === 0 ? (
                      <p className="text-gray-500 text-sm">Scan feedback will appear here...</p>
                    ) : (
                      crawlFeedback.slice(-10).reverse().map((feedback, index) => (
                        <div key={index} className="flex items-start space-x-2 text-sm">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            feedback.type === 'success' ? 'bg-green-500' :
                            feedback.type === 'warning' ? 'bg-yellow-500' :
                            feedback.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 truncate">{feedback.stage}</span>
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
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Detailed Crawl Log */}
        {crawlFeedback.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">Detailed Crawl Log</h2>
                </div>
                <span className="text-sm text-gray-500">{crawlFeedback.length} events</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {crawlFeedback.map((feedback, index) => (
                  <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
                    feedback.type === 'success' ? 'bg-green-50' :
                    feedback.type === 'warning' ? 'bg-yellow-50' :
                    feedback.type === 'error' ? 'bg-red-50' : 'bg-blue-50'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      feedback.type === 'success' ? 'bg-green-500' :
                      feedback.type === 'warning' ? 'bg-yellow-500' :
                      feedback.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${
                          feedback.type === 'success' ? 'text-green-900' :
                          feedback.type === 'warning' ? 'text-yellow-900' :
                          feedback.type === 'error' ? 'text-red-900' : 'text-blue-900'
                        }`}>
                          {feedback.stage}
                        </span>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{feedback.timestamp}</span>
                      </div>
                      <p className={`text-sm mt-1 ${
                        feedback.type === 'success' ? 'text-green-700' :
                        feedback.type === 'warning' ? 'text-yellow-700' :
                        feedback.type === 'error' ? 'text-red-700' : 'text-gray-600'
                      }`}>
                        {feedback.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Table */}
        {currentScan && currentScan.results.length > 0 && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Analysis Results</h2>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">URL</th>
                      <th className="text-left py-3 px-4">Score</th>
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Issues</th>
                      <th className="text-left py-3 px-4">Load Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentScan.results.map((result) => (
                      <tr key={result.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            {result.status === 200 ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-xs">
                              {result.url}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <span className={`font-semibold ${
                              result.score >= 80 ? 'text-green-600' :
                              result.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {result.score}
                            </span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
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
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900 truncate max-w-xs block">
                            {result.title || 'No title'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-1">
                            {result.issues.filter(i => i.type === 'error').length > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                {result.issues.filter(i => i.type === 'error').length} errors
                              </span>
                            )}
                            {result.issues.filter(i => i.type === 'warning').length > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                {result.issues.filter(i => i.type === 'warning').length} warnings
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`text-sm ${
                            result.loadTime < 1000 ? 'text-green-600' :
                            result.loadTime < 2000 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {Math.round(result.loadTime)}ms
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!currentScan && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No scans yet</h3>
              <p className="text-gray-600 mb-6">
                Enter a website URL above to start your first comprehensive SEO analysis.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Search className="h-6 w-6 text-blue-600 mb-2" />
                  <h4 className="font-medium text-blue-900">Discover Pages</h4>
                  <p className="text-sm text-blue-700">Automatically finds all pages via sitemap and internal links</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-purple-600 mb-2" />
                  <h4 className="font-medium text-purple-900">Analyse SEO</h4>
                  <p className="text-sm text-purple-700">Comprehensive technical and content analysis</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 mb-2" />
                  <h4 className="font-medium text-green-900">Get Insights</h4>
                  <p className="text-sm text-green-700">Actionable recommendations to improve rankings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}