"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Car, Zap, Battery, Bike, Upload, MapPin } from "lucide-react";
import Header from "@/components/Header";
import ImageUpload from "@/components/ImageUpload";

export default function SellPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userSupabaseId, setUserSupabaseId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('ev-car');
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
    seller_email: user?.emailAddresses[0]?.emailAddress || "",
    // New fields
    vehicle_condition: "",
    title_status: "",
    highlighted_features: "",
    condition: "",
    // Scooter/Bike specific fields
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
    // Color field for scooters and bikes
    color: "",
    // Extended fields
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

  // Fetch user's Supabase ID when component mounts
  useEffect(() => {
    const fetchUserSupabaseId = async () => {
      if (isSignedIn && user) {
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
            const data = await response.json();
            setUserSupabaseId(data.supabaseId);
            console.log('✅ User Supabase ID fetched:', data.supabaseId);
          } else {
            console.error('❌ Failed to fetch user Supabase ID');
          }
        } catch (error) {
          console.error('❌ Error fetching user Supabase ID:', error);
        }
      }
    };

    fetchUserSupabaseId();
  }, [isSignedIn, user]);

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

    // Description validation (optional now)
    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
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

    // Mileage validation
    if (formData.mileage) {
      const mileageNum = parseInt(formData.mileage);
      if (isNaN(mileageNum) || mileageNum < 0) {
        newErrors.mileage = 'Mileage must be a positive number';
      } else if (mileageNum > 1000000) {
        newErrors.mileage = 'Mileage cannot exceed 1,000,000';
      }
    }

    // Range validation
    if (formData.range_miles) {
      const rangeNum = parseInt(formData.range_miles);
      if (isNaN(rangeNum) || rangeNum < 0) {
        newErrors.range_miles = 'Range must be a positive number';
      } else if (rangeNum > 1000) {
        newErrors.range_miles = 'Range cannot exceed 1,000 miles';
      }
    }

    // Max speed validation
    if (formData.max_speed) {
      const speedNum = parseInt(formData.max_speed);
      if (isNaN(speedNum) || speedNum < 0) {
        newErrors.max_speed = 'Max speed must be a positive number';
      } else if (speedNum > 300) {
        newErrors.max_speed = 'Max speed cannot exceed 300 mph';
      }
    }

    // Description validation (optional)
    if (formData.description.trim() && formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters';
    }

    // Images validation
    if (images.length === 0) {
      newErrors.images = 'At least one image is required';
    } else if (images.length > 12) {
      newErrors.images = 'Maximum 12 images allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      alert("Please sign in to list a vehicle");
      return;
    }

    if (!userSupabaseId) {
      alert("Please wait while we load your account information");
      return;
    }

    // Validate form
    if (!validateForm()) {
      console.error("❌ Form validation failed:", errors);
      alert("Please fix the errors in the form. Check the console for details.");
      return;
    }

    setLoading(true);
    try {
      console.log("🚀 Starting vehicle submission...");
      console.log("📝 Form data:", formData);
      console.log("🖼️ Images count:", images.length);
      console.log("👤 User Supabase ID:", userSupabaseId);
      
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
      submitFormData.append('seller_id', userSupabaseId);
      submitFormData.append('seller_email', formData.seller_email);

      // Add new vehicle detail fields to FormData
      submitFormData.append('vehicle_condition', formData.vehicle_condition || '');
      submitFormData.append('title_status', formData.title_status || '');
      submitFormData.append('highlighted_features', formData.highlighted_features || '');
      submitFormData.append('interior_color', formData.interior_color || '');
      submitFormData.append('exterior_color', formData.exterior_color || '');
      submitFormData.append('body_seating', formData.body_seating || '');
      submitFormData.append('combined_fuel_economy', formData.combined_fuel_economy || '');
      submitFormData.append('transmission', formData.transmission || '');
      submitFormData.append('horsepower', formData.horsepower || '');
      submitFormData.append('electric_mile_range', formData.electric_mile_range || '');
      submitFormData.append('battery_warranty', formData.battery_warranty || '');
      submitFormData.append('drivetrain', formData.drivetrain || '');
      submitFormData.append('vin', formData.vin || '');

      // Add images to FormData
      images.forEach((image, index) => {
        submitFormData.append('images', image);
      });
      
      const response = await fetch("/api/vehicles", {
        method: "POST",
        body: submitFormData,
      });

      if (response.ok) {
        alert("Vehicle listed successfully!");
        router.push("/vehicles");
      } else {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData);
        alert(`Error: ${errorData.error || 'Failed to list vehicle'}`);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      alert("Network error: Failed to list vehicle. Please check your connection and try again.");
    } finally {
      setLoading(false);
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

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sign In Required</h1>
            <p className="text-gray-600 mb-8">Please sign in to list your vehicle for sale.</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">List Your Vehicle</h1>
          
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
                  placeholder={
                    selectedCategory === 'ev-scooter' ? "e.g., Segway Ninebot Max" :
                    selectedCategory === 'e-bike' ? "e.g., Trek Verve+ 2" :
                    "e.g., Tesla Model 3"
                  }
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

            {/* Brand and Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand *
                </label>
                <select
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                >
                  <option value="" className="text-gray-900">Select brand</option>
                  
                  {/* Car Brands */}
                  {(selectedCategory === 'ev-car' || selectedCategory === 'hybrid-car') && (
                    <>
                      <option value="Tesla" className="text-gray-900">Tesla</option>
                      <option value="Rivian" className="text-gray-900">Rivian</option>
                      <option value="Lucid" className="text-gray-900">Lucid</option>
                      <option value="Ford" className="text-gray-900">Ford</option>
                      <option value="Chevrolet" className="text-gray-900">Chevrolet</option>
                      <option value="Toyota" className="text-gray-900">Toyota</option>
                      <option value="Honda" className="text-gray-900">Honda</option>
                      <option value="Nissan" className="text-gray-900">Nissan</option>
                      <option value="BMW" className="text-gray-900">BMW</option>
                      <option value="Mercedes-Benz" className="text-gray-900">Mercedes-Benz</option>
                      <option value="Audi" className="text-gray-900">Audi</option>
                      <option value="Volkswagen" className="text-gray-900">Volkswagen</option>
                      <option value="Hyundai" className="text-gray-900">Hyundai</option>
                      <option value="Kia" className="text-gray-900">Kia</option>
                      <option value="Lexus" className="text-gray-900">Lexus</option>
                      <option value="Porsche" className="text-gray-900">Porsche</option>
                      <option value="Volvo" className="text-gray-900">Volvo</option>
                      <option value="Jaguar" className="text-gray-900">Jaguar</option>
                      <option value="Land Rover" className="text-gray-900">Land Rover</option>
                      <option value="Mazda" className="text-gray-900">Mazda</option>
                      <option value="Mitsubishi" className="text-gray-900">Mitsubishi</option>
                      <option value="Subaru" className="text-gray-900">Subaru</option>
                      <option value="Polestar" className="text-gray-900">Polestar</option>
                      <option value="Fisker" className="text-gray-900">Fisker</option>
                      <option value="VinFast" className="text-gray-900">VinFast</option>
                      <option value="Bollinger" className="text-gray-900">Bollinger</option>
                      <option value="Canoo" className="text-gray-900">Canoo</option>
                      <option value="Lordstown" className="text-gray-900">Lordstown</option>
                      <option value="Nikola" className="text-gray-900">Nikola</option>
                    </>
                  )}
                  
                  {/* Scooter Brands */}
                  {selectedCategory === 'ev-scooter' && (
                    <>
                      <option value="Segway" className="text-gray-900">Segway</option>
                      <option value="Xiaomi" className="text-gray-900">Xiaomi</option>
                      <option value="Ninebot" className="text-gray-900">Ninebot</option>
                      <option value="Razor" className="text-gray-900">Razor</option>
                      <option value="GoTrax" className="text-gray-900">GoTrax</option>
                      <option value="Hiboy" className="text-gray-900">Hiboy</option>
                      <option value="Glion" className="text-gray-900">Glion</option>
                      <option value="Unagi" className="text-gray-900">Unagi</option>
                      <option value="Bird" className="text-gray-900">Bird</option>
                      <option value="Lime" className="text-gray-900">Lime</option>
                      <option value="Spin" className="text-gray-900">Spin</option>
                      <option value="Vespa" className="text-gray-900">Vespa</option>
                      <option value="Yamaha" className="text-gray-900">Yamaha</option>
                      <option value="Honda" className="text-gray-900">Honda</option>
                      <option value="Suzuki" className="text-gray-900">Suzuki</option>
                      <option value="Kymco" className="text-gray-900">Kymco</option>
                      <option value="SYM" className="text-gray-900">SYM</option>
                      <option value="Other" className="text-gray-900">Other</option>
                    </>
                  )}
                  
                  {/* E-Bike Brands */}
                  {selectedCategory === 'e-bike' && (
                    <>
                      <option value="Trek" className="text-gray-900">Trek</option>
                      <option value="Specialized" className="text-gray-900">Specialized</option>
                      <option value="Giant" className="text-gray-900">Giant</option>
                      <option value="Cannondale" className="text-gray-900">Cannondale</option>
                      <option value="Santa Cruz" className="text-gray-900">Santa Cruz</option>
                      <option value="Yeti" className="text-gray-900">Yeti</option>
                      <option value="Ibis" className="text-gray-900">Ibis</option>
                      <option value="Pivot" className="text-gray-900">Pivot</option>
                      <option value="Salsa" className="text-gray-900">Salsa</option>
                      <option value="Surly" className="text-gray-900">Surly</option>
                      <option value="All-City" className="text-gray-900">All-City</option>
                      <option value="Kona" className="text-gray-900">Kona</option>
                      <option value="Marin" className="text-gray-900">Marin</option>
                      <option value="Diamondback" className="text-gray-900">Diamondback</option>
                      <option value="Raleigh" className="text-gray-900">Raleigh</option>
                      <option value="Schwinn" className="text-gray-900">Schwinn</option>
                      <option value="Huffy" className="text-gray-900">Huffy</option>
                      <option value="Kent" className="text-gray-900">Kent</option>
                      <option value="Mongoose" className="text-gray-900">Mongoose</option>
                      <option value="Haro" className="text-gray-900">Haro</option>
                      <option value="GT" className="text-gray-900">GT</option>
                      <option value="Redline" className="text-gray-900">Redline</option>
                      <option value="SE" className="text-gray-900">SE</option>
                      <option value="Volume" className="text-gray-900">Volume</option>
                      <option value="Other" className="text-gray-900">Other</option>
                    </>
                  )}
                </select>
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
                      placeholder={
                        selectedCategory === 'ev-scooter' ? "e.g., Ninebot Max" :
                        selectedCategory === 'e-bike' ? "e.g., Verve+ 2" :
                        "e.g., Model 3"
                      }
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

            {/* Fuel Type and Mileage - Only for Cars */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900"
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
                    Mileage (miles)
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="15000"
                  />
                  {errors.mileage && <p className="text-red-500 text-xs mt-1">{errors.mileage}</p>}
                </div>
              </div>
            )}

            {/* Range - Only for Cars */}
            {(selectedCategory === 'ev-car' || selectedCategory === 'hybrid-car') && (
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="350"
                />
                {errors.range_miles && <p className="text-red-500 text-xs mt-1">{errors.range_miles}</p>}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
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
                    <select
                      name="drivetrain"
                      value={formData.drivetrain}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="" className="text-gray-900">Select drivetrain here</option>
                      <option value="awd" className="text-gray-900">All-Wheel Drive (AWD)</option>
                      <option value="fwd" className="text-gray-900">Front-Wheel Drive (FWD)</option>
                      <option value="rwd" className="text-gray-900">Rear-Wheel Drive (RWD)</option>
                      <option value="4wd" className="text-gray-900">Four-Wheel Drive (4WD)</option>
                    </select>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="Enter VIN here"
                      maxLength={17}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* EV Specific Fields - Only for Cars */}
            {(selectedCategory === 'ev-car' || selectedCategory === 'hybrid-car') && (
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="155"
                  />
                  {errors.max_speed && <p className="text-red-500 text-xs mt-1">{errors.max_speed}</p>}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    placeholder="75 kWh"
                  />
                </div>
              </div>
            )}

            {/* Scooter Specific Fields */}
            {selectedCategory === 'ev-scooter' && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scooter Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="" className="text-gray-900">Select condition</option>
                      <option value="excellent" className="text-gray-900">Excellent</option>
                      <option value="good" className="text-gray-900">Good</option>
                      <option value="fair" className="text-gray-900">Fair</option>
                      <option value="poor" className="text-gray-900">Poor</option>
                    </select>
                  </div>
                  
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="25"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="36V 7.8Ah"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="35"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Load (lbs)
                    </label>
                    <input
                      type="number"
                      name="max_load"
                      value={formData.max_load}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="265"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wheel Size
                    </label>
                    <input
                      type="text"
                      name="wheel_size"
                      value={formData.wheel_size}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="10 inch"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motor Power (W)
                    </label>
                    <input
                      type="number"
                      name="motor_power"
                      value={formData.motor_power}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Black, White, Red"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Charging Time
                    </label>
                    <input
                      type="text"
                      name="charging_time"
                      value={formData.charging_time}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="4-6 hours"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Warranty
                    </label>
                    <input
                      type="text"
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="1 year"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* E-Bike Specific Fields */}
            {selectedCategory === 'e-bike' && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">E-Bike Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Condition
                    </label>
                    <select
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="" className="text-gray-900">Select condition</option>
                      <option value="excellent" className="text-gray-900">Excellent</option>
                      <option value="good" className="text-gray-900">Good</option>
                      <option value="fair" className="text-gray-900">Fair</option>
                      <option value="poor" className="text-gray-900">Poor</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bike Type
                    </label>
                    <select
                      name="bike_type"
                      value={formData.bike_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="" className="text-gray-900">Select bike type</option>
                      <option value="mountain" className="text-gray-900">Mountain Bike</option>
                      <option value="road" className="text-gray-900">Road Bike</option>
                      <option value="city" className="text-gray-900">City Bike</option>
                      <option value="hybrid" className="text-gray-900">Hybrid Bike</option>
                      <option value="cargo" className="text-gray-900">Cargo Bike</option>
                      <option value="folding" className="text-gray-900">Folding Bike</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="28"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Battery Capacity
                    </label>
                    <input
                      type="text"
                      name="battery_capacity"
                      value={formData.battery_capacity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="36V 10Ah"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frame Size
                    </label>
                    <input
                      type="text"
                      name="frame_size"
                      value={formData.frame_size}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="L (Large)"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Wheel Size
                    </label>
                    <input
                      type="text"
                      name="wheel_size"
                      value={formData.wheel_size}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="26 inch"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motor Type
                    </label>
                    <select
                      name="motor_type"
                      value={formData.motor_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="" className="text-gray-900">Select motor type</option>
                      <option value="hub" className="text-gray-900">Hub Motor</option>
                      <option value="mid-drive" className="text-gray-900">Mid-Drive Motor</option>
                      <option value="rear-hub" className="text-gray-900">Rear Hub Motor</option>
                      <option value="front-hub" className="text-gray-900">Front Hub Motor</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Motor Power (W)
                    </label>
                    <input
                      type="number"
                      name="motor_power"
                      value={formData.motor_power}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="350"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gear System
                    </label>
                    <input
                      type="text"
                      name="gear_system"
                      value={formData.gear_system}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="7-speed Shimano"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Black, Blue, Green"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Charging Time
                    </label>
                    <input
                      type="text"
                      name="charging_time"
                      value={formData.charging_time}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="4-6 hours"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Warranty
                    </label>
                    <input
                      type="text"
                      name="warranty"
                      value={formData.warranty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                      placeholder="3 years"
                    />
                  </div>
                </div>
              </div>
            )}

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
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                  placeholder="e.g., New York, NY"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Images
              </label>
              <ImageUpload onImagesChange={handleImagesChange} maxImages={12} />
              {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="List the key features of your vehicle (e.g., Autopilot, Premium Sound, Leather Seats, Navigation, etc.)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Highlight the most important features that make your vehicle special
              </p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                placeholder="Describe your vehicle's condition, features, and any additional information..."
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#1C1F4A] text-white px-8 py-3 rounded-lg hover:bg-[#2A2F6B] disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Listing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    List Vehicle
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