"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Heart, Car, Zap, Battery, Bike } from "lucide-react";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import { Vehicle } from "@/lib/database";
import Link from "next/link";

export default function FavoritesPage() {
  const { isSignedIn, user } = useUser();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteVehicles, setFavoriteVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn) {
      loadFavorites();
    }
  }, [isSignedIn]);

  const loadFavorites = async () => {
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
        
        // Fetch favorites from API
        const favoritesResponse = await fetch(`/api/favorites?user_id=${userId}`);
        if (favoritesResponse.ok) {
          const favoritesData = await favoritesResponse.json();
          const favoriteIds = favoritesData.favorites.map((fav: any) => fav.vehicle_id);
          setFavorites(favoriteIds);
          fetchFavoriteVehicles(favoriteIds);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoriteVehicles = async (favoriteIds: string[]) => {
    try {
      const vehicles: Vehicle[] = [];
      
      for (const id of favoriteIds) {
        try {
          const response = await fetch(`/api/vehicles/${id}`);
          if (response.ok) {
            const data = await response.json();
            vehicles.push(data.vehicle);
          }
        } catch (error) {
          console.error(`Error fetching vehicle ${id}:`, error);
        }
      }
      
      setFavoriteVehicles(vehicles);
    } catch (error) {
      console.error('Error fetching favorite vehicles:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ev-car':
        return 'bg-blue-100 text-blue-800';
      case 'hybrid-car':
        return 'bg-green-100 text-green-800';
      case 'ev-scooter':
        return 'bg-purple-100 text-purple-800';
      case 'e-bike':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">❤️</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-8">Please sign in to view your favorites.</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-[#1C1F4A] text-white px-6 py-3 rounded-lg hover:bg-[#2A2F6B] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">
            {favorites.length} vehicle{favorites.length !== 1 ? 's' : ''} in your favorites
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">❤️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-8">Start browsing vehicles and add them to your favorites!</p>
            <Link href="/vehicles">
              <button className="bg-[#1C1F4A] text-white px-6 py-3 rounded-lg hover:bg-[#2A2F6B] transition-colors">
                Browse Vehicles
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gray-200">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-gray-400 text-center">
                          <div className="text-4xl mb-2">🚗</div>
                          <div className="text-sm">{vehicle.brand} {vehicle.model}</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <FavoriteButton vehicleId={vehicle.id} size="sm" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(vehicle.category)}`}>
                      {vehicle.category.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{vehicle.title}</h3>
                  <p className="text-gray-600 mb-4">
                    {vehicle.year} • {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'New'} 
                    {vehicle.range_miles && ` • ${vehicle.range_miles}mi range`}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-[#3AB0FF]">
                      ${vehicle.price.toLocaleString()}
                    </span>
                    <Link href={`/vehicles/${vehicle.id}`}>
                      <button className="bg-[#1C1F4A] text-white px-4 py-2 rounded-lg hover:bg-[#2A2F6B] transition-colors">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 