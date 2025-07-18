import React from 'react';
import { Globe, Clock, CheckCircle } from 'lucide-react';

interface CrawlProgressProps {
  isActive: boolean;
  currentPage: string;
  pagesFound: number;
  pagesCrawled: number;
}

export const CrawlProgress: React.FC<CrawlProgressProps> = ({
  isActive,
  currentPage,
  pagesFound,
  pagesCrawled
}) => {
  if (!isActive) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Globe className="w-5 h-5 text-white animate-spin" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Crawling Website</h3>
          <p className="text-sm text-gray-600">Analyzing pages and gathering SEO data...</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{pagesCrawled} / {pagesFound} pages</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${pagesFound > 0 ? (pagesCrawled / pagesFound) * 100 : 0}%` }}
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="truncate">Currently analyzing: {currentPage}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">{pagesCrawled} pages analyzed</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-gray-600">{pagesFound} pages found</span>
          </div>
        </div>
      </div>
    </div>
  );
};