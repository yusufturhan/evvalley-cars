'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';

interface GSCIssue {
  type: string;
  severity: string;
  url: string;
  description: string;
  detectedAt: string;
  status: string;
}

interface GSCMonitorData {
  newIssues: GSCIssue[];
  totalIssues: number;
  criticalIssues: number;
  allIssues: GSCIssue[];
  timestamp: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [gscData, setGscData] = useState<GSCMonitorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simple admin authentication
  const handleLogin = () => {
    if (password === 'evvalley2024' || password === 'admin123') {
      setIsAuthenticated(true);
      setShowLogin(false);
      localStorage.setItem('adminAuthenticated', 'true');
      fetchGSCData();
    } else {
      alert('Yanlış şifre!');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setShowLogin(true);
    localStorage.removeItem('adminAuthenticated');
  };

  useEffect(() => {
    // Check if already authenticated (client-side only)
    if (typeof window !== 'undefined') {
      const authenticated = localStorage.getItem('adminAuthenticated');
      if (authenticated === 'true') {
        setIsAuthenticated(true);
        setShowLogin(false);
        fetchGSCData();
      } else {
        setShowLogin(true);
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    }
  }, []);

  const fetchGSCData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gsc-monitor');
      const data = await response.json();
      
      if (data.success) {
        setGscData(data.data);
      } else {
        setError(data.error || 'Failed to fetch GSC data');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const resolveIssue = async (url: string, type: string) => {
    try {
      const response = await fetch('/api/gsc-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resolve', url, type })
      });
      
      if (response.ok) {
        fetchGSCData(); // Refresh data
      }
    } catch (err) {
      console.error('Failed to resolve issue:', err);
    }
  };

  // Show loading while checking authentication
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3AB0FF] mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Login Screen
  if (showLogin || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-[#3AB0FF] rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Erişimi</h1>
            <p className="text-gray-600 mt-2">Admin paneline erişmek için şifre girin</p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent"
                placeholder="Admin şifresini girin"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-[#3AB0FF] text-white py-2 px-4 rounded-md hover:bg-[#2A8FE6] transition-colors font-medium"
            >
              Giriş Yap
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Demo şifreler: <code className="bg-gray-100 px-2 py-1 rounded">evvalley2024</code> veya <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600">Error: {error}</p>
            <button 
              onClick={fetchGSCData}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Çıkış Yap
          </button>
        </div>
        
        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/email-campaigns" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Email Campaigns</h2>
            <p className="text-gray-600">Manage email marketing campaigns</p>
          </Link>
          
          <Link href="/admin/update-vehicle" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Update Vehicle</h2>
            <p className="text-gray-600">Update vehicle information</p>
          </Link>
          
          <Link href="/admin/blog-images" className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Blog Görselleri</h2>
            <p className="text-gray-600">Blog görsellerini yükle ve düzenle</p>
          </Link>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">GSC Monitor</h2>
            <p className="text-gray-600">SEO issue monitoring</p>
          </div>
        </div>

        {/* GSC Monitoring */}
        {gscData && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">GSC Monitoring</h2>
              <button 
                onClick={fetchGSCData}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Refresh
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{gscData.totalIssues}</div>
                <div className="text-sm text-blue-800">Total Issues</div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{gscData.criticalIssues}</div>
                <div className="text-sm text-red-800">Critical Issues</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{gscData.newIssues.length}</div>
                <div className="text-sm text-green-800">New Issues</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm text-gray-600">Last Check</div>
                <div className="text-sm text-gray-800">
                  {new Date(gscData.timestamp).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Issues List */}
            {gscData.allIssues.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Issues</h3>
                <div className="space-y-3">
                  {gscData.allIssues.map((issue, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              issue.severity === 'critical' ? 'bg-red-100 text-red-800' :
                              issue.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                              issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {issue.severity.toUpperCase()}
                            </span>
                            <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                              {issue.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">{issue.url}</div>
                          <div className="text-sm text-gray-800">{issue.description}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(issue.detectedAt).toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={() => resolveIssue(issue.url, issue.type)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Resolve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
