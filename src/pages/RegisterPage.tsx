import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const success = await register(formData.email, formData.password, formData.name);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <BarChart3 className="h-10 w-10 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">AnalyseThat</span>
          </Link>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Get started today</h2>
          <p className="mt-2 text-gray-600">Create your account and start analysing</p>
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-center">Create Account</h3>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                name="name"
                label="Full name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Smith"
                required
              />
              
              <Input
                type="email"
                name="email"
                label="Email address"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.co.uk"
                required
              />
              
              <Input
                type="password"
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
              
              <Input
                type="password"
                name="confirmPassword"
                label="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                loading={isLoading}
              >
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="mt-4 text-xs text-gray-500 text-center">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}