"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";

export default function EditVehiclePage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const routeParams = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (!isSignedIn || !user) {
        setLoading(false);
                return;
              }
              
      try {
        // Get vehicle ID
        const id = routeParams?.id;
        if (!id) {
          setError("Vehicle ID not found");
          setLoading(false);
          return;
        }

        // Fetch vehicle data
        const response = await fetch(`/api/vehicles/${id}`);
        if (response.ok) {
          const data = await response.json();
          setVehicle(data.vehicle);
      } else {
          setError("Vehicle not found");
        }
      } catch (err) {
        setError("Failed to load vehicle");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSignedIn, user, routeParams]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-8">Please sign in to edit vehicles.</p>
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
            <p className="mt-4 text-gray-600">Loading vehicle data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "The vehicle you're looking for doesn't exist."}</p>
            <button 
              onClick={() => router.push("/profile")}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push("/profile")}
              className="mr-4 p-2 text-gray-600 hover:text-green-600"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Vehicle</h1>
          </div>
          
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Vehicle Found!</h2>
              <p><strong>ID:</strong> {vehicle.id}</p>
              <p><strong>Title:</strong> {vehicle.title}</p>
              <p><strong>Brand:</strong> {vehicle.brand}</p>
              <p><strong>Model:</strong> {vehicle.model}</p>
              <p><strong>Year:</strong> {vehicle.year}</p>
              <p><strong>Price:</strong> ${vehicle.price}</p>
              <p><strong>Seller Email:</strong> {vehicle.seller_email}</p>
            </div>

            <div className="mt-8">
              <button
                onClick={() => router.push("/profile")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Back to Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 