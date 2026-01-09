"use client";

import { Heart, Plus, User, Filter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileBottomNavProps {
  onFilterClick?: () => void;
  showFilters?: boolean;
}

export default function MobileBottomNav({ onFilterClick, showFilters = false }: MobileBottomNavProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="grid grid-cols-4 h-16">
        {/* Filters Button (Only on listing pages) */}
        {showFilters && onFilterClick ? (
          <button
            onClick={onFilterClick}
            className="flex flex-col items-center justify-center gap-1 active:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-[10px] font-medium text-gray-600">Filters</span>
          </button>
        ) : (
          <Link
            href="/"
            className={`flex flex-col items-center justify-center gap-1 active:bg-gray-50 transition-colors ${
              isActive('/') ? 'text-[#3AB0FF]' : 'text-gray-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-medium">Home</span>
          </Link>
        )}

        {/* Favorites */}
        <Link
          href="/favorites"
          className={`flex flex-col items-center justify-center gap-1 active:bg-gray-50 transition-colors ${
            isActive('/favorites') ? 'text-[#3AB0FF]' : 'text-gray-600'
          }`}
        >
          <Heart className={`w-5 h-5 ${isActive('/favorites') ? 'fill-current' : ''}`} />
          <span className="text-[10px] font-medium">Favorites</span>
        </Link>

        {/* List Your EV - Center with emphasis */}
        <Link
          href="/sell"
          className="flex flex-col items-center justify-center gap-1 active:bg-gray-50 transition-colors"
        >
          <div className="w-12 h-12 -mt-6 bg-[#3AB0FF] rounded-full flex items-center justify-center shadow-lg">
            <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-semibold text-[#3AB0FF]">List Your EV</span>
        </Link>

        {/* My Profile */}
        <Link
          href="/profile"
          className={`flex flex-col items-center justify-center gap-1 active:bg-gray-50 transition-colors ${
            isActive('/profile') ? 'text-[#3AB0FF]' : 'text-gray-600'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">My Profile</span>
        </Link>
      </div>
    </nav>
  );
}
