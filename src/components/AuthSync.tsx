"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

export default function AuthSync() {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only sync once per session and only if user exists
    if (mounted && isLoaded && user && !synced) {
      // Check if already synced in this session
      const sessionKey = `auth_synced_${user.id}`;
      if (sessionStorage.getItem(sessionKey)) {
        setSynced(true);
        return;
      }

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
            setSynced(true);
            sessionStorage.setItem(sessionKey, 'true');
          } else {
            console.error('❌ Failed to sync user');
          }
        } catch (error) {
          console.error('❌ Error syncing user:', error);
        }
      };

      syncUser();
    }
  }, [mounted, user, isLoaded, synced]);

  return null; // This component doesn't render anything
} 