"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, Filter, Car, Zap, Battery, Bike, MapPin, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import BottomSheet from "@/components/BottomSheet";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Vehicle } from "@/lib/database";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Script from "next/script";

interface VehiclesClientProps {
  initialCategory?: string;
  initialBrand?: string;
  initialLocation?: string;
  initialYear?: string;
}

export function VehiclesClient({ 
  initialCategory, 
  initialBrand, 
  initialLocation,
  initialYear 
}: VehiclesClientProps = {}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState(initialLocation || '');
  const [filters, setFilters] = useState({
    category: initialCategory || 'all',
    brand: initialBrand || 'all',
    year: initialYear || 'all',
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
  
  // Mobile filter bottom sheet state
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Sort state
  const [sortBy, setSortBy] = useState('newest');
  
  // Mobile sort bottom sheet state
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Load messageSent from localStorage on mount (user-specific)
  useEffect(() => {
    if (typeof window !== 'undefined' && user?.primaryEmailAddress?.emailAddress) {
      const userId = user.id;
      const userKey = `evvalley_messageSent_${userId}`;
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

  // Sync filters state with URL params for UI
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || initialCategory || 'all';
    const brandFromUrl = searchParams.get('brand') || initialBrand || 'all';
    const yearFromUrl = searchParams.get('year') || initialYear || 'all';
    const minPriceFromUrl = searchParams.get('minPrice') || '';
    const maxPriceFromUrl = searchParams.get('maxPrice') || '';
    const colorFromUrl = searchParams.get('color') || 'all';
    const maxMileageFromUrl = searchParams.get('maxMileage') || '';
    const searchFromUrl = searchParams.get('search') || '';
    const locationFromUrl = searchParams.get('location') || initialLocation || '';
    
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
  }, [searchParams, initialCategory, initialBrand, initialYear, initialLocation]);

  // Fetch vehicles with pagination
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Build API params with pagination - use filters state directly
        const params = new URLSearchParams();
        params.append('page', currentPage.toString());
        params.append('limit', vehiclesPerPage.toString());
        
        if (filters.category !== 'all') params.append('category', filters.category);
        if (filters.brand !== 'all') params.append('brand', filters.brand);
        if (filters.year !== 'all') params.append('year', filters.year);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.color !== 'all') params.append('color', filters.color);
        if (filters.maxMileage) params.append('maxMileage', filters.maxMileage);
        // Always show all vehicles (both sold and unsold) - no sold filter
        if (searchQuery.trim()) params.append('search', searchQuery.trim());
        if (locationQuery.trim()) params.append('location', locationQuery.trim());
        if (sortBy) params.append('sortBy', sortBy);

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
        setError('Failed to load vehicles. Please try again.');
        setVehicles([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [currentPage, filters, searchQuery, locationQuery, sortBy, vehiclesPerPage]);

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

  const handleSendMessage = useCallback(async (vehicleId: string, vehicleTitle: string, sellerEmail: string) => {
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
  }, [user, messageInputs, messageSent]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const applyLocationFilter = (loc: string) => {
    setLocationQuery(loc);
    setCurrentPage(1);
    
    // Apply to URL
    const params = new URLSearchParams(searchParams.toString());
    if (loc.trim()) {
      params.set('location', loc.trim());
    } else {
      params.delete('location');
    }
    router.push(`/vehicles?${params.toString()}`, { scroll: false });
  };

  // Structured Data for vehicles listing
  const listStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Electric Vehicles for Sale",
    "description": "Browse electric vehicles, hybrid cars, e-bikes, and e-scooters for sale",
    "url": "https://www.evvalley.com/vehicles",
    "itemListElement": vehicles.map((vehicle, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": vehicle.title,
        "description": vehicle.description || `${vehicle.year} ${vehicle.brand} ${vehicle.model} for sale. Price: $${vehicle.price?.toLocaleString()}. Mileage: ${vehicle.mileage ? vehicle.mileage.toLocaleString() + ' mi' : 'New'}. View more details on Evvalley.`,
        "image": vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : undefined,
        "brand": {
          "@type": "Brand",
          "name": vehicle.brand
        },
        "offers": {
          "@type": "Offer",
          "price": vehicle.price,
          "priceCurrency": "USD",
          "availability": vehicle.sold ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          "itemCondition": "https://schema.org/UsedCondition",
          "url": `https://www.evvalley.com/vehicles/${vehicle.id}`
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-16 md:pb-0">
      <Header />

      {/* Structured Data */}
      <Script
        id="list-structured-data-vc"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(listStructuredData)
        }}
      />

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
          {/* Mobile Filters & Sort Buttons */}
          <div className="lg:hidden mb-4 flex gap-3">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-[#3AB0FF] text-[#3AB0FF] font-semibold rounded-lg shadow-sm active:scale-95 transition-transform"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              <span className="ml-1 px-2 py-0.5 bg-[#3AB0FF] text-white text-xs rounded-full">
                {totalVehicles}
              </span>
            </button>
            <button
              onClick={() => setIsSortOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm active:scale-95 transition-transform"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <span>Sort</span>
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
                    // Apply filters to URL (no auto-scroll to preserve user position)
                    const params = new URLSearchParams();
                    if (filters.category !== 'all') params.set('category', filters.category);
                    if (filters.brand !== 'all') params.set('brand', filters.brand);
                    if (filters.year !== 'all') params.set('year', filters.year);
                    if (filters.minPrice) params.set('minPrice', filters.minPrice);
                    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
                    if (locationQuery.trim()) params.set('location', locationQuery.trim());
                    
                    const queryString = params.toString();
                    router.push(`/vehicles${queryString ? `?${queryString}` : ''}`);
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
              {/* Desktop Sort & Active Filter Chips Row */}
              <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                {/* Active Filter Chips */}
                {(filters.category !== 'all' || filters.brand !== 'all' || filters.year !== 'all' || filters.minPrice || filters.maxPrice || locationQuery) && (
                  <div className="flex flex-wrap items-center gap-2">
                  {/* Category Chip */}
                  {filters.category !== 'all' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                      <span className="font-medium">
                        {filters.category === 'ev-car' && 'Electric Cars'}
                        {filters.category === 'hybrid-car' && 'Hybrid Cars'}
                        {filters.category === 'ev-scooter' && 'Electric Scooters'}
                        {filters.category === 'e-bike' && 'Electric Bikes'}
                      </span>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, category: 'all' }))}
                        className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        aria-label="Remove category filter"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Brand Chip */}
                  {filters.brand !== 'all' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                      <span className="font-medium">Brand: {filters.brand}</span>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, brand: 'all' }))}
                        className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        aria-label="Remove brand filter"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Year Chip */}
                  {filters.year !== 'all' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                      <span className="font-medium">Year: {filters.year}</span>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, year: 'all' }))}
                        className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        aria-label="Remove year filter"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Min Price Chip */}
                  {filters.minPrice && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                      <span className="font-medium">Min: ${parseInt(filters.minPrice).toLocaleString()}</span>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, minPrice: '' }))}
                        className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        aria-label="Remove min price filter"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Max Price Chip */}
                  {filters.maxPrice && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                      <span className="font-medium">Max: ${parseInt(filters.maxPrice).toLocaleString()}</span>
                      <button
                        onClick={() => setFilters(prev => ({ ...prev, maxPrice: '' }))}
                        className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        aria-label="Remove max price filter"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Location Chip */}
                  {locationQuery && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                      <span className="font-medium">Location: {locationQuery}</span>
                      <button
                        onClick={() => setLocationQuery('')}
                        className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        aria-label="Remove location filter"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Clear All Button */}
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
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    Clear all
                  </button>
                  </div>
                )}

                {/* Desktop Sort Dropdown */}
                <div className="hidden md:flex items-center gap-2">
                  <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Sort by:
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all cursor-pointer hover:border-[#3AB0FF]"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="year-desc">Year: Newest</option>
                    <option value="mileage-asc">Mileage: Low to High</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
                      {/* Image Skeleton */}
                      <div className="aspect-[4/3] bg-gray-200"></div>
                      
                      {/* Content Skeleton */}
                      <div className="p-4 space-y-3">
                        {/* Category Badge */}
                        <div className="h-5 bg-gray-200 rounded-full w-24"></div>
                        
                        {/* Title */}
                        <div className="space-y-2">
                          <div className="h-6 bg-gray-200 rounded w-full"></div>
                          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        </div>
                        
                        {/* Meta Info */}
                        <div className="flex gap-3">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                          <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                        
                        {/* Price */}
                        <div className="h-7 bg-gray-200 rounded w-32"></div>
                        
                        {/* CTA */}
                        <div className="h-12 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-16 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Something went wrong
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#3AB0FF] text-white font-semibold rounded-lg hover:bg-[#2A9FEF] transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Retry
                  </button>
                </div>
              ) : vehicles.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No vehicles found
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Try adjusting or clearing your filters to see more results.
                  </p>
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
                      setSearchQuery('');
                      router.push('/vehicles');
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear all filters
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {vehicles.map((vehicle, index) => (
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
                            <video
                              src={vehicle.video_url}
                              playsInline
                              controls
                              className="w-full h-full object-cover transition-transform duration-200 ease-out md:group-hover:scale-105"
                              preload="metadata"
                            />
                            ) : vehicle.images && vehicle.images.length > 0 ? (
                              <Image
                                src={vehicle.images[0]}
                                alt={vehicle.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-200 ease-out md:group-hover:scale-105"
                                priority={index < 4}
                                placeholder="blur"
                                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.parentElement?.nextElementSibling as HTMLElement;
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
                                  className="flex-1 h-11 px-3 border border-gray-300 rounded-lg text-sm text-black font-medium placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                />
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleSendMessage(vehicle.id, vehicle.title, vehicle.seller_email || '');
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

      {/* Mobile Bottom Sheet Filters */}
      <BottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title="Filters"
        actions={
          <div className="flex gap-3">
            <button
              onClick={() => {
                // Clear filters and apply to URL
                router.push('/vehicles');
                setIsFilterOpen(false);
              }}
              className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg active:scale-95 transition-transform"
            >
              Clear
            </button>
            <button
              onClick={() => {
                // Apply filters to URL
                const params = new URLSearchParams();
                if (filters.category !== 'all') params.set('category', filters.category);
                if (filters.brand !== 'all') params.set('brand', filters.brand);
                if (filters.year !== 'all') params.set('year', filters.year);
                if (filters.minPrice) params.set('minPrice', filters.minPrice);
                if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
                if (locationQuery.trim()) params.set('location', locationQuery.trim());
                
                const queryString = params.toString();
                router.push(`/vehicles${queryString ? `?${queryString}` : ''}`);
                setIsFilterOpen(false);
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
              id="mobile-showSoldVehicles-vc"
              checked={showSoldVehicles}
              onChange={(e) => setShowSoldVehicles(e.target.checked)}
              className="w-5 h-5 text-[#3AB0FF] bg-gray-100 border-gray-300 rounded focus:ring-[#3AB0FF] focus:ring-2"
            />
            <label htmlFor="mobile-showSoldVehicles-vc" className="text-sm font-medium text-gray-700">
              Show sold vehicles
            </label>
          </div>
        </div>
      </BottomSheet>

      {/* Mobile Bottom Sheet Sort */}
      <BottomSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        title="Sort by"
        actions={
          <button
            onClick={() => setIsSortOpen(false)}
            className="w-full px-4 py-3 bg-[#3AB0FF] text-white font-semibold rounded-lg active:scale-95 transition-transform"
          >
            Apply
          </button>
        }
      >
        <div className="p-4 space-y-2">
          {[
            { value: 'newest', label: 'Newest' },
            { value: 'price-asc', label: 'Price: Low to High' },
            { value: 'price-desc', label: 'Price: High to Low' },
            { value: 'year-desc', label: 'Year: Newest' },
            { value: 'mileage-asc', label: 'Mileage: Low to High' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                sortBy === option.value
                  ? 'bg-[#3AB0FF]/10 border-2 border-[#3AB0FF]'
                  : 'bg-white border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                sortBy === option.value
                  ? 'border-[#3AB0FF] bg-[#3AB0FF]'
                  : 'border-gray-300'
              }`}>
                {sortBy === option.value && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
              <span className={`text-sm font-medium ${
                sortBy === option.value ? 'text-[#3AB0FF]' : 'text-gray-700'
              }`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        showFilters={true}
        onFilterClick={() => setIsFilterOpen(true)}
      />

    </div>
  );
}

