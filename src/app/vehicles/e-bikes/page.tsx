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

function EBikesContent() {
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
    
    // Redirect if category=e-bike is in URL (duplicate canonical issue)
    // The canonical URL is /vehicles/e-bikes without query params
    if (categoryFromUrl === 'e-bike') {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('category');
      const newUrl = newParams.toString() 
        ? `/vehicles/e-bikes?${newParams.toString()}`
        : '/vehicles/e-bikes';
      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, router]);
  
  // Set canonical URL - always point to clean URL without redundant category param
  useEffect(() => {
    const canonicalUrl = 'https://www.evvalley.com/vehicles/e-bikes';
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

        // Fetch E-bikes
        const params = new URLSearchParams();
        if (currentBrand !== 'all') params.append('brand', currentBrand);
        if (currentYear !== 'all') params.append('year', currentYear);
        if (currentMinPrice) params.append('minPrice', currentMinPrice);
        if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
        if (showSoldVehicles) params.append('includeSold', 'true');

        const response = await fetch(`/api/e-bikes?${params.toString()}`);
        const data = await response.json();
        
        let filteredVehicles = data.bikes || [];
        
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Electric Bikes
            </h1>
            <p className="text-xl text-white/90">
              Pedal with power - electric bikes for every adventure
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
                        placeholder="Search electric bikes..."
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

      {/* Category Info */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Bike className="w-8 h-8 text-orange-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Electric Bikes</h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the perfect blend of human power and electric assistance. Electric bikes offer 
              enhanced mobility, fitness benefits, and eco-friendly transportation for all types of 
              riders and terrains.
            </p>
            <div className="mt-4 text-2xl font-bold text-green-600">
              {loading ? 'Loading...' : `${vehicles.length} Electric Bikes`} Currently Available
            </div>
          </div>
        </div>
      </section>

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
              variant="outline"
              size="md"
              onClick={() => router.push('/vehicles/ev-scooters')}
              className="flex items-center gap-2"
            >
              <Bike className="w-4 h-4" />
              <span className="text-sm font-medium">Electric Scooters</span>
            </Button>
            
            <Button 
              variant="primary"
              size="md"
              onClick={() => router.push('/vehicles/e-bikes')}
              className="flex items-center gap-2 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] shadow-md"
            >
              <Bike className="w-4 h-4" />
              <span className="text-sm font-medium">Electric Bikes</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-gradient-to-r from-muted to-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-6">
            <div className="flex items-center mb-4">
              <Filter className="w-5 h-5 text-[#3AB0FF] mr-2" />
              <h3 className="text-base font-semibold text-foreground">Filters</h3>
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
                      const newBrand = e.target.value;
                      const currentYear = searchParams.get('year') || 'all';
                      const currentMinPrice = searchParams.get('minPrice') || '';
                      const currentMaxPrice = searchParams.get('maxPrice') || '';
                      
                      const params = new URLSearchParams();
                      if (newBrand !== 'all') params.append('brand', newBrand);
                      if (currentYear !== 'all') params.append('year', currentYear);
                      if (currentMinPrice) params.append('minPrice', currentMinPrice);
                      if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
                      
                      router.push(`/vehicles/e-bikes?${params.toString()}`);
                    }}
                  >
                    <option value="all" className="text-gray-900">All Brands</option>
                    <option value="Trek" className="text-gray-900">Trek</option>
                    <option value="Specialized" className="text-gray-900">Specialized</option>
                    <option value="Giant" className="text-gray-900">Giant</option>
                    <option value="Cannondale" className="text-gray-900">Cannondale</option>
                    <option value="Rad Power Bikes" className="text-gray-900">Rad Power Bikes</option>
                    <option value="Aventon" className="text-gray-900">Aventon</option>
                    <option value="Lectric" className="text-gray-900">Lectric</option>
                    <option value="Juiced" className="text-gray-900">Juiced</option>
                    <option value="Super73" className="text-gray-900">Super73</option>
                    <option value="VanMoof" className="text-gray-900">VanMoof</option>
                    <option value="Cowboy" className="text-gray-900">Cowboy</option>
                    <option value="Gazelle" className="text-gray-900">Gazelle</option>
                    <option value="Riese & Müller" className="text-gray-900">Riese & Müller</option>
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Year</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 appearance-none cursor-pointer hover:border-[#3AB0FF]"
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
                      
                      router.push(`/vehicles/e-bikes?${params.toString()}`);
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
                    <option value="2017" className="text-gray-900">2017</option>
                    <option value="2016" className="text-gray-900">2016</option>
                    <option value="2015" className="text-gray-900">2015</option>
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
                      
                      router.push(`/vehicles/e-bikes?${params.toString()}`);
                    }}
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
                    placeholder="10,000"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 hover:border-[#3AB0FF]"
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
                      
                      router.push(`/vehicles/e-bikes?${params.toString()}`);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/vehicles/e-bikes')}
                className="flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear all filters
              </Button>
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
          </Card>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="text-gray-400 text-6xl mb-4">🚴</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No electric bikes found</h3>
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
                        <div className="text-4xl mb-2">🚴</div>
                        <div className="text-sm">{vehicle.brand} {vehicle.model}</div>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <FavoriteButton vehicleId={vehicle.id} vehicleTitle={vehicle.title} size="sm" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2 gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(vehicle.category)}`}>
                        {vehicle.category?.replace('-', ' ').toUpperCase() || 'E-BIKE'}
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
                      <div className="flex items-center gap-2">
                        <Link href={`/vehicles/${vehicle.id}#contact`} aria-label="Contact Seller">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="p-2"
                            title="Contact Seller"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/vehicles/${vehicle.id}`}>
                          <Button size="md" className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a]">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">About Electric Bikes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Enhanced Cycling Experience</h3>
                <p className="text-gray-600 mb-4">
                  Electric bikes combine the health benefits of traditional cycling with the convenience 
                  of electric assistance. They're perfect for commuting, recreational riding, and 
                  exploring new terrains while reducing physical strain and increasing range.
                </p>
                <p className="text-gray-600">
                  Modern e-bikes feature sophisticated motor systems, long-lasting batteries, and 
                  intelligent pedal assistance that adapts to your riding style and terrain conditions. 
                  They offer ranges of 20-100+ miles depending on the model and usage.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Versatile & Eco-Friendly</h3>
                <p className="text-gray-600 mb-4">
                  At Evvalley, you'll find electric bikes for every need - from city commuters and 
                  mountain bikes to cargo bikes and folding models. Popular brands include Trek, 
                  Specialized, Rad Power Bikes, and Aventon.
                </p>
                <p className="text-gray-600">
                  Electric bikes offer significant environmental benefits by reducing car dependency 
                  and carbon emissions. They also provide health benefits through active transportation 
                  while making cycling accessible to riders of all fitness levels and ages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function EBikesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F9FF]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3AB0FF] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading electric bikes...</p>
          </div>
        </div>
      </div>
    }>
      <EBikesContent />
    </Suspense>
  );
}
