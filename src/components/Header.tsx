"use client";

import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import { Heart, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

export default function Header() {
  const { isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log('Header - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);
  console.log('Header - Clerk publishableKey:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? 'Present' : 'Missing');

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center h-16">
          <Link href="/">
            <Logo />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="flex space-x-8">
            <Link href="/" className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors">
              Home
            </Link>
            <Link href="/vehicles" className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors">
              EVs & E-Mobility
            </Link>
            <Link href="/community" className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors">
              Community
            </Link>
            <Link href="/about" className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors">
              About Us
            </Link>
            <Link href="/blog" className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors">
              Blog
            </Link>
            <Link href="/escrow" className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors">
              Escrow
            </Link>
            <Link href="/sell" className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors">
              List Your EV
            </Link>

            {isSignedIn && (
              <Link href="/favorites" className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                Favorites
              </Link>
            )}
            {isSignedIn && (
              <Link href="/profile" className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors">
                My Profile
              </Link>
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="flex items-center space-x-4">
            <SignedIn>
              <div className="flex items-center space-x-4">
                <UserButton afterSignOutUrl="/" />
                <button
                  onClick={handleSignOut}
                  className="text-[#4A5568] hover:text-[#3AB0FF] text-sm transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </SignedIn>
            <SignedOut>
              <div className="flex items-center space-x-4">
                <SignInButton mode="redirect">
                  <button className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="redirect">
                  <button className="bg-[#1C1F4A] text-white px-4 py-2 rounded-lg hover:bg-[#2A2F6B] transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Logo />
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#4A5568] hover:text-[#3AB0FF] transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="bg-white border-t border-gray-100 shadow-lg">
              <div className="px-4 py-4 space-y-4">
                {/* Navigation Links */}
                <div className="space-y-3">
                  <Link 
                    href="/" 
                    className="block text-[#4A5568] hover:text-[#3AB0FF] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Home
                  </Link>
                  <Link 
                    href="/vehicles" 
                    className="block text-[#4A5568] hover:text-[#3AB0FF] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    EVs & E-Mobility
                  </Link>
                  <Link 
                    href="/community" 
                    className="block text-[#4A5568] hover:text-[#3AB0FF] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Community
                  </Link>
                  <Link 
                    href="/about" 
                    className="block text-[#4A5568] hover:text-[#3AB0FF] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link 
                    href="/blog" 
                    className="block text-[#4A5568] hover:text-[#3AB0FF] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link 
                    href="/escrow" 
                    className="block text-[#4A5568] hover:text-[#3AB0FF] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Escrow
                  </Link>
                  <Link 
                    href="/sell" 
                    className="block text-[#4A5568] hover:text-[#3AB0FF] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    List Your EV
                  </Link>
                </div>

                {/* User-specific Links */}
                {isSignedIn && (
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <Link 
                      href="/favorites" 
                      className="block text-[#4A5568] hover:text-[#3AB0FF] transition-colors flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Favorites
                    </Link>
                    <Link 
                      href="/profile" 
                      className="block text-[#4A5568] hover:text-[#3AB0FF] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                  </div>
                )}

                {/* Auth Buttons */}
                <div className="border-t border-gray-100 pt-4">
                  <SignedIn>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <UserButton afterSignOutUrl="/" />
                        <span className="text-sm text-[#4A5568]">Account</span>
                      </div>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="text-[#4A5568] hover:text-[#3AB0FF] text-sm transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <div className="space-y-3">
                      <SignInButton mode="redirect">
                        <button 
                          className="w-full text-left text-[#4A5568] hover:text-[#3AB0FF] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton mode="redirect">
                        <button 
                          className="w-full bg-[#1C1F4A] text-white px-4 py-2 rounded-lg hover:bg-[#2A2F6B] transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Sign Up
                        </button>
                      </SignUpButton>
                    </div>
                  </SignedOut>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}