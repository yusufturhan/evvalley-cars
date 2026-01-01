/**
 * Google Maps helper functions
 */

export interface LocationData {
  formatted_address: string;
  place_id: string;
  lat: number;
  lng: number;
  city: string;
  state: string;
  postal_code: string;
}

/**
 * Parse Google Places address_components to extract city, state, and postal_code
 */
export function parseAddressComponents(
  addressComponents: google.maps.places.PlaceResult['address_components']
): { city: string; state: string; postal_code: string } {
  let city = '';
  let state = '';
  let postal_code = '';

  if (!addressComponents) {
    return { city, state, postal_code };
  }

  for (const component of addressComponents) {
    const types = component.types;

    // Extract city (locality or administrative_area_level_2)
    if (types.includes('locality')) {
      city = component.long_name;
    } else if (!city && types.includes('administrative_area_level_2')) {
      city = component.long_name;
    }

    // Extract state (administrative_area_level_1)
    if (types.includes('administrative_area_level_1')) {
      state = component.short_name; // Use short_name for state code (e.g., "CA")
    }

    // Extract postal code
    if (types.includes('postal_code')) {
      postal_code = component.long_name;
    }
  }

  return { city, state, postal_code };
}

/**
 * Resolve a Google Places place_id to LocationData
 */
export async function resolvePlaceDetails(
  placeId: string,
  placesService: google.maps.places.PlacesService
): Promise<LocationData | null> {
  return new Promise((resolve, reject) => {
    placesService.getDetails(
      {
        placeId,
        fields: ['formatted_address', 'geometry', 'address_components'],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          const { city, state, postal_code } = parseAddressComponents(
            place.address_components
          );

          const locationData: LocationData = {
            formatted_address: place.formatted_address || '',
            place_id: placeId,
            lat: place.geometry?.location?.lat() || 0,
            lng: place.geometry?.location?.lng() || 0,
            city,
            state,
            postal_code,
          };

          resolve(locationData);
        } else {
          reject(new Error(`PlacesServiceStatus: ${status}`));
        }
      }
    );
  });
}

