import { Metadata } from 'next';
import { getBlogPostBySlug, getRelatedBlogPosts } from '@/lib/blog-content';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Force static generation for better SEO
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

// Generate static params for all blog posts
export async function generateStaticParams() {
  const { blogPosts } = await import('@/lib/blog-content');
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Blog Post Not Found - Evvalley',
      description: 'The requested blog post could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }
  const postUrl = `https://www.evvalley.com/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    creator: 'Evvalley',
    publisher: 'Evvalley',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://www.evvalley.com'),
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
    other: {
      'google-site-verification': 'your-verification-code',
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: 'Evvalley',
      locale: 'en_US',
      type: 'article',
      images: [
        {
          url: post.featuredImage || 'https://www.evvalley.com/blog-images/ev-charging-station-guide.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage || 'https://www.evvalley.com/blog-images/ev-charging-station-guide.jpg'],
    },
  };
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  // Special handling for old/deleted blog post - redirect to 404
  if (slug === 'battery-technology-advancements-and-the-ev-range-problem') {
    notFound(); // This will return a proper 404 status
  }
  
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound(); // Changed from custom JSX to Next.js notFound()
  }

  const postUrl = `https://www.evvalley.com/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      {/* Explicit Canonical URL */}
      <link rel="canonical" href={postUrl} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* SEO: Enhanced Structured Data for Blog Post */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.title,
              "description": post.metaDescription || post.excerpt,
              "image": post.featuredImage ? (post.featuredImage.startsWith('http') ? post.featuredImage : `https://www.evvalley.com${post.featuredImage}`) : 'https://www.evvalley.com/blog-images/ev-charging-station-guide.jpg',
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "publisher": {
                "@type": "Organization",
                "name": "Evvalley",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.evvalley.com/logo.png"
                }
              },
              "datePublished": post.publishedAt,
              "dateModified": post.updatedAt || post.publishedAt,
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": postUrl
              },
              "articleSection": post.category,
              "keywords": Array.isArray(post.keywords) ? post.keywords.join(", ") : post.keywords,
              "wordCount": post.content ? post.content.split(' ').length : 0,
              "timeRequired": `PT${post.readTime || 5}M`,
              "url": postUrl
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.evvalley.com/" },
                { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.evvalley.com/blog" },
                { "@type": "ListItem", position: 3, name: post.title, item: `https://www.evvalley.com/blog/${post.slug}` }
              ]
            })
          }}
        />
        {/* Header */}
        <div className="mb-8">
          <nav className="text-sm text-gray-600 mb-4">
            <a href="/" className="hover:text-[#3AB0FF]">Home</a>
            <span className="mx-2">→</span>
            <a href="/blog" className="hover:text-[#3AB0FF]">Blog</a>
            <span className="mx-2">→</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
            <span>By {post.author}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{post.readTime} min read</span>
            <span>•</span>
            <span className="bg-[#3AB0FF] text-white px-2 py-1 rounded-full text-xs">
              {post.category}
            </span>
          </div>
          
          {post.featuredImage && (
            <div className="mb-8">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Content */}
        <article className="prose prose-lg max-w-none">
          <div 
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="text-gray-800 leading-relaxed"
          />
        </article>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Blog Posts */}
        {(() => {
          const relatedPosts = getRelatedBlogPosts(post, 3);
          if (relatedPosts.length > 0) {
            return (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                    >
                      {relatedPost.featuredImage && (
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                        <p className="text-xs text-blue-600 mt-2">Read more →</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Category Link */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">Category:</span>{' '}
            <Link 
              href={`/blog/category/${post.category.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {post.category}
            </Link>
            {' • '}
            <Link 
              href="/blog"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View all blog posts
            </Link>
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] rounded-lg text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Find Your Perfect EV?</h3>
          <p className="text-lg mb-6">
            Explore our marketplace for electric vehicles, e-scooters, and e-bikes.
          </p>
          <a
            href="/vehicles"
            className="inline-block bg-white text-[#1C1F4A] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse Electric Vehicles
          </a>
        </div>
      </div>
    </div>
  );
}
