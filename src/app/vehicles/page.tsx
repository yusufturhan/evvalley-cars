"use client";

import { useState, useEffect, Suspense } from "react";
import { Search, Filter, Car, Zap, Battery, Bike, MapPin } from "lucide-react";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import Link from "next/link";
import { Vehicle } from "@/lib/database";
import { parseNaturalLanguageQuery, buildVehiclesSearchParams } from "@/lib/nlSearch";
import { useSearchParams, useRouter } from "next/navigation";
import Head from "next/head";

function VehiclesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
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
  const [showSoldVehicles, setShowSoldVehicles] = useState(true);
  const [smartQuery, setSmartQuery] = useState<string>("");
  const [semanticResults, setSemanticResults] = useState<Vehicle[]>([]);
  const [isSemanticSearch, setIsSemanticSearch] = useState(false);

  // Sync filters state with URL params for UI
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'all';
    const brandFromUrl = searchParams.get('brand') || 'all';
    const yearFromUrl = searchParams.get('year') || 'all';
    const minPriceFromUrl = searchParams.get('minPrice') || '';
    const maxPriceFromUrl = searchParams.get('maxPrice') || '';
    const searchFromUrl = searchParams.get('search') || '';
    const locationFromUrl = searchParams.get('location') || '';
    const colorFromUrl = searchParams.get('color') || '';
    
    setFilters({
      category: categoryFromUrl,
      brand: brandFromUrl,
      year: yearFromUrl,
      minPrice: minPriceFromUrl,
      maxPrice: maxPriceFromUrl
    });
    
    setSearchQuery(searchFromUrl);
    setLocationQuery(locationFromUrl);
    // Store color in URL-only state (we don't have a dedicated UI control yet)
    (window as any).__evvalley_color = colorFromUrl;
  }, [searchParams]);

  const handleSmartSearch = () => {
    if (!smartQuery.trim()) return;
    (async () => {
      try {
        // First try AI parser
        const res = await fetch('/api/ai-search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: smartQuery }) });
        const data = await res.json();
        const qs = data?.params || '';
        const url = `/vehicles${qs ? `?${qs}` : ''}`;
        router.push(url);
      } catch {
        try {
          // Deterministic fallback
          const det = await fetch('/api/search', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ q: smartQuery }) });
          const data = await det.json();
          const qs = data?.params || '';
          const url = `/vehicles${qs ? `?${qs}` : ''}`;
          router.push(url);
        } catch {
          // Local parser last resort
          const parsed = parseNaturalLanguageQuery(smartQuery);
          const params = buildVehiclesSearchParams(parsed);
          const url = `/vehicles?${params.toString()}`;
          router.push(url);
        }
      }
    })();
  };

  // Fetch vehicles when URL params change
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        let allVehicles: any[] = [];

        // Check if this is a semantic search
        const isSemantic = searchParams.get('semantic') === 'true';
        const semanticQuery = searchParams.get('query');

        if (isSemantic && semanticQuery) {
          // Handle semantic search results
          console.log('🔍 Semantic search query:', semanticQuery);
          const response = await fetch('/api/semantic-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ q: semanticQuery })
          });
          
          const data = await response.json();
          setSemanticResults(data.vehicles || []);
          setIsSemanticSearch(true);
          setVehicles([]);
          setLoading(false);
          return;
        }

        // Regular search
        setIsSemanticSearch(false);
        setSemanticResults([]);

        // Get current filters from URL params
        const currentCategory = searchParams.get('category') || 'all';
        const currentBrand = searchParams.get('brand') || 'all';
        const currentYear = searchParams.get('year') || 'all';
        const currentMinPrice = searchParams.get('minPrice') || '';
        const currentMaxPrice = searchParams.get('maxPrice') || '';
        const currentSearch = searchParams.get('search') || '';
        const currentLocation = searchParams.get('location') || '';
        const currentColor = (searchParams.get('color') || (typeof window !== 'undefined' ? (window as any).__evvalley_color : '')) || '';

        console.log('🔍 Current URL params:', {
          category: currentCategory,
          brand: currentBrand,
          year: currentYear,
          minPrice: currentMinPrice,
          maxPrice: currentMaxPrice,
          search: currentSearch,
          location: currentLocation
        });

        // Fetch from different endpoints based on category
        if (currentCategory === 'all' || currentCategory === 'ev-car' || currentCategory === 'hybrid-car') {
          const params = new URLSearchParams();
          params.append('limit', '100'); // Show all vehicles
          if (currentCategory !== 'all') params.append('category', currentCategory);
          if (currentBrand !== 'all') params.append('brand', currentBrand);
          if (currentYear !== 'all') params.append('year', currentYear);
          if (currentMinPrice) params.append('minPrice', currentMinPrice);
          if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
          if (currentSearch) params.append('search', currentSearch);
          if (currentColor) params.append('color', currentColor);
          if (currentLocation) params.append('location', currentLocation);
          if (showSoldVehicles) params.append('includeSold', 'true');

          console.log('🔍 Fetching vehicles with params:', params.toString());
          const response = await fetch(`/api/vehicles?${params.toString()}`);
          const data = await response.json();
          console.log('📦 API response:', data);
          if (data.vehicles) {
            console.log('✅ Adding vehicles:', data.vehicles.length);
            allVehicles.push(...data.vehicles);
          }
        }

        // Fetch E-Scooters
        if (currentCategory === 'all' || currentCategory === 'ev-scooter') {
          const params = new URLSearchParams();
          if (currentBrand !== 'all') params.append('brand', currentBrand);
          if (currentYear !== 'all') params.append('year', currentYear);
          if (currentMinPrice) params.append('minPrice', currentMinPrice);
          if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
          if (currentSearch) params.append('search', currentSearch);
          if (currentLocation) params.append('location', currentLocation);
          if (showSoldVehicles) params.append('includeSold', 'true');

          console.log('🔍 Fetching scooters with params:', params.toString());
          const response = await fetch(`/api/ev-scooters?${params.toString()}`);
          const data = await response.json();
          if (data.scooters) {
            console.log('✅ Adding scooters:', data.scooters.length);
            allVehicles.push(...data.scooters);
          }
        }

        // Fetch E-Bikes
        if (currentCategory === 'all' || currentCategory === 'e-bike') {
          const params = new URLSearchParams();
          if (currentBrand !== 'all') params.append('brand', currentBrand);
          if (currentYear !== 'all') params.append('year', currentYear);
          if (currentMinPrice) params.append('minPrice', currentMinPrice);
          if (currentMaxPrice) params.append('maxPrice', currentMaxPrice);
          if (currentSearch) params.append('search', currentSearch);
          if (currentLocation) params.append('location', currentLocation);
          if (showSoldVehicles) params.append('includeSold', 'true');

          console.log('🔍 Fetching bikes with params:', params.toString());
          const response = await fetch(`/api/e-bikes?${params.toString()}`);
          const data = await response.json();
          if (data.bikes) {
            console.log('✅ Adding bikes:', data.bikes.length);
            allVehicles.push(...data.bikes);
          }
        }

        // Client-side safety filter for location: exact city match (before comma)
        let filteredVehicles = allVehicles;
        if (currentLocation) {
          const locCity = currentLocation.split(',')[0].trim().toLowerCase();
          filteredVehicles = filteredVehicles.filter((v: any) => {
            const lvCity = (v.location || '').split(',')[0].trim().toLowerCase();
            return lvCity === locCity;
          });
        }
        
        console.log('🔍 Total vehicles from API:', allVehicles.length);
        console.log('🔍 Search query:', currentSearch);
        console.log('🔍 Location query:', currentLocation);
        
        // Ensure all data is properly serialized for Next.js 15 compatibility
        const serializedVehicles = filteredVehicles.map((vehicle: any) => {
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
        });
        
        console.log('🎯 Final vehicles to display:', serializedVehicles.length);
        setVehicles(serializedVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [searchParams, showSoldVehicles, searchQuery, locationQuery]);

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
    // Trigger the main fetchVehicles function which now handles all categories
    // fetchVehicles function is already defined above
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      {/* Canonical for vehicles listing; query param variations are redirected or noindexed */}
      <Head>
        {(() => {
          const category = filters.category || 'all';
          const brand = filters.brand && filters.brand !== 'all' ? filters.brand : '';
          const loc = (locationQuery || '').trim();
          const humanCategory = category === 'ev-car' ? 'Electric Cars' : category === 'hybrid-car' ? 'Hybrid Cars' : category === 'ev-scooter' ? 'Electric Scooters' : category === 'e-bike' ? 'Electric Bikes' : 'Electric Vehicles';
          const parts = [brand, humanCategory, loc ? `in ${loc}` : ''].filter(Boolean);
          const title = parts.length ? `${parts.join(' ')} for Sale | Evvalley` : 'Buy & Sell Electric Vehicles | Evvalley';
          const desc = `Browse ${brand ? brand + ' ' : ''}${humanCategory.toLowerCase()}${loc ? ' in ' + loc : ''}. Filter by price, year and brand. Verified listings on Evvalley.`;
          return (
            <>
              <title>{title}</title>
              <meta name="description" content={desc} />
            </>
          );
        })()}
        <link rel="canonical" href="https://www.evvalley.com/vehicles" />
        {(() => {
          const hasNonCanonicalFilters = (
            (filters.brand && filters.brand !== 'all') ||
            (filters.year && filters.year !== 'all') ||
            (filters.minPrice && filters.minPrice !== '') ||
            (filters.maxPrice && filters.maxPrice !== '') ||
            (searchQuery && searchQuery.trim() !== '') ||
            (locationQuery && locationQuery.trim() !== '')
          );
          return hasNonCanonicalFilters ? (
            <meta name="robots" content="noindex,follow" />
          ) : null;
        })()}
      </Head>

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

      {/* AI Search - separate section */}
      <section className="py-6 bg-[#F5F9FF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Search with EvValley AI</h3>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={smartQuery}
                    onChange={(e) => setSmartQuery(e.target.value)}
                    placeholder="Search with EvValley AI"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent text-gray-900"
                    onKeyPress={(e) => e.key === 'Enter' && handleSmartSearch()}
                  />
                </div>
              </div>
              <button
                onClick={handleSmartSearch}
                className="bg-[#3AB0FF] text-white px-6 py-3 rounded-lg hover:bg-[#2A8FE6] transition-colors"
              >
                Try AI Search
              </button>
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
                router.push('/vehicles');
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
                router.push('/vehicles?category=ev-car');
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
                router.push('/vehicles?category=hybrid-car');
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
                router.push('/vehicles?category=ev-scooter');
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
                router.push('/vehicles?category=e-bike');
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
                    <option value="2009" className="text-gray-900">2009</option>
                    <option value="2008" className="text-gray-900">2008</option>
                    <option value="2007" className="text-gray-900">2007</option>
                    <option value="2006" className="text-gray-900">2006</option>
                    <option value="2005" className="text-gray-900">2005</option>
                    <option value="2004" className="text-gray-900">2004</option>
                    <option value="2003" className="text-gray-900">2003</option>
                    <option value="2002" className="text-gray-900">2002</option>
                    <option value="2001" className="text-gray-900">2001</option>
                    <option value="2000" className="text-gray-900">2000</option>
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Max Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="100,000"
                    className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-[#3AB0FF] transition-all duration-200 bg-white text-gray-900 placeholder-gray-400 hover:border-[#3AB0FF]"
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

            {/* Clear Filters Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  router.push('/vehicles');
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
              {loading ? 'Loading...' : 
                isSemanticSearch 
                  ? `${semanticResults.length} AI Search Results` 
                  : `${vehicles.length} Vehicles Found`
              }
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
          ) : (isSemanticSearch ? semanticResults : vehicles).length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isSemanticSearch ? 'No matching vehicles found' : 'No vehicles found'}
              </h3>
              <p className="text-gray-600">
                {isSemanticSearch 
                  ? 'Try a different search term or use the filters below.' 
                  : 'Try adjusting your filters or check back later.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(isSemanticSearch ? semanticResults : vehicles).map((vehicle) => (
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
                    
                    {/* SOLD Badge - Small and positioned */}
                    {vehicle.sold && (
                      <div className="absolute top-2 left-2 z-10">
                        <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                          SOLD
                        </span>
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2">
                      <FavoriteButton vehicleId={vehicle.id} vehicleTitle={vehicle.title} size="sm" />
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
                      <span className={`text-2xl font-bold ${vehicle.sold ? 'text-red-600' : 'text-green-600'}`}>
                        {vehicle.sold ? 'SOLD' : `$${vehicle.price.toLocaleString()}`}
                      </span>
                      <Link href={`/vehicles/${vehicle.id}`}>
                        <button className={`px-4 py-2 rounded-lg transition-colors ${
                          vehicle.sold 
                            ? 'bg-gray-600 text-white hover:bg-gray-700' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}>
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

      {/* SEO: BreadcrumbList and ItemList JSON-LD (does not affect UI) */}
      {(() => {
        try {
          const category = filters.category || 'all';
          const humanCategory = category === 'ev-car' ? 'Electric Cars' : category === 'hybrid-car' ? 'Hybrid Cars' : category === 'ev-scooter' ? 'E‑Scooters' : category === 'e-bike' ? 'E‑Bikes' : 'All Vehicles';
          const breadcrumb = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.evvalley.com/" },
              { "@type": "ListItem", position: 2, name: "Vehicles", item: "https://www.evvalley.com/vehicles" },
              ...(category && category !== 'all' ? [{ "@type": "ListItem", position: 3, name: humanCategory, item: `https://www.evvalley.com/vehicles` }] : [])
            ]
          };
          const itemList = {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${humanCategory} on Evvalley`,
            numberOfItems: Array.isArray(vehicles) ? vehicles.length : 0,
            itemListElement: (Array.isArray(vehicles) ? vehicles : []).slice(0, 30).map((v: any, idx: number) => ({
              "@type": "ListItem",
              position: idx + 1,
              item: {
                "@type": "Product",
                name: v.title,
                brand: { "@type": "Brand", name: v.brand || v.make },
                model: v.model,
                image: v.images && v.images.length > 0 ? v.images[0] : undefined,
                url: `https://www.evvalley.com/vehicles/${v.id}`,
                offers: {
                  "@type": "Offer",
                  price: v.price,
                  priceCurrency: "USD",
                  availability: v.sold ? "https://schema.org/OutOfStock" : "https://schema.org/InStock"
                }
              }
            }))
          };
          return (
            <>
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
              <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
            </>
          );
        } catch (e) {
          return null;
        }
      })()}
    </div>
  );
}

export default function VehiclesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F9FF]">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3AB0FF] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading vehicles...</p>
          </div>
        </div>
      </div>
    }>
      <VehiclesContent />
    </Suspense>
  );
} 