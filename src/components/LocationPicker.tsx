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
  placeholder = "Enter ZIP code, city, or address",
}: LocationPickerProps) {
  const [inputValue, setInputValue] = useState(
    value?.formatted_address || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const pendingPlaceRef = useRef<LocationData | null>(value);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const geocoderRef = useRef<any>(null);

  // Initialize Google Maps API (singleton loader) and Autocomplete
  useEffect(() => {
    let hiddenMapDiv: HTMLDivElement | null = null;

    (async () => {
      try {
        const google = await getGoogleMaps();

        // Initialize Places Autocomplete on the input
        if (inputRef.current && !autocompleteRef.current) {
          autocompleteRef.current = new google.maps.places.Autocomplete(
            inputRef.current,
            {
              componentRestrictions: { country: "us" },
              types: ["(cities)", "geocode"], // Cities + addresses/ZIP
              fields: [
                "formatted_address",
                "place_id",
                "geometry",
                "address_components",
              ],
            }
          );

          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current.getPlace();
            if (!place || !place.place_id || !place.formatted_address) {
              return;
            }
            const { city, state, postal_code } = parseAddressComponents(
              place.address_components
            );
            const lat = place.geometry?.location?.lat() || 0;
            const lng = place.geometry?.location?.lng() || 0;
            const locationData: LocationData = {
              formatted_address: place.formatted_address,
              place_id: place.place_id,
              lat,
              lng,
              city,
              state,
              postal_code,
            };
            setInputValue(place.formatted_address);
            onChange(locationData);
          });
        }

        // Geocoder for fallback (enter/blur without selection)
        if (!geocoderRef.current) {
          geocoderRef.current = new google.maps.Geocoder();
        }

        // Initialize preview map
        hiddenMapDiv = document.createElement("div");
        hiddenMapDiv.style.display = "none";
        document.body.appendChild(hiddenMapDiv);

        const hiddenMap = new google.maps.Map(hiddenMapDiv);
        // hidden map only to satisfy API; not used directly
        // Initialize visible preview map
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
      } catch (err) {
        console.error("Error loading Google Maps API:", err);
      }
    })();

    return () => {
      if (hiddenMapDiv && document.body.contains(hiddenMapDiv)) {
        document.body.removeChild(hiddenMapDiv);
      }
      if (autocompleteRef.current && (window as any).google?.maps?.event) {
        (window as any).google.maps.event.clearInstanceListeners(
          autocompleteRef.current
        );
      }
    };
  }, [value, onChange]);

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

  // Handle input change (clear selection)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    onChange(null); // Clear selection when user types
  };

  // Fallback: on Enter or blur, if user typed something but did not select a suggestion, geocode it.
  const handleGeocodeFallback = async () => {
    const query = inputValue.trim();
    if (!query || !geocoderRef.current) return;
    try {
      setIsLoading(true);
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
            pendingPlaceRef.current = locationData;
          } else {
            console.warn("[LocationPicker] Geocode fallback failed", { query, status });
          }
        }
      );
    } catch (err) {
      setIsLoading(false);
      console.error("[LocationPicker] Geocode fallback error", err);
    }
  };

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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleGeocodeFallback();
            }
          }}
          onBlur={() => {
            // Use a timeout to allow click on dropdown; fallback if no selection
            setTimeout(() => {
              if (!pendingPlaceRef.current) {
                handleGeocodeFallback();
              }
              // reset pending flag after blur attempt
              pendingPlaceRef.current = null;
            }, 150);
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

