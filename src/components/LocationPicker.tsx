"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import type { LocationData } from "@/lib/googleMaps";

interface LocationPickerProps {
  value: LocationData | null;
  onChange: (location: LocationData | null) => void;
  error?: string;
  placeholder?: string;
}

export default function LocationPicker({
  value,
  onChange,
  error,
  placeholder = "Enter city and state (e.g., Mountain View, CA)",
}: LocationPickerProps) {
  const [inputValue, setInputValue] = useState(
    value?.formatted_address || ""
  );

  // Simple text input handler - parse city and state from input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);
    
    if (text.trim()) {
      // Simple parsing: "Mountain View, CA" -> city: "Mountain View", state: "CA"
      const parts = text.split(',').map(s => s.trim());
      const city = parts[0] || "";
      const state = parts[1] || "";
      
      // Create LocationData object with minimal info
      const locationData: LocationData = {
        formatted_address: text,
        place_id: "",
        lat: 0, // No geocoding, so no lat/lng
        lng: 0,
        city,
        state,
        postal_code: "",
      };
      onChange(locationData);
    } else {
      onChange(null);
    }
  };

  return (
    <div className="w-full">
      {/* Simple Text Input */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500 ${
            error ? "border-red-500" : value ? "border-green-500" : "border-gray-300"
          }`}
          placeholder={placeholder}
        />
        {value && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
            ✓
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
      {!error && inputValue && value && (
        <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
          <span>✓</span>
          <span>Location entered: {value.city && value.state ? `${value.city}, ${value.state}` : value.formatted_address}</span>
        </p>
      )}
      {!error && !inputValue && (
        <p className="text-gray-500 text-xs mt-1">
          Examples: Mountain View, CA • San Francisco, California • Los Angeles, CA
        </p>
      )}
    </div>
  );
}

