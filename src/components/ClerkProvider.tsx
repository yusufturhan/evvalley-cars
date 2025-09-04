"use client";

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";

export default function ClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProviderBase
      publishableKey={publishableKey}
      clerkJSUrl="https://cdn.jsdelivr.net/npm/@clerk/clerk-js@5/dist/clerk.browser.js"
      appearance={{
        elements: {
          formButtonPrimary: "bg-[#3AB0FF] hover:bg-[#2A8FE6]",
          card: "shadow-lg",
        },
      }}
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      {children}
    </ClerkProviderBase>
  );
}