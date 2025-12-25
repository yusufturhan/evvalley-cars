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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
          {vehicle.video_url ? (
            <video src={vehicle.video_url} playsInline controls className="w-full h-full object-contain bg-black" />
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
          <div className={`text-gray-400 text-center ${(vehicle.video_url || (vehicle.images && vehicle.images.length > 0)) ? 'hidden' : 'flex'}`}>
            <div className="text-4xl mb-2">🚗</div>
            <div className="text-sm">{vehicle.brand} {vehicle.model}</div>
          </div>
        </div>
        {/* SOLD Badge - Small and positioned */}
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
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getCategoryIcon(vehicle.category)}
            <span className="text-sm text-gray-600">{getCategoryName(vehicle.category)}</span>
          </div>
          <div className="text-sm text-gray-500">
            {vehicle.year}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {vehicle.brand} {vehicle.model}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{vehicle.location}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-green-600">
            {formatPrice(vehicle.price)}
            {vehicle.old_price && vehicle.old_price > 0 && vehicle.old_price > vehicle.price && (
              <span className="text-sm text-gray-500 line-through ml-2">
                {formatPrice(vehicle.old_price)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Chat Button - Direct to messaging */}
            <Link 
              href={`/vehicles/${vehicle.id}#contact`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
              title="Contact Seller"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Chat</span>
            </Link>
            {/* View Details Button */}
            <Link 
              href={`/vehicles/${vehicle.id}`}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

VehicleCard.displayName = 'VehicleCard';

export default VehicleCard;
