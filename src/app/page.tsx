"use client";

import { useState, useEffect } from "react";
import { Search, Car, MapPin, Filter, Zap, Battery, Bike, Instagram, Facebook } from "lucide-react";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import AuthSync from "@/components/AuthSync";
import Link from "next/link";
import { Vehicle } from "@/lib/database";

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

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
      <AuthSync />
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect EV
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Electric Vehicle & E-Mobility Marketplace
            </p>
            {/* Search Bar with English placeholders */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-4 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Search EV, Hybrid, Scooter, or E-Bike..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <input
                        type="text"
                        placeholder="Select location..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent text-gray-900"
                      />
                    </div>
                  </div>
                  <Link href="/vehicles">
                    <button className="bg-[#1C1F4A] text-white px-8 py-3 rounded-lg hover:bg-[#2A2F6B] flex items-center justify-center transition-colors">
                      <Filter className="mr-2 h-5 w-5" />
                      Search
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/vehicles?category=all">
              <button className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] text-white shadow-md">
                <Zap className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">All Categories</span>
              </button>
            </Link>
            
            <Link href="/vehicles?category=ev-car">
              <button className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF]">
                <Car className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">EV Cars</span>
              </button>
            </Link>
            
            <Link href="/vehicles?category=hybrid-car">
              <button className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF]">
                <Car className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">Hybrid Cars</span>
              </button>
            </Link>
            
            <Link href="/vehicles?category=ev-scooter">
              <button className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF]">
                <Bike className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">EV Scooters</span>
              </button>
            </Link>
            
            <Link href="/vehicles?category=e-bike">
              <button className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 bg-white border border-gray-300 hover:border-[#3AB0FF] hover:bg-[#F5F9FF]">
                <Bike className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-900">E-Bikes</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Electric Vehicles */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Electric Vehicles
            </h2>
            <Link href="/vehicles" className="text-[#3AB0FF] hover:text-[#2A2F6B] font-semibold transition-colors">
              View All →
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
                        <button className="bg-[#1C1F4A] text-white px-4 py-2 rounded-lg hover:bg-[#2A2F6B] transition-colors">
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
                Electric Vehicle & E-Mobility Marketplace
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/vehicles?category=ev-car" className="hover:text-white">EV Cars</Link></li>
                <li><Link href="/vehicles?category=hybrid-car" className="hover:text-white">Hybrid Cars</Link></li>
                <li><Link href="/vehicles?category=ev-scooter" className="hover:text-white">EV Scooters</Link></li>
                <li><Link href="/vehicles?category=e-bike" className="hover:text-white">E-Bikes</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/safety" className="hover:text-white">Safety</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>evvalley@evvalley.com</li>
                <li>San Francisco, CA</li>
                <li>
                  <Link href="/contact">
                    <button className="bg-[#3AB0FF] text-white px-4 py-2 rounded-lg hover:bg-[#2A8FE6] transition-colors text-sm">
                      Contact Us
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400">&copy; 2024 Evvalley. All rights reserved.</p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <a 
                  href="https://www.instagram.com/evvalleyus/" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  title="Follow us on Instagram"
                  target="_blank" rel="noopener noreferrer"
                >
                  <Instagram className="h-5 w-5" />
                  <span className="hidden sm:inline">Instagram</span>
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61574833470669" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                  title="Follow us on Facebook"
                  target="_blank" rel="noopener noreferrer"
                >
                  <Facebook className="h-5 w-5" />
                  <span className="hidden sm:inline">Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
