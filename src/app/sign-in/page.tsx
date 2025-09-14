"use client";

import { SignIn } from "@clerk/nextjs";
import Header from "@/components/Header";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />
      <div className="max-w-md mx-auto pt-20 pb-10 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1C1F4A] mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your Evvalley account</p>
        </div>
        
        {/* Google Sign-in Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.726-1.36 3.491 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Having Google Sign-in Issues?
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>If you're experiencing issues with Google sign-in:</p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Try using a regular web browser (Chrome, Safari)</li>
                  <li>Open evvalley.com in your mobile browser</li>
                  <li>Use external browser instead of in-app browser</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-[#3AB0FF] hover:bg-[#2A8FE6]",
              card: "shadow-lg border-0",
              headerTitle: "text-[#1C1F4A] text-2xl font-bold",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700",
              socialButtonsBlockButtonText: "text-gray-700 font-medium",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-500",
              formFieldInput: "border-gray-300 focus:border-[#3AB0FF] focus:ring-[#3AB0FF]",
              formFieldLabel: "text-gray-700 font-medium",
              footerActionLink: "text-[#3AB0FF] hover:text-[#2A8FE6]",
            },
          }}
          redirectUrl="/"
        />
      </div>
    </div>
  );
}
