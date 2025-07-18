import React, { useState } from 'react';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Search,
  MoreVertical,
  UserPlus,
  Crown,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';

const mockUsers = [
  { id: '1', name: 'John Smith', email: 'john@example.com', role: 'user', subscription: 'pro', lastActive: '2025-01-15', scans: 142 },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@company.co.uk', role: 'user', subscription: 'enterprise', lastActive: '2025-01-14', scans: 89 },
  { id: '3', name: 'Mike Wilson', email: 'mike@startup.com', role: 'user', subscription: 'free', lastActive: '2025-01-13', scans: 12 },
  { id: '4', name: 'Emma Brown', email: 'emma@agency.co.uk', role: 'user', subscription: 'pro', lastActive: '2025-01-12', scans: 67 }
];

export function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <Crown className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600">You need administrator privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = mockUsers.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, monitor platform usage, and configure settings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">1,247</p>
                  <p className="text-sm text-green-600">+12% this month</p>
                </div>
                <Users className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Active Scans</p>
                  <p className="text-3xl font-bold text-gray-900">89</p>
                  <p className="text-sm text-blue-600">Currently running</p>
                </div>
                <Search className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">£34,567</p>
                  <p className="text-sm text-green-600">+8% this month</p>
                </div>
                <BarChart3 className="h-10 w-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">System Health</p>
                  <p className="text-3xl font-bold text-green-600">99.9%</p>
                  <p className="text-sm text-gray-600">Uptime</p>
                </div>
                <Activity className="h-10 w-10 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              System Settings
            </button>
          </nav>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">User Management</h2>
                <Button className="flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              <div className="mt-4">
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4">User</th>
                      <th className="text-left py-3 px-4">Subscription</th>
                      <th className="text-left py-3 px-4">Scans</th>
                      <th className="text-left py-3 px-4">Last Active</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <span className="text-white text-sm font-medium">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.subscription === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                            user.subscription === 'pro' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {user.subscription}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900">{user.scans}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-500">
                            {new Date(user.lastActive).toLocaleDateString('en-GB')}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Platform Analytics</h2>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-600">
                    Detailed analytics and reporting features will be displayed here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">System Settings</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Configuration</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Max concurrent scans" defaultValue="100" />
                    <Input label="Scan timeout (seconds)" defaultValue="30" />
                    <Input label="Rate limit (requests/minute)" defaultValue="60" />
                    <Input label="Max pages per scan" defaultValue="1000" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="SMTP Server" placeholder="smtp.example.com" />
                    <Input label="Support Email" defaultValue="support@analysethat.co.uk" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}