import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  BarChart3, 
  Shield, 
  Zap, 
  Users, 
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The UK's Most
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent"> Comprehensive</span>
              <br />SEO Analysis Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover, analyse, and optimise your website's SEO performance with our advanced sitemap crawling and comprehensive reporting tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
                View Demo
              </Button>
            </div>
            <p className="mt-4 text-blue-200">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for SEO Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform automatically discovers and analyses every page on your website, providing actionable insights to boost your search rankings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Intelligent Crawling</h3>
                <p className="text-gray-600">
                  Automatically discovers URLs from your sitemap and follows internal links to find every page on your website.
                </p>
              </CardContent>
            </Card>

            <Card hover className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Comprehensive Analysis</h3>
                <p className="text-gray-600">
                  Detailed SEO audits covering meta tags, headers, images, internal linking, and technical performance metrics.
                </p>
              </CardContent>
            </Card>

            <Card hover className="text-center">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Actionable Insights</h3>
                <p className="text-gray-600">
                  Get prioritised recommendations and step-by-step guidance to fix SEO issues and improve your rankings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Built for UK Businesses by SEO Experts
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform understands the unique challenges of UK businesses, from local SEO to international expansion.
              </p>
              
              <div className="space-y-4">
                {[
                  'Automated sitemap discovery and link following',
                  'Real-time scanning with progress tracking',
                  'Comprehensive technical SEO analysis',
                  'Competitor benchmarking and insights',
                  'White-label reporting for agencies',
                  'GDPR-compliant data handling'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">SEO Score</h3>
                    <span className="text-2xl font-bold text-green-600">94/100</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Technical SEO</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Content Quality</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">User Experience</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading UK Businesses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "AnalyseThat helped us identify critical SEO issues we didn't even know existed. Our organic traffic increased by 340% in just 6 months.",
                author: "Sarah Johnson",
                title: "Marketing Director, TechStart UK"
              },
              {
                quote: "The automated scanning saves us hours every week. The insights are spot-on and the recommendations actually work.",
                author: "Michael Chen",
                title: "SEO Manager, London Retail Group"
              },
              {
                quote: "Finally, an SEO tool that understands UK businesses. The local SEO insights are particularly valuable for our regional expansion.",
                author: "Emma Thompson",
                title: "Digital Marketing Lead, Northern Foods"
              }
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Dominate Search Results?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of UK businesses using AnalyseThat to improve their SEO performance.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}