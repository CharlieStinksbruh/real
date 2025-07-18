import React from 'react';
import { Share2, Facebook, Twitter, Instagram, Linkedin, MessageCircle, Eye, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { PageAnalysis } from '../types/seo';

interface SocialMediaAnalysisProps {
  pages: PageAnalysis[];
}

export const SocialMediaAnalysis: React.FC<SocialMediaAnalysisProps> = ({ pages }) => {
  const successfulPages = pages.filter(p => p.statusCode === 200);
  
  const socialStats = {
    withOGTitle: successfulPages.filter(p => p.ogTitle).length,
    withOGDescription: successfulPages.filter(p => p.ogDescription).length,
    withOGImage: successfulPages.filter(p => p.ogImage).length,
    withTwitterCard: successfulPages.filter(p => p.twitterCard).length,
    completeOG: successfulPages.filter(p => p.ogTitle && p.ogDescription && p.ogImage).length,
    completeSocial: successfulPages.filter(p => p.ogTitle && p.ogDescription && p.ogImage && p.twitterCard).length,
    avgOGTitleLength: Math.round(successfulPages.filter(p => p.ogTitle).reduce((sum, p) => sum + p.ogTitle.length, 0) / successfulPages.filter(p => p.ogTitle).length || 0),
    avgOGDescLength: Math.round(successfulPages.filter(p => p.ogDescription).reduce((sum, p) => sum + p.ogDescription.length, 0) / successfulPages.filter(p => p.ogDescription).length || 0)
  };

  const getSocialScore = (page: PageAnalysis) => {
    let score = 0;
    if (page.ogTitle) score += 25;
    if (page.ogDescription) score += 25;
    if (page.ogImage) score += 25;
    if (page.twitterCard) score += 25;
    return score;
  };

  const socialScoreDistribution = {
    complete: successfulPages.filter(p => getSocialScore(p) === 100).length,
    good: successfulPages.filter(p => getSocialScore(p) >= 75 && getSocialScore(p) < 100).length,
    partial: successfulPages.filter(p => getSocialScore(p) >= 25 && getSocialScore(p) < 75).length,
    none: successfulPages.filter(p => getSocialScore(p) === 0).length
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
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Social Media Optimization Analysis</h3>
        
        {/* Social Media Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center border border-blue-200">
            <Facebook className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${getScoreColor(socialStats.withOGTitle, successfulPages.length)}`}>
              {socialStats.withOGTitle}
            </div>
            <div className="text-xs text-blue-700 font-medium">OG Titles</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200">
            <MessageCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${getScoreColor(socialStats.withOGDescription, successfulPages.length)}`}>
              {socialStats.withOGDescription}
            </div>
            <div className="text-xs text-green-700 font-medium">OG Descriptions</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center border border-purple-200">
            <Eye className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${getScoreColor(socialStats.withOGImage, successfulPages.length)}`}>
              {socialStats.withOGImage}
            </div>
            <div className="text-xs text-purple-700 font-medium">OG Images</div>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-4 text-center border border-cyan-200">
            <Twitter className="w-6 h-6 text-cyan-600 mx-auto mb-2" />
            <div className={`text-2xl font-bold ${getScoreColor(socialStats.withTwitterCard, successfulPages.length)}`}>
              {socialStats.withTwitterCard}
            </div>
            <div className="text-xs text-cyan-700 font-medium">Twitter Cards</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center border border-orange-200">
            <Share2 className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{socialStats.completeOG}</div>
            <div className="text-xs text-orange-700 font-medium">Complete OG</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-4 text-center border border-indigo-200">
            <TrendingUp className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-indigo-600">{socialStats.completeSocial}</div>
            <div className="text-xs text-indigo-700 font-medium">Fully Optimized</div>
          </div>
        </div>

        {/* Social Media Optimization Score Distribution */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Share2 className="w-6 h-6 text-gray-600" />
            <h4 className="font-semibold text-gray-900 text-lg">Social Media Optimization Distribution</h4>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-100 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">{socialScoreDistribution.complete}</div>
              <div className="text-sm font-medium text-green-700">Complete (100%)</div>
              <div className="text-xs text-green-600 mt-1">
                All social tags present
              </div>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">{socialScoreDistribution.good}</div>
              <div className="text-sm font-medium text-blue-700">Good (75-99%)</div>
              <div className="text-xs text-blue-600 mt-1">
                Most tags present
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-100 rounded-xl border border-yellow-200">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{socialScoreDistribution.partial}</div>
              <div className="text-sm font-medium text-yellow-700">Partial (25-74%)</div>
              <div className="text-xs text-yellow-600 mt-1">
                Some tags present
              </div>
            </div>
            <div className="text-center p-4 bg-red-100 rounded-xl border border-red-200">
              <div className="text-3xl font-bold text-red-600 mb-2">{socialScoreDistribution.none}</div>
              <div className="text-sm font-medium text-red-700">None (0%)</div>
              <div className="text-xs text-red-600 mt-1">
                No social tags
              </div>
            </div>
          </div>
        </div>

        {/* Open Graph Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <Facebook className="w-6 h-6 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Open Graph Optimization</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">OG Title Coverage</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(socialStats.withOGTitle, successfulPages.length)}`}>
                    {((socialStats.withOGTitle / successfulPages.length) * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm text-blue-600">({socialStats.withOGTitle}/{successfulPages.length})</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">OG Description Coverage</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(socialStats.withOGDescription, successfulPages.length)}`}>
                    {((socialStats.withOGDescription / successfulPages.length) * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm text-blue-600">({socialStats.withOGDescription}/{successfulPages.length})</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">OG Image Coverage</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(socialStats.withOGImage, successfulPages.length)}`}>
                    {((socialStats.withOGImage / successfulPages.length) * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm text-blue-600">({socialStats.withOGImage}/{successfulPages.length})</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-700">Complete OG Setup</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(socialStats.completeOG, successfulPages.length)}`}>
                    {((socialStats.completeOG / successfulPages.length) * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm text-blue-600">({socialStats.completeOG}/{successfulPages.length})</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 border border-cyan-200">
            <div className="flex items-center gap-3 mb-4">
              <Twitter className="w-6 h-6 text-cyan-600" />
              <h4 className="font-semibold text-cyan-900">Twitter Card Optimization</h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-cyan-700">Twitter Card Coverage</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(socialStats.withTwitterCard, successfulPages.length)}`}>
                    {((socialStats.withTwitterCard / successfulPages.length) * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm text-cyan-600">({socialStats.withTwitterCard}/{successfulPages.length})</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-cyan-700">Complete Social Setup</span>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${getScoreColor(socialStats.completeSocial, successfulPages.length)}`}>
                    {((socialStats.completeSocial / successfulPages.length) * 100).toFixed(1)}%
                  </span>
                  <span className="text-sm text-cyan-600">({socialStats.completeSocial}/{successfulPages.length})</span>
                </div>
              </div>
              {socialStats.avgOGTitleLength > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-cyan-700">Avg OG Title Length</span>
                  <span className={`text-lg font-bold ${socialStats.avgOGTitleLength >= 30 && socialStats.avgOGTitleLength <= 60 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {socialStats.avgOGTitleLength} chars
                  </span>
                </div>
              )}
              {socialStats.avgOGDescLength > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-cyan-700">Avg OG Desc Length</span>
                  <span className={`text-lg font-bold ${socialStats.avgOGDescLength >= 120 && socialStats.avgOGDescLength <= 160 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {socialStats.avgOGDescLength} chars
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Social Media Platform Guidelines */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Share2 className="w-6 h-6 text-purple-600" />
            <h4 className="font-semibold text-purple-900 text-lg">Platform-Specific Guidelines</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Facebook className="w-5 h-5 text-blue-600" />
                <h5 className="font-semibold text-gray-800">Facebook</h5>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">• Title: 60-90 characters</div>
                <div className="text-gray-600">• Description: 155-160 characters</div>
                <div className="text-gray-600">• Image: 1200x630px (1.91:1)</div>
                <div className="text-gray-600">• Format: JPG, PNG</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Twitter className="w-5 h-5 text-cyan-600" />
                <h5 className="font-semibold text-gray-800">Twitter</h5>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">• Title: 70 characters max</div>
                <div className="text-gray-600">• Description: 200 characters</div>
                <div className="text-gray-600">• Image: 1200x628px (1.91:1)</div>
                <div className="text-gray-600">• Card types: summary, summary_large_image</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Linkedin className="w-5 h-5 text-blue-700" />
                <h5 className="font-semibold text-gray-800">LinkedIn</h5>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">• Title: 60-90 characters</div>
                <div className="text-gray-600">• Description: 155-160 characters</div>
                <div className="text-gray-600">• Image: 1200x627px (1.91:1)</div>
                <div className="text-gray-600">• Professional content focus</div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <Instagram className="w-5 h-5 text-pink-600" />
                <h5 className="font-semibold text-gray-800">Instagram</h5>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-gray-600">• Uses OG tags for stories</div>
                <div className="text-gray-600">• Image: 1080x1080px (1:1)</div>
                <div className="text-gray-600">• High-quality visuals essential</div>
                <div className="text-gray-600">• Mobile-first approach</div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Recommendations */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h4 className="font-semibold text-gray-900 text-lg">Social Media Optimization Recommendations</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-800">High Priority Actions</h5>
              
              {socialStats.withOGTitle < successfulPages.length && (
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Missing Open Graph Titles</p>
                    <p className="text-sm text-red-700">
                      {successfulPages.length - socialStats.withOGTitle} pages lack OG titles. 
                      Add compelling og:title tags (60-90 characters) for better social sharing.
                    </p>
                  </div>
                </div>
              )}

              {socialStats.withOGDescription < successfulPages.length && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-orange-900">Missing OG Descriptions</p>
                    <p className="text-sm text-orange-700">
                      {successfulPages.length - socialStats.withOGDescription} pages need og:description tags. 
                      Write engaging descriptions (155-160 characters) to improve click-through rates.
                    </p>
                  </div>
                </div>
              )}

              {socialStats.withOGImage < successfulPages.length && (
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Missing OG Images</p>
                    <p className="text-sm text-red-700">
                      {successfulPages.length - socialStats.withOGImage} pages lack og:image tags. 
                      Add high-quality images (1200x630px) for better visual appeal in social shares.
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h5 className="font-semibold text-gray-800">Enhancement Opportunities</h5>
              
              {socialStats.withTwitterCard < successfulPages.length && (
                <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-900">Twitter Card Optimization</p>
                    <p className="text-sm text-yellow-700">
                      {successfulPages.length - socialStats.withTwitterCard} pages could benefit from Twitter Card tags. 
                      Add twitter:card meta tags for enhanced Twitter sharing experience.
                    </p>
                  </div>
                </div>
              )}

              {socialStats.avgOGTitleLength > 0 && (socialStats.avgOGTitleLength < 30 || socialStats.avgOGTitleLength > 90) && (
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">OG Title Length Optimization</p>
                    <p className="text-sm text-blue-700">
                      Average OG title length is {socialStats.avgOGTitleLength} characters. 
                      Optimize to 60-90 characters for better display across platforms.
                    </p>
                  </div>
                </div>
              )}

              {socialStats.completeSocial > 0 && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Well-Optimized Pages</p>
                    <p className="text-sm text-green-700">
                      {socialStats.completeSocial} pages have complete social media optimization. 
                      Great work! Apply the same approach to remaining pages.
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