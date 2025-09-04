"use client";

import { SignInButton, SignUpButton, UserButton, useUser, useClerk } from "@clerk/nextjs";
import { Heart } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

export default function Header() {
  const { isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();

  console.log('Header - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);

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
            {!isLoaded ? (
              <div className="flex items-center space-x-4">
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              </div>
            ) : isSignedIn ? (
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
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Logo />
            </Link>
            
            {/* Mobile Auth Buttons */}
            <div className="flex items-center space-x-2">
              {!isLoaded ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse bg-gray-200 h-6 w-12 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                </div>
              ) : isSignedIn ? (
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
                  <SignInButton mode="redirect">
                    <button className="text-[#4A5568] hover:text-[#3AB0FF] transition-colors text-sm">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="redirect">
                    <button className="bg-[#1C1F4A] text-white px-3 py-1 rounded text-sm hover:bg-[#2A2F6B] transition-colors">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}