"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { trackVehicleFavorite } from "@/lib/analytics";

interface FavoriteButtonProps {
  vehicleId: string;
  vehicleTitle: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function FavoriteButton({ vehicleId, vehicleTitle, className = "", size = "md" }: FavoriteButtonProps) {
  const { isSignedIn, user } = useUser();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  useEffect(() => {
    if (isSignedIn) {
      checkFavoriteStatus();
    }
  }, [isSignedIn, vehicleId]);

  const checkFavoriteStatus = async () => {
    try {
      // Get user's Supabase ID
      const userResponse = await fetch('/api/auth/sync', {
        headers: {
          'Authorization': `Bearer ${user?.id}`
        }
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        const userId = userData.user.id;
        
        // Check if vehicle is in favorites
        const favoritesResponse = await fetch(`/api/favorites?user_id=${userId}&vehicle_id=${vehicleId}`);
        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          const isFav = favoritesData.favorites.length > 0;
          setIsFavorited(isFav);
        }
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!isSignedIn) {
      alert('Please sign in to add favorites');
      return;
    }

    setLoading(true);
    try {
      // Get user's Supabase ID
      const userResponse = await fetch('/api/auth/sync', {
        headers: {
          'Authorization': `Bearer ${user?.id}`
        }
      });
      if (userResponse.ok) {
        const userData = await userResponse.json();
        const userId = userData.user.id;
        
        if (isFavorited) {
          // Remove from favorites
          const response = await fetch(`/api/favorites?userId=${userId}&vehicleId=${vehicleId}`, {
            method: 'DELETE'
          });
          if (response.ok) {
            setIsFavorited(false);
            console.log('Removed from favorites:', vehicleId);
          }
        } else {
          // Add to favorites
          const response = await fetch('/api/favorites', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              userId: userId,
              vehicleId: vehicleId
            })
          });
          if (response.ok) {
            setIsFavorited(true);
            console.log('Added to favorites:', vehicleId);
            // Track favorite event
            trackVehicleFavorite(vehicleId, vehicleTitle);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`transition-colors duration-200 ${className} ${
        isFavorited 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <Heart 
        className={`${sizeClasses[size]} ${isFavorited ? 'fill-current' : ''}`} 
      />
    </button>
  );
} 