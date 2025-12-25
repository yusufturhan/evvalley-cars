import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'EV Guides - Evvalley Blog',
  description: 'Comprehensive guides, tips, and up-to-date information about electric vehicles. Expert advice on EV purchasing, charging, and maintenance.',
  keywords: 'electric vehicle guide, EV buying guide, charging station, maintenance tips, Tesla guide',
  alternates: {
    canonical: 'https://www.evvalley.com/blog/category/ev-guide',
  },
  openGraph: {
    title: 'EV Guides - Evvalley Blog',
    description: 'Comprehensive guides and expert advice about electric vehicles.',
    url: 'https://www.evvalley.com/blog/category/ev-guide',
  },
};

export default function EVGuideCategoryPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📚 EV Guides
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive guides about electric vehicles, buying tips, 
            charging solutions, and maintenance advice.
          </p>
        </div>

        {/* Category Description */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Electric Vehicle Guides
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              We offer comprehensive guides for newcomers to the electric vehicle world 
              and advanced tips for experienced EV drivers.
            </p>
            <p className="mb-4">
              In this category, we cover topics such as the electric vehicle purchasing process, 
              finding charging stations, maintenance, and performance optimization.
            </p>
            <p>
              Enhance your electric vehicle experience with up-to-date and accurate information 
              prepared by our expert writers.
            </p>
          </div>
        </div>

        {/* Featured Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Article 1 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Electric Vehicle Buying Guide 2024
              </h3>
              <p className="text-gray-600 mb-4">
                All the details and tips you need to pay attention to when 
                buying your first electric vehicle.
              </p>
              <Link
                href="/blog/ev-buying-guide-2024"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>

          {/* Article 2 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Home Tesla Charging Installation
              </h3>
              <p className="text-gray-600 mb-4">
                Step-by-step guide and cost analysis for installing a Tesla 
                charging station at your home.
              </p>
              <Link
                href="/blog/tesla-home-charging-setup"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>

          {/* Article 3 */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                EV Maintenance and Service Guide
              </h3>
              <p className="text-gray-600 mb-4">
                Maintenance requirements, service intervals, and tips for 
                long-term use of electric vehicles.
              </p>
              <Link
                href="/blog/ev-maintenance-guide"
                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
              >
                Read More →
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to All Blog Posts
          </Link>
        </div>
      </div>
    </div>
  );
}
