"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export function useAuthSync() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      console.log('🔄 Auth sync: User signed in, syncing to Supabase...');
      
      // Get user data from Clerk
      const primaryEmail = user.emailAddresses.find(email => email.id === user.primaryEmailAddressId);
      const userData = {
        clerkId: user.id,
        email: primaryEmail?.emailAddress || user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName
      };

      console.log('📋 Auth sync: User data from Clerk:', userData);
      
      // Sync user to Supabase
      fetch('/api/auth/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      .then(response => response.json())
      .then(data => {
        if (data.supabaseId) {
          console.log('✅ Auth sync: User synced to Supabase:', data.supabaseId);
        } else {
          console.error('❌ Auth sync: Failed to sync user:', data.error);
        }
      })
      .catch(error => {
        console.error('❌ Auth sync: Error syncing user:', error);
      });
    }
  }, [isSignedIn, user]);

  return { isSignedIn, user };
} 