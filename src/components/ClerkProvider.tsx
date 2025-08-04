"use client";

import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";

export default function ClerkProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProviderBase
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        elements: {
          formButtonPrimary: "bg-[#3AB0FF] hover:bg-[#2A8FE6]",
          card: "shadow-lg",
        },
      }}
    >
      {children}
    </ClerkProviderBase>
  );
} 