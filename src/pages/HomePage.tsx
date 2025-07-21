import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Target,
  TrendingUp,
  Award,
  Sparkles,
  Play,
  ChevronRight,
  Eye,
  Clock,
  Activity
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export function HomePage() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      quote: "AnalyseThat helped us identify critical SEO issues we didn't even know existed. Our organic traffic increased by 340% in just 6 months.",
      author: "Sarah Johnson",
      title: "Marketing Director",
      company: "TechStart UK",
      avatar: "SJ"
    },
    {
      quote: "The automated scanning saves us hours every week. The insights are spot-on and the recommendations actually work.",
      author: "Michael Chen",
      title: "SEO Manager", 
      company: "London Retail Group",
      avatar: "MC"
    },
    {
      quote: "Finally, an SEO tool that understands UK businesses. The local SEO insights are particularly valuable for our regional expansion.",
      author: "Emma Thompson",
      title: "Digital Marketing Lead",
      company: "Northern Foods",
      avatar: "ET"
    }
  ];

  const features = [
    {
      icon: <Search className="w-8 h-8 text-blue-600" />,
      title: "Intelligent Site Crawling",
      description: "Advanced crawler discovers every page through sitemaps, internal links, and intelligent content mapping",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Comprehensive Analysis",
      description: "Deep technical SEO audits covering meta tags, performance, mobile optimization, and content quality",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Target className="w-8 h-8 text-green-600" />,
      title: "Actionable Insights",
      description: "Prioritized recommendations with clear impact levels and step-by-step implementation guidance",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Performance Monitoring",
      description: "Core Web Vitals tracking with detailed performance metrics and optimization suggestions",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Shield className="w-8 h-8 text-indigo-600" />,
      title: "Technical SEO Audit",
      description: "Complete technical analysis including structured data, security, and crawlability assessment",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Globe className="w-8 h-8 text-teal-600" />,
      title: "International SEO",
      description: "Multi-language and multi-region optimization with hreflang and geo-targeting analysis",
      gradient: "from-teal-500 to-cyan-500"
    }
  ];

  const stats = [
    { number: "500K+", label: "Pages Analyzed", icon: <Eye className="w-6 h-6" /> },
    { number: "10K+", label: "Websites Audited", icon: <Globe className="w-6 h-6" /> },
    { number: "95%", label: "Issue Detection Rate", icon: <Target className="w-6 h-6" /> },
    { number: "24/7", label: "Monitoring Available", icon: <Clock className="w-6 h-6" /> }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className={`relative max-w-7xl mx-auto px-6 py-20 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Logo Animation */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-3xl shadow-2xl animate-bounce">
              <BarChart3 className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-7xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              AnalyseThat
            </h1>
          </div>
          
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-blue-200 font-medium">
              <Sparkles className="w-5 h-5" />
              The UK's Most Advanced SEO Platform
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Dominate Search Results with
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> AI-Powered</span>
            <br />SEO Intelligence
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            Discover, analyze, and optimize your website's SEO performance with our revolutionary 
            sitemap crawling technology and comprehensive reporting suite.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-gray-900 font-bold text-lg px-12 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300">
                <Sparkles className="mr-3 h-6 w-6" />
                Start Free Analysis
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            
            <button className="flex items-center gap-3 text-white hover:text-blue-200 font-semibold text-lg transition-colors group">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full group-hover:bg-white/30 transition-colors">
                <Play className="w-6 h-6" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                  <div className="text-blue-300 mb-3 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-blue-200 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 rounded-full px-6 py-3 font-semibold mb-6">
              <Award className="w-5 h-5" />
              Award-Winning Technology
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> SEO Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform automatically discovers and analyzes every page on your website, 
              providing actionable insights to boost your search rankings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:text-purple-600 transition-colors">
                    Learn more
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-blue-500/5 to-purple-500/10"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white rounded-full px-6 py-3 font-semibold mb-6">
              <Users className="w-5 h-5" />
              Trusted by 10,000+ Businesses
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              See What Our Customers Say
            </h2>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 max-w-4xl mx-auto">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <blockquote className="text-2xl text-white font-medium mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div className="text-left">
                  <div className="text-white font-bold text-lg">{testimonials[currentTestimonial].author}</div>
                  <div className="text-blue-200">{testimonials[currentTestimonial].title}</div>
                  <div className="text-blue-300 font-semibold">{testimonials[currentTestimonial].company}</div>
                </div>
              </div>
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 to-red-600/20"></div>
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white rounded-full px-6 py-3 font-semibold mb-6">
              <TrendingUp className="w-5 h-5" />
              Join the SEO Revolution
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Dominate Search Results?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto">
              Join thousands of UK businesses using AnalyseThat to improve their SEO performance. 
              Start your free analysis today and see the difference our advanced technology can make.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link to="/register">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 font-bold text-lg px-12 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300">
                <Sparkles className="mr-3 h-6 w-6" />
                Start Your Free Trial
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
            
            <div className="text-white/90 text-sm">
              No credit card required • 14-day free trial
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>No Setup Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}