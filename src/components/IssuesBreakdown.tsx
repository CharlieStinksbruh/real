import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Filter, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SEOIssue } from '../types/seo';

interface IssuesBreakdownProps {
  issues: SEOIssue[];
}

export const IssuesBreakdown: React.FC<IssuesBreakdownProps> = ({ issues }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const categories = ['all', ...new Set(issues.map(issue => issue.category))];
  const impacts = ['all', 'critical', 'high', 'medium', 'low'];
  const types = ['all', 'error', 'warning', 'success'];

  const filteredIssues = issues.filter(issue => {
    return (selectedCategory === 'all' || issue.category === selectedCategory) &&
           (selectedImpact === 'all' || issue.impact === selectedImpact) &&
           (selectedType === 'all' || issue.type === selectedType);
  });

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    const styles = {
      critical: 'bg-red-100 text-red-800 border border-red-200',
      high: 'bg-orange-100 text-orange-800 border border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border border-blue-200'
    };
    return `px-3 py-1 rounded-full text-xs font-semibold ${styles[impact as keyof typeof styles]}`;
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'critical':
      case 'high':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'medium':
        return <Minus className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <TrendingDown className="w-4 h-4 text-blue-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Technical': 'blue',
      'Content': 'green',
      'Performance': 'yellow',
      'Mobile': 'purple',
      'Accessibility': 'indigo',
      'Social': 'pink',
      'Security': 'red',
      'International': 'teal'
    };
    return colors[category as keyof typeof colors] || 'gray';
  };

  const issueStats = {
    total: issues.length,
    errors: issues.filter(i => i.type === 'error').length,
    warnings: issues.filter(i => i.type === 'warning').length,
    success: issues.filter(i => i.type === 'success').length,
    critical: issues.filter(i => i.impact === 'critical').length,
    high: issues.filter(i => i.impact === 'high').length,
    medium: issues.filter(i => i.impact === 'medium').length,
    low: issues.filter(i => i.impact === 'low').length
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">SEO Issues & Recommendations</h3>
        
        {/* Issue Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 text-center border border-gray-200">
            <div className="text-2xl font-bold text-gray-900 mb-1">{issueStats.total}</div>
            <div className="text-xs text-gray-600 font-medium">Total Issues</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 text-center border border-red-200">
            <div className="text-2xl font-bold text-red-600 mb-1">{issueStats.errors}</div>
            <div className="text-xs text-red-700 font-medium">Errors</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 text-center border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{issueStats.warnings}</div>
            <div className="text-xs text-yellow-700 font-medium">Warnings</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">{issueStats.success}</div>
            <div className="text-xs text-green-700 font-medium">Success</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 text-center border border-red-200">
            <div className="text-2xl font-bold text-red-600 mb-1">{issueStats.critical}</div>
            <div className="text-xs text-red-700 font-medium">Critical</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center border border-orange-200">
            <div className="text-2xl font-bold text-orange-600 mb-1">{issueStats.high}</div>
            <div className="text-xs text-orange-700 font-medium">High Impact</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 text-center border border-yellow-200">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{issueStats.medium}</div>
            <div className="text-xs text-yellow-700 font-medium">Medium</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">{issueStats.low}</div>
            <div className="text-xs text-blue-700 font-medium">Low Impact</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <select
            value={selectedImpact}
            onChange={(e) => setSelectedImpact(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {impacts.map(impact => (
              <option key={impact} value={impact}>
                {impact === 'all' ? 'All Impact Levels' : `${impact.charAt(0).toUpperCase() + impact.slice(1)} Impact`}
              </option>
            ))}
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : `${type.charAt(0).toUpperCase() + type.slice(1)}s`}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-600 ml-auto">
            Showing {filteredIssues.length} of {issues.length} issues
          </div>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filteredIssues.map((issue, index) => {
          const categoryColor = getCategoryColor(issue.category);
          return (
            <div key={index} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
              <div className="flex items-start gap-4">
                {getIssueIcon(issue.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <h4 className="font-semibold text-gray-900 text-lg">{issue.issue}</h4>
                    <div className="flex items-center gap-2">
                      {getImpactIcon(issue.impact)}
                      <span className={getImpactBadge(issue.impact)}>
                        {issue.impact} impact
                      </span>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full bg-${categoryColor}-100 text-${categoryColor}-800 border border-${categoryColor}-200`}>
                      {issue.category}
                    </span>
                    {issue.count && (
                      <span className="text-xs text-blue-600 bg-blue-100 px-3 py-1 rounded-full font-semibold border border-blue-200">
                        {issue.count} affected {issue.count === 1 ? 'page' : 'pages'}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed font-medium">{issue.suggestion}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredIssues.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Issues Found</h3>
          <p className="text-gray-600">No issues match your current filter criteria.</p>
        </div>
      )}
    </div>
  );
};