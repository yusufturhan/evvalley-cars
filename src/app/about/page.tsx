"use client";

import Header from "@/components/Header";
import { 
  Zap, Users, Shield, MessageCircle, Car, Battery, 
  TrendingUp, Heart, Target, Award, Check, Globe,
  DollarSign, Clock, Star, Sparkles, ArrowRight,
  CheckCircle2, XCircle, Leaf, UserCheck, Lock
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const coreValues = [
    {
      icon: Heart,
      title: "Community First",
      description: "We prioritize the EV community's needs above profits. Every decision we make is centered around serving buyers and sellers better.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "No hidden fees, no commissions, no surprises. We believe in complete transparency in every transaction and interaction.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Leaf,
      title: "Sustainable Future",
      description: "Accelerating the transition to electric mobility is our mission. Every vehicle sold brings us closer to a cleaner planet.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      title: "Innovation & Simplicity",
      description: "We constantly innovate while keeping the platform simple and intuitive. Technology should make your life easier, not harder.",
      color: "from-purple-500 to-indigo-500"
    }
  ];

  const features = [
    {
      icon: MessageCircle,
      title: "Direct Messaging",
      description: "Built-in real-time chat system allows instant communication between buyers and sellers. No phone numbers required until you're ready.",
      stats: "10,000+ conversations/month",
      color: "blue"
    },
    {
      icon: UserCheck,
      title: "Verified Users",
      description: "Every user goes through secure authentication. Your safety is our priority with ID verification and background checks.",
      stats: "99.5% verified users",
      color: "green"
    },
    {
      icon: Battery,
      title: "EV-Specific Platform",
      description: "Unlike generic marketplaces, we're built exclusively for electric mobility. Advanced filters for range, battery, and EV features.",
      stats: "50+ vehicle categories",
      color: "purple"
    },
    {
      icon: Globe,
      title: "Nationwide Coverage",
      description: "Active in all 50 states with location-based search. Find EVs in your area or expand your search nationwide.",
      stats: "All 50 states",
      color: "orange"
    },
    {
      icon: Lock,
      title: "Secure Platform",
      description: "Bank-level encryption protects your data. Coming soon: integrated escrow service for 100% secure transactions.",
      stats: "256-bit SSL encryption",
      color: "indigo"
    },
    {
      icon: Star,
      title: "Quality Listings",
      description: "Professional listing tools with photo uploads, detailed specs, and vehicle history. Make your listing stand out.",
      stats: "15+ photos per listing",
      color: "pink"
    }
  ];

  const whatWeAreNot = [
    "We are NOT a dealership - no dealer markups or pressure sales",
    "We do NOT take commissions - what you list is what you get",
    "We do NOT handle payments - you transact directly with buyers/sellers",
    "We do NOT participate in negotiations - you control your terms",
    "We are NOT a broker - no middleman fees or hidden costs"
  ];

  const whatWeAre = [
    "A dedicated marketplace ONLY for electric mobility",
    "A transparent platform with zero commission fees",
    "A trusted community of verified EV enthusiasts",
    "A direct connection between buyers and sellers",
    "A simple, user-friendly listing and search platform"
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
    green: "bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white",
    purple: "bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    orange: "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white",
    indigo: "bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
    pink: "bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white"
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />
      
      {/* Hero Section - Enhanced */}
      <section className="relative bg-gradient-to-br from-[#1C1F4A] via-[#2A2F6B] to-[#3AB0FF] text-white py-24 md:py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#78D64B] rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8 inline-block">
              <div className="relative">
                <div className="absolute inset-0 bg-[#78D64B]/30 rounded-full blur-2xl animate-pulse"></div>
                <Zap className="relative h-24 w-24 mx-auto text-[#78D64B] drop-shadow-2xl" fill="#78D64B" strokeWidth={1.5} />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-[#78D64B]" />
              <span className="text-sm font-medium">America's #1 EV Marketplace</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Welcome to
              <span className="block bg-gradient-to-r from-[#78D64B] via-[#3AB0FF] to-cyan-200 bg-clip-text text-transparent">
                EvValley
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-4 text-white/90 max-w-4xl mx-auto leading-relaxed font-medium">
              The premier commission-free marketplace for electric vehicles and sustainable e-mobility
            </p>
            
            <p className="text-lg md:text-xl mb-10 text-white/80 max-w-3xl mx-auto">
              Connecting passionate EV enthusiasts, one listing at a time. Zero commissions. Zero hassle. 100% community-driven.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/vehicles"
                className="bg-[#78D64B] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#6BC43D] transition-all transform hover:scale-105 shadow-2xl flex items-center gap-2"
              >
                Browse EVs
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/sell"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm"
              >
                List Your EV Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-block p-4 bg-blue-50 rounded-2xl mb-3">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">5,000+</div>
              <div className="text-gray-600 font-medium">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-green-50 rounded-2xl mb-3">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">50,000+</div>
              <div className="text-gray-600 font-medium">Community Members</div>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-purple-50 rounded-2xl mb-3">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">$0</div>
              <div className="text-gray-600 font-medium">Commission Fees</div>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-orange-50 rounded-2xl mb-3">
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">$15M+</div>
              <div className="text-gray-600 font-medium">In Saved Commissions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#3AB0FF] font-semibold text-sm uppercase tracking-wider">Our Mission</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
              Accelerating the Electric Revolution
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We're on a mission to make electric vehicle ownership accessible, affordable, and transparent for everyone. 
              By eliminating commissions and middlemen, we're empowering direct connections between passionate EV enthusiasts 
              while accelerating the world's transition to sustainable transportation.
            </p>
          </div>
          
          {/* Core Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <value.icon className="h-8 w-8 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Are / Are NOT Section - Enhanced */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* What We Are */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-10 border-2 border-green-200 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-500 rounded-xl">
                  <CheckCircle2 className="h-8 w-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">What We Are</h3>
              </div>
              <div className="space-y-4">
                {whatWeAre.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" strokeWidth={3} />
                    <p className="text-gray-700 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* What We Are NOT */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-10 border-2 border-red-200 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-500 rounded-xl">
                  <XCircle className="h-8 w-8 text-white" strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900">What We're NOT</h3>
              </div>
              <div className="space-y-4">
                {whatWeAreNot.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <XCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                    <p className="text-gray-700 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#3AB0FF] font-semibold text-sm uppercase tracking-wider">Platform Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
              Built for EV Enthusiasts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every feature is designed with the electric vehicle community in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-[#3AB0FF]/50"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                  <feature.icon className="h-8 w-8 transition-all duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#3AB0FF]">
                  <Award className="h-4 w-4" />
                  <span>{feature.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#3AB0FF] font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started is easy. Whether you're buying or selling, we've streamlined the process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16">
            {/* For Sellers */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-10 border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-blue-500 rounded-xl">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">For Sellers</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Create Your Listing</h4>
                      <p className="text-gray-600">Sign up free and create detailed listings with photos, specs, and pricing. Takes only 5 minutes.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Connect with Buyers</h4>
                      <p className="text-gray-600">Receive messages from verified buyers. Respond through our secure messaging platform.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Complete Your Sale</h4>
                      <p className="text-gray-600">Negotiate terms, arrange viewing, and close the deal directly. Keep 100% of the sale price.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* For Buyers */}
            <div className="relative">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-10 border-2 border-green-200">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-green-500 rounded-xl">
                    <Car className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">For Buyers</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Browse Listings</h4>
                      <p className="text-gray-600">Search thousands of EVs with advanced filters. Find your perfect match by range, price, location.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Contact Sellers</h4>
                      <p className="text-gray-600">Message sellers instantly. Ask questions, request photos, negotiate price—all within our platform.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-xl w-12 h-12 flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg mb-2">Make Your Purchase</h4>
                      <p className="text-gray-600">Arrange viewing, complete inspection, finalize deal. Optional escrow service coming soon.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Commission Free - Highlighted */}
      <section className="py-24 bg-gradient-to-br from-[#3AB0FF] to-[#78D64B] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block p-4 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
            <DollarSign className="h-16 w-16" strokeWidth={2.5} />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            100% Commission Free
          </h2>
          <p className="text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Unlike traditional marketplaces that charge 5-10% commission, we charge <span className="font-bold text-3xl">$0</span>. 
          </p>
          <p className="text-xl mb-12 text-white/80 max-w-3xl mx-auto">
            What you list is what you get. We believe in fair, transparent transactions that benefit both buyers and sellers. 
            Our community has saved over <span className="font-bold text-2xl text-[#FFE66D]">$15 million</span> in commission fees.
          </p>

          <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-10 max-w-3xl mx-auto border-2 border-white/30">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
              <Heart className="h-8 w-8 text-red-300" fill="currentColor" />
              Our Promise
            </h3>
            <p className="text-lg text-white/90 leading-relaxed">
              We're committed to providing a platform that truly serves the EV community. 
              No hidden fees, no commissions, no surprises. Just a simple, effective marketplace 
              for electric vehicle enthusiasts. Our revenue comes from optional premium features, 
              not from your sales.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-[#1C1F4A] to-[#2A2F6B] text-white py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join the EV Revolution Today
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
            Be part of the future of transportation. Whether you're buying your first EV or selling your current one, 
            EvValley is your trusted partner in the electric vehicle marketplace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/sell"
              className="bg-[#78D64B] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#6BC43D] transition-all transform hover:scale-105 shadow-2xl inline-flex items-center gap-2"
            >
              List Your EV Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/vehicles"
              className="bg-white text-[#1C1F4A] px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl"
            >
              Browse Vehicles
            </Link>
          </div>
          
          <div className="mt-12 flex items-center justify-center gap-8 text-white/70">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-400" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-400" />
              <span>No Credit Card</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-400" />
              <span>List in 5 Minutes</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
