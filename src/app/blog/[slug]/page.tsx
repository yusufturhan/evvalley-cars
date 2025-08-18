import { Metadata } from 'next';
import { getBlogPostBySlug } from '@/lib/blog-content';
import { notFound } from 'next/navigation';

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
    robots: { // Added for specific blog post indexing
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
      description: post.excerpt,
      url: postUrl,
      siteName: 'Evvalley',
      locale: 'en_US',
      type: 'article',
      images: [
        {
          url: post.featuredImage || 'https://www.evvalley.com/og-image.jpg',
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
      images: [post.featuredImage || 'https://www.evvalley.com/og-image.jpg'],
    },
  };
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  // Special handling for old/deleted blog post
  if (slug === 'battery-technology-advancements-and-the-ev-range-problem') {
    // Return 410 Gone status for permanently deleted content
    return new Response('This blog post has been permanently removed.', {
      status: 410,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }
  
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound(); // Changed from custom JSX to Next.js notFound()
  }

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
