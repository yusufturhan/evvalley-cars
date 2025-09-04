"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { Car, Zap, Battery, Bike, Upload, MapPin, Trash2, Star } from "lucide-react";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";

interface Vehicle {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  description: string;
  location: string;
  seller_email: string;
  images: string[];
  category: string;
  fuel_type: string;
  transmission: string;
  color: string;
  condition: string;
  range_miles: number;
  max_speed: number;
  battery_capacity: string;
  vehicle_condition: string;
  title_status: string;
  highlighted_features: string;
  weight: string;
  max_load: string;
  wheel_size: string;
  motor_power: string;
  charging_time: string;
  warranty: string;
  frame_size: string;
  motor_type: string;
  bike_type: string;
  gear_system: string;
  interior_color: string;
  exterior_color: string;
  body_seating: string;
  combined_fuel_economy: string;
  horsepower: number;
  electric_mile_range: string;
  battery_warranty: string;
  drivetrain: string;
  vin: string;
  seller_type: string;
}

export default function EditVehiclePage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
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
    fuel_type: "",
    seller_type: "private",
    vehicle_condition: "",
    title_status: "",
    highlighted_features: "",
    condition: "",
    weight: "",
    max_load: "",
    wheel_size: "",
    motor_power: "",
    charging_time: "",
    warranty: "",
    frame_size: "",
    motor_type: "",
    bike_type: "",
    gear_system: "",
    color: "",
    interior_color: "",
    exterior_color: "",
    body_seating: "",
    combined_fuel_economy: "",
    transmission: "",
    horsepower: "",
    electric_mile_range: "",
    battery_warranty: "",
    drivetrain: "",
    vin: ""
  });

  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ev-car');

  useEffect(() => {
    const fetchData = async () => {
      if (!isSignedIn || !user) {
        setLoading(false);
        return;
      }

      try {
        // Get vehicle ID
        const id = params?.id;
        if (!id) {
          setError("Vehicle ID not found");
          setLoading(false);
          return;
        }

        // Fetch vehicle data
        const vehicleResponse = await fetch(`/api/vehicles/${id}`);
        if (!vehicleResponse.ok) {
          throw new Error('Failed to fetch vehicle data');
        }

        const vehicleData = await vehicleResponse.json();
        const vehicleInfo = vehicleData.vehicle;
        setVehicle(vehicleInfo);

        // Ownership Check (email-based only)
        const userEmail = user.emailAddresses[0]?.emailAddress || '';
        const ownsByEmail = (vehicleInfo.seller_email || '').toLowerCase() === userEmail.toLowerCase();
        const userDomain = userEmail.split('@')[1];
        const sellerDomain = (vehicleInfo.seller_email || '').split('@')[1];
        const ownsByDomain = userDomain && sellerDomain && userDomain === sellerDomain;

        if (!ownsByEmail && !ownsByDomain) {
          setError("You can only edit your own vehicles.");
          router.push("/profile");
          return;
        }

        // Set category
        setSelectedCategory(vehicleInfo.category || 'ev-car');

        // Populate form with vehicle data
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
          fuel_type: vehicleInfo.fuel_type || "",
          seller_type: vehicleInfo.seller_type || "private",
          vehicle_condition: vehicleInfo.vehicle_condition || "",
          title_status: vehicleInfo.title_status || "",
          highlighted_features: vehicleInfo.highlighted_features || "",
          condition: vehicleInfo.condition || "",
          weight: vehicleInfo.weight || "",
          max_load: vehicleInfo.max_load || "",
          wheel_size: vehicleInfo.wheel_size || "",
          motor_power: vehicleInfo.motor_power || "",
          charging_time: vehicleInfo.charging_time || "",
          warranty: vehicleInfo.warranty || "",
          frame_size: vehicleInfo.frame_size || "",
          motor_type: vehicleInfo.motor_type || "",
          bike_type: vehicleInfo.bike_type || "",
          gear_system: vehicleInfo.gear_system || "",
          color: vehicleInfo.color || "",
          interior_color: vehicleInfo.interior_color || "",
          exterior_color: vehicleInfo.exterior_color || "",
          body_seating: vehicleInfo.body_seating || "",
          combined_fuel_economy: vehicleInfo.combined_fuel_economy || "",
          transmission: vehicleInfo.transmission || "",
          horsepower: vehicleInfo.horsepower?.toString() || "",
          electric_mile_range: vehicleInfo.electric_mile_range || "",
          battery_warranty: vehicleInfo.battery_warranty || "",
          drivetrain: vehicleInfo.drivetrain || "",
          vin: vehicleInfo.vin || ""
        });

        // Set existing images
        if (vehicleInfo.images && vehicleInfo.images.length > 0) {
          setImageUrls(vehicleInfo.images);
        }

      } catch (err: any) {
        console.error('Error in fetchData:', err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isSignedIn, user, params, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = (newImages: File[]) => {
    setImages(newImages);
  };

  const removeImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
  };

  const setCoverImage = (index: number) => {
    const newUrls = [...imageUrls];
    const coverImage = newUrls.splice(index, 1)[0];
    newUrls.unshift(coverImage);
    setImageUrls(newUrls);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.model.trim()) newErrors.model = 'Model is required';
    if (!formData.year.trim()) newErrors.year = 'Year is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    // Numeric validations
    if (formData.price && (isNaN(Number(formData.price)) || Number(formData.price) <= 0)) {
      newErrors.price = 'Price must be a positive number';
    }
    if (formData.year && (isNaN(Number(formData.year)) || Number(formData.year) < 1900 || Number(formData.year) > new Date().getFullYear() + 1)) {
      newErrors.year = 'Year must be between 1900 and ' + (new Date().getFullYear() + 1);
    }
    if (formData.mileage && (isNaN(Number(formData.mileage)) || Number(formData.mileage) < 0)) {
      newErrors.mileage = 'Mileage must be a positive number';
    }

    // Images validation
    if (imageUrls.length === 0 && images.length === 0) {
      newErrors.images = 'At least one image is required';
    } else if (images.length > 12) {
      newErrors.images = 'Maximum 12 images allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!vehicle) return;

    setSaving(true);
    try {
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      // Add images
      images.forEach((image, index) => {
        formDataToSend.append('images', image);
      });

      // Add existing image URLs
      imageUrls.forEach((url, index) => {
        formDataToSend.append('existingImages', url);
      });

      const response = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      if (response.ok) {
        router.push('/profile');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update vehicle');
      }
    } catch (err) {
      setError('Failed to update vehicle');
    } finally {
      setSaving(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-8">Please sign in to edit vehicles.</p>
          <button onClick={() => router.push("/")} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading vehicle data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <button onClick={() => router.push("/profile")} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
          <p className="text-gray-600 mb-8">The vehicle you're looking for doesn't exist or you don't have permission.</p>
          <button onClick={() => router.push("/profile")} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700">
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Vehicle</h1>
          
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
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setFormData(prev => ({ ...prev, category: e.target.value }));
                  }}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="ev-car" className="text-gray-900">EV Car</option>
                  <option value="hybrid-car" className="text-gray-900">Hybrid Car</option>
                  <option value="ev-scooter" className="text-gray-900">EV Scooter</option>
                  <option value="e-bike" className="text-gray-900">E-Bike</option>
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

            {/* Seller Type and Vehicle Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seller Type *
                </label>
                <select
                  name="seller_type"
                  value={formData.seller_type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="private" className="text-gray-900">Private Seller</option>
                  <option value="dealer" className="text-gray-900">Dealer</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.seller_type === 'private' && 'You are selling your own vehicle'}
                  {formData.seller_type === 'dealer' && 'You are selling as a professional dealer'}
                </p>
              </div>

              {(selectedCategory === 'ev-car' || selectedCategory === 'hybrid-car') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Condition
                  </label>
                  <select
                    name="vehicle_condition"
                    value={formData.vehicle_condition}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-900">Select condition</option>
                    <option value="excellent" className="text-gray-900">Excellent</option>
                    <option value="good" className="text-gray-900">Good</option>
                    <option value="fair" className="text-gray-900">Fair</option>
                    <option value="poor" className="text-gray-900">Poor</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Describe the overall condition of your vehicle
                  </p>
                </div>
              )}
            </div>

            {/* Title Status - Only for Cars */}
            {(selectedCategory === 'ev-car' || selectedCategory === 'hybrid-car') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title Status *
                </label>
                <select
                  name="title_status"
                  value={formData.title_status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="" className="text-gray-900">Select title status</option>
                  <option value="clean" className="text-gray-900">Clean Title</option>
                  <option value="salvage" className="text-gray-900">Salvage Title</option>
                  <option value="rebuilt" className="text-gray-900">Rebuilt Title</option>
                  <option value="flood" className="text-gray-900">Flood Title</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Clean title means no major accidents. Salvage means the vehicle was declared a total loss by insurance.
                </p>
              </div>
            )}

            {/* Year, Price, Mileage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  min="1900"
                  max={new Date().getFullYear() + 1}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="50000"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>

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
                {errors.mileage && <p className="text-red-500 text-xs mt-1">{errors.mileage}</p>}
              </div>
            </div>

            {/* Fuel Type and Range - Only for Cars */}
            {(selectedCategory === 'ev-car' || selectedCategory === 'hybrid-car') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fuel Type
                  </label>
                  <select
                    name="fuel_type"
                    value={formData.fuel_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                  >
                    <option value="" className="text-gray-900">Select fuel type</option>
                    <option value="electric" className="text-gray-900">Electric</option>
                    <option value="hybrid" className="text-gray-900">Hybrid</option>
                    <option value="plug-in-hybrid" className="text-gray-900">Plug-in Hybrid</option>
                    <option value="hydrogen" className="text-gray-900">Hydrogen</option>
                  </select>
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
            )}

            {/* Vehicle Details - Only for Cars */}
            {(selectedCategory === 'ev-car' || selectedCategory === 'hybrid-car') && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Details</h3>
                
                {/* Colors and Body */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      placeholder="Enter color here"
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
                      placeholder="Enter color here"
                    />
                  </div>
                </div>

                {/* Body and Transmission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Body/Seating
                    </label>
                    <input
                      type="text"
                      name="body_seating"
                      value={formData.body_seating}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Enter body/seating here"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transmission
                    </label>
                    <select
                      name="transmission"
                      value={formData.transmission}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="" className="text-gray-900">Select transmission here</option>
                      <option value="automatic" className="text-gray-900">Automatic Transmission</option>
                      <option value="e-cvt" className="text-gray-900">e-CVT</option>
                      <option value="single-speed" className="text-gray-900">Single-Speed</option>
                      <option value="2-speed" className="text-gray-900">2-Speed Transmission</option>
                      <option value="dct" className="text-gray-900">DCT (Dual-Clutch)</option>
                    </select>
                  </div>
                </div>

                {/* Fuel Economy and Horsepower */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      placeholder="Enter combined fuel economy here"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horsepower
                    </label>
                    <input
                      type="number"
                      name="horsepower"
                      value={formData.horsepower}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Enter horsepower here"
                    />
                  </div>
                </div>

                {/* Electric Range and Battery Warranty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Electric Mile Range
                    </label>
                    <input
                      type="number"
                      name="electric_mile_range"
                      value={formData.electric_mile_range}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Enter electric mile range here"
                    />
                  </div>
                  
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
                      placeholder="Enter battery warranty here"
                    />
                  </div>
                </div>

                {/* Drivetrain and VIN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      placeholder="Enter drivetrain here"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      VIN
                    </label>
                    <input
                      type="text"
                      name="vin"
                      value={formData.vin}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Enter VIN here"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., New York, NY"
                />
              </div>
              {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
            </div>

            {/* Image Management */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Images
              </label>
              
              {/* Cover Photo Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Star className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      📸 Cover Photo Management
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p><strong>The first photo is your cover photo</strong> - it appears as the main image on your listing.</p>
                      <p className="mt-1">💡 <strong>Tip:</strong> Use the star button to set any photo as your cover photo!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Existing Images */}
              {imageUrls.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Vehicle image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                            {index === 0 && (
                              <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                                Cover
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => setCoverImage(index)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded"
                              title="Set as cover photo"
                            >
                              <Star className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                              title="Remove image"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Image Upload */}
              <ImageUpload onImagesChange={handleImagesChange} onUrlsChange={() => {}} maxImages={12} />
              {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
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
                placeholder="Describe your vehicle's condition, features, and any additional information..."
              />
            </div>

            {/* Highlighted Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Highlighted Features
              </label>
              <textarea
                name="highlighted_features"
                value={formData.highlighted_features}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="List the key features of your vehicle (e.g., Autopilot, Premium Sound, Leather Seats, Navigation, etc.)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Highlight the most important features that make your vehicle special
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
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