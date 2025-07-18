import React from 'react';
import { FileText, Type, Image, Hash, BarChart3, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { PageAnalysis } from '../types/seo';

interface ContentAnalysisProps {
  pages: PageAnalysis[];
}

export const ContentAnalysis: React.FC<ContentAnalysisProps> = ({ pages }) => {
  const successfulPages = pages.filter(p => p.statusCode === 200);
  
  const contentStats = {
    avgWordCount: Math.round(successfulPages.reduce((sum, p) => sum + p.wordCount, 0) / successfulPages.length || 0),
    totalWords: successfulPages.reduce((sum, p) => sum + p.wordCount, 0),
    avgTitleLength: Math.round(successfulPages.reduce((sum, p) => sum + p.titleLength, 0) / successfulPages.length || 0),
    avgMetaLength: Math.round(successfulPages.reduce((sum, p) => sum + p.metaDescriptionLength, 0) / successfulPages.length || 0),
    totalImages: successfulPages.reduce((sum, p) => sum + p.imageCount, 0),
    imagesWithoutAlt: successfulPages.reduce((sum, p) => sum + p.imagesWithoutAlt, 0),
    pagesWithoutMeta: successfulPages.filter(p => !p.metaDescription).length,
    shortContent: successfulPages.filter(p => p.wordCount < 300).length,
    longContent: successfulPages.filter(p => p.wordCount > 2000).length,
    noH1: successfulPages.filter(p => p.h1Count === 0).length,
    multipleH1: successfulPages.filter(p => p.h1Count > 1).length,
    properH1: successfulPages.filter(p => p.h1Count === 1).length
  };

  const getScoreColor = (value: number, good: number, warning: number) => {
    if (value >= good) return 'text-green-600';
    if (value >= warning) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getContentQualityScore = (page: PageAnalysis) => {
    let score = 100;
    if (page.wordCount < 300) score -= 20;
    if (!page.metaDescription) score -= 15;
    if (page.h1Count !== 1) score -= 10;
    if (page.titleLength < 30 || page.titleLength > 60) score -= 10;
    if (page.imagesWithoutAlt > 0) score -= Math.min(page.imagesWithoutAlt * 5, 20);
    return Math.max(0, score);
  };

  const contentQualityDistribution = {
    excellent: successfulPages.filter(p => getContentQualityScore(p) >= 90).length,
    good: successfulPages.filter(p => getContentQualityScore(p) >= 70 && getContentQualityScore(p) < 90).length,
    fair: successfulPages.filter(p => getContentQualityScore(p) >= 50 && getContentQualityScore(p) < 70).length,
    poor: successfulPages.filter(p => getContentQualityScore(p) < 50).length
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Content Quality Analysis</h3>
        
        {/* Content Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center border border-blue-200">
            <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{contentStats.avgWordCount}</div>
            <div className="text-xs text-blue-700 font-medium">Avg Word Count</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200">
            <Type className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{contentStats.avgTitleLength}</div>
            <div className="text-xs text-green-700 font-medium">Avg Title Length</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center border border-purple-200">
            <Hash className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{contentStats.avgMetaLength}</div>
            <div className="text-xs text-purple-700 font-medium">Avg Meta Length</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center border border-orange-200">
            <Image className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{contentStats.totalImages}</div>
            <div className="text-xs text-orange-700 font-medium">Total Images</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 text-center border border-red-200">
            <AlertTriangle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{contentStats.imagesWithoutAlt}</div>
            <div className="text-xs text-red-700 font-medium">Missing Alt Text</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 text-center border border-indigo-200">
            <BarChart3 className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-indigo-600">{(contentStats.totalWords / 1000).toFixed(1)}K</div>
            <div className="text-xs text-indigo-700 font-medium">Total Words</div>
          </div>
        </div>

        {/* Content Quality Distribution */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-gray-600" />
            <h4 className="font-semibold text-gray-900 text-lg">Content Quality Distribution</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-100 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">{contentQualityDistribution.excellent}</div>
              <div className="text-sm font-medium text-green-700">Excellent (90-100)</div>
              <div className="text-xs text-green-600 mt-1">
                {((contentQualityDistribution.excellent / successfulPages.length) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{contentQualityDistribution.good}</div>
              <div className="text-sm font-medium text-blue-700">Good (70-89)</div>
              <div className="text-xs text-blue-600 mt-1">
                {((contentQualityDistribution.good / successfulPages.length) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-100 rounded-xl border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{contentQualityDistribution.fair}</div>
              <div className="text-sm font-medium text-yellow-700">Fair (50-69)</div>
              <div className="text-xs text-yellow-600 mt-1">
                {((contentQualityDistribution.fair / successfulPages.length) * 100).toFixed(1)}%
              </div>
            </div>
            <div className="text-center p-4 bg-red-100 rounded-xl border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-2">{contentQualityDistribution.poor}</div>
              <div className="text-sm font-medium text-red-700">Poor (0-49)</div>
              <div className="text-xs text-red-600 mt-1">
                {((contentQualityDistribution.poor / successfulPages.length) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Content Issues Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 border border-red-200">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h4 className="font-semibold text-red-900">Content Issues</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-700">Missing Meta Descriptions</span>
                <span className="text-xl font-bold text-red-600">{contentStats.pagesWithoutMeta}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-700">Thin Content (&lt;300 words)</span>
                <span className="text-xl font-bold text-red-600">{contentStats.shortContent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-700">Missing H1 Tags</span>
                <span className="text-xl font-bold text-red-600">{contentStats.noH1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-700">Multiple H1 Tags</span>
                <span className="text-xl font-bold text-red-600">{contentStats.multipleH1}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 border border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <Image className="w-6 h-6 text-yellow-600" />
              <h4 className="font-semibold text-yellow-900">Image Optimization</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-700">Total Images</span>
                <span className="text-xl font-bold text-yellow-600">{contentStats.totalImages}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-700">Missing Alt Text</span>
                <span className="text-xl font-bold text-yellow-600">{contentStats.imagesWithoutAlt}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-700">Alt Text Coverage</span>
                <span className={`text-xl font-bold ${getScoreColor(
                  ((contentStats.totalImages - contentStats.imagesWithoutAlt) / contentStats.totalImages) * 100,
                  90, 70
                )}`}>
                  {contentStats.totalImages > 0 ? 
                    (((contentStats.totalImages - contentStats.imagesWithoutAlt) / contentStats.totalImages) * 100).toFixed(1) : 0}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-yellow-700">Avg Images per Page</span>
                <span className="text-xl font-bold text-yellow-600">
                  {(contentStats.totalImages / successfulPages.length).toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h4 className="font-semibold text-green-900">Content Strengths</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Proper H1 Structure</span>
                <span className="text-xl font-bold text-green-600">{contentStats.properH1}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Rich Content (&gt;2000 words)</span>
                <span className="text-xl font-bold text-green-600">{contentStats.longContent}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">With Meta Descriptions</span>
                <span className="text-xl font-bold text-green-600">
                  {successfulPages.length - contentStats.pagesWithoutMeta}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Adequate Content (&gt;300 words)</span>
                <span className="text-xl font-bold text-green-600">
                  {successfulPages.length - contentStats.shortContent}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Recommendations */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-gray-900 text-lg">Content Optimization Recommendations</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-800">High Priority Actions</h5>
              
              {contentStats.pagesWithoutMeta > 0 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Add Meta Descriptions</p>
                    <p className="text-sm text-red-700">
                      {contentStats.pagesWithoutMeta} pages are missing meta descriptions. 
                      Write compelling 150-160 character descriptions for better CTR.
                    </p>
                  </div>
                </div>
              )}

              {contentStats.shortContent > 0 && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">Expand Thin Content</p>
                    <p className="text-sm text-orange-700">
                      {contentStats.shortContent} pages have less than 300 words. 
                      Add more valuable, relevant content to improve rankings.
                    </p>
                  </div>
                </div>
              )}

              {contentStats.noH1 > 0 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Add H1 Tags</p>
                    <p className="text-sm text-red-700">
                      {contentStats.noH1} pages are missing H1 tags. 
                      Add descriptive H1 headings to improve content structure.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-800">Medium Priority Actions</h5>
              
              {contentStats.imagesWithoutAlt > 0 && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Optimize Image Alt Text</p>
                    <p className="text-sm text-yellow-700">
                      {contentStats.imagesWithoutAlt} images are missing alt text. 
                      Add descriptive alt attributes for better accessibility and SEO.
                    </p>
                  </div>
                </div>
              )}

              {contentStats.multipleH1 > 0 && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Fix Multiple H1 Tags</p>
                    <p className="text-sm text-yellow-700">
                      {contentStats.multipleH1} pages have multiple H1 tags. 
                      Use only one H1 per page for proper heading hierarchy.
                    </p>
                  </div>
                </div>
              )}

              {contentStats.avgWordCount < 500 && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Increase Content Depth</p>
                    <p className="text-sm text-blue-700">
                      Average word count is {contentStats.avgWordCount}. 
                      Consider adding more comprehensive, valuable content to key pages.
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