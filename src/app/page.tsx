"use client";

import { useState, useEffect } from "react";
import { Search, Car, MapPin, Filter, Zap, Battery, Bike, Instagram, Facebook, Shield, Star, Users, TrendingUp, ChevronRight } from "lucide-react";
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

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.append('search', searchQuery.trim());
    }
    if (locationQuery.trim()) {
      params.append('location', locationQuery.trim());
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
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
      <section className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Perfect Electric Vehicle
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-medium">
              US Electric Vehicle & E-Mobility Marketplace
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto opacity-90">
              Buy and sell electric cars, hybrid vehicles, e-scooters, and e-bikes. 
              Trusted marketplace for Tesla, Chevrolet, Ford, Hyundai, and more. 
              Expert guidance for your electric vehicle journey.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="flex flex-col md:flex-row gap-4 bg-white rounded-xl p-2 shadow-lg">
                <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-4 py-3">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search Tesla, Chevy Bolt, Ford Mach-E..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <div className="flex-1 flex items-center bg-gray-50 rounded-lg px-4 py-3">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Enter city, state, or zip code..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Filter className="w-5 h-5 mr-2" />
                  Search EVs
                </button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                <span>Secure Transactions</span>
              </div>
              <div className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span>Growing Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse Electric Vehicle Categories
            </h2>
            <p className="text-lg text-gray-600">
              Find the perfect electric vehicle for your needs - from electric cars to e-scooters
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <button
              onClick={() => handleCategoryClick('all')}
              className="bg-blue-600 text-white p-6 rounded-xl hover:bg-blue-700 transition-colors text-center"
            >
              <Zap className="w-8 h-8 mx-auto mb-3" />
              <span className="font-medium">All Electric Vehicles</span>
            </button>
            <button
              onClick={() => handleCategoryClick('ev-car')}
              className="bg-white text-gray-900 p-6 rounded-xl hover:bg-gray-50 transition-colors text-center border border-gray-200"
            >
              <Car className="w-8 h-8 mx-auto mb-3" />
              <span className="font-medium">Electric Cars</span>
            </button>
            <button
              onClick={() => handleCategoryClick('hybrid-car')}
              className="bg-white text-gray-900 p-6 rounded-xl hover:bg-gray-50 transition-colors text-center border border-gray-200"
            >
              <Battery className="w-8 h-8 mx-auto mb-3" />
              <span className="font-medium">Hybrid Cars</span>
            </button>
            <button
              onClick={() => handleCategoryClick('ev-scooter')}
              className="bg-white text-gray-900 p-6 rounded-xl hover:bg-gray-50 transition-colors text-center border border-gray-200"
            >
              <Bike className="w-8 h-8 mx-auto mb-3" />
              <span className="font-medium">Electric Scooters</span>
            </button>
            <button
              onClick={() => handleCategoryClick('ev-bike')}
              className="bg-white text-gray-900 p-6 rounded-xl hover:bg-gray-50 transition-colors text-center border border-gray-200"
            >
              <Bike className="w-8 h-8 mx-auto mb-3" />
              <span className="font-medium">Electric Bikes</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Featured Electric Vehicles
              </h2>
              <p className="text-lg text-gray-600">
                Discover top-rated electric cars, hybrid vehicles, and e-mobility solutions
              </p>
            </div>
            <Link
              href="/vehicles"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              onClick={() => trackClick('view_all_vehicles', 'homepage')}
            >
              View All Electric Vehicles
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredVehicles.slice(0, 8).map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <OptimizedImage
                      src={vehicle.images?.[0] || '/placeholder-car.jpg'}
                      alt={vehicle.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <FavoriteButton vehicleId={vehicle.id} className="absolute top-2 right-2" />
                    <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(vehicle.category)}`}>
                      {vehicle.category.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link href={`/vehicles/${vehicle.id}`} className="hover:text-blue-600">
                        {vehicle.title}
                      </Link>
                    </h3>
                    <p className="text-2xl font-bold text-blue-600 mb-2">
                      {formatPrice(vehicle.price)}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{vehicle.location || 'Location not specified'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join the Electric Revolution?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey towards sustainable transportation today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/vehicles"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              onClick={() => trackClick('cta_browse_vehicles', 'homepage')}
            >
              Browse Vehicles
            </Link>
            <Link
              href="/sell"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
              onClick={() => trackClick('cta_sell_vehicle', 'homepage')}
            >
              Sell Your EV
            </Link>
          </div>
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
                  onClick={() => trackSocialMediaClick('facebook')}
                  className="text-gray-400 hover:text-white"
                >
                  <Facebook className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  onClick={() => trackSocialMediaClick('instagram')}
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
