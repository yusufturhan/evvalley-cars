'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Enhanced error logging
    console.error('❌ Application error:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error digest:', error.digest);
    
    // Log additional context
    console.error('❌ User agent:', navigator.userAgent);
    console.error('❌ Current URL:', window.location.href);
    console.error('❌ Timestamp:', new Date().toISOString());
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Something went wrong!
          </h1>
          <p className="text-gray-600 mb-6">
            We're sorry, but something went wrong. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <p className="text-sm text-red-800 font-medium mb-2">Debug Info:</p>
              <p className="text-xs text-red-700 mb-1">Error: {error.message}</p>
              <p className="text-xs text-red-700">Digest: {error.digest}</p>
            </div>
          )}
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Try again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 