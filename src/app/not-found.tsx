import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F9FF] flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 404 Icon */}
          <div className="mb-6">
            <div className="bg-[#F5F9FF] p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
              <Search className="h-10 w-10 text-[#3AB0FF]" />
            </div>
          </div>

          {/* 404 Text */}
          <h1 className="text-6xl font-bold text-[#1C1F4A] mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link href="/">
              <button className="w-full bg-[#1C1F4A] text-white px-6 py-3 rounded-lg hover:bg-[#2A2F6B] transition-colors flex items-center justify-center">
                <Home className="h-5 w-5 mr-2" />
                Go to Home
              </button>
            </Link>
            
            <Link href="/vehicles">
              <button className="w-full bg-[#3AB0FF] text-white px-6 py-3 rounded-lg hover:bg-[#2A8FD9] transition-colors flex items-center justify-center">
                <Search className="h-5 w-5 mr-2" />
                Browse Vehicles
              </button>
            </Link>

            <button 
              onClick={() => window.history.back()}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Can't find what you're looking for?{' '}
              <Link href="/contact" className="text-[#3AB0FF] hover:underline">
                Contact us
              </Link>{' '}
              for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
