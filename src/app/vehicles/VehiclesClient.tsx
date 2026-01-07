"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Car, Zap, Battery, Bike, MapPin, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Vehicle } from "@/lib/database";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export function VehiclesClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    brand: 'all',
    year: 'all',
    minPrice: '',
    maxPrice: '',
    color: 'all',
    maxMileage: ''
  });
  const [showSoldVehicles, setShowSoldVehicles] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const vehiclesPerPage = 12;

  // Message composer states
  const [messageSent, setMessageSent] = useState<Record<string, boolean>>({});
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({});
  const [sendingMessage, setSendingMessage] = useState<Record<string, boolean>>({});

  // Load messageSent from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('evvalley_messageSent');
      if (stored) {
        try {
          setMessageSent(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse messageSent from localStorage:', e);
        }
      }
    }
  }, []);

  // Sync filters state with URL params for UI
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'all';
    const brandFromUrl = searchParams.get('brand') || 'all';
    const yearFromUrl = searchParams.get('year') || 'all';
    const minPriceFromUrl = searchParams.get('minPrice') || '';
    const maxPriceFromUrl = searchParams.get('maxPrice') || '';
    const colorFromUrl = searchParams.get('color') || 'all';
    const maxMileageFromUrl = searchParams.get('maxMileage') || '';
    const searchFromUrl = searchParams.get('search') || '';
    const locationFromUrl = searchParams.get('location') || '';
    
    setFilters({
      category: categoryFromUrl,
      brand: brandFromUrl,
      year: yearFromUrl,
      minPrice: minPriceFromUrl,
      maxPrice: maxPriceFromUrl,
      color: colorFromUrl,
      maxMileage: maxMileageFromUrl
    });
    
    setSearchQuery(searchFromUrl);
    setLocationQuery(locationFromUrl);
  }, [searchParams]);

  // Fetch vehicles with pagination
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        
        // Get current filters from URL params
        const currentCategory = searchParams.get('category') || 'all';
        const currentBrand = searchParams.get('brand') || 'all';
        const currentYear = searchParams.get('year') || 'all';
        const currentMinPrice = searchParams.get('minPrice') || '';
        const currentMaxPrice = searchParams.get('maxPrice') || '';
        const currentColor = searchParams.get('color') || 'all';
        const currentMaxMileage = searchParams.get('maxMileage') || '';
        const currentSearch = searchParams.get('search') || '';
        const currentLocation = searchParams.get('location') || '';

        // Build API params with pagination
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', vehiclesPerPage.toString());
        
        if (currentCategory !== 'all') params.append('category', currentCategory);
        if (currentBrand !== 'all') params.append('brand', currentBrand);
        if (currentYear !== 'all') params.append('year', currentYear);
        if (currentMinPrice) params.append('minPrice', currentMinPrice);
        if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
        if (currentColor !== 'all') params.append('color', currentColor);
        if (currentMaxMileage) params.append('maxMileage', currentMaxMileage);
        // Always show all vehicles (both sold and unsold) - no sold filter
        if (currentSearch.trim()) params.append('search', currentSearch.trim());
        if (currentLocation.trim()) params.append('location', currentLocation.trim());

        console.log('🔍 Fetching vehicles for page:', currentPage, 'with params:', params.toString());

        const response = await fetch(`/api/vehicles?${params.toString()}`);
        const data = await response.json();

        console.log('📊 API Response for page', currentPage, ':', {
          vehiclesCount: data.vehicles?.length || 0,
          total: data.total,
          page: currentPage
        });

        if (data.vehicles && data.vehicles.length > 0) {
          // Ensure all data is properly serialized
          const serializedVehicles = data.vehicles.map((vehicle: any) => {
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
          setTotalVehicles(data.total || 0);
          setTotalPages(Math.ceil((data.total || 0) / vehiclesPerPage));
        } else {
          setVehicles([]);
          setTotalVehicles(0);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setVehicles([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [currentPage, searchParams, searchQuery, locationQuery, vehiclesPerPage]);

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

  const handleSendMessage = async (vehicleId: string, vehicleTitle: string, sellerEmail: string) => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      alert('Please sign in to send a message');
      return;
    }

    const message = messageInputs[vehicleId] || 'Hi, is this still available?';
    
    // Set sending state
    setSendingMessage(prev => ({ ...prev, [vehicleId]: true }));

    try {
      const response = await fetch('/api/simple-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId,
          senderEmail: user.primaryEmailAddress.emailAddress,
          receiverEmail: sellerEmail,
          content: message.trim()
        })
      });

      if (response.ok) {
        // Mark as sent and save to localStorage
        const updatedMessageSent = { ...messageSent, [vehicleId]: true };
        setMessageSent(updatedMessageSent);
        
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('evvalley_messageSent', JSON.stringify(updatedMessageSent));
        }
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(prev => ({ ...prev, [vehicleId]: false }));
    }
  };

  const applyLocationFilter = (loc: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = loc.trim();
    if (trimmed) {
      params.set('location', trimmed);
    } else {
      params.delete('location');
    }
    // Preserve pagination reset
    params.delete('page');
    router.push(`/vehicles?${params.toString()}`);
    setCurrentPage(1);
  };

  // Reset to page 1 when filters change (but not when currentPage changes)
  useEffect(() => {
    // Only reset if we're not on page 1 already
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchParams.get('category'), searchParams.get('brand'), searchParams.get('year'), searchParams.get('minPrice'), searchParams.get('maxPrice'), searchParams.get('color'), searchParams.get('maxMileage'), searchParams.get('search'), searchParams.get('location')]);

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />

      {/* Sell CTA Banner */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-lg border border-[#E5E7EB] bg-[#F8FAFF] px-5 py-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-600 font-semibold">Selling your EV?</p>
              <p className="text-base text-gray-800">List for free in minutes. No commissions.</p>
            </div>
            <Link href="/sell-your-ev">
              <Button variant="primary" size="lg">
                Start free listing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              variant="primary"
              size="md"
              onClick={() => router.push('/vehicles')}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              All Electric Vehicles
            </Button>
            
            <Button 
              variant="outline"
              size="md"
              onClick={() => router.push('/vehicles/ev-cars')}
              className="flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              Electric Cars
            </Button>
            
            <Button 
              variant="outline"
              size="md"
              onClick={() => router.push('/vehicles/hybrid-cars')}
              className="flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              Hybrid Cars
            </Button>
            
            <Button 
              variant="outline"
              size="md"
              onClick={() => router.push('/vehicles/ev-scooters')}
              className="flex items-center gap-2"
            >
              <Bike className="w-4 h-4" />
              Electric Scooters
            </Button>
            
            <Button 
              variant="outline"
              size="md"
              onClick={() => router.push('/vehicles/e-bikes')}
              className="flex items-center gap-2"
            >
              <Bike className="w-4 h-4" />
              Electric Bikes
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content: Sidebar + Listings */}
      <section className="py-8 bg-gradient-to-r from-[#F5F9FF] to-white">
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
                    value={filters.category}
                    onChange={(e) => {
                      const newCategory = e.target.value;
                      const currentBrand = searchParams.get('brand') || 'all';
                      const currentYear = searchParams.get('year') || 'all';
                      const currentMinPrice = searchParams.get('minPrice') || '';
                      const currentMaxPrice = searchParams.get('maxPrice') || '';
                      
                      const params = new URLSearchParams();
                      if (newCategory !== 'all') params.append('category', newCategory);
                      if (currentBrand !== 'all') params.append('brand', currentBrand);
                      if (currentYear !== 'all') params.append('year', currentYear);
                      if (currentMinPrice) params.append('minPrice', currentMinPrice);
                      if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
                      
                      router.push(`/vehicles?${params.toString()}`);
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
                      const currentCategory = searchParams.get('category') || 'all';
                      const currentYear = searchParams.get('year') || 'all';
                      const currentMinPrice = searchParams.get('minPrice') || '';
                      const currentMaxPrice = searchParams.get('maxPrice') || '';
                      
                      const params = new URLSearchParams();
                      if (currentCategory !== 'all') params.append('category', currentCategory);
                      if (newBrand !== 'all') params.append('brand', newBrand);
                      if (currentYear !== 'all') params.append('year', currentYear);
                      if (currentMinPrice) params.append('minPrice', currentMinPrice);
                      if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
                      
                      router.push(`/vehicles?${params.toString()}`);
                    }}
                  >
                    <option value="all" className="text-gray-900">All Brands</option>
                    <option value="Tesla" className="text-gray-900">Tesla</option>
                    <option value="Rivian" className="text-gray-900">Rivian</option>
                    <option value="Lucid" className="text-gray-900">Lucid</option>
                    <option value="Ford" className="text-gray-900">Ford</option>
                    <option value="Chevrolet" className="text-gray-900">Chevrolet</option>
                    <option value="Nissan" className="text-gray-900">Nissan</option>
                    <option value="BMW" className="text-gray-900">BMW</option>
                    <option value="Mercedes-Benz" className="text-gray-900">Mercedes-Benz</option>
                    <option value="Audi" className="text-gray-900">Audi</option>
                    <option value="Volkswagen" className="text-gray-900">Volkswagen</option>
                    <option value="Hyundai" className="text-gray-900">Hyundai</option>
                    <option value="Kia" className="text-gray-900">Kia</option>
                    <option value="Porsche" className="text-gray-900">Porsche</option>
                    <option value="Volvo" className="text-gray-900">Volvo</option>
                    <option value="Polestar" className="text-gray-900">Polestar</option>
                    <option value="Fisker" className="text-gray-900">Fisker</option>
                    <option value="VinFast" className="text-gray-900">VinFast</option>
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
                      const currentCategory = searchParams.get('category') || 'all';
                      const currentBrand = searchParams.get('brand') || 'all';
                      const currentMinPrice = searchParams.get('minPrice') || '';
                      const currentMaxPrice = searchParams.get('maxPrice') || '';
                      
                      const params = new URLSearchParams();
                      if (currentCategory !== 'all') params.append('category', currentCategory);
                      if (currentBrand !== 'all') params.append('brand', currentBrand);
                      if (newYear !== 'all') params.append('year', newYear);
                      if (currentMinPrice) params.append('minPrice', currentMinPrice);
                      if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
                      
                      router.push(`/vehicles?${params.toString()}`);
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
                    <option value="2014" className="text-gray-900">2014</option>
                    <option value="2013" className="text-gray-900">2013</option>
                    <option value="2012" className="text-gray-900">2012</option>
                    <option value="2011" className="text-gray-900">2011</option>
                    <option value="2010" className="text-gray-900">2010</option>
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
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        applyLocationFilter(locationQuery);
                      }
                    }}
                    onBlur={() => applyLocationFilter(locationQuery)}
                    placeholder="ZIP, city, or address"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 placeholder-gray-500 hover:border-[#3AB0FF]"
                  />
                </div>
              </div>

              {/* Min Price Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Min Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 hover:border-[#3AB0FF]"
                    value={filters.minPrice}
                    onChange={(e) => {
                      const newMinPrice = e.target.value;
                      const currentCategory = searchParams.get('category') || 'all';
                      const currentBrand = searchParams.get('brand') || 'all';
                      const currentYear = searchParams.get('year') || 'all';
                      const currentMaxPrice = searchParams.get('maxPrice') || '';
                      
                      const params = new URLSearchParams();
                      if (currentCategory !== 'all') params.append('category', currentCategory);
                      if (currentBrand !== 'all') params.append('brand', currentBrand);
                      if (currentYear !== 'all') params.append('year', currentYear);
                      if (newMinPrice) params.append('minPrice', newMinPrice);
                      if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
                      
                      router.push(`/vehicles?${params.toString()}`);
                    }}
                  />
                </div>
              </div>

              {/* Max Price Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Max Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">$</span>
                  <input
                    type="number"
                    placeholder="100,000"
                    className="w-full pl-7 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 hover:border-[#3AB0FF]"
                    value={filters.maxPrice}
                    onChange={(e) => {
                      const newMaxPrice = e.target.value;
                      const currentCategory = searchParams.get('category') || 'all';
                      const currentBrand = searchParams.get('brand') || 'all';
                      const currentYear = searchParams.get('year') || 'all';
                      const currentMinPrice = searchParams.get('minPrice') || '';
                      
                      const params = new URLSearchParams();
                      if (currentCategory !== 'all') params.append('category', currentCategory);
                      if (currentBrand !== 'all') params.append('brand', currentBrand);
                      if (currentYear !== 'all') params.append('year', currentYear);
                      if (currentMinPrice) params.append('minPrice', currentMinPrice);
                      if (newMaxPrice) params.append('maxPrice', newMaxPrice);
                      
                      router.push(`/vehicles?${params.toString()}`);
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
                <label htmlFor="showSoldVehicles" className="ml-2 text-xs font-medium text-gray-700">
                  Show sold vehicles
                </label>
              </div>

              {/* Action Buttons - Stacked */}
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/vehicles')}
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
                    // Scroll to vehicles grid
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
                        <div className="h-3 bg-gray-200 rounded mb-2 w-20"></div>
                        <div className="h-5 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
                        <div className="h-11 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🚗</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {'No vehicles found'}
                  </h3>
                  <p className="text-gray-600">
                    {'Try adjusting your filters or check back later.'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vehicles.map((vehicle) => (
                      <Link 
                        key={vehicle.id}
                        href={`/vehicles/${vehicle.id}`}
                        className={`block bg-card rounded-xl border border-border shadow-sm overflow-hidden active:opacity-90 transition-opacity ${
                          vehicle.sold ? 'opacity-75' : ''
                        }`}
                      >
                        <div className="relative">
                          <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center overflow-hidden">
                            {vehicle.video_url ? (
                            <video
                              src={vehicle.video_url}
                              playsInline
                              controls
                              className="w-full h-full object-cover"
                              preload="metadata"
                            />
                            ) : vehicle.images && vehicle.images.length > 0 ? (
                              <img
                                src={vehicle.images[0]}
                                alt={vehicle.title}
                                className="w-full h-full object-cover"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`absolute inset-0 flex flex-col items-center justify-center text-gray-400 ${(vehicle.video_url || (vehicle.images && vehicle.images.length > 0)) ? 'hidden' : ''}`}>
                              <div className="text-4xl mb-2">🚗</div>
                              <div className="text-sm">{vehicle.brand} {vehicle.model}</div>
                            </div>
                          </div>
                          <div className="absolute top-3 right-3 z-10" onClick={(e) => e.preventDefault()}>
                            <FavoriteButton vehicleId={vehicle.id} vehicleTitle={vehicle.title} size="sm" />
                          </div>
                        </div>
                        <div className="p-4">
                          {/* Badges */}
                          <div className="flex items-center mb-2 gap-2 flex-wrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(vehicle.category)}`}>
                              {vehicle.category.replace('-', ' ').toUpperCase()}
                            </span>
                            {vehicle.sold && (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                SOLD
                              </span>
                            )}
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-lg font-medium text-card-foreground mb-2 line-clamp-2 leading-tight">
                            {vehicle.title}
                          </h3>
                          
                          {/* Meta Info */}
                          <div className="flex items-center gap-1.5 mb-3 text-sm text-muted-foreground flex-wrap">
                            <span>{vehicle.year}</span>
                            <span>•</span>
                            <span>{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : 'New'}</span>
                            {vehicle.range_miles && (
                              <>
                                <span>•</span>
                                <span>{vehicle.range_miles}mi range</span>
                              </>
                            )}
                          </div>
                          
                          {/* Price - Most Prominent */}
                          <div className="mb-4">
                            <div className="flex items-center gap-2 flex-wrap">
                              {(() => {
                                const rawOld = (vehicle as any).old_price;
                                const oldP = typeof rawOld === 'string' ? parseFloat(rawOld) : Number(rawOld);
                                const currP = typeof (vehicle as any).price === 'string' ? parseFloat((vehicle as any).price) : Number((vehicle as any).price);
                                return Number.isFinite(oldP) && Number.isFinite(currP) && oldP > 0 && oldP > currP ? (
                                  <span className="text-muted-foreground line-through text-sm">${oldP.toLocaleString()}</span>
                                ) : null;
                              })()}
                              <span className="text-2xl font-bold text-green-600">
                                ${vehicle.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          
                          {/* CTA: Inline Message Composer (All Screen Sizes) */}
                          <div className="w-full">
                            {messageSent[vehicle.id] ? (
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  window.location.href = `/vehicles/${vehicle.id}#contact`;
                                }}
                                className="w-full h-11 px-4 bg-green-600 text-white rounded-lg font-medium active:opacity-80 flex items-center justify-center gap-2"
                              >
                                <MessageCircle className="h-4 w-4" />
                                See conversation
                              </button>
                            ) : (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={messageInputs[vehicle.id] || 'Hi, is this still available?'}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    setMessageInputs(prev => ({ ...prev, [vehicle.id]: e.target.value }));
                                  }}
                                  onClick={(e) => e.preventDefault()}
                                  onFocus={(e) => e.stopPropagation()}
                                  className="flex-1 h-11 px-3 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleSendMessage(vehicle.id, vehicle.title, vehicle.seller_email);
                                  }}
                                  disabled={sendingMessage[vehicle.id]}
                                  className="h-11 px-4 bg-primary text-white rounded-lg font-medium active:opacity-80 whitespace-nowrap disabled:opacity-50"
                                >
                                  {sendingMessage[vehicle.id] ? 'Sending...' : 'Send'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-12">
                      {/* Mobile: Show only current page info */}
                      <div className="sm:hidden flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          ← Prev
                        </Button>
                        
                        <span className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm">
                          {currentPage} / {totalPages}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next →
                        </Button>
                      </div>

                      {/* Desktop: Show full pagination */}
                      <div className="hidden sm:flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </Button>
                        
                        {/* Page Numbers */}
                        {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 7) {
                            pageNum = i + 1;
                          } else if (currentPage <= 4) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 3) {
                            pageNum = totalPages - 6 + i;
                          } else {
                            pageNum = currentPage - 3 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "primary" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>

    </div>
  );
}

