import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react';
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/blog-content';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: 'Blog Post Not Found - Evvalley',
      description: 'The requested blog post could not be found.',
    };
  }

  const postUrl = `https://www.evvalley.com/blog/${post.slug}`;

  return {
    title: `${post.title} - Evvalley Blog`,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords || 'electric vehicles, EVs, e-scooters, e-bikes, marketplace, blog',
    alternates: {
      canonical: postUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: post.title,
      description: post.metaDescription || post.excerpt,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ['Evvalley Team'],
      tags: post.tags || [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription || post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h1>
          <p className="text-gray-600">The requested blog post could not be found.</p>
        </div>
      </div>
    );
  }

  const relatedPosts = getRelatedBlogPosts(post, 2);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1C1F4A] to-[#3AB0FF] text-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="mb-6">
            <Link href="/blog">
              <button className="flex items-center text-white hover:text-gray-200 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </button>
            </Link>
          </div>
          
          {/* Category Badge */}
          <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
            {post.category}
          </span>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl opacity-90 mb-6">
            {post.excerpt}
          </p>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-sm opacity-80">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              {post.readTime} min read
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <article className="bg-white rounded-lg shadow-lg p-8">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed text-base"
            style={{
              fontSize: '16px',
              lineHeight: '1.7',
              color: '#374151'
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {relatedPost.readTime} min read
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
