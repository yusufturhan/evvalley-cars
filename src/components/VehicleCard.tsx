"use client";

import { memo } from "react";
import { Car, MapPin, Zap, Battery, Bike, MessageCircle } from "lucide-react";
import FavoriteButton from "./FavoriteButton";
import Link from "next/link";
import { Vehicle } from "@/lib/database";

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard = memo(({ vehicle }: VehicleCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ev-car':
        return <Car className="h-4 w-4" />;
      case 'hybrid-car':
        return <Zap className="h-4 w-4" />;
      case 'e-bike':
        return <Bike className="h-4 w-4" />;
      case 'ev-scooter':
        return <Battery className="h-4 w-4" />;
      default:
        return <Car className="h-4 w-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'ev-car':
        return 'Electric Car';
      case 'hybrid-car':
        return 'Hybrid Car';
      case 'e-bike':
        return 'E-Bike';
      case 'ev-scooter':
        return 'E-Scooter';
      default:
        return 'Vehicle';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex">
      {/* Left Side - Image */}
      <div className="relative w-56 h-44 flex-shrink-0">
        <div className="w-full h-full bg-gray-200 flex items-center justify-center overflow-hidden">
          {vehicle.video_url ? (
            <video src={vehicle.video_url} playsInline controls className="w-full h-full object-cover" />
          ) : vehicle.images && vehicle.images.length > 0 ? (
            <img
              src={vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.model} electric vehicle for sale`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          ) : null}
          <div className={`text-gray-400 text-center ${(vehicle.video_url || (vehicle.images && vehicle.images.length > 0)) ? 'hidden' : 'flex flex-col items-center justify-center'}`}>
            <div className="text-4xl mb-2">🚗</div>
            <div className="text-sm">{vehicle.brand} {vehicle.model}</div>
          </div>
        </div>
        {/* SOLD Badge */}
        {vehicle.sold && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            SOLD
          </div>
        )}
        {/* Favorite Button */}
        <div className="absolute top-2 left-2">
          <FavoriteButton vehicleId={vehicle.id} />
        </div>
      </div>
      
      {/* Right Side - Details */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {vehicle.year} {vehicle.brand} {vehicle.model}
          </h3>
          
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="flex items-center text-gray-600">
              <span className="text-sm font-medium mr-2">Mileage:</span>
              <span className="text-sm">{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : 'N/A'}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{vehicle.location}</span>
            </div>
          </div>
          
          {/* Price */}
          <div className="mb-3">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(vehicle.price)}
            </span>
            {vehicle.old_price && vehicle.old_price > 0 && vehicle.old_price > vehicle.price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(vehicle.old_price)}
              </span>
            )}
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex items-center space-x-2">
          <Link 
            href={`/vehicles/${vehicle.id}#contact`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            title="Contact Seller"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat</span>
          </Link>
          <Link 
            href={`/vehicles/${vehicle.id}`}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
});

VehicleCard.displayName = 'VehicleCard';

export default VehicleCard;
