import React from 'react';
import { Search, Zap, Shield, TrendingUp, Users, Globe, CheckCircle, Star, ArrowRight, BarChart3, Target, Smartphone, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onStartAnalysis: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStartAnalysis }) => {
  const { user } = useAuth();

  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      title: "Comprehensive Site Crawling",
      description: "Analyze unlimited pages with intelligent sitemap discovery and internal link following"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-green-600" />,
      title: "Advanced SEO Scoring",
      description: "Get detailed scores for technical, content, performance, mobile, and accessibility factors"
    },
    {
      icon: <Target className="w-8 h-8 text-purple-600" />,
      title: "Actionable Insights",
      description: "Receive prioritized recommendations with clear impact levels and implementation guidance"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Performance Analysis",
      description: "Core Web Vitals monitoring with detailed performance metrics and optimization tips"
    },
    {
      icon: <Smartphone className="w-8 h-8 text-indigo-600" />,
      title: "Mobile Optimization",
      description: "Complete mobile-first analysis including viewport, responsive design, and user experience"
    },
    {
      icon: <FileText className="w-8 h-8 text-teal-600" />,
      title: "Content Quality Assessment",
      description: "Analyze content depth, structure, readability, and semantic markup across all pages"
    }
  ];

  const tools = [
    {
      name: "SEO Site Crawler",
      description: "Comprehensive website analysis with unlimited page scanning",
      status: "Available"
    },
    {
      name: "Keyword Research Tool",
      description: "Discover high-value keywords and analyze competition",
      status: "Coming Soon"
    },
    {
      name: "Backlink Analyzer",
      description: "Monitor and analyze your backlink profile",
      status: "Coming Soon"
    },
    {
      name: "Competitor Analysis",
      description: "Compare your SEO performance against competitors",
      status: "Coming Soon"
    },
    {
      name: "Rank Tracker",
      description: "Track keyword rankings across search engines",
      status: "Coming Soon"
    },
    {
      name: "Technical SEO Auditor",
      description: "Deep technical analysis and issue detection",
      status: "Coming Soon"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Digital Marketing Manager",
      company: "TechCorp",
      content: "AnalyseThat helped us identify critical SEO issues across our 500+ page website. The comprehensive analysis saved us weeks of manual work.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "SEO Consultant",
      company: "Growth Agency",
      content: "The depth of analysis is incredible. From technical issues to content optimization, everything is covered with actionable recommendations.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "E-commerce Director",
      company: "RetailPlus",
      content: "Finally, an SEO tool that actually crawls our entire site and provides insights we can act on immediately. Game-changer for our team.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-3xl shadow-2xl">
                <Search className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                AnalyseThat
              </h1>
            </div>
            
            <p className="text-2xl text-gray-600 mb-4 font-medium">
              The Ultimate SEO Analysis Platform
            </p>
            <p className="text-xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed">
              Comprehensive website analysis with unlimited page crawling, advanced SEO scoring, 
              and actionable insights to boost your search engine rankings.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button
                onClick={onStartAnalysis}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-2xl hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-3"
              >
                <Search className="w-6 h-6" />
                Start Free Analysis
                <ArrowRight className="w-5 h-5" />
              </button>
              
              {!user && (
                <div className="text-sm text-gray-500">
                  No signup required • Analyze up to 50 pages free
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">500K+</div>
                <div className="text-gray-600 font-medium">Pages Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">10K+</div>
                <div className="text-gray-600 font-medium">Websites Audited</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-gray-600 font-medium">Issue Detection Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                <div className="text-gray-600 font-medium">Monitoring Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful SEO Analysis Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to optimize your website's search engine performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-blue-200">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Complete SEO Toolkit
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive suite of tools to cover all aspects of SEO optimization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{tool.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    tool.status === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tool.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by SEO Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what our users say about AnalyseThat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-blue-600 font-medium">{testimonial.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Optimize Your Website?
          </h2>
          <p className="text-xl text-blue-100 mb-10 leading-relaxed">
            Start your comprehensive SEO analysis today and discover opportunities 
            to improve your search engine rankings.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={onStartAnalysis}
              className="bg-white text-blue-600 px-12 py-4 rounded-2xl hover:bg-gray-50 focus:ring-4 focus:ring-white/20 transition-all duration-200 font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center gap-3"
            >
              <Search className="w-6 h-6" />
              Analyze Your Website Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Unlimited Pages</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};