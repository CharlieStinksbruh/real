import React, { useState } from 'react';
import { User, Mail, Calendar, Crown, Save, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

export function ProfilePage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Mock save functionality
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your profile and account preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'profile' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <User className="h-4 w-4 inline mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'security' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Shield className="h-4 w-4 inline mr-2" />
                    Security
                  </button>
                  <button
                    onClick={() => setActiveTab('subscription')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeTab === 'subscription' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Crown className="h-4 w-4 inline mr-2" />
                    Subscription
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  <p className="text-gray-600">Update your personal information and preferences</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <User className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <p className="text-gray-600">{user.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {user.role === 'admin' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                              <Crown className="h-3 w-3 mr-1" />
                              Administrator
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {user.subscription || 'Free'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      <Input
                        label="Email address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {new Date(user.createdAt).toLocaleDateString('en-GB')}</span>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSave} className="flex items-center">
                        <Save className="h-4 w-4 mr-2" />
                        {saved ? 'Saved!' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Security Settings</h2>
                  <p className="text-gray-600">Manage your password and security preferences</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Input
                        label="Current password"
                        name="currentPassword"
                        type="password"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        placeholder="Enter current password"
                      />
                      <Input
                        label="New password"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                      />
                      <Input
                        label="Confirm new password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                      />
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Password Requirements</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• At least 8 characters long</li>
                        <li>• Include both uppercase and lowercase letters</li>
                        <li>• Include at least one number</li>
                        <li>• Include at least one special character</li>
                      </ul>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleSave}>Update Password</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'subscription' && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold">Subscription Details</h2>
                  <p className="text-gray-600">Manage your subscription and billing</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900">Free Plan</h4>
                        <p className="text-2xl font-bold text-gray-900 mt-1">£0/month</p>
                        <ul className="text-sm text-gray-600 mt-3 space-y-1">
                          <li>• 5 scans per month</li>
                          <li>• Basic SEO analysis</li>
                          <li>• Email support</li>
                        </ul>
                        {user.subscription === 'free' && (
                          <span className="inline-block mt-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Current Plan
                          </span>
                        )}
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                        <h4 className="font-medium text-blue-900">Pro Plan</h4>
                        <p className="text-2xl font-bold text-blue-900 mt-1">£29/month</p>
                        <ul className="text-sm text-blue-700 mt-3 space-y-1">
                          <li>• Unlimited scans</li>
                          <li>• Advanced SEO analysis</li>
                          <li>• Priority support</li>
                          <li>• Competitor analysis</li>
                        </ul>
                        {user.subscription === 'pro' ? (
                          <span className="inline-block mt-3 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Current Plan
                          </span>
                        ) : (
                          <Button size="sm" className="mt-3">Upgrade</Button>
                        )}
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-900">Enterprise</h4>
                        <p className="text-2xl font-bold text-purple-900 mt-1">£99/month</p>
                        <ul className="text-sm text-purple-700 mt-3 space-y-1">
                          <li>• Everything in Pro</li>
                          <li>• White-label reports</li>
                          <li>• API access</li>
                          <li>• Dedicated support</li>
                        </ul>
                        {user.subscription === 'enterprise' ? (
                          <span className="inline-block mt-3 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            Current Plan
                          </span>
                        ) : (
                          <Button variant="secondary" size="sm" className="mt-3">Upgrade</Button>
                        )}
                      </div>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-900">Next billing date: 15th February 2025</span>
                      </div>
                      <p className="text-sm text-green-700 mt-1">
                        Your subscription will automatically renew unless cancelled.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}