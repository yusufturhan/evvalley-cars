"use client";

import Header from "@/components/Header";
import { Zap, Users, Shield, MessageCircle, Car, Battery } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1C1F4A] to-[#3AB0FF] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About Evvalley
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8">
            America's Premier Electric Vehicle & E-Mobility Marketplace
          </p>
          <div className="flex justify-center">
            <Zap className="h-12 w-12 text-[#78D64B]" />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To accelerate the adoption of electric vehicles and sustainable mobility by connecting buyers and sellers in a trusted, commission-free marketplace.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#F5F9FF] p-8 rounded-lg">
              <Car className="h-12 w-12 text-[#3AB0FF] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">What We Are</h3>
              <p className="text-gray-700">
                Evvalley is a dedicated marketplace platform that brings together electric vehicle buyers and sellers. 
                We provide a seamless, user-friendly environment where individuals can list, discover, and purchase 
                electric vehicles, hybrids, e-scooters, and e-bikes.
              </p>
            </div>
            
            <div className="bg-[#F5F9FF] p-8 rounded-lg">
              <Users className="h-12 w-12 text-[#78D64B] mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">What We Are NOT</h3>
              <p className="text-gray-700">
                We are not a dealership, broker, or intermediary. We do not take commissions, 
                handle payments, or participate in transactions. We simply connect buyers and sellers 
                in a trusted marketplace environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Platform Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <MessageCircle className="h-12 w-12 text-[#3AB0FF] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Direct Communication</h3>
                <p className="text-gray-600">
                  Built-in messaging system allows buyers and sellers to communicate directly, 
                  ask questions, and negotiate terms without any intermediaries.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Shield className="h-12 w-12 text-[#78D64B] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Verified Users</h3>
                <p className="text-gray-600">
                  User verification system ensures trust and transparency. 
                  All users are verified through secure authentication processes.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Battery className="h-12 w-12 text-[#1C1F4A] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">EV Focused</h3>
                <p className="text-gray-600">
                  Specialized platform for electric vehicles, hybrids, e-scooters, and e-bikes. 
                  Detailed specifications and range information for informed decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Sellers</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#3AB0FF] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Create Your Listing</h4>
                    <p className="text-gray-600">Sign up and create detailed listings with photos, specifications, and pricing.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#3AB0FF] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Connect with Buyers</h4>
                    <p className="text-gray-600">Receive messages from interested buyers and respond directly through our platform.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#3AB0FF] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Complete Your Sale</h4>
                    <p className="text-gray-600">Negotiate terms, arrange viewing, and complete the transaction on your terms.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">For Buyers</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#78D64B] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Browse Listings</h4>
                    <p className="text-gray-600">Search through thousands of electric vehicles with detailed specifications and photos.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#78D64B] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Contact Sellers</h4>
                    <p className="text-gray-600">Message sellers directly to ask questions, request more photos, or negotiate price.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#78D64B] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Make Your Purchase</h4>
                    <p className="text-gray-600">Arrange viewing, negotiate terms, and complete your purchase directly with the seller.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Free */}
      <section className="py-16 bg-gradient-to-r from-[#F5F9FF] to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">100% Commission Free</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Unlike traditional marketplaces, we don't take any commission from your sales. 
            What you list is what you get. We believe in fair, transparent transactions 
            that benefit both buyers and sellers.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-sm max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Our Promise</h3>
            <p className="text-gray-700">
              We're committed to providing a platform that truly serves the EV community. 
              No hidden fees, no commissions, no surprises. Just a simple, effective marketplace 
              for electric vehicle enthusiasts.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1C1F4A] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Join the EV Revolution</h3>
          <p className="text-gray-300 mb-6">
            Be part of the future of transportation. Whether you're buying or selling, 
            Evvalley is your trusted partner in the electric vehicle marketplace.
          </p>
          <div className="flex justify-center space-x-4">
            <a 
              href="/sell" 
              className="bg-[#3AB0FF] text-white px-6 py-3 rounded-lg hover:bg-[#2A2F6B] transition-colors"
            >
              List Your Vehicle
            </a>
            <a 
              href="/vehicles" 
              className="bg-transparent border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#1C1F4A] transition-colors"
            >
              Browse Vehicles
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
} 