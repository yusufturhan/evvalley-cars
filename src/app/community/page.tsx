"use client";

import { useState } from "react";
import { 
  Users, 
  MessageCircle, 
  Calendar, 
  TrendingUp, 
  UserPlus, 
  Heart,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Instagram,
  Facebook
} from "lucide-react";
import Header from "@/components/Header";
import Link from "next/link";

export default function CommunityPage() {
  const [isJoined, setIsJoined] = useState(false);

  const handleJoinCommunity = () => {
    // Discord redirect logic
    window.open('https://discord.gg/aRRNjgrm', '_blank');
    setIsJoined(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F9FF]">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1C1F4A] to-[#3AB0FF] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Join the EV Community
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                Connect with like-minded individuals who share your passion for electric vehicles. Learn from their experiences and share your own.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleJoinCommunity}
                  className="bg-[#78D64B] text-[#1C1F4A] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#6BC042] transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Join Discord Community
                  <ArrowRight className="w-5 h-5" />
                </button>
                <Link href="/vehicles">
                  <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#1C1F4A] transition-colors">
                    Browse EVs
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Side - EV Meetup Image */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20">
                <img
                  src="https://unicorn-images.b-cdn.net/8b732c44-17e4-43a6-a8c6-5898cbb28d6f?optimizer=gif&width=800&height=537"
                  alt="Tesla EV Meetup - Electric Vehicle Community Gathering"
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div className="hidden absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <div className="text-2xl font-bold mb-2">Tesla Meetup</div>
                    <div className="text-white/90">EV Community Gathering</div>
                  </div>
                </div>
              </div>
              {/* Overlay with community info */}
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Community</span>
                </div>
                <div className="text-sm text-white/80">Join our next EV meetup!</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Join Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How to Join Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with our EV community in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Step 1 */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  1
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Create Profile</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Start by creating your profile. Share your interests in electric vehicles and your journey towards sustainable living. Connect with other EV enthusiasts and build your network.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Share your EV experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Upload profile picture</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Add your location</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  2
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Join Discord</h3>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect with like-minded individuals who share your passion for electric vehicles. Learn from their experiences and share your own insights in our active Discord community.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Real-time discussions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Expert advice</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Event notifications</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#F5F9FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Community Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what makes our EV community special
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] rounded-lg flex items-center justify-center mb-6">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-time Chat</h3>
              <p className="text-gray-600">
                Connect with EV enthusiasts from around the world through our active Discord channels.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] rounded-lg flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">EV Events</h3>
              <p className="text-gray-600">
                Stay updated with local and virtual EV events, meetups, and community gatherings.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Expert Insights</h3>
              <p className="text-gray-600">
                Get advice from experienced EV owners and industry professionals in our community.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Local Groups</h3>
              <p className="text-gray-600">
                Find and connect with EV enthusiasts in your local area for meetups and support.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Latest News</h3>
              <p className="text-gray-600">
                Stay informed about the latest EV technology, charging infrastructure, and industry updates.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B] rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Support Network</h3>
              <p className="text-gray-600">
                Get help with EV-related questions, troubleshooting, and recommendations from the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#3AB0FF] to-[#78D64B]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Join the EV Revolution?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Connect with thousands of EV enthusiasts, share your experiences, and be part of the sustainable future.
          </p>
          <button 
            onClick={handleJoinCommunity}
            className="bg-white text-[#1C1F4A] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto"
          >
            <MessageCircle className="w-5 h-5" />
            Join Discord Community Now
            <ArrowRight className="w-5 h-5" />
          </button>
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