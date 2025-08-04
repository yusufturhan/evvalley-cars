"use client";

import { SignInButton, SignUpButton, UserButton, useUser, useClerk } from "@clerk/nextjs";
import { Heart, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

export default function Header() {
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const toggleMobileMenu = () => {
    console.log("Toggle mobile menu clicked");
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
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
              <Link href="/sell" className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors">
                Sell Your EV
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
              {isSignedIn ? (
                <div className="flex items-center space-x-4">
                  <UserButton afterSignOutUrl="/" />
                  <button
                    onClick={handleSignOut}
                    className="text-[#4A5568] hover:text-[#3AB0FF] text-sm transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <SignInButton mode="modal">
                    <button className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-[#1C1F4A] text-white px-4 py-2 rounded-lg hover:bg-[#2A2F6B] transition-colors">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden">
            {/* Mobile Top Row */}
            <div className="flex justify-between items-center h-16">
              <Link href="/">
                <Logo />
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="flex items-center space-x-2">
                {isSignedIn ? (
                  <div className="flex items-center space-x-2">
                    <UserButton afterSignOutUrl="/" />
                    <button
                      onClick={handleSignOut}
                      className="text-[#4A5568] hover:text-[#3AB0FF] text-sm transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <SignInButton mode="modal">
                      <button className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors text-sm">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button className="bg-[#1C1F4A] text-white px-3 py-1 rounded text-sm hover:bg-[#2A2F6B] transition-colors">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </div>
                )}
                
                {/* Mobile Menu Button (3 dots) */}
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-gray-600 hover:text-[#3AB0FF] hover:bg-gray-100 border border-gray-300"
                  style={{ minWidth: '40px', minHeight: '40px' }}
                  type="button"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation Menu - Always Visible */}
            <div style={{ 
              backgroundColor: '#EBF8FF', 
              borderTop: '1px solid #90CDF4', 
              padding: '12px 0',
              marginTop: '8px'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
                <Link 
                  href="/" 
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#4A5568',
                    backgroundColor: 'white',
                    border: '1px solid #90CDF4',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  🏠 Home
                </Link>
                <Link 
                  href="/vehicles" 
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#4A5568',
                    backgroundColor: 'white',
                    border: '1px solid #90CDF4',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  🚗 EVs & E-Mobility
                </Link>
                <Link 
                  href="/community" 
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#4A5568',
                    backgroundColor: 'white',
                    border: '1px solid #90CDF4',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  👥 Community
                </Link>
                <Link 
                  href="/about" 
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#4A5568',
                    backgroundColor: 'white',
                    border: '1px solid #90CDF4',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  ℹ️ About Us
                </Link>
                <Link 
                  href="/sell" 
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1C1F4A',
                    backgroundColor: '#BEE3F8',
                    border: '2px solid #3AB0FF',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-block'
                  }}
                >
                  💰 Sell Your EV
                </Link>

                {isSignedIn && (
                  <Link 
                    href="/favorites" 
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#4A5568',
                      backgroundColor: 'white',
                      border: '1px solid #90CDF4',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    <Heart style={{ width: '12px', height: '12px', marginRight: '4px' }} />
                    Favorites
                  </Link>
                )}
                {isSignedIn && (
                  <Link 
                    href="/profile" 
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#4A5568',
                      backgroundColor: 'white',
                      border: '1px solid #90CDF4',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}
                  >
                    👤 My Profile
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
} 