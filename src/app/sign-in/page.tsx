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
