"use client";

import { useState, useEffect } from "react";
import { Search, Car, MapPin, Filter, Zap, Battery, Bike, Instagram, Facebook, Shield, Star, Users, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import OptimizedImage from "@/components/OptimizedImage";
import AuthSync from "@/components/AuthSync";
import Link from "next/link";
import { Vehicle } from "@/lib/database";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { trackEvent, trackSearch, trackCategoryView, trackClick, trackScrollDepth } from "@/lib/analytics";

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
      case 'e-bike':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      {/* Enhanced Local Business Schema for Homepage */}
      <Script
        id="local-business-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Evvalley",
            "description": "US EV & E-Mobility Marketplace - Buy and sell electric vehicles, e-scooters, and e-bikes. Find your perfect electric vehicle with expert guidance and trusted marketplace.",
            "url": "https://www.evvalley.com",
            "logo": "https://www.evvalley.com/logo.png",
            "image": "https://www.evvalley.com/og-image.jpg",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US",
              "addressRegion": "United States"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "url": "https://www.evvalley.com/contact",
              "email": "evvalley@evvalley.com"
            },
            "sameAs": [
              "https://www.evvalley.com/blog",
              "https://www.instagram.com/evvalleyus/",
              "https://www.facebook.com/profile.php?id=61574833470669"
            ],
            "serviceArea": {
              "@type": "Country",
              "name": "United States"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Electric Vehicles & E-Mobility",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Electric Vehicles",
                    "description": "Tesla, Chevrolet, Ford, Hyundai, Kia, Nissan electric cars"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "Hybrid Vehicles",
                    "description": "Toyota, Honda, Ford hybrid cars and SUVs"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "E-Scooters",
                    "description": "Electric scooters for urban transportation"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Product",
                    "name": "E-Bikes",
                    "description": "Electric bicycles for commuting and recreation"
                  }
                }
              ]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "150"
            }
          })
        }}
      />
      
      <AuthSync />
      <Header />

      {/* Enhanced Hero Section with SEO Content */}
      <section className="bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Electric Vehicle
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-white/90">
              US Electric Vehicle & E-Mobility Marketplace
            </p>
            <p className="text-lg mb-8 text-white/80 max-w-3xl mx-auto">
              Buy and sell electric cars, hybrid vehicles, e-scooters, and e-bikes. 
              Trusted marketplace for Tesla, Chevrolet, Ford, Hyundai, and more. 
              Expert guidance for your electric vehicle journey.
            </p>
            
            {/* Enhanced Search Bar */}
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
                        placeholder="Search Tesla, Chevy Bolt, Ford Mach-E, e-scooter, e-bike..."
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

            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Secure Transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span>4.8/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Growing Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Category Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Browse Electric Vehicle Categories
            </h2>
            <p className="text-gray-600">
              Find the perfect electric vehicle for your needs - from electric cars to e-scooters
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/vehicles?category=all" onClick={() => handleCategoryClick('all')}>
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
            
            <Link href="/vehicles?category=e-bike" onClick={() => handleCategoryClick('e-bike')}>
              <button className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF]">
                <Bike className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">Electric Bikes</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Featured Electric Vehicles Section */}
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
                        {vehicle.category.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{vehicle.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {vehicle.year} • {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'New'}
                      {vehicle.range_miles && ` • ${vehicle.range_miles}mi range`}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#3AB0FF]">
                        ${vehicle.price.toLocaleString()}
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

      {/* New SEO Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Evvalley for Your Electric Vehicle?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#3AB0FF] p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Trusted Marketplace</h3>
                    <p className="text-gray-600">
                      Buy and sell electric vehicles with confidence. Our secure platform ensures safe transactions 
                      and verified listings for Tesla, Chevrolet, Ford, and other electric vehicles.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#78D64B] p-2 rounded-lg">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Guidance</h3>
                    <p className="text-gray-600">
                      Get expert advice on electric vehicles, charging, maintenance, and tax incentives. 
                      Our comprehensive guides help you make informed decisions about your EV purchase.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-[#1C1F4A] p-2 rounded-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Growing EV Community</h3>
                    <p className="text-gray-600">
                      Join thousands of electric vehicle enthusiasts. Share experiences, tips, and connect 
                      with other EV owners in our community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#3AB0FF] to-[#78D64B] rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Popular Electric Vehicle Brands</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Electric Cars</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Tesla Model 3 & Y</li>
                    <li>• Chevrolet Bolt EV</li>
                    <li>• Ford Mustang Mach-E</li>
                    <li>• Hyundai Ioniq 5</li>
                  </ul>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Hybrid Vehicles</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Toyota Prius</li>
                    <li>• Honda Insight</li>
                    <li>• Ford Escape Hybrid</li>
                    <li>• Hyundai Tucson Hybrid</li>
                  </ul>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">E-Scooters</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Xiaomi Mi Scooter</li>
                    <li>• Segway Ninebot</li>
                    <li>• Razor E300</li>
                    <li>• GoTrax GXL</li>
                  </ul>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">E-Bikes</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Rad Power Bikes</li>
                    <li>• Trek E-Bikes</li>
                    <li>• Specialized Turbo</li>
                    <li>• Cannondale E-Bikes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Evvalley</h3>
              <p className="text-gray-400 mb-4">
                US Electric Vehicle & E-Mobility Marketplace. Buy and sell electric cars, 
                hybrid vehicles, e-scooters, and e-bikes with confidence.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/evvalleyus/" 
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Follow us on Instagram"
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => trackSocialMediaClick('instagram', 'footer')}
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61574833470669" 
                  className="text-gray-400 hover:text-white transition-colors"
                  title="Follow us on Facebook"
                  target="_blank" rel="noopener noreferrer"
                  onClick={() => trackSocialMediaClick('facebook', 'footer')}
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Electric Vehicle Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/vehicles?category=ev-car" className="hover:text-white">Electric Cars</Link></li>
                <li><Link href="/vehicles?category=hybrid-car" className="hover:text-white">Hybrid Cars</Link></li>
                <li><Link href="/vehicles?category=ev-scooter" className="hover:text-white">Electric Scooters</Link></li>
                <li><Link href="/vehicles?category=e-bike" className="hover:text-white">Electric Bikes</Link></li>
                <li><Link href="/blog" className="hover:text-white">EV Blog & Guides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Evvalley</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety Guidelines</Link></li>
                <li><Link href="/escrow" className="hover:text-white">Secure Escrow</Link></li>
                <li><Link href="/community" className="hover:text-white">EV Community</Link></li>
                <li><Link href="/sell" className="hover:text-white">Sell Your EV</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li>evvalley@evvalley.com</li>
                <li>San Francisco, CA</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">&copy; 2024 Evvalley. All rights reserved. US Electric Vehicle Marketplace.</p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Trusted by 10,000+ EV enthusiasts</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
