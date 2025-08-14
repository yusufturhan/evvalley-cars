"use client";

import { useState, useEffect } from 'react';
import { 
  Mail, 
  Users, 
  BarChart3, 
  Calendar, 
  Play, 
  Pause, 
  Settings,
  Eye,
  Send,
  TrendingUp,
  Lock
} from 'lucide-react';
import { getActiveCampaigns, getCampaignsByType, EmailCampaign } from '@/lib/email-campaigns';

interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSent: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [stats, setStats] = useState<CampaignStats>({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalSent: 0,
    openRate: 0,
    clickRate: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);

  // Simple admin authentication
  const handleLogin = () => {
    // In production, this should be a proper authentication system
    if (password === 'evvalley2024' || password === 'admin123') {
      setIsAuthenticated(true);
      setShowLogin(false);
      localStorage.setItem('adminAuthenticated', 'true');
    } else {
      alert('Incorrect password!');
    }
  };

  useEffect(() => {
    // Check if already authenticated
    const authenticated = localStorage.getItem('adminAuthenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
      setShowLogin(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadCampaigns();
      loadStats();
    }
  }, [selectedType, isAuthenticated]);

  const loadCampaigns = () => {
    const allCampaigns = getActiveCampaigns();
    const filteredCampaigns = selectedType === 'all' 
      ? allCampaigns 
      : getCampaignsByType(selectedType as any);
    
    setCampaigns(filteredCampaigns);
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      // In a real app, this would fetch from your API
      setStats({
        totalCampaigns: 8,
        activeCampaigns: 6,
        totalSent: 15420,
        openRate: 24.5,
        clickRate: 8.3,
        conversionRate: 2.1
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    try {
      // Show loading state
      const sendButton = document.querySelector(`[data-campaign-id="${campaignId}"]`) as HTMLButtonElement;
      const originalText = sendButton.innerHTML;
      sendButton.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>';
      sendButton.disabled = true;

      const response = await fetch('/api/email-campaign/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignType: campaigns.find(c => c.id === campaignId)?.type
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Show detailed success message
        const successMessage = `
          ✅ Campaign sent successfully!
          
          📊 Results:
          - Total users: ${result.results?.[0]?.totalUsers || 'N/A'}
          - Successful: ${result.results?.[0]?.successful || 'N/A'}
          - Failed: ${result.results?.[0]?.failed || 'N/A'}
          
          📧 Check your email logs for details.
        `;
        alert(successMessage);
        loadStats();
      } else {
        // Show detailed error message
        const errorMessage = `
          ❌ Failed to send campaign!
          
          Error: ${result.error || 'Unknown error'}
          Status: ${response.status}
          
          Please check the console for more details.
        `;
        alert(errorMessage);
        console.error('Campaign send error:', result);
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert(`
        ❌ Error sending campaign!
        
        Error: ${error instanceof Error ? error.message : 'Unknown error'}
        
        Please check the console for more details.
      `);
    } finally {
      // Reset button state
      const sendButton = document.querySelector(`[data-campaign-id="${campaignId}"]`) as HTMLButtonElement;
      if (sendButton) {
        sendButton.innerHTML = '<Send className="h-4 w-4 inline mr-1" />Send';
        sendButton.disabled = false;
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
    localStorage.removeItem('adminAuthenticated');
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'welcome': return <Mail className="h-5 w-5" />;
      case 'newsletter': return <BarChart3 className="h-5 w-5" />;
      case 'promotional': return <TrendingUp className="h-5 w-5" />;
      case 'abandoned-cart': return <Eye className="h-5 w-5" />;
      case 'market-update': return <Calendar className="h-5 w-5" />;
      default: return <Mail className="h-5 w-5" />;
    }
  };

  const getCampaignTypeColor = (type: string) => {
    switch (type) {
      case 'welcome': return 'bg-blue-100 text-blue-800';
      case 'newsletter': return 'bg-green-100 text-green-800';
      case 'promotional': return 'bg-orange-100 text-orange-800';
      case 'abandoned-cart': return 'bg-red-100 text-red-800';
      case 'market-update': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Login Screen
  if (showLogin || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-[#3AB0FF] rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-600 mt-2">Enter password to access email campaigns</p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#3AB0FF] text-white py-2 px-4 rounded-md hover:bg-[#2A8FE6] transition-colors font-medium"
            >
              Login
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Demo passwords: <code className="bg-gray-100 px-2 py-1 rounded">evvalley2024</code> or <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3AB0FF] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Campaigns</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and monitor your email marketing campaigns
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-[#3AB0FF] text-white px-4 py-2 rounded-lg hover:bg-[#2A8FE6] transition-colors">
                <Settings className="h-4 w-4 inline mr-2" />
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Send className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalSent.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Open Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.openRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Campaigns</h2>
          </div>
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {['all', 'welcome', 'newsletter', 'promotional', 'abandoned-cart', 'market-update'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-[#3AB0FF] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {selectedType === 'all' ? 'All Campaigns' : `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1).replace('-', ' ')} Campaigns`}
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getCampaignTypeColor(campaign.type)}`}>
                      {getCampaignTypeIcon(campaign.type)}
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{campaign.name}</h4>
                      <p className="text-sm text-gray-500">{campaign.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          campaign.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {campaign.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {campaign.schedule && (
                          <span className="text-xs text-gray-500">
                            Schedule: {campaign.schedule}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleSendCampaign(campaign.id)}
                      className="bg-[#3AB0FF] text-white px-3 py-1 rounded text-sm hover:bg-[#2A8FE6] transition-colors"
                      data-campaign-id={campaign.id}
                    >
                      <Send className="h-4 w-4 inline mr-1" />
                      Send
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors">
                      <Eye className="h-4 w-4 inline mr-1" />
                      View
                    </button>
                    <button className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors">
                      <Settings className="h-4 w-4 inline mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Email Logs */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Email Logs</h3>
            <p className="text-sm text-gray-500 mt-1">Track email delivery and engagement</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Campaign
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sent At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Welcome Email - Day 1
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      john@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Sent
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      2 hours ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[#3AB0FF] hover:text-[#2A8FE6]">
                        View Details
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Weekly Newsletter
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      jane@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Opened
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      1 hour ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[#3AB0FF] hover:text-[#2A8FE6]">
                        View Details
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Summer Sale Campaign
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      mike@example.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        Clicked
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      30 minutes ago
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-[#3AB0FF] hover:text-[#2A8FE6]">
                        View Details
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <button className="text-[#3AB0FF] hover:text-[#2A8FE6] text-sm font-medium">
                View All Email Logs →
              </button>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Click Rate</span>
                <span className="text-sm font-medium text-gray-900">{stats.clickRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.clickRate}%` }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Conversion Rate</span>
                <span className="text-sm font-medium text-gray-900">{stats.conversionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${stats.conversionRate}%` }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Weekly newsletter sent to 2,450 subscribers</span>
                <span className="text-xs text-gray-400">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Welcome series completed for 15 new users</span>
                <span className="text-xs text-gray-400">4 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Promotional campaign launched</span>
                <span className="text-xs text-gray-400">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
