"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { Car, Upload, MapPin, ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";

interface Vehicle {
  id: string;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage: number | null;
  brand: string;
  model: string;
  category: string;
  range_miles: number | null;
  max_speed: number | null;
  battery_capacity: string | null;
  location: string | null;
  fuel_type: string;
  images: string[];
  interior_color?: string;
  exterior_color?: string;
  body_seating?: string;
  combined_fuel_economy?: string;
  horsepower?: number;
  electric_mile_range?: number;
  battery_warranty?: string;
  drivetrain?: string;
  vin?: string;
  seller_type?: string;
}

export default function EditVehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const routeParams = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [userSupabaseId, setUserSupabaseId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  console.log('EditVehiclePage loaded!');
  console.log('isSignedIn:', isSignedIn);
  console.log('user:', user?.emailAddresses?.[0]?.emailAddress);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    year: "",
    mileage: "",
    brand: "",
    model: "",
    category: "ev-car",
    range_miles: "",
    max_speed: "",
    battery_capacity: "",
    location: "",
    fuel_type: "electric",
    interior_color: "",
    exterior_color: "",
    body_seating: "",
    combined_fuel_economy: "",
    horsepower: "",
    electric_mile_range: "",
    battery_warranty: "",
    drivetrain: "",
    vin: "",
    seller_type: "private",
    highlighted_features: ""
  });
  const [images, setImages] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<number[]>([]);

  // Fetch vehicle data and user info
  useEffect(() => {
    const fetchData = async () => {
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

            // Then fetch vehicle data (prefer client route params)
            const idFromRoute = routeParams?.id;
            const resolvedId = Array.isArray(idFromRoute) ? idFromRoute[0] : idFromRoute;
            const fallback = await params; // keep SSR param as fallback
            const id = resolvedId || fallback.id;
            console.log('🔍 Edit page - ID resolution:', { idFromRoute, resolvedId, fallbackId: fallback.id, finalId: id });
            if (!id) {
              console.warn('❌ Edit page: missing vehicle id from params');
              setLoading(false);
              return;
            }
            console.log('🔍 Edit page - Fetching vehicle with ID:', id);
            const vehicleResponse = await fetch(`/api/vehicles/${id}`);
            
            if (vehicleResponse.ok) {
              const vehicleData = await vehicleResponse.json();
              const vehicleInfo = vehicleData.vehicle;
              setVehicle(vehicleInfo);

              // Check if user owns this vehicle (by seller_id OR fallback to email)
              const userEmail = user.emailAddresses[0]?.emailAddress || '';
              const ownsById = vehicleInfo.seller_id === syncData.supabaseId;
              const ownsByEmail = (vehicleInfo.seller_email || '').toLowerCase() === userEmail.toLowerCase();

              console.log('🔍 Ownership check:', {
                vehicleSellerId: vehicleInfo.seller_id,
                userSupabaseId: syncData.supabaseId,
                vehicleSellerEmail: vehicleInfo.seller_email,
                userEmail,
                ownsById,
                ownsByEmail,
              });

              if (!ownsById && !ownsByEmail) {
                console.log('❌ Access denied: User does not own this vehicle');
                alert("You can only edit your own vehicles");
                router.push("/profile");
                return;
              }
              
              console.log('✅ Access granted: User owns this vehicle');

              // Debug: Log vehicle data
              console.log('🔍 Vehicle data from API:', vehicleInfo);
              
              // Populate form with existing data
              setFormData({
                title: vehicleInfo.title || "",
                description: vehicleInfo.description || "",
                price: vehicleInfo.price?.toString() || "",
                year: vehicleInfo.year?.toString() || "",
                mileage: vehicleInfo.mileage?.toString() || "",
                brand: vehicleInfo.brand || "",
                model: vehicleInfo.model || "",
                category: vehicleInfo.category || "ev-car",
                range_miles: vehicleInfo.range_miles?.toString() || "",
                max_speed: vehicleInfo.max_speed?.toString() || "",
                battery_capacity: vehicleInfo.battery_capacity || "",
                location: vehicleInfo.location || "",
                fuel_type: vehicleInfo.fuel_type || "electric",
                interior_color: vehicleInfo.interior_color || "",
                exterior_color: vehicleInfo.exterior_color || "",
                body_seating: vehicleInfo.body_seating || "",
                combined_fuel_economy: vehicleInfo.combined_fuel_economy || "",
                horsepower: vehicleInfo.horsepower?.toString() || "",
                electric_mile_range: vehicleInfo.electric_mile_range?.toString() || "",
                battery_warranty: vehicleInfo.battery_warranty || "",
                drivetrain: vehicleInfo.drivetrain || "",
                vin: vehicleInfo.vin || "",
                seller_type: vehicleInfo.seller_type || "private",
                highlighted_features: vehicleInfo.highlighted_features || ""
              });
            } else {
              console.log('❌ Edit page - Vehicle fetch failed:', vehicleResponse.status, vehicleResponse.statusText);
              const errorData = await vehicleResponse.json().catch(() => ({}));
              console.log('❌ Edit page - Error details:', errorData);
              alert("Vehicle not found");
              router.push("/profile");
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          alert("Failed to load vehicle data");
          router.push("/profile");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSignedIn, user, params, routeParams, router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Vehicle title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    // Brand validation
    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    } else if (formData.brand.length < 2) {
      newErrors.brand = 'Brand must be at least 2 characters';
    }

    // Model validation
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required';
    } else if (formData.model.length < 2) {
      newErrors.model = 'Model must be at least 2 characters';
    }

    // Year validation
    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else {
      const yearNum = parseInt(formData.year);
      if (isNaN(yearNum) || yearNum < 1990 || yearNum > new Date().getFullYear() + 1) {
        newErrors.year = `Year must be between 1990 and ${new Date().getFullYear() + 1}`;
      }
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = 'Price must be a positive number';
      } else if (priceNum > 1000000) {
        newErrors.price = 'Price cannot exceed $1,000,000';
      }
    }

    // Description validation (optional)
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      alert("Please sign in to edit a vehicle");
      return;
    }

    if (!vehicle) {
      alert("Vehicle data not loaded");
      return;
    }

    // Validate form
    if (!validateForm()) {
      alert("Please fix the errors in the form");
      return;
    }

    setSaving(true);
    try {
      const idFromRoute = routeParams?.id;
      const resolvedId = Array.isArray(idFromRoute) ? idFromRoute[0] : idFromRoute;
      const fallback = await params;
      const id = resolvedId || fallback.id;
      
      // Create FormData
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title.trim());
      submitFormData.append('description', formData.description.trim());
      submitFormData.append('price', formData.price);
      submitFormData.append('year', formData.year);
      submitFormData.append('mileage', formData.mileage || '');
      submitFormData.append('fuel_type', formData.fuel_type);
      submitFormData.append('brand', formData.brand.trim());
      submitFormData.append('model', formData.model.trim());
      submitFormData.append('category', formData.category);
      submitFormData.append('range_miles', formData.range_miles || '');
      submitFormData.append('max_speed', formData.max_speed || '');
      submitFormData.append('battery_capacity', formData.battery_capacity || '');
      submitFormData.append('location', formData.location.trim() || '');
      submitFormData.append('interior_color', formData.interior_color || '');
      submitFormData.append('exterior_color', formData.exterior_color || '');
      submitFormData.append('body_seating', formData.body_seating || '');
      submitFormData.append('combined_fuel_economy', formData.combined_fuel_economy || '');
      submitFormData.append('horsepower', formData.horsepower || '');
      submitFormData.append('electric_mile_range', formData.electric_mile_range || '');
      submitFormData.append('battery_warranty', formData.battery_warranty || '');
      submitFormData.append('drivetrain', formData.drivetrain || '');
      submitFormData.append('vin', formData.vin || '');
      submitFormData.append('highlighted_features', formData.highlighted_features || '');

      // Add new images if provided
      images.forEach((image, index) => {
        submitFormData.append('images', image);
      });

      // Add deleted image indices
      if (deletedImages.length > 0) {
        submitFormData.append('deletedImages', JSON.stringify(deletedImages));
      }
      
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        body: submitFormData,
      });

      if (response.ok) {
        // Check if price changed and send notifications
        const oldPrice = vehicle.price;
        const newPrice = parseFloat(formData.price);
        
        if (oldPrice !== newPrice) {
          try {
            const notificationResponse = await fetch('/api/notifications/price-change', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                vehicleId: vehicle.id,
                oldPrice: oldPrice,
                newPrice: newPrice
              }),
            });

            if (notificationResponse.ok) {
              const notificationData = await notificationResponse.json();
              console.log(`✅ Price change notifications sent to ${notificationData.notifiedUsers} users`);
            }
          } catch (error) {
            console.error('Error sending price change notifications:', error);
          }
        }

        alert("Vehicle updated successfully!");
        router.push("/profile");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update vehicle");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const handleDeleteImage = (index: number) => {
    setDeletedImages(prev => [...prev, index]);
    alert("Image marked for deletion. To save changes, please click the 'Save Changes' button.");
  };

  const handleRestoreImage = (index: number) => {
    setDeletedImages(prev => prev.filter(i => i !== index));
  };

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

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
            <p className="text-gray-600 mb-8">The vehicle you're looking for doesn't exist.</p>
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
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Edit Vehicle</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Tesla Model 3"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="ev-car">EV Car</option>
                  <option value="hybrid-car">Hybrid Car</option>
                  <option value="ev-scooter">EV Scooter</option>
                  <option value="e-bike">E-Bike</option>
                </select>
              </div>
            </div>

            {/* Brand and Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Tesla"
                />
                {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Model 3"
                />
                {errors.model && <p className="text-red-500 text-xs mt-1">{errors.model}</p>}
              </div>
            </div>

            {/* Year and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  min="1990"
                  max="2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="2023"
                />
                {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="42500"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
            </div>

            {/* Mileage and Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mileage (miles)
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="15000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Range (miles)
                </label>
                <input
                  type="number"
                  name="range_miles"
                  value={formData.range_miles}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="350"
                />
              </div>
            </div>

            {/* EV Specific Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Speed (mph)
                </label>
                <input
                  type="number"
                  name="max_speed"
                  value={formData.max_speed}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="155"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Battery Capacity
                </label>
                <input
                  type="text"
                  name="battery_capacity"
                  value={formData.battery_capacity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="75 kWh"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Describe your vehicle, its features, condition, and any additional information..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interior Color
                  </label>
                  <input
                    type="text"
                    name="interior_color"
                    value={formData.interior_color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g., Black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exterior Color
                  </label>
                  <input
                    type="text"
                    name="exterior_color"
                    value={formData.exterior_color}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g., White"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Body & Seating
                  </label>
                  <input
                    type="text"
                    name="body_seating"
                    value={formData.body_seating}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g., SUV, 5 seats"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Combined Fuel Economy
                  </label>
                  <input
                    type="text"
                    name="combined_fuel_economy"
                    value={formData.combined_fuel_economy}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g., 120 MPGe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horsepower
                  </label>
                  <input
                    type="number"
                    name="horsepower"
                    value={formData.horsepower}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g., 300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Electric Mile Range
                  </label>
                  <input
                    type="number"
                    name="electric_mile_range"
                    value={formData.electric_mile_range}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g., 300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Battery Warranty
                  </label>
                  <input
                    type="text"
                    name="battery_warranty"
                    value={formData.battery_warranty}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g., 8 years/100,000 miles"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Drivetrain
                  </label>
                  <input
                    type="text"
                    name="drivetrain"
                    value={formData.drivetrain}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="e.g., AWD"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VIN
                </label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., 1HGBH41JXMN109186"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Highlighted Features
                </label>
                <textarea
                  name="highlighted_features"
                  value={formData.highlighted_features}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., Autopilot, Premium Interior, Performance Package, etc."
                />
              </div>
            </div>

            {/* Current Images */}
            {vehicle.images && vehicle.images.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Images
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vehicle.images.map((image, index) => {
                    const isDeleted = deletedImages.includes(index);
                    return (
                      <div key={index} className={`relative group ${isDeleted ? 'opacity-50' : ''}`}>
                        <img
                          src={image}
                          alt={`Vehicle ${index + 1}`}
                          className={`w-full h-24 object-cover rounded-lg ${isDeleted ? 'grayscale' : ''}`}
                        />
                        
                        {/* Delete/Restore Button */}
                        {isDeleted ? (
                          <button
                            type="button"
                            onClick={() => handleRestoreImage(index)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-green-500 hover:bg-green-600 text-white transition-all z-10"
                            title="Restore image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(index)}
                            className="absolute top-1 right-1 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
                            title="Delete image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                        
                        {/* Deleted Overlay */}
                        {isDeleted && (
                          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center pointer-events-none z-0">
                            <span className="text-white text-xs font-medium bg-red-500 px-2 py-1 rounded">
                              Deleted
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-gray-500">
                    Click the X button on images to delete them. Deleted images will be removed when you save changes.
                  </p>
                  {deletedImages.length > 0 && (
                    <p className="text-sm text-blue-600">
                      {deletedImages.length} image(s) marked for deletion. Click the restore button (↻) to keep them.
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* New Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Images (Optional)
              </label>
              
              {/* Cover Photo Warning */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      📸 Cover Photo Tip
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p><strong>The first photo you upload will replace your current cover photo</strong> - it will appear as the main image on your listing.</p>
                      <p className="mt-1">💡 <strong>Tip:</strong> Choose your best exterior shot as the first photo for maximum impact!</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <ImageUpload onImagesChange={handleImagesChange} maxImages={12} />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Describe your vehicle's condition, features, and any additional information... (Optional)"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 