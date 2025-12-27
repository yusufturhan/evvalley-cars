/**
 * Generate Vehicle JSON-LD structured data
 * @param vehicle - Vehicle data from database
 * @param canonicalUrl - Canonical URL for the vehicle page
 * @returns JSON-LD object or null if vehicle is invalid
 */
export function generateVehicleJsonLd(vehicle: any, canonicalUrl: string): any | null {
  if (!vehicle) return null;

  const jsonLd: any = {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    "url": canonicalUrl,
  };

  // Name (required by Google) — build from year/make/model with safe fallbacks
  const nameParts = [
    vehicle.year ? vehicle.year.toString() : null,
    vehicle.brand || null,
    vehicle.model || null,
  ].filter(Boolean);
  const name = nameParts.length > 0
    ? nameParts.join(' ')
    : vehicle.title || 'Vehicle for Sale';
  jsonLd.name = name;

  // Brand (make)
  if (vehicle.brand) {
    jsonLd.brand = vehicle.brand;
  }

  // Model
  if (vehicle.model) {
    jsonLd.model = vehicle.model;
  }

  // Vehicle model date (year)
  if (vehicle.year) {
    jsonLd.vehicleModelDate = vehicle.year.toString();
  }

  // VIN
  if (vehicle.vin) {
    jsonLd.vehicleIdentificationNumber = vehicle.vin;
  }

  // Mileage
  if (vehicle.mileage) {
    jsonLd.mileageFromOdometer = {
      "@type": "QuantitativeValue",
      "value": vehicle.mileage,
      "unitCode": "SMI"
    };
  }

  // Images
  if (vehicle.images && vehicle.images.length > 0) {
    jsonLd.image = vehicle.images;
  }

  // Offers
  if (vehicle.price) {
    jsonLd.offers = {
      "@type": "Offer",
      "price": vehicle.price,
      "priceCurrency": "USD",
      "availability": vehicle.sold_at ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      "itemCondition": "https://schema.org/UsedCondition",
      "url": canonicalUrl
    };
  }

  return jsonLd;
}

