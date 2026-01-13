"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import type { LocationData } from "@/lib/googleMaps";
import { parseAddressComponents } from "@/lib/googleMaps";
import { getGoogleMaps } from "@/lib/mapsLoader";

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
  placeholder = "Enter ZIP code, city, or state (e.g., Mountain View, 94040, CA)",
}: LocationPickerProps) {
  const [inputValue, setInputValue] = useState(
    value?.formatted_address || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [geocodeError, setGeocodeError] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const geocoderRef = useRef<any>(null);
  const geocodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Google Maps API and Geocoder
  useEffect(() => {
    let mounted = true;
    
    (async () => {
      try {
        console.log("[LocationPicker] Starting initialization...");
        setIsInitializing(true);
        
        const google = await getGoogleMaps();
        console.log("[LocationPicker] Google Maps loaded", { 
          hasGoogle: !!google, 
          hasMaps: !!google?.maps,
          hasGeocoder: !!google?.maps?.Geocoder 
        });

        if (!mounted) return;

        // Initialize Geocoder for manual address search
        if (!geocoderRef.current && google?.maps?.Geocoder) {
          geocoderRef.current = new google.maps.Geocoder();
          console.log("[LocationPicker] Geocoder initialized successfully");
        }

        // Initialize visible preview map only if we have a value to show
        if (mapRef.current && !map && value) {
          const previewMap = new google.maps.Map(mapRef.current, {
            center: { lat: 37.7749, lng: -122.4194 }, // Default: San Francisco
            zoom: 10,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });
          setMap(previewMap);
          setMapLoaded(true);
          
          // If we already have a location, create marker immediately
          if (value) {
            const position = { lat: value.lat, lng: value.lng };
            previewMap.setCenter(position);
            previewMap.setZoom(13);
            const newMarker = new google.maps.Marker({
              position,
              map: previewMap,
              title: value.formatted_address,
            });
            setMarker(newMarker);
          }
        }
        
        if (mounted) {
          setIsInitializing(false);
          console.log("[LocationPicker] Initialization complete");
        }
      } catch (err) {
        console.error("[LocationPicker] Error loading Google Maps API:", err);
        if (mounted) {
          setIsInitializing(false);
          setGeocodeError("Unable to load maps service. Please refresh the page and try again.");
        }
      }
    })();

    return () => {
      mounted = false;
      if (geocodeTimeoutRef.current) {
        clearTimeout(geocodeTimeoutRef.current);
      }
    };
  }, [value, map]);

  // Update map when location changes
  useEffect(() => {
    if (map && value && mapLoaded && typeof window !== 'undefined' && (window as any).google) {
      const position = { lat: value.lat, lng: value.lng };
      map.setCenter(position);
      map.setZoom(13);

      // Update or create marker
      if (marker) {
        marker.setPosition(position);
      } else {
        const newMarker = new (window as any).google.maps.Marker({
          position,
          map,
          title: value.formatted_address,
        });
        setMarker(newMarker);
      }
    }
  }, [value, map, mapLoaded, marker]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    setGeocodeError("");
    
    // Clear timeout if user is still typing
    if (geocodeTimeoutRef.current) {
      clearTimeout(geocodeTimeoutRef.current);
    }
    
    // Clear location when user modifies input
    if (value) {
      onChange(null);
    }
  };

  // Geocode the user's input (called on Enter or blur)
  const handleGeocodeLocation = async (retryCount = 0) => {
    const query = inputValue.trim();
    const MAX_RETRIES = 5; // Increased from 3 to 5
    
    // Skip if empty, already loading, or already have valid location for this query
    if (!query || isLoading) return;
    if (value && value.formatted_address === query) return;
    
    console.log(`[LocationPicker] handleGeocodeLocation called`, { 
      query, 
      retryCount, 
      hasGeocoder: !!geocoderRef.current,
      isInitializing 
    });
    
    // If geocoder not ready, wait and retry
    if (!geocoderRef.current) {
      if (retryCount < MAX_RETRIES) {
        console.log(`[LocationPicker] Geocoder not ready, retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        setIsLoading(true);
        setGeocodeError("");
        
        // Wait 1000ms (increased from 500ms) and retry
        setTimeout(async () => {
          // Try to initialize geocoder again
          try {
            console.log(`[LocationPicker] Attempting to load Google Maps (retry ${retryCount + 1})`);
            const google = await getGoogleMaps();
            console.log(`[LocationPicker] Google Maps loaded successfully`, { hasGoogle: !!google });
            
            if (!geocoderRef.current) {
              geocoderRef.current = new google.maps.Geocoder();
              console.log(`[LocationPicker] Geocoder initialized on retry ${retryCount + 1}`);
            }
          } catch (err) {
            console.error(`[LocationPicker] Failed to load Google Maps on retry ${retryCount + 1}:`, err);
          }
          
          setIsLoading(false);
          handleGeocodeLocation(retryCount + 1);
        }, 1000); // Increased from 500ms to 1000ms
        return;
      } else {
        console.error(`[LocationPicker] Max retries reached. Geocoder still not available.`);
        setGeocodeError("Maps service is taking longer than expected. Please click 'Confirm Location' button below.");
        setIsLoading(false);
        return;
      }
    }
    
    try {
      setIsLoading(true);
      setGeocodeError("");
      
      geocoderRef.current.geocode(
        {
          address: query,
          componentRestrictions: { country: "us" },
        },
        (results: any, status: any) => {
          setIsLoading(false);
          
          if (status === "OK" && results && results.length > 0) {
            const place = results[0];
            const { city, state, postal_code } = parseAddressComponents(
              place.address_components
            );
            const lat = place.geometry?.location?.lat() || 0;
            const lng = place.geometry?.location?.lng() || 0;
            const locationData: LocationData = {
              formatted_address: place.formatted_address || query,
              place_id: place.place_id || "",
              lat,
              lng,
              city,
              state,
              postal_code,
            };
            setInputValue(locationData.formatted_address);
            onChange(locationData);
            setGeocodeError("");
          } else if (status === "ZERO_RESULTS") {
            setGeocodeError("Location not found. Please try a different address, city, or ZIP code.");
            onChange(null);
          } else {
            console.warn("[LocationPicker] Geocode failed", { query, status });
            setGeocodeError("Unable to verify location. Please check your input and try again.");
            onChange(null);
          }
        }
      );
    } catch (err) {
      setIsLoading(false);
      console.error("[LocationPicker] Geocode error", err);
      setGeocodeError("An error occurred. Please try again.");
      onChange(null);
    }
  };

  return (
    <div className="w-full relative">
      {/* Input Field with Button */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleGeocodeLocation();
              }
            }}
            className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500 ${
              error || geocodeError ? "border-red-500" : value ? "border-green-500" : "border-gray-300"
            }`}
            placeholder={isInitializing ? "Loading maps..." : placeholder}
            disabled={isLoading || isInitializing}
          />
          {(isLoading || isInitializing) && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3AB0FF]"></div>
            </div>
          )}
          {value && !isLoading && !isInitializing && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
              ✓
            </div>
          )}
        </div>
        
        {/* Confirm Button - Only show if user has typed something but not confirmed */}
        {inputValue && !value && !isInitializing && (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleGeocodeLocation();
            }}
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-[#3AB0FF] text-white rounded-lg hover:bg-[#2A9FEF] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap font-medium transition-colors"
          >
            {isLoading ? "..." : "Confirm"}
          </button>
        )}
      </div>

      {/* Success/Error Messages */}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
      {geocodeError && !error && (
        <p className="text-red-500 text-xs mt-1">{geocodeError}</p>
      )}
      {isInitializing && !error && !geocodeError && (
        <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
          <span>⏳</span>
          <span>Loading maps service... This may take a few seconds.</span>
        </p>
      )}
      {!error && !geocodeError && !isInitializing && inputValue && !value && !isLoading && (
        <p className="text-blue-600 text-xs mt-1 flex items-center gap-1">
          <span>💡</span>
          <span>Click "Confirm" button or press Enter to verify location</span>
        </p>
      )}
      {value && !error && !geocodeError && !isInitializing && (
        <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
          <span>✓</span>
          <span>Location confirmed: {value.city && value.state ? `${value.city}, ${value.state}` : value.formatted_address}</span>
        </p>
      )}

      {/* Map Preview */}
      {mapLoaded && value && (
        <div className="mt-4">
          <div
            ref={mapRef}
            className="w-full h-48 rounded-lg border border-gray-300 overflow-hidden"
          />
          <p className="text-xs text-gray-500 mt-1 text-center">
            📍 {value.formatted_address}
          </p>
        </div>
      )}
    </div>
  );
}

