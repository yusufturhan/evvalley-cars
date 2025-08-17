"use client";

import { useState, useEffect } from "react";
import { Search, Car, MapPin, Filter, Zap, Battery, Bike, Instagram, Facebook, Shield, Star, Users, TrendingUp, ChevronRight, ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import OptimizedImage from "@/components/OptimizedImage";
import AuthSync from "@/components/AuthSync";
import Link from "next/link";
import { Vehicle } from "@/lib/database";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { trackEvent, trackSearch, trackCategoryView, trackClick, trackScrollDepth, trackSocialMediaClick } from "@/lib/analytics";

export default function Home() {
  const router = useRouter();
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/vehicles?limit=12');
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
        
        setFeaturedVehicles(serializedVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVehicles();

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent >= 25 && scrollPercent < 50) {
        trackScrollDepth(25);
      } else if (scrollPercent >= 50 && scrollPercent < 75) {
        trackScrollDepth(50);
      } else if (scrollPercent >= 75) {
        trackScrollDepth(75);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.category-dropdown')) {
        setShowCategoryDropdown(false);
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCategoryDropdown]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    if (locationQuery.trim()) {
      params.append('location', locationQuery.trim());
    }
    if (selectedCategory !== 'all') {
      params.append('category', selectedCategory);
    }
    
    const queryString = params.toString();
    trackSearch(searchQuery.trim(), featuredVehicles.length);
    router.push(`/vehicles${queryString ? `?${queryString}` : ''}`);
  };

  const handleCategoryClick = (category: string) => {
    trackCategoryView(category);
    trackClick('category_button', category);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ev-car':
        return 'bg-green-100 text-green-800';
      case 'hybrid-car':
        return 'bg-blue-100 text-blue-800';
      case 'ev-scooter':
        return 'bg-purple-100 text-purple-800';
      case 'ev-bike':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'ev-car':
        return 'EV CAR';
      case 'hybrid-car':
        return 'HYBRID';
      case 'ev-scooter':
        return 'E-SCOOTER';
      case 'ev-bike':
        return 'E-BIKE';
      default:
        return category.toUpperCase();
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'all':
        return 'All Categories';
      case 'ev-car':
        return 'Electric Cars';
      case 'hybrid-car':
        return 'Hybrid Cars';
      case 'ev-scooter':
        return 'E-Scooters';
      case 'ev-bike':
        return 'E-Bikes';
      default:
        return 'All Categories';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <AuthSync />
      
      {/* Google Analytics */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}
      </Script>

      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Electric Vehicle
            </h1>
            <p className="text-xl text-white/90">
              US Electric Vehicle & E-Mobility Marketplace
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mt-8">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Category Dropdown */}
                  <div className="relative category-dropdown">
                    <button
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="w-full md:w-48 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 flex items-center justify-between hover:border-[#3AB0FF] transition-colors"
                    >
                      <span className="flex items-center">
                        <Zap className="w-4 h-4 mr-2 text-gray-500" />
                        {getCategoryDisplayName(selectedCategory)}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showCategoryDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        {[
                          { value: 'all', label: 'All Categories', icon: Zap },
                          { value: 'ev-car', label: 'Electric Cars', icon: Car },
                          { value: 'hybrid-car', label: 'Hybrid Cars', icon: Car },
                          { value: 'ev-scooter', label: 'E-Scooters', icon: Bike },
                          { value: 'ev-bike', label: 'E-Bikes', icon: Bike }
                        ].map((category) => {
                          const IconComponent = category.icon;
                          return (
                            <button
                              key={category.value}
                              onClick={() => {
                                setSelectedCategory(category.value);
                                setShowCategoryDropdown(false);
                              }}
                              className={`w-full px-4 py-3 text-left flex items-center hover:bg-gray-50 transition-colors ${
                                selectedCategory === category.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                              }`}
                            >
                              <IconComponent className="w-4 h-4 mr-2" />
                              {category.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Tesla, Chevy Bolt, Ford Mach-E..."
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
                        placeholder="Enter city, state, or zip code..."
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
                    Search EVs
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Browse Electric Vehicle Categories
            </h2>
            <p className="text-gray-600">
              Find the perfect electric vehicle for your needs
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/vehicles" onClick={() => handleCategoryClick('all')}>
              <button className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white shadow-md">
                <Zap className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">All Electric Vehicles</span>
              </button>
            </Link>
            
            <Link href="/vehicles?category=ev-car" onClick={() => handleCategoryClick('ev-car')}>
              <button className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF]">
                <Car className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">Electric Cars</span>
              </button>
            </Link>
            
            <Link href="/vehicles?category=hybrid-car" onClick={() => handleCategoryClick('hybrid-car')}>
              <button className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF]">
                <Car className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">Hybrid Cars</span>
              </button>
            </Link>
            
            <Link href="/vehicles?category=ev-scooter" onClick={() => handleCategoryClick('ev-scooter')}>
              <button className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF]">
                <Bike className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">Electric Scooters</span>
              </button>
            </Link>
            
            <Link href="/vehicles?category=ev-bike" onClick={() => handleCategoryClick('ev-bike')}>
              <button className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF]">
                <Bike className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">Electric Bikes</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Electric Vehicles
              </h2>
              <p className="text-gray-600">
                Discover top-rated electric cars, hybrid vehicles, and e-mobility solutions
              </p>
            </div>
            <Link href="/vehicles" className="text-[#3AB0FF] hover:text-[#2A2F6B] font-semibold transition-colors">
              View All Electric Vehicles →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(12)].map((_, i) => (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img
                          src={vehicle.images[0]}
                          alt={`${vehicle.brand} ${vehicle.model} electric vehicle for sale`}
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
                    <div className="flex items-center mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(vehicle.category)}`}>
                        {getCategoryLabel(vehicle.category)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{vehicle.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {vehicle.year} • {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'New'}
                      {vehicle.range_miles && ` • ${vehicle.range_miles}mi range`}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#3AB0FF]">
                        {formatPrice(vehicle.price)}
                      </span>
                      <Link href={`/vehicles/${vehicle.id}`}>
                        <button 
                          className="bg-[#1C1F4A] text-white px-4 py-2 rounded-lg hover:bg-[#2A2F6B] transition-colors"
                          onClick={() => trackClick('view_details_button', vehicle.title)}
                        >
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Evvalley</h3>
              <p className="text-gray-400">
                Your trusted marketplace for electric vehicles and e-mobility solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/vehicles" className="hover:text-white">Browse Vehicles</Link></li>
                <li><Link href="/sell" className="hover:text-white">Sell Your EV</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  onClick={() => trackSocialMediaClick('facebook', 'link')}
                  className="text-gray-400 hover:text-white"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  onClick={() => trackSocialMediaClick('instagram', 'link')}
                  className="text-gray-400 hover:text-white"
                >
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Evvalley. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
