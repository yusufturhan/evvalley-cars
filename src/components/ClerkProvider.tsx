"use client";

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";

export default function ClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // Get domain from environment or use default
  const domain = typeof window !== 'undefined' 
    ? window.location.hostname 
    : process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '').replace('http://', '') || 'evvalley.com';

  return (
    <ClerkProviderBase
      publishableKey={publishableKey}
      domain={domain}
      clerkJSUrl="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js"
      appearance={{
        elements: {
          formButtonPrimary: "bg-[#3AB0FF] hover:bg-[#2A8FE6]",
          card: "shadow-lg",
        },
      }}
      afterSignInUrl="/"
      afterSignUpUrl="/"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      localization={{
        signIn: {
          start: {
            title: "Welcome to Evvalley",
            subtitle: "Sign in to your account",
          },
        },
        signUp: {
          start: {
            title: "Join Evvalley",
            subtitle: "Create your account",
          },
        },
      }}
    >
      {children}
    </ClerkProviderBase>
  );
}