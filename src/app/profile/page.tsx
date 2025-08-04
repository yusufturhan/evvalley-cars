"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Car, Edit, Trash2, Plus, User, Mail, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";

interface Vehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  category: string;
  location: string;
  created_at: string;
  images: string[];
  sold?: boolean;
}

export default function ProfilePage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSupabaseId, setUserSupabaseId] = useState<string | null>(null);

  // Fetch user's Supabase ID and vehicles
  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn && user) {
        try {
          // First, sync user with Supabase
          const syncResponse = await fetch('/api/auth/sync', {
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

          if (syncResponse.ok) {
            const syncData = await syncResponse.json();
            setUserSupabaseId(syncData.supabaseId);
            console.log('✅ User Supabase ID fetched:', syncData.supabaseId);

            // Then fetch user's vehicles
            const vehiclesResponse = await fetch(`/api/vehicles?seller_id=${syncData.supabaseId}`);
            if (vehiclesResponse.ok) {
              const vehiclesData = await vehiclesResponse.json();
              setUserVehicles(vehiclesData.vehicles || []);
              console.log('✅ User vehicles fetched:', vehiclesData.vehicles?.length || 0);
            } else {
              console.error('❌ Failed to fetch user vehicles');
            }
          } else {
            console.error('❌ Failed to sync user');
          }
        } catch (error) {
          console.error('❌ Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isSignedIn, user]);

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    try {
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUserVehicles(prev => prev.filter(v => v.id !== vehicleId));
        alert('Vehicle deleted successfully!');
      } else {
        alert('Failed to delete vehicle');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete vehicle');
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-8">Please sign in to view your profile.</p>
            <button 
              onClick={() => router.push("/")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-[#F5F9FF] p-3 rounded-full">
              <User className="h-8 w-8 text-[#3AB0FF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {user?.emailAddresses[0]?.emailAddress}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since {new Date(user?.createdAt || '').toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* My Vehicles Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Vehicles</h2>
            <Link 
              href="/sell"
              className="bg-[#1C1F4A] text-white px-4 py-2 rounded-lg hover:bg-[#2A2F6B] flex items-center transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Link>
          </div>

          {userVehicles.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles listed yet</h3>
              <p className="text-gray-600 mb-6">Start by listing your first vehicle for sale.</p>
              <Link 
                href="/sell"
                className="bg-[#1C1F4A] text-white px-6 py-3 rounded-lg hover:bg-[#2A2F6B] inline-flex items-center transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                List Your First Vehicle
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userVehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    {vehicle.images && vehicle.images.length > 0 ? (
                      <img
                        src={vehicle.images[0]}
                        alt={vehicle.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Car className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{vehicle.title}</h3>
                  <div className="text-sm text-gray-600 mb-2">
                    {vehicle.brand} {vehicle.model} • {vehicle.year}
                  </div>
                  <div className="text-lg font-bold text-[#3AB0FF] mb-3">
                    ${vehicle.price.toLocaleString()}
                  </div>
                  
                  {vehicle.sold ? (
                    <div className="flex items-center justify-center">
                      <span className="px-3 py-2 bg-red-100 text-red-800 rounded text-sm font-medium">
                        SOLD
                      </span>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => router.push(`/vehicles/${vehicle.id}/edit`)}
                        className="flex-1 bg-[#3AB0FF] text-white px-3 py-2 rounded text-sm hover:bg-[#2A2F6B] flex items-center justify-center transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 