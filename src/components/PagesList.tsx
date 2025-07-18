import React, { useState } from 'react';
import { ChevronDown, ChevronRight, ExternalLink, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { PageAnalysis } from '../types/seo';

interface PagesListProps {
  pages: PageAnalysis[];
}

export const PagesList: React.FC<PagesListProps> = ({ pages }) => {
  const [expandedPage, setExpandedPage] = useState<string | null>(null);

  const getStatusColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600 bg-green-100';
    if (statusCode >= 300 && statusCode < 400) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getLoadTimeColor = (loadTime: number) => {
    if (loadTime < 1) return 'text-green-600';
    if (loadTime < 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const toggleExpanded = (url: string) => {
    setExpandedPage(expandedPage === url ? null : url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Crawled Pages ({pages.length})</h3>
      
      <div className="space-y-2">
        {pages.map((page, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <div 
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => toggleExpanded(page.url)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {expandedPage === page.url ? (
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{page.title}</h4>
                      <a
                        href={page.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{page.url}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(page.statusCode)}`}>
                    {page.statusCode}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className={`text-xs font-medium ${getLoadTimeColor(page.loadTime)}`}>
                      {page.loadTime.toFixed(1)}s
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {expandedPage === page.url && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Title Length</p>
                    <div className="flex items-center gap-1">
                      {page.titleLength >= 30 && page.titleLength <= 60 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      )}
                      <span className="text-xs font-medium">
                        {page.titleLength} chars
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Meta Description</p>
                    <div className="flex items-center gap-1">
                      {page.metaDescriptionLength >= 120 && page.metaDescriptionLength <= 160 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      )}
                      <span className="text-xs font-medium">
                        {page.metaDescriptionLength > 0 ? `${page.metaDescriptionLength} chars` : 'Missing'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">H1 Tags</p>
                    <div className="flex items-center gap-1">
                      {page.h1Count === 1 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-yellow-500" />
                      )}
                      <span className="text-xs font-medium">{page.h1Count}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Word Count</p>
                    <div className="flex items-center gap-1">
                      {page.wordCount >= 300 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-yellow-500" />
                      )}
                      <span className="text-xs font-medium">{page.wordCount}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Page Size</p>
                    <div className="flex items-center gap-1">
                      {page.pageSize < 1000000 ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      )}
                      <span className="text-xs font-medium">{(page.pageSize / 1024).toFixed(1)}KB</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Images</p>
                    <span className="text-xs font-medium">
                      {page.imageCount} total, {page.imagesWithoutAlt} without alt
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Headings</p>
                    <span className="text-xs font-medium">
                      H2: {page.h2Count}, H3: {page.h3Count}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Internal Links</p>
                    <span className="text-xs font-medium">{page.internalLinks}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">External Links</p>
                    <span className="text-xs font-medium">{page.externalLinks}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Core Web Vitals</p>
                    <div className="space-y-1">
                      <div className="text-xs">
                        <span className="text-gray-500">LCP:</span>
                        <span className={`ml-1 font-medium ${page.coreWebVitals.lcp < 2500 ? 'text-green-600' : page.coreWebVitals.lcp < 4000 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {(page.coreWebVitals.lcp / 1000).toFixed(1)}s
                        </span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-500">CLS:</span>
                        <span className={`ml-1 font-medium ${page.coreWebVitals.cls < 0.1 ? 'text-green-600' : page.coreWebVitals.cls < 0.25 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {page.coreWebVitals.cls.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Technical SEO</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {page.canonicalUrl ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className="text-xs">Canonical URL</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {page.viewport ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className="text-xs">Mobile Viewport</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {page.schemaMarkup.length > 0 ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-400" />
                        )}
                        <span className="text-xs">Schema Markup ({page.schemaMarkup.length})</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Social Media</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {page.ogTitle ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className="text-xs">Open Graph Title</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {page.ogDescription ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500" />
                        )}
                        <span className="text-xs">OG Description</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {page.twitterCard ? (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        ) : (
                          <XCircle className="w-3 h-3 text-gray-400" />
                        )}
                        <span className="text-xs">Twitter Card</span>
                      </div>
                    </div>
                  </div>
                </div>

                {(page.hreflang.length > 0 || page.metaKeywords || page.favicon) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">International SEO</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {page.hreflang.length > 0 ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <XCircle className="w-3 h-3 text-gray-400" />
                          )}
                          <span className="text-xs">Hreflang ({page.hreflang.length})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {page.favicon ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-500" />
                          )}
                          <span className="text-xs">Favicon</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Additional Meta</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {page.metaKeywords ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <XCircle className="w-3 h-3 text-gray-400" />
                          )}
                          <span className="text-xs">Meta Keywords</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {page.lang ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <XCircle className="w-3 h-3 text-red-500" />
                          )}
                          <span className="text-xs">Language Declaration</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {page.h1Text.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">H1 Content</p>
                    <div className="space-y-1">
                      {page.h1Text.map((h1, idx) => (
                        <p key={idx} className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {h1}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};