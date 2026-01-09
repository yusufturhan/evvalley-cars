"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Search, Filter, Car, Zap, Battery, Bike, MapPin, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import BottomSheet from "@/components/BottomSheet";
import MobileBottomNav from "@/components/MobileBottomNav";
import Link from "next/link";
import { Vehicle } from "@/lib/database";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F9FF]">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3AB0FF] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vehicles...</p>
          </div>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}

export function HomeContent() {
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
  const [showSoldVehicles, setShowSoldVehicles] = useState(true); // Default: show all vehicles (including sold)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVehicles, setTotalVehicles] = useState(0);
  const vehiclesPerPage = 12;

  // Message composer states
  const [messageSent, setMessageSent] = useState<Record<string, boolean>>({});
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({});
  const [sendingMessage, setSendingMessage] = useState<Record<string, boolean>>({});

  // Mobile filter bottom sheet state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load messageSent from localStorage on mount (user-specific)
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.id) {
      const userKey = `evvalley_messageSent_${user.id}`;
      const stored = localStorage.getItem(userKey);
      if (stored) {
        try {
          setMessageSent(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse messageSent from localStorage:', e);
        }
      } else {
        // Clear state if no data for this user
        setMessageSent({});
      }
    }
  }, [user?.id]);

  // Fetch vehicles with pagination
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        
              // Build API params
              const params = new URLSearchParams();
              params.append('page', currentPage.toString());
              params.append('limit', vehiclesPerPage.toString());
              // IMPORTANT: Always show ALL vehicles (both sold and unsold) - never filter sold vehicles
        
        console.log('🔍 Fetching vehicles for page:', currentPage, 'with params:', params.toString());
        
        if (filters.category !== 'all') params.append('category', filters.category);
        if (filters.brand !== 'all') params.append('brand', filters.brand);
        if (filters.year !== 'all') params.append('year', filters.year);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.color !== 'all') params.append('color', filters.color);
        if (filters.maxMileage) params.append('maxMileage', filters.maxMileage);
        // includeSold parameter removed - we now use 'sold' parameter instead
        if (searchQuery.trim()) params.append('search', searchQuery.trim());
        if (locationQuery.trim()) params.append('location', locationQuery.trim());

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
          setTotalPages(Math.ceil(data.total / vehiclesPerPage));
          setTotalVehicles(data.total);
        } else {
          setVehicles([]);
          setTotalPages(1);
          setTotalVehicles(0);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setVehicles([]);
        setTotalPages(1);
        setTotalVehicles(0);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [currentPage, filters, showSoldVehicles, searchQuery, locationQuery]);

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
        // Mark as sent and save to localStorage (user-specific)
        const updatedMessageSent = { ...messageSent, [vehicleId]: true };
        setMessageSent(updatedMessageSent);
        
        // Persist to localStorage with user-specific key
        if (typeof window !== 'undefined' && user?.id) {
          const userKey = `evvalley_messageSent_${user.id}`;
          localStorage.setItem(userKey, JSON.stringify(updatedMessageSent));
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

  const handleSearch = async () => {
    // Reset to page 1 when searching
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filters change
  };

  // Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Evvalley - Buy & Sell Electric Vehicles USA",
    "description": "America's #1 electric vehicle marketplace. Buy and sell EVs, hybrid cars, e-bikes, and e-scooters across the United States. Free listings, no commission fees.",
    "url": "https://www.evvalley.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.evvalley.com/vehicles?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Evvalley",
      "url": "https://www.evvalley.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.evvalley.com/logo.png"
      },
      "sameAs": [
        "https://www.facebook.com/evvalley",
        "https://www.instagram.com/evvalley",
        "https://www.twitter.com/evvalley"
      ],
      "areaServed": "United States"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Electric Vehicles for Sale",
      "description": "Browse electric vehicles, hybrid cars, e-bikes, and e-scooters for sale",
      "url": "https://www.evvalley.com/vehicles"
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-16 md:pb-0">
      {/* SEO Head */}
      <head>
        <title>Evvalley - US EV & E-Mobility Marketplace | Buy & Sell Electric Vehicles</title>
        <meta name="description" content="America's premier electric vehicle marketplace. Buy and sell EVs, hybrid cars, e-bikes, and e-scooters across the United States. Free listings, no commission fees." />
        <meta name="keywords" content="electric vehicles, EV marketplace, Tesla, hybrid cars, e-bikes, e-scooters, buy EV, sell EV, electric car marketplace, USA" />
        <link rel="canonical" href="https://www.evvalley.com/" />
      </head>

      <Header />

      {/* Category Filters */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Button 
              variant="primary"
              size="md"
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'all' }));
                setShowSoldVehicles(true);
              }}
              className="flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              All Electric Vehicles
            </Button>
            
            <Button 
              variant="outline"
              size="md"
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'ev-car' }));
                setShowSoldVehicles(true);
              }}
              className="flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              Electric Cars
            </Button>
            
            <Button 
              variant="outline"
              size="md"
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'hybrid-car' }));
                setShowSoldVehicles(true);
              }}
              className="flex items-center gap-2"
            >
              <Car className="w-4 h-4" />
              Hybrid Cars
            </Button>
            
            <Button 
              variant="outline"
              size="md"
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'ev-scooter' }));
                setShowSoldVehicles(true);
              }}
              className="flex items-center gap-2"
            >
              <Bike className="w-4 h-4" />
              Electric Scooters
            </Button>
            
            <Button 
              variant="outline"
              size="md"
              onClick={() => {
                setFilters(prev => ({ ...prev, category: 'e-bike' }));
                setShowSoldVehicles(true);
              }}
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
          {/* Mobile Filters Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-[#3AB0FF] text-[#3AB0FF] font-semibold rounded-lg shadow-sm active:scale-95 transition-transform"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <span className="ml-1 px-2 py-0.5 bg-[#3AB0FF] text-white text-xs rounded-full">
                {totalVehicles}
              </span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar: Filters (Desktop Only) */}
            <aside className="hidden lg:block w-full lg:w-80 flex-shrink-0">
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
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
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
                    onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
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
                    onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
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
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setCurrentPage(1);
                      }
                    }}
                    onBlur={() => setCurrentPage(1)}
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
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
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
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
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
                  onClick={() => {
                    setFilters({
                      category: 'all',
                      brand: 'all',
                      year: 'all',
                      minPrice: '',
                      maxPrice: '',
                      color: 'all',
                      maxMileage: ''
                    });
                  }}
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
                  No vehicles found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or check back later.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vehicles.map((vehicle) => (
                <Link 
                  key={vehicle.id}
                  href={`/vehicles/${vehicle.id}`}
                  className={`group block bg-card rounded-xl border border-border shadow-sm overflow-hidden active:opacity-90 transition-all duration-200 ease-out md:hover:-translate-y-1 md:hover:shadow-lg ${
                    vehicle.sold ? 'opacity-75' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gray-200 flex items-center justify-center overflow-hidden">
                      {vehicle.video_url ? (
                        <video src={vehicle.video_url} playsInline controls className="w-full h-full object-cover transition-transform duration-200 ease-out md:group-hover:scale-105" preload="metadata" />
                      ) : vehicle.images && vehicle.images.length > 0 ? (
                        <img
                          src={vehicle.images[0]}
                          alt={vehicle.title}
                          className="w-full h-full object-cover transition-transform duration-200 ease-out md:group-hover:scale-105"
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
            )}
              
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-3 mt-12">
                {/* Mobile: Show only current page info */}
                <div className="sm:hidden flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border-2 border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 hover:border-gray-500 transition-all duration-200 text-sm"
                  >
                    ← Prev
                  </button>
                  
                  <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm">
                    {currentPage} / {totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border-2 border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 hover:border-gray-500 transition-all duration-200 text-sm"
                  >
                    Next →
                  </button>
                </div>

                {/* Desktop: Show full pagination */}
                <div className="hidden sm:flex items-center space-x-3">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border-2 border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 hover:border-gray-500 transition-all duration-200"
                  >
                    Previous
                  </button>
                  
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
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-4 py-2 rounded-lg border-2 font-semibold transition-all duration-200 ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
                            : 'border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-gray-500 hover:shadow-md'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border-2 border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700 hover:border-gray-500 transition-all duration-200"
                  >
                    Next
                  </button>
                </div>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-8">About Electric Vehicles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Zero Emissions, Maximum Performance</h3>
                <p className="text-gray-600 mb-4">
                  Electric vehicles represent the future of transportation, offering zero emissions while delivering 
                  incredible performance and acceleration. With instant torque and smooth operation, EVs provide 
                  a driving experience unlike any traditional vehicle.
                </p>
                <p className="text-gray-600">
                  Modern electric vehicles feature advanced battery technology, providing ranges of 200-400+ miles 
                  on a single charge, making them practical for daily commuting and long-distance travel.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Cost Savings & Environmental Benefits</h3>
                <p className="text-gray-600 mb-4">
                  Electric vehicles offer significant cost savings over time, with lower fuel costs, reduced 
                  maintenance requirements, and various government incentives. They also contribute to a cleaner 
                  environment by eliminating tailpipe emissions.
                </p>
                <p className="text-gray-600">
                  At Evvalley, we offer a wide selection of electric vehicles from leading manufacturers like 
                  Tesla, Rivian, Lucid, and more. Our expert team can help you find the perfect EV for your 
                  lifestyle and budget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Bottom Sheet Filters */}
      <BottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filters"
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => {
                setFilters({
                  category: 'all',
                  brand: 'all',
                  year: 'all',
                  minPrice: '',
                  maxPrice: '',
                  color: 'all',
                  maxMileage: ''
                });
                setLocationQuery('');
                setShowSoldVehicles(true);
              }}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg active:scale-95 transition-transform"
            >
              Clear
            </button>
            <button
              onClick={() => {
                setIsFilterOpen(false);
                setCurrentPage(1);
              }}
              className="flex-[2] px-4 py-3 bg-[#3AB0FF] text-white font-semibold rounded-lg active:scale-95 transition-transform"
            >
              Apply ({totalVehicles} results)
            </button>
          </div>
        }
      >
        <div className="space-y-4 px-4 py-4 pb-28">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Category</label>
            <select 
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] bg-white text-gray-900"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="all">All Categories</option>
              <option value="ev-car">Electric Cars</option>
              <option value="hybrid-car">Hybrid Cars</option>
              <option value="ev-scooter">Electric Scooters</option>
              <option value="e-bike">Electric Bikes</option>
            </select>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Brand</label>
            <select 
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] bg-white text-gray-900"
              value={filters.brand}
              onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
            >
              <option value="all">All Brands</option>
              <option value="Tesla">Tesla</option>
              <option value="Rivian">Rivian</option>
              <option value="Lucid">Lucid</option>
              <option value="Ford">Ford</option>
              <option value="Chevrolet">Chevrolet</option>
              <option value="Nissan">Nissan</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Audi">Audi</option>
              <option value="Volkswagen">Volkswagen</option>
              <option value="Hyundai">Hyundai</option>
              <option value="Kia">Kia</option>
              <option value="Porsche">Porsche</option>
              <option value="Volvo">Volvo</option>
              <option value="Polestar">Polestar</option>
              <option value="Fisker">Fisker</option>
              <option value="VinFast">VinFast</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Year Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Year</label>
            <select 
              className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] bg-white text-gray-900"
              value={filters.year}
              onChange={(e) => setFilters(prev => ({ ...prev, year: e.target.value }))}
            >
              <option value="all">All Years</option>
              {Array.from({ length: 16 }, (_, i) => 2025 - i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="ZIP, city, or address"
                className="w-full pl-12 pr-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] bg-white text-gray-900 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Min Price Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Min Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base">$</span>
              <input
                type="number"
                placeholder="0"
                className="w-full pl-9 pr-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] bg-white text-gray-900 placeholder-gray-400"
                value={filters.minPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              />
            </div>
          </div>

          {/* Max Price Filter */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Max Price</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base">$</span>
              <input
                type="number"
                placeholder="100,000"
                className="w-full pl-9 pr-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] bg-white text-gray-900 placeholder-gray-400"
                value={filters.maxPrice}
                onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              />
            </div>
          </div>

          {/* Show Sold Toggle */}
          <div className="flex items-center gap-3 py-2">
            <input
              type="checkbox"
              id="mobile-showSoldVehicles"
              checked={showSoldVehicles}
              onChange={(e) => setShowSoldVehicles(e.target.checked)}
              className="w-5 h-5 text-[#3AB0FF] bg-gray-100 border-gray-300 rounded focus:ring-[#3AB0FF] focus:ring-2"
            />
            <label htmlFor="mobile-showSoldVehicles" className="text-sm font-medium text-gray-700">
              Show sold vehicles
            </label>
          </div>
        </div>
      </BottomSheet>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        showFilters={true}
        onFilterClick={() => setIsFilterOpen(true)}
      />

      {/* Structured Data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
    </div>
  );
}