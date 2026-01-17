"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";

function CancelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listingId');
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    // Countdown and auto-redirect
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/sell');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Cancel Icon */}
          <div className="mb-6 inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-orange-500 to-red-600 rounded-full p-6">
                <XCircle className="h-20 w-20 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Your payment was cancelled. Your listing has not been activated.
          </p>

          {/* Details */}
          {listingId && (
            <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-8">
              <div className="space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Listing ID:</span>
                  <span className="text-sm font-mono text-gray-900">{listingId}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-orange-200">
                  <span className="text-sm font-medium text-orange-700">Status:</span>
                  <span className="text-sm font-semibold text-orange-700">⚠ Not Activated</span>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">ℹ️</span> What happened?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>You cancelled the payment process</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>Your listing draft is saved but not published</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>No charges were made to your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Your form data is still saved - you can try again</span>
              </li>
            </ul>
          </div>

          {/* Auto-redirect notice */}
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to sell page in <span className="font-bold text-orange-600">{countdown}</span> seconds...
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sell"
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              Try Again
            </Link>
            
            <Link
              href="/vehicles"
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              View Listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SellCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}
