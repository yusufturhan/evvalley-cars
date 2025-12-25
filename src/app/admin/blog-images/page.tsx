'use client';

import { useState, useEffect } from 'react';
import { blogPosts } from '@/lib/blog-content';
import Link from 'next/link';
import Image from 'next/image';
import { Lock } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  featuredImage?: string;
}

export default function BlogImagesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Simple admin authentication
  const handleLogin = () => {
    if (password === 'evvalley2024' || password === 'admin123') {
      setIsAuthenticated(true);
      setShowLogin(false);
      localStorage.setItem('adminAuthenticated', 'true');
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
      } else {
        setShowLogin(true);
        setIsAuthenticated(false);
      }
      setCheckingAuth(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Load all blog posts
      const allPosts = blogPosts.map(post => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        featuredImage: post.featuredImage
      }));
      setPosts(allPosts);
    }
  }, [isAuthenticated]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate image file
      if (!file.type.startsWith('image/')) {
        alert('Lütfen bir resim dosyası seçin!');
        return;
      }
      
      // Check file size (max 20MB)
      if (file.size > 20 * 1024 * 1024) {
        alert('Dosya boyutu 20MB\'dan küçük olmalı!');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedPost || !imageFile) {
      alert('Lütfen bir blog ve görsel seçin!');
      return;
    }

    setUploading(true);
    try {
      // Upload to Supabase Storage
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('blogSlug', selectedPost.slug);
      formData.append('blogId', selectedPost.id);

      const response = await fetch('/api/admin/upload-blog-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        if (data.needsManualUpload) {
          alert(`✅ Görsel hazır!\n\nDosya adı: ${data.fileName}\n\nŞimdi yapmanız gerekenler:\n1. Görseli 'public/blog-images/' klasörüne '${data.fileName}' olarak kaydedin\n2. blog-content.ts dosyasında ilgili blog'un featuredImage alanını '${data.imageUrl}' olarak güncelleyin\n\nGörsel URL: ${data.imageUrl}`);
        } else {
          alert(`✅ Görsel başarıyla yüklendi!\n\nGörsel URL: ${data.imageUrl}\n\nblog-content.ts dosyasında ilgili blog'un featuredImage alanını bu URL ile güncelleyin.`);
        }
        // Update local state
        setPosts(prev => prev.map(post => 
          post.id === selectedPost.id 
            ? { ...post, featuredImage: data.imageUrl }
            : post
        ));
        setSelectedPost({ ...selectedPost, featuredImage: data.imageUrl });
        setPreview(null);
        setImageFile(null);
      } else {
        const errorMsg = data.error || 'Görsel yüklenemedi';
        const details = data.details ? `\n\nDetay: ${data.details}` : '';
        const suggestion = data.suggestion || data.message || '';
        const isRLSError = data.isRLSError || data.needsRLSPolicy;
        
        let fullMessage = `❌ Hata: ${errorMsg}${details}`;
        
        if (suggestion) {
          fullMessage += `\n\n💡 ${suggestion}`;
        }
        
        if (isRLSError) {
          fullMessage += `\n\n🔧 RLS Politikası Hatası:\n1. Supabase Dashboard > SQL Editor'e gidin\n2. fix-blog-images-storage.sql dosyasındaki SQL'i çalıştırın\n3. Storage > blog-images > Settings > "Public bucket" açık olduğundan emin olun`;
        }
        
        fullMessage += `\n\n📋 Genel Kontroller:\n- Dosya boyutu 20MB'dan küçük olmalı\n- Dosya formatı JPG, PNG veya WebP olmalı\n- İnternet bağlantınızı kontrol edin`;
        
        alert(fullMessage);
      }
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      alert(`❌ Görsel yüklenirken bir hata oluştu!\n\nHata: ${errorMessage}\n\nLütfen:\n- İnternet bağlantınızı kontrol edin\n- Dosya boyutunu kontrol edin\n- Farklı bir görsel deneyin`);
    } finally {
      setUploading(false);
    }
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
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
            <p className="text-gray-600 mt-2">Blog görselleri yönetimi için şifre girin</p>
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Link href="/admin" className="text-blue-600 hover:text-blue-800 inline-block">
              ← Admin Paneline Dön
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog Görselleri Yönetimi</h1>
          <p className="text-gray-600">Blog görsellerini yükleyin ve düzenleyin</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Blog List */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Blog Listesi</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {posts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPost?.id === post.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded overflow-hidden">
                      {getImageUrl(post.featuredImage) ? (
                        <img
                          src={getImageUrl(post.featuredImage)!}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs">
                          Görsel Yok
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{post.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">Slug: {post.slug}</p>
                      {post.featuredImage ? (
                        <p className="text-xs text-green-600 mt-1">✓ Görsel var</p>
                      ) : (
                        <p className="text-xs text-red-600 mt-1">✗ Görsel yok</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedPost ? `Görsel Yükle: ${selectedPost.title}` : 'Bir blog seçin'}
            </h2>

            {selectedPost && (
              <div className="space-y-4">
                {/* Current Image */}
                {selectedPost.featuredImage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mevcut Görsel
                    </label>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <img
                        src={getImageUrl(selectedPost.featuredImage)!}
                        alt={selectedPost.title}
                        className="w-full h-48 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-2 break-all">
                        {selectedPost.featuredImage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Upload New Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yeni Görsel Yükle
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maksimum dosya boyutu: 20MB. Önerilen boyut: 1200x630px (JPG veya PNG)
                  </p>
                </div>

                {/* Preview */}
                {preview && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Önizleme
                    </label>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded"
                      />
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={!imageFile || uploading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? 'Yükleniyor...' : 'Görseli Yükle'}
                </button>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>📝 Nasıl Kullanılır:</strong>
                  </p>
                  <ol className="text-sm text-blue-800 list-decimal list-inside space-y-1">
                    <li>Görseli seçin ve yükleyin</li>
                    <li>Yükleme başarılı olursa görsel URL'si gösterilecek</li>
                    <li>Eğer Supabase Storage yoksa, görseli manuel olarak <code className="bg-blue-100 px-1 rounded">public/blog-images/</code> klasörüne eklemeniz gerekecek</li>
                    <li><code className="bg-blue-100 px-1 rounded">src/lib/blog-content.ts</code> dosyasında ilgili blog'un <code className="bg-blue-100 px-1 rounded">featuredImage</code> alanını güncelleyin</li>
                  </ol>
                </div>
                
                {/* Alternative: Manual Upload Instructions */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                  <p className="text-sm text-gray-800 mb-2">
                    <strong>💡 Alternatif Yöntem:</strong>
                  </p>
                  <p className="text-xs text-gray-700">
                    Supabase Storage bucket'ı yoksa, görseli doğrudan <code className="bg-gray-100 px-1 rounded">public/blog-images/</code> klasörüne ekleyip, <code className="bg-gray-100 px-1 rounded">blog-content.ts</code> dosyasında <code className="bg-gray-100 px-1 rounded">featuredImage: '/blog-images/dosya-adi.jpg'</code> şeklinde güncelleyin.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

