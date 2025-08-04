"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function AuthSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user data with Supabase
      const syncUser = async () => {
        try {
          const response = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.emailAddresses[0]?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
            }),
          });

          if (response.ok) {
            console.log('✅ User synced successfully');
          } else {
            console.error('❌ Failed to sync user');
          }
        } catch (error) {
          console.error('❌ Error syncing user:', error);
        }
      };

      syncUser();
    }
  }, [user, isLoaded]);

  return null; // This component doesn't render anything
} 