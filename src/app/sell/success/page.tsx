"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";

export default function SellSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listingId');
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Clear localStorage after successful payment
    localStorage.removeItem('sellFormData');
    localStorage.removeItem('sellFormImages');
    localStorage.removeItem('sellFormVideo');
    console.log('🧹 Form data cleared from localStorage after successful payment');
  }, []);

  useEffect(() => {
    // Countdown and auto-redirect
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/vehicles');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />
      
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6 inline-block">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-6">
                <CheckCircle2 className="h-20 w-20 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Payment Successful! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            Your listing is being activated and will be visible shortly.
          </p>

          {/* Details */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-8">
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Listing ID:</span>
                <span className="text-sm font-mono text-gray-900">{listingId || 'N/A'}</span>
              </div>
              {sessionId && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Session ID:</span>
                  <span className="text-sm font-mono text-gray-900 truncate max-w-[200px]">{sessionId}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-3 border-t border-green-200">
                <span className="text-sm font-medium text-green-700">Status:</span>
                <span className="text-sm font-semibold text-green-700">✓ Activated</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">ℹ️</span> What happens next?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Your listing is now live on EvValley</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Potential buyers can view and contact you</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>You'll receive email notifications for inquiries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span>Your subscription will renew monthly until cancelled</span>
              </li>
            </ul>
          </div>

          {/* Auto-redirect notice */}
          <p className="text-sm text-gray-500 mb-6">
            Redirecting to all listings in <span className="font-bold text-green-600">{countdown}</span> seconds...
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/vehicles"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
            >
              View All Listings
              <ArrowRight className="h-5 w-5" />
            </Link>
            
            <Link
              href="/"
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Home className="h-5 w-5" />
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
