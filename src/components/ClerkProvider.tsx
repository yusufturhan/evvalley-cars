"use client";

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";

export default function ClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  // Debug logging
  console.log('ClerkProvider - publishableKey:', publishableKey ? 'Present' : 'Missing');
  
  if (!publishableKey) {
    console.error('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is missing!');
    return <div>Error: Clerk configuration missing</div>;
  }

  return (
    <ClerkProviderBase
      publishableKey={publishableKey}
      appearance={{
        elements: {
          formButtonPrimary: "bg-[#3AB0FF] hover:bg-[#2A8FE6]",
          card: "shadow-lg",
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      {children}
    </ClerkProviderBase>
  );
} 