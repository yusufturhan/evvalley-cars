"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function EditVehiclePage() {
  const params = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("EDIT PAGE: Starting...");
    console.log("EDIT PAGE: Params:", params);
    
    const id = params?.id;
    if (id) {
      console.log("EDIT PAGE: Vehicle ID:", id);
      
      fetch(`/api/vehicles/${id}`)
        .then(res => {
          console.log("EDIT PAGE: API Response Status:", res.status);
          return res.json();
        })
        .then(data => {
          console.log("EDIT PAGE: API Data:", data);
          setData(data);
        })
        .catch(err => {
          console.log("EDIT PAGE: API Error:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("EDIT PAGE: No vehicle ID found");
      setLoading(false);
    }
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Vehicle</h1>
          
          <div className="space-y-4">
            <p><strong>Vehicle ID:</strong> {params?.id}</p>
            <p><strong>Status:</strong> {data ? "Vehicle Found" : "Vehicle Not Found"}</p>
            
            {data && data.vehicle && (
              <div className="bg-gray-100 p-4 rounded">
                <h3 className="font-bold mb-2">Vehicle Data:</h3>
                <p><strong>Title:</strong> {data.vehicle.title}</p>
                <p><strong>Brand:</strong> {data.vehicle.brand}</p>
                <p><strong>Model:</strong> {data.vehicle.model}</p>
                <p><strong>Year:</strong> {data.vehicle.year}</p>
                <p><strong>Price:</strong> ${data.vehicle.price}</p>
                <p><strong>Seller Email:</strong> {data.vehicle.seller_email}</p>
              </div>
            )}
            
            {data && data.vehicle && (
              <div className="mt-6">
                <button 
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                  onClick={() => {
                    console.log("EDIT PAGE: Edit button clicked");
                    alert("Edit functionality will be implemented here");
                  }}
                >
                  Edit This Vehicle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}