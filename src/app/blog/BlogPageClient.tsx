"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { blogPosts, categories, getBlogPostsByCategory, BlogPost } from '@/lib/blog-content';

export default function BlogPageClient() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredPosts = getBlogPostsByCategory(selectedCategory);

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '100vh' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
          Evvalley Blog
        </h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
        Evvalley Blog
      </h1>
      
      {/* Categories */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}>Categories</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
          {categories.map((category: string) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: selectedCategory === category ? '#3b82f6' : '#f3f4f6',
                color: selectedCategory === category ? 'white' : 'black',
                cursor: 'pointer'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Debug Info */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '16px', 
        backgroundColor: '#fef3c7', 
        border: '1px solid #f59e0b', 
        borderRadius: '4px' 
      }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>DEBUG INFO:</h3>
        <p><strong>Total Blog Posts:</strong> {blogPosts.length}</p>
        <p><strong>Filtered Posts:</strong> {filteredPosts.length}</p>
        <p><strong>Selected Category:</strong> {selectedCategory}</p>
        <p><strong>Post IDs:</strong> {filteredPosts.map((p: BlogPost) => p.id).join(', ')}</p>
        <p><strong>Mounted:</strong> {mounted ? 'Yes' : 'No'}</p>
      </div>

      {/* Blog Posts */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
          Blog Posts ({filteredPosts.length})
        </h2>
        
        {filteredPosts.map((post: BlogPost) => (
          <div key={post.id} style={{ 
            border: '1px solid #d1d5db', 
            padding: '16px', 
            borderRadius: '4px', 
            marginBottom: '16px' 
          }}>
            <div style={{ marginBottom: '8px' }}>
              <span style={{ 
                backgroundColor: '#dbeafe', 
                color: '#1e40af', 
                padding: '4px 8px', 
                borderRadius: '4px', 
                fontSize: '0.875rem' 
              }}>
                {post.category}
              </span>
              <span style={{ marginLeft: '8px', color: '#6b7280', fontSize: '0.875rem' }}>
                ID: {post.id}
              </span>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' }}>
              <Link href={`/blog/${post.slug}`} style={{ color: '#2563eb', textDecoration: 'none' }}>
                {post.title}
              </Link>
            </h3>
            
            <p style={{ color: '#4b5563', marginBottom: '8px' }}>{post.excerpt}</p>
            
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              By {post.author} • {post.readTime} min read • {new Date(post.publishedAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <p style={{ color: '#6b7280' }}>No posts found for this category.</p>
        </div>
      )}
    </div>
  );
}
