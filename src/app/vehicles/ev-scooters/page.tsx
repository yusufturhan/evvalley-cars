"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, Filter, Car, Zap, Battery, Bike, MapPin, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import Link from "next/link";
import { Vehicle } from "@/lib/database";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

function EVScootersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [filters, setFilters] = useState({
    brand: 'all',
    year: 'all',
    minPrice: '',
    maxPrice: ''
  });
  const [showSoldVehicles, setShowSoldVehicles] = useState(false);

  // Sync filters state with URL params for UI
  useEffect(() => {
    const brandFromUrl = searchParams.get('brand') || 'all';
    const yearFromUrl = searchParams.get('year') || 'all';
    const minPriceFromUrl = searchParams.get('minPrice') || '';
    const maxPriceFromUrl = searchParams.get('maxPrice') || '';
    const searchFromUrl = searchParams.get('search') || '';
    const locationFromUrl = searchParams.get('location') || '';
    const categoryFromUrl = searchParams.get('category');
    
    setFilters({
      brand: brandFromUrl,
      year: yearFromUrl,
      minPrice: minPriceFromUrl,
      maxPrice: maxPriceFromUrl
    });
    
    setSearchQuery(searchFromUrl);
    setLocationQuery(locationFromUrl);
    
    // Redirect if category=ev-scooter is in URL (duplicate canonical issue)
    if (categoryFromUrl === 'ev-scooter') {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('category');
      const newUrl = newParams.toString() 
        ? `/vehicles/ev-scooters?${newParams.toString()}`
        : '/vehicles/ev-scooters';
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router]);
  
  // Set canonical URL - always point to clean URL without redundant category param
  useEffect(() => {
    const canonicalUrl = 'https://www.evvalley.com/vehicles/ev-scooters';
    let existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.setAttribute('href', canonicalUrl);
    } else {
      const canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      canonicalLink.setAttribute('href', canonicalUrl);
      document.head.appendChild(canonicalLink);
    }
  }, []);

  // Fetch vehicles when URL params change
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        
        // Get current filters from URL params
        const currentBrand = searchParams.get('brand') || 'all';
        const currentYear = searchParams.get('year') || 'all';
        const currentMinPrice = searchParams.get('minPrice') || '';
        const currentMaxPrice = searchParams.get('maxPrice') || '';
        const currentSearch = searchParams.get('search') || '';
        const currentLocation = searchParams.get('location') || '';

        // Fetch E-scooters
        const params = new URLSearchParams();
        if (currentBrand !== 'all') params.append('brand', currentBrand);
        if (currentYear !== 'all') params.append('year', currentYear);
        if (currentMinPrice) params.append('minPrice', currentMinPrice);
        if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
        if (showSoldVehicles) params.append('includeSold', 'true');

        const response = await fetch(`/api/ev-scooters?${params.toString()}`);
        const data = await response.json();
        
        let filteredVehicles = data.scooters || [];
        
        // Apply search filtering
        if (currentSearch.trim()) {
          const searchQuery = currentSearch.toLowerCase().trim();
          filteredVehicles = filteredVehicles.filter((vehicle: any) => {
            const title = vehicle.title?.toLowerCase() || '';
            const brand = vehicle.brand?.toLowerCase() || '';
            const model = vehicle.model?.toLowerCase() || '';
            
            const searchWords = searchQuery.split(' ').filter(word => word.length > 0);
            
            if (searchWords.length > 1) {
              return searchWords.some(word => 
                title.includes(word) || 
                brand.includes(word) || 
                model.includes(word)
              );
            }
            
            return title.includes(searchQuery) || 
                   brand.includes(searchQuery) || 
                   model.includes(searchQuery);
          });
        }

        // Apply location filtering
        if (currentLocation.trim()) {
          const locationQuery = currentLocation.toLowerCase().trim();
          filteredVehicles = filteredVehicles.filter((vehicle: any) => {
            const vehicleLocation = vehicle.location?.toLowerCase() || '';
            const searchWords = locationQuery.split(' ').filter(word => word.length > 0);
            
            if (searchWords.length > 1) {
              return searchWords.some(word => vehicleLocation.includes(word));
            }
            
            return vehicleLocation.includes(locationQuery);
          });
        }

        // Ensure all data is properly serialized
        const serializedVehicles = filteredVehicles.map((vehicle: any) => {
          const plainVehicle = { ...vehicle };
          if (plainVehicle.created_at) {
            plainVehicle.created_at = plainVehicle.created_at.toString();
          }
          if (plainVehicle.updated_at) {
            plainVehicle.updated_at = plainVehicle.updated_at.toString();
          }
          if (plainVehicle.sold_at) {
            plainVehicle.sold_at = plainVehicle.sold_at.toString();
          }
          return JSON.parse(JSON.stringify(plainVehicle));
        });
        
        setVehicles(serializedVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchParams, showSoldVehicles, searchQuery, locationQuery]);

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
    // Search functionality is handled by the useEffect above
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />

      {/* Category Filters */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              variant="outline"
              size="md"
              onClick={() => router.push('/vehicles')}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">All Electric Vehicles</span>
            </Button>
            
            <Button 
              variant="outline"
              size="md"
              onClick={() => router.push('/vehicles/ev-cars')}
              className="flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span className="text-sm font-medium">Electric Cars</span>
            </Button>
            
            <Button 
              variant="outline"
              size="md"
              onClick={() => router.push('/vehicles/hybrid-cars')}
              className="flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              <span className="text-sm font-medium">Hybrid Cars</span>
            </Button>
            
            <Button 
              variant="primary"
              size="md"
              onClick={() => router.push('/vehicles/ev-scooters')}
              className="flex items-center gap-2 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] shadow-md"
            >
              <Bike className="w-4 h-4" />
              <span className="text-sm font-medium">Electric Scooters</span>
            </Button>
            
            <Button 
              variant="outline"
              size="md"
              onClick={() => router.push('/vehicles/e-bikes')}
              className="flex items-center gap-2"
            >
              <Bike className="w-4 h-4" />
              <span className="text-sm font-medium">Electric Bikes</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content: Sidebar + Listings */}
      <section className="py-8 bg-gradient-to-r from-muted to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar: Filters */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <Card className="p-5 sticky top-4">
                <div className="flex items-center mb-5">
                  <Filter className="w-5 h-5 text-[#3AB0FF] mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                </div>
                
                <div className="space-y-4">
              {/* Category Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Category</label>
                <div className="relative">
                  <select 
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer hover:border-[#3AB0FF]"
                    value="ev-scooter"
                    onChange={(e) => {
                      const category = e.target.value;
                      if (category === 'all') router.push('/vehicles');
                      else if (category === 'ev-car') router.push('/vehicles/ev-cars');
                      else if (category === 'hybrid-car') router.push('/vehicles/hybrid-cars');
                      else if (category === 'ev-scooter') router.push('/vehicles/ev-scooters');
                      else if (category === 'e-bike') router.push('/vehicles/e-bikes');
                    }}
                  >
                    <option value="all" className="text-gray-900">All Categories</option>
                    <option value="ev-car" className="text-gray-900">Electric Cars</option>
                    <option value="hybrid-car" className="text-gray-900">Hybrid Cars</option>
                    <option value="ev-scooter" className="text-gray-900">Electric Scooters</option>
                    <option value="e-bike" className="text-gray-900">Electric Bikes</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Brand</label>
                <div className="relative">
                  <select 
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer hover:border-[#3AB0FF]"
                    value={filters.brand}
                    onChange={(e) => {
                      const newBrand = e.target.value;
                      const currentYear = searchParams.get('year') || 'all';
                      const currentMinPrice = searchParams.get('minPrice') || '';
                      const currentMaxPrice = searchParams.get('maxPrice') || '';
                      
                      const params = new URLSearchParams();
                      if (newBrand !== 'all') params.append('brand', newBrand);
                      if (currentYear !== 'all') params.append('year', currentYear);
                      if (currentMinPrice) params.append('minPrice', currentMinPrice);
                      if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
                      
                      router.push(`/vehicles/ev-scooters?${params.toString()}`);
                    }}
                  >
                    <option value="all" className="text-gray-900">All Brands</option>
                    <option value="Xiaomi" className="text-gray-900">Xiaomi</option>
                    <option value="Segway" className="text-gray-900">Segway</option>
                    <option value="Ninebot" className="text-gray-900">Ninebot</option>
                    <option value="Razor" className="text-gray-900">Razor</option>
                    <option value="Gotrax" className="text-gray-900">Gotrax</option>
                    <option value="Hiboy" className="text-gray-900">Hiboy</option>
                    <option value="Glion" className="text-gray-900">Glion</option>
                    <option value="Unagi" className="text-gray-900">Unagi</option>
                    <option value="Bird" className="text-gray-900">Bird</option>
                    <option value="Lime" className="text-gray-900">Lime</option>
                    <option value="Spin" className="text-gray-900">Spin</option>
                    <option value="Other" className="text-gray-900">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Year Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Year</label>
                <div className="relative">
                  <select 
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer hover:border-[#3AB0FF]"
                    value={filters.year}
                    onChange={(e) => {
                      const newYear = e.target.value;
                      const currentBrand = searchParams.get('brand') || 'all';
                      const currentMinPrice = searchParams.get('minPrice') || '';
                      const currentMaxPrice = searchParams.get('maxPrice') || '';
                      
                      const params = new URLSearchParams();
                      if (currentBrand !== 'all') params.append('brand', currentBrand);
                      if (newYear !== 'all') params.append('year', newYear);
                      if (currentMinPrice) params.append('minPrice', currentMinPrice);
                      if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
                      
                      router.push(`/vehicles/ev-scooters?${params.toString()}`);
                    }}
                  >
                    <option value="all" className="text-gray-900">All Years</option>
                    <option value="2025" className="text-gray-900">2025</option>
                    <option value="2024" className="text-gray-900">2024</option>
                    <option value="2023" className="text-gray-900">2023</option>
                    <option value="2022" className="text-gray-900">2022</option>
                    <option value="2021" className="text-gray-900">2021</option>
                    <option value="2020" className="text-gray-900">2020</option>
                    <option value="2019" className="text-gray-900">2019</option>
                    <option value="2018" className="text-gray-900">2018</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Location Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                  <input
                    type="text"
                    placeholder="ZIP, city, or address"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 hover:border-[#3AB0FF]"
                    value={filters.location}
                    onChange={(e) => {
                      const newLocation = e.target.value;
                      const currentBrand = searchParams.get('brand') || 'all';
                      const currentYear = searchParams.get('year') || 'all';
                      const currentMinPrice = searchParams.get('minPrice') || '';
                      const currentMaxPrice = searchParams.get('maxPrice') || '';
                      
                      const params = new URLSearchParams();
                      params.append('category', 'ev-scooter');
                      if (currentBrand !== 'all') params.append('brand', currentBrand);
                      if (currentYear !== 'all') params.append('year', currentYear);
                      if (newLocation) params.append('location', newLocation);
                      if (currentMinPrice) params.append('minPrice', currentMinPrice);
                      if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
                      
                      router.push(`/vehicles/ev-scooters?${params.toString()}`);
                    }}
                  />
                </div>
              </div>

              {/* Min Price Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Min Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 hover:border-[#3AB0FF]"
                    value={filters.minPrice}
                    onChange={(e) => {
                      const newMinPrice = e.target.value;
                      const currentBrand = searchParams.get('brand') || 'all';
                      const currentYear = searchParams.get('year') || 'all';
                      const currentMaxPrice = searchParams.get('maxPrice') || '';
                      
                      const params = new URLSearchParams();
                      if (currentBrand !== 'all') params.append('brand', currentBrand);
                      if (currentYear !== 'all') params.append('year', currentYear);
                      if (newMinPrice) params.append('minPrice', newMinPrice);
                      if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
                      
                      router.push(`/vehicles/ev-scooters?${params.toString()}`);
                    }}
                  />
                </div>
              </div>

              {/* Max Price Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Max Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="5,000"
                    className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 hover:border-[#3AB0FF]"
                    value={filters.maxPrice}
                    onChange={(e) => {
                      const newMaxPrice = e.target.value;
                      const currentBrand = searchParams.get('brand') || 'all';
                      const currentYear = searchParams.get('year') || 'all';
                      const currentMinPrice = searchParams.get('minPrice') || '';
                      
                      const params = new URLSearchParams();
                      if (currentBrand !== 'all') params.append('brand', currentBrand);
                      if (currentYear !== 'all') params.append('year', currentYear);
                      if (currentMinPrice) params.append('minPrice', currentMinPrice);
                      if (newMaxPrice) params.append('maxPrice', newMaxPrice);
                      
                      router.push(`/vehicles/ev-scooters?${params.toString()}`);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Filter Actions - Bottom of Sidebar */}
            <div className="mt-5 pt-5 border-t border-gray-200 space-y-3">
              {/* Show Sold Vehicles Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="showSoldVehicles"
                  checked={showSoldVehicles}
                  onChange={(e) => setShowSoldVehicles(e.target.checked)}
                  className="w-4 h-4 text-[#3AB0FF] bg-gray-100 border-gray-300 rounded focus:ring-[#3AB0FF] focus:ring-2"
                />
                <label htmlFor="showSoldVehicles" className="ml-2 text-xs font-medium text-gray-700">Show sold vehicles</label>
              </div>

              {/* Action Buttons - Stacked */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/vehicles/ev-scooters')}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all filters
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const vehiclesSection = document.querySelector('.vehicles-grid');
                    if (vehiclesSection) {
                      vehiclesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
              </Card>
            </aside>

            {/* Right: Vehicle Listings */}
            <main className="flex-1 vehicles-grid">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200"></div>
                  <div className="p-4">
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
                  <div className="text-gray-400 text-6xl mb-4">🛴</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No electric scooters found</h3>
                  <p className="text-gray-600">Try adjusting your filters or check back later.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicles.map((vehicle) => (
                <div 
                  key={vehicle.id} 
                  className={`bg-card rounded-xl border border-border shadow-sm overflow-hidden active:opacity-90 transition-opacity ${
                    vehicle.sold 
                      ? 'opacity-75 hover:opacity-80' 
                      : 'hover:shadow-xl hover:-translate-y-1'
                  }`}
                >
                  <div className="relative">
                    <Link href={`/vehicles/${vehicle.id}`} className="block relative">
                      <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center overflow-hidden">
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
                          <div className="text-4xl mb-2">🛴</div>
                          <div className="text-sm">{vehicle.brand} {vehicle.model}</div>
                        </div>
                      </div>
                    </Link>
                    <div className="absolute top-2 right-2 z-10">
                      <FavoriteButton vehicleId={vehicle.id} size="sm" />
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-2 gap-2 flex-wrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(vehicle.category)}`}>
                        {vehicle.category?.replace('-', ' ').toUpperCase() || 'EV SCOOTER'}
                      </span>
                      {vehicle.sold && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          SOLD
                        </span>
                      )}
                    </div>
                    
                    {/* Title - Most Dominant */}
                    <h3 className="text-lg font-medium text-card-foreground mb-2 line-clamp-2 leading-tight">{vehicle.title}</h3>
                    
                    {/* Secondary Info - Muted Group */}
                    <div className="flex items-center gap-1.5 mb-3 text-sm text-muted-foreground flex-wrap">
                      <span>{vehicle.year}</span>
                      <span>•</span>
                      <span>{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'New'}</span>
                      {vehicle.range_miles && (
                        <>
                          <span>•</span>
                          <span>{vehicle.range_miles}mi range</span>
                        </>
                      )}
                    </div>
                    
                    {/* Price - Second Most Important */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-green-600">
                        ${vehicle.price.toLocaleString()}
                      </span>
                    </div>
                    
                    {/* CTA Buttons */}
                    <div className="flex items-center justify-between gap-3">
                      <Link href={`/vehicles/${vehicle.id}#contact`} aria-label="Contact Seller" className="flex-shrink-0">
                        <Button 
                          variant="primary" 
                          size="sm" 
                          className="p-2"
                          title="Contact Seller"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/vehicles/${vehicle.id}`} className="flex-1">
                        <Button 
                          size="md" 
                          className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] hover:scale-105 transition-transform duration-200 w-full"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                ))}
              </div>
            )}
            </main>
          </div>
        </div>
      </section>

      {/* About Section - Below Vehicles Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">About Electric Scooters</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Urban Mobility Revolution</h3>
                <p className="text-gray-600 mb-4">
                  Electric scooters are transforming urban transportation by offering a convenient, 
                  eco-friendly alternative to traditional commuting methods. With zero emissions and 
                  compact design, they're perfect for navigating city streets and reducing traffic congestion.
                </p>
                <p className="text-gray-600">
                  Modern electric scooters feature advanced battery technology, providing ranges of 
                  15-50 miles on a single charge, making them ideal for daily commuting, errands, 
                  and recreational use.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Popular Brands & Features</h3>
                <p className="text-gray-600 mb-4">
                  At Evvalley, you'll find top electric scooter brands like Xiaomi, Segway, Ninebot, 
                  and Razor. These scooters offer features like LED displays, smartphone connectivity, 
                  regenerative braking, and foldable designs for easy storage.
                </p>
                <p className="text-gray-600">
                  Our selection includes scooters for all skill levels and budgets, from entry-level 
                  models perfect for beginners to high-performance options for experienced riders. 
                  We also offer comprehensive support and maintenance services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function EVScootersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F9FF]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3AB0FF] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading electric scooters...</p>
          </div>
        </div>
      </div>
    }>
      <EVScootersContent />
    </Suspense>
  );
}
