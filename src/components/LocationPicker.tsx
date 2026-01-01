"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import type { LocationData } from "@/lib/googleMaps";
import { resolvePlaceDetails } from "@/lib/googleMaps";
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
  placeholder = "Enter ZIP code, city, or address",
}: LocationPickerProps) {
  const [inputValue, setInputValue] = useState(
    value?.formatted_address || ""
  );
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Initialize Google Maps API (singleton loader)
  useEffect(() => {
    let hiddenMapDiv: HTMLDivElement | null = null;

    (async () => {
      try {
        const google = await getGoogleMaps();

        // Initialize AutocompleteService
        autocompleteServiceRef.current = new google.maps.places.AutocompleteService();

        // Initialize PlacesService (needs a map, so we'll create a hidden one)
        hiddenMapDiv = document.createElement("div");
        hiddenMapDiv.style.display = "none";
        document.body.appendChild(hiddenMapDiv);
        const hiddenMap = new google.maps.Map(hiddenMapDiv);
        placesServiceRef.current = new google.maps.places.PlacesService(hiddenMap);

        // Initialize preview map
        if (mapRef.current) {
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
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
      }
    })();

    return () => {
      // Cleanup hidden map div
      if (hiddenMapDiv && document.body.contains(hiddenMapDiv)) {
        document.body.removeChild(hiddenMapDiv);
      }
    };
  }, [value]);

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
  }, [value, map, mapLoaded]);

  // Handle input change and fetch suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    onChange(null); // Clear selection when user types

    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!autocompleteServiceRef.current) {
      return;
    }

    setIsLoading(true);
    autocompleteServiceRef.current.getPlacePredictions(
      {
        input: query,
        componentRestrictions: { country: "us" }, // US-only
        types: ["(regions)", "geocode"], // Allow cities, ZIP codes, and addresses
      },
      (predictions: any, status: any) => {
        setIsLoading(false);
        if (
          status === "OK" &&
          predictions
        ) {
          setSuggestions(predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    );
  };

  // Handle suggestion selection
  const handleSelectSuggestion = async (
    prediction: any
  ) => {
    setInputValue(prediction.description);
    setShowSuggestions(false);
    setSuggestions([]);

    if (!placesServiceRef.current) {
      return;
    }

    setIsLoading(true);
    try {
      const locationData = await resolvePlaceDetails(
        prediction.place_id,
        placesServiceRef.current
      );
      if (locationData) {
        onChange(locationData);
      }
    } catch (error) {
      console.error("Error resolving place details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full relative">
      {/* Input Field */}
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AB0FF] focus:border-transparent bg-white text-gray-900 placeholder-gray-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          placeholder={placeholder}
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#3AB0FF]"></div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => handleSelectSuggestion(prediction)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            >
              <div className="font-medium text-gray-900">
                {prediction.structured_formatting.main_text}
              </div>
              <div className="text-sm text-gray-500">
                {prediction.structured_formatting.secondary_text}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Map Preview */}
      {mapLoaded && (
        <div className="mt-4">
          <div
            ref={mapRef}
            className="w-full h-48 rounded-lg border border-gray-300 overflow-hidden"
          />
          {value && (
            <p className="text-xs text-gray-500 mt-1 text-center">
              {value.formatted_address}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

