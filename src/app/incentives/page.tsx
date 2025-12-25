"use client";

import Header from "@/components/Header";
import { DollarSign, Gift, Star, Users, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

export default function IncentivesPage() {
  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1C1F4A] to-[#3AB0FF] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Earn Money Selling Your Electric Vehicle
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Join our growing community of EV sellers and start earning today
          </p>
          <Link 
            href="/sell" 
            className="bg-white text-[#1C1F4A] px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Start Selling Today
          </Link>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 bg-[#F5F9FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Live Platform Statistics
            </h2>
            <p className="text-xl text-gray-600">
              Real-time data from our growing marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl font-bold text-[#3AB0FF] mb-2">55+</div>
              <div className="text-gray-600">Active Listings</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl font-bold text-[#3AB0FF] mb-2">5000+</div>
              <div className="text-gray-600">Monthly Visitors</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl font-bold text-[#3AB0FF] mb-2">100%</div>
              <div className="text-gray-600">Free Listings</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <div className="text-3xl font-bold text-[#3AB0FF] mb-2">24/7</div>
              <div className="text-gray-600">Platform Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Sell on Evvalley?
            </h2>
            <p className="text-xl text-gray-600">
              Features that actually work and deliver results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-[#3AB0FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% FREE Listings</h3>
              <p className="text-gray-600">✅ No listing fees • ✅ No commission • ✅ No hidden costs • ✅ Forever free</p>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 font-medium">Currently Active</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-[#3AB0FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Growing EV Community</h3>
              <p className="text-gray-600">📈 5000+ monthly visitors • 🚗 55+ active listings • 🌍 US-wide reach</p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Live Stats</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-[#3AB0FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Messaging</h3>
              <p className="text-gray-600">🔒 Verified user accounts • 💬 Built-in chat system • 🚫 No spam</p>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700 font-medium">Active Now</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-[#3AB0FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Homepage Visibility</h3>
              <p className="text-gray-600">🏠 Featured on main page • 🔍 Top search results • 📱 Mobile optimized</p>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700 font-medium">In Development</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-[#3AB0FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real Market Data</h3>
              <p className="text-gray-600">📊 55+ active listings • 💰 Price comparisons • 📈 Market trends</p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">Live Data</p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="w-16 h-16 bg-[#3AB0FF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Coming Soon</h3>
              <p className="text-gray-600">🔒 Escrow • 🏆 Top seller badges • 💎 Premium features</p>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700 font-medium">In Development</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how other sellers are succeeding on Evvalley
            </p>
          </div>
          
          <div className="flex justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-[#3AB0FF] rounded-full flex items-center justify-center mr-6">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-xl">Carfornia</h4>
                  <p className="text-lg text-gray-600">Dealer</p>
                </div>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6 text-center">
                "I sold 3 of my listed cars in just 1 week, and the fact that buyers are serious on this platform has made our company's business much easier."
              </p>
              <div className="text-center">
                <div className="text-[#3AB0FF] font-semibold text-lg">Dealer Success Story</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#1C1F4A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Selling?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join our growing community of EV sellers
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#3AB0FF]">0$</div>
              <div className="text-sm">Cost to List</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#3AB0FF]">1 min</div>
              <div className="text-sm">Setup Time</div>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#3AB0FF]">24/7</div>
              <div className="text-sm">Platform Access</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/sell" 
              className="bg-[#3AB0FF] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#2A8FE6] transition-colors"
            >
              🚀 Start Selling Now - FREE
            </Link>
            <Link 
              href="/vehicles" 
              className="bg-transparent border border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-[#1C1F4A] transition-colors"
            >
              🔍 Browse Current Listings
            </Link>
          </div>
          
          <p className="text-sm text-blue-200 mt-6">
            ✅ No credit card required • ✅ No hidden fees • ✅ Start listing in minutes
          </p>
        </div>
      </section>
    </div>
  );
}
