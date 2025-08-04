"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Car, Zap, Battery, Bike, MapPin } from "lucide-react";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import Link from "next/link";
import { Vehicle } from "@/lib/database";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    year: 'all',
    minPrice: '',
    maxPrice: ''
  });
  const [showSoldVehicles, setShowSoldVehicles] = useState(false);

  // URL'den parametreleri oku ve filtreleri ayarla
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const categoryFromUrl = urlParams.get('category');
      
      if (categoryFromUrl) {
        setFilters(prev => ({
          ...prev,
          category: categoryFromUrl
        }));
      }
    }
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filters.category !== 'all') params.append('category', filters.category);
        if (filters.brand !== 'all') params.append('brand', filters.brand);
        if (filters.year !== 'all') params.append('year', filters.year);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (showSoldVehicles) params.append('includeSold', 'true');

        const response = await fetch(`/api/vehicles?${params.toString()}`);
        const data = await response.json();
        
        // Ensure all data is properly serialized for Next.js 15 compatibility
        const serializedVehicles = data.vehicles?.map((vehicle: any) => {
          const plainVehicle = { ...vehicle };
          // Convert dates to strings
          if (plainVehicle.created_at) {
            plainVehicle.created_at = plainVehicle.created_at.toString();
          }
          if (plainVehicle.updated_at) {
            plainVehicle.updated_at = plainVehicle.updated_at.toString();
          }
          if (plainVehicle.sold_at) {
            plainVehicle.sold_at = plainVehicle.sold_at.toString();
          }
          // Ensure all properties are serializable
          return JSON.parse(JSON.stringify(plainVehicle));
        }) || [];
        
        setVehicles(serializedVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [filters, showSoldVehicles]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ev-car':
        return <Car className="h-6 w-6" />;
      case 'hybrid-car':
        return <Zap className="h-6 w-6" />;
      case 'ev-scooter':
        return <Battery className="h-6 w-6" />;
      case 'e-bike':
        return <Bike className="h-6 w-6" />;
      default:
        return <Car className="h-6 w-6" />;
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

  const handleSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      // Add search query
      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      
      // Add location query
      if (locationQuery.trim()) {
        params.append('location', locationQuery.trim());
      }
      
      // Add filters
      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.brand !== 'all') params.append('brand', filters.brand);
      if (filters.year !== 'all') params.append('year', filters.year);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);

      const response = await fetch(`/api/vehicles?${params.toString()}`);
      const data = await response.json();
      
      // Ensure all data is properly serialized for Next.js 15 compatibility
      const serializedVehicles = data.vehicles?.map((vehicle: any) => {
        const plainVehicle = { ...vehicle };
        // Convert dates to strings
        if (plainVehicle.created_at) {
          plainVehicle.created_at = plainVehicle.created_at.toString();
        }
        if (plainVehicle.updated_at) {
          plainVehicle.updated_at = plainVehicle.updated_at.toString();
        }
        if (plainVehicle.sold_at) {
          plainVehicle.sold_at = plainVehicle.sold_at.toString();
        }
        // Ensure all properties are serializable
        return JSON.parse(JSON.stringify(plainVehicle));
      }) || [];
      
      setVehicles(serializedVehicles);
    } catch (error) {
      console.error('Error searching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              EVs & E-Mobility
            </h1>
            <p className="text-xl text-white/90">
              Find your perfect electric vehicle
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search EV, Hybrid, Scooter, or E-Bike..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent text-gray-900"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        placeholder="Select location..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent text-gray-900"
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="bg-[#1C1F4A] text-white px-8 py-3 rounded-lg hover:bg-[#2A2F6B] flex items-center justify-center transition-colors"
                  >
                    <Filter className="mr-2 h-5 w-5" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button 
              onClick={() => {
                setFilters({...filters, category: 'all'});
                setTimeout(() => handleSearch(), 100);
              }}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                filters.category === 'all' 
                  ? 'bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white shadow-md' 
                  : 'bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF] text-gray-900'
              }`}
            >
              <Zap className={`w-4 h-4 ${filters.category === 'all' ? 'text-white' : 'text-gray-600'}`} />
              <span className="text-sm font-medium">All Categories</span>
            </button>
            
            <button 
              onClick={() => {
                setFilters({...filters, category: 'ev-car'});
                setTimeout(() => handleSearch(), 100);
              }}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                filters.category === 'ev-car' 
                  ? 'bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white shadow-md' 
                  : 'bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF] text-gray-900'
              }`}
            >
              <Car className={`w-4 h-4 ${filters.category === 'ev-car' ? 'text-white' : 'text-gray-600'}`} />
              <span className="text-sm font-medium">EV Cars</span>
            </button>
            
            <button 
              onClick={() => {
                setFilters({...filters, category: 'hybrid-car'});
                setTimeout(() => handleSearch(), 100);
              }}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                filters.category === 'hybrid-car' 
                  ? 'bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white shadow-md' 
                  : 'bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF] text-gray-900'
              }`}
            >
              <Car className={`w-4 h-4 ${filters.category === 'hybrid-car' ? 'text-white' : 'text-gray-600'}`} />
              <span className="text-sm font-medium">Hybrid Cars</span>
            </button>
            
            <button 
              onClick={() => {
                setFilters({...filters, category: 'ev-scooter'});
                setTimeout(() => handleSearch(), 100);
              }}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                filters.category === 'ev-scooter' 
                  ? 'bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white shadow-md' 
                  : 'bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF] text-gray-900'
              }`}
            >
              <Bike className={`w-4 h-4 ${filters.category === 'ev-scooter' ? 'text-white' : 'text-gray-600'}`} />
              <span className="text-sm font-medium">EV Scooters</span>
            </button>
            
            <button 
              onClick={() => {
                setFilters({...filters, category: 'e-bike'});
                setTimeout(() => handleSearch(), 100);
              }}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                filters.category === 'e-bike' 
                  ? 'bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white shadow-md' 
                  : 'bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF] text-gray-900'
              }`}
            >
              <Bike className={`w-4 h-4 ${filters.category === 'e-bike' ? 'text-white' : 'text-gray-600'}`} />
              <span className="text-sm font-medium">E-Bikes</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gradient-to-r from-[#F5F9FF] to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 text-[#3AB0FF] mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Brand Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Brand</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer hover:border-[#3AB0FF]"
                    value={filters.brand}
                    onChange={(e) => {
                      setFilters({...filters, brand: e.target.value});
                      setTimeout(() => handleSearch(), 100);
                    }}
                  >
                    <option value="all" className="text-gray-900">All Brands</option>
                    <option value="Tesla" className="text-gray-900">Tesla</option>
                    <option value="BMW" className="text-gray-900">BMW</option>
                    <option value="Audi" className="text-gray-900">Audi</option>
                    <option value="Toyota" className="text-gray-900">Toyota</option>
                    <option value="Xiaomi" className="text-gray-900">Xiaomi</option>
                    <option value="Segway" className="text-gray-900">Segway</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Year Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Year</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer hover:border-[#3AB0FF]"
                    value={filters.year}
                    onChange={(e) => {
                      setFilters({...filters, year: e.target.value});
                      setTimeout(() => handleSearch(), 100);
                    }}
                  >
                    <option value="all" className="text-gray-900">All Years</option>
                    <option value="2024" className="text-gray-900">2024</option>
                    <option value="2023" className="text-gray-900">2023</option>
                    <option value="2022" className="text-gray-900">2022</option>
                    <option value="2021" className="text-gray-900">2021</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Min Price Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Min Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 hover:border-[#3AB0FF]"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    onBlur={() => handleSearch()}
                  />
                </div>
              </div>

              {/* Max Price Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Max Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="100,000"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 hover:border-[#3AB0FF]"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    onBlur={() => handleSearch()}
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setFilters({
                    category: 'all',
                    brand: 'all',
                    year: 'all',
                    minPrice: '',
                    maxPrice: ''
                  });
                  setTimeout(() => handleSearch(), 100);
                }}
                className="text-sm text-gray-500 hover:text-[#3AB0FF] transition-colors duration-200 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear all filters
              </button>
            </div>
            
            {/* Show Sold Vehicles Toggle */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showSoldVehicles"
                    checked={showSoldVehicles}
                    onChange={(e) => setShowSoldVehicles(e.target.checked)}
                    className="w-4 h-4 text-[#3AB0FF] bg-gray-100 border-gray-300 rounded focus:ring-[#3AB0FF] focus:ring-2"
                  />
                  <label htmlFor="showSoldVehicles" className="ml-2 text-sm font-medium text-gray-700">
                    Show sold vehicles
                  </label>
                </div>
                {showSoldVehicles && (
                  <span className="text-xs text-gray-500">
                    Showing all vehicles including sold ones
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${vehicles.length} Vehicles Found`}
            </h2>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
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
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img
                          src={vehicle.images[0]}
                          alt={vehicle.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.nextElementSibling as HTMLElement;
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div className={`text-gray-400 text-center ${vehicle.images && vehicle.images.length > 0 ? 'hidden' : 'flex'}`}>
                        <div className="text-4xl mb-2">🚗</div>
                        <div className="text-sm">{vehicle.brand} {vehicle.model}</div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <FavoriteButton vehicleId={vehicle.id} size="sm" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2 gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(vehicle.category)}`}>
                        {vehicle.category.replace('-', ' ').toUpperCase()}
                      </span>
                      {vehicle.sold && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          SOLD
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{vehicle.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {vehicle.year} • {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'New'} 
                      {vehicle.range_miles && ` • ${vehicle.range_miles}mi range`}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">
                        ${vehicle.price.toLocaleString()}
                      </span>
                      <Link href={`/vehicles/${vehicle.id}`}>
                        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
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
      </section>
    </div>
  );
} 