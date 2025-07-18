import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">AnalyseThat</span>
            </div>
            <p className="text-gray-400">
              The most comprehensive SEO analysis platform for UK businesses.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <div className="space-y-2">
              <Link to="/features" className="block text-gray-400 hover:text-white">Features</Link>
              <Link to="/pricing" className="block text-gray-400 hover:text-white">Pricing</Link>
              <Link to="/integrations" className="block text-gray-400 hover:text-white">Integrations</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-400 hover:text-white">About Us</Link>
              <Link to="/careers" className="block text-gray-400 hover:text-white">Careers</Link>
              <Link to="/blog" className="block text-gray-400 hover:text-white">Blog</Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <span>hello@analysethat.co.uk</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+44 20 7946 0958</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>London, United Kingdom</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 AnalyseThat Ltd. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}