"use client";

import { 
  Car, 
  Zap, 
  Battery, 
  Bike, 
  MapPin, 
  Calendar, 
  Gauge, 
  DollarSign, 
  MessageCircle,
  Phone,
  Mail,
  ArrowLeft,
  Heart,
  Image as ImageIcon,
  User,
  Clock,
  CheckCircle
} from "lucide-react";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import SimpleChat from "@/components/SimpleChat";
import OptimizedImage from "@/components/OptimizedImage";
import { Vehicle } from "@/lib/database";
import { calculateMembershipDuration, isVerifiedUser, getVerificationBadge, formatListingCount } from "@/lib/userUtils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface VehicleDetailClientProps {
  vehicle: Vehicle;
}

export default function VehicleDetailClient({ vehicle }: VehicleDetailClientProps) {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showMessaging, setShowMessaging] = useState(false);
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [markingAsSold, setMarkingAsSold] = useState(false);
  const [userSupabaseId, setUserSupabaseId] = useState<string | null>(null);

  // Fetch user's Supabase ID when component mounts
  useEffect(() => {
    const fetchUserSupabaseId = async () => {
      if (isSignedIn && user) {
        try {
          const response = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.emailAddresses[0]?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setUserSupabaseId(data.supabaseId);
          }
        } catch (error) {
          console.error('Error fetching user Supabase ID:', error);
        }
      }
    };

    fetchUserSupabaseId();
  }, [isSignedIn, user]);

  // Fetch seller information
  useEffect(() => {
    const fetchSellerInfo = async () => {
      if (vehicle.seller_id) {
        try {
          const sellerResponse = await fetch(`/api/users/${vehicle.seller_id}`);
          const sellerData = await sellerResponse.json();
          if (sellerResponse.ok) {
            setSellerInfo(sellerData.user);
          }
        } catch (error) {
          console.error('Error fetching seller info:', error);
        }
      }
    };

    fetchSellerInfo();
  }, [vehicle.seller_id]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ev-car':
        return <Car className="h-6 w-6" />;
      case 'hybrid-car':
        return <Zap className="h-6 w-6" />;
      case 'ev-scooter':
        return <Battery className="h-6 w-6" />;
      case 'e-bike':
        return <Bike className="h-6 w-6" />;
      default:
        return <Car className="h-6 w-6" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ev-car':
        return 'bg-blue-100 text-blue-800';
      case 'hybrid-car':
        return 'bg-green-100 text-green-800';
      case 'ev-scooter':
        return 'bg-purple-100 text-purple-800';
      case 'e-bike':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkAsSold = async () => {
    if (!vehicle || !isSignedIn) return;
    
    const isOwner = vehicle.seller_id === userSupabaseId;
    if (!isOwner) return;

    try {
      setMarkingAsSold(true);
      const response = await fetch(`/api/vehicles/${vehicle.id}/mark-sold`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sold: true,
          sold_at: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert('Failed to mark vehicle as sold');
      }
    } catch (error) {
      console.error('Error marking vehicle as sold:', error);
      alert('Error marking vehicle as sold');
    } finally {
      setMarkingAsSold(false);
    }
  };

  const hasImages = vehicle.images && vehicle.images.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-[500px] lg:h-[600px] bg-gray-200 flex items-center justify-center">
                {hasImages && vehicle.images && vehicle.images[selectedImageIndex] ? (
                  <img
                    src={vehicle.images[selectedImageIndex]}
                    alt={vehicle.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                                  ) : null}
                  {hasImages && vehicle.images && (
                    <div className="hidden text-center">
                      <div className="text-8xl mb-4">🚗</div>
                      <div className="text-gray-600">{vehicle.brand} {vehicle.model}</div>
                    </div>
                  )}
              </div>
            </div>

            {/* Image Thumbnails */}
            {hasImages && vehicle.images && vehicle.images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`h-24 bg-gray-200 rounded-lg border-2 overflow-hidden hover:border-[#3AB0FF] transition-colors ${
                      selectedImageIndex === index ? 'border-[#3AB0FF]' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${vehicle.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Contact Actions */}
            {!vehicle?.sold && (
              <div className="space-y-3 mt-6">
                {isSignedIn ? (
                  <button 
                    onClick={() => setShowMessaging(!showMessaging)}
                    className="w-full bg-[#1C1F4A] text-white py-3 rounded-lg hover:bg-[#2A2F6B] flex items-center justify-center transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {showMessaging ? 'Hide Chat' : 'Contact Seller'}
                  </button>
                ) : (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-2">Sign in to contact the seller</p>
                    <button className="bg-[#1C1F4A] text-white px-4 py-2 rounded-lg hover:bg-[#2A2F6B] transition-colors">
                      Sign In
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Messaging Component */}
            {vehicle && (
              <div className="mt-6">
                <SimpleChat
                  vehicleId={vehicle.id}
                  currentUserEmail={user?.emailAddresses[0]?.emailAddress || 'test@evvalley.com'}
                  sellerEmail={vehicle.seller_email || 'evvalley12@gmail.com'}
                  isCurrentUserSeller={user?.emailAddresses[0]?.emailAddress === (vehicle.seller_email || 'evvalley12@gmail.com')}
                />
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(vehicle.category)}`}>
                    {vehicle.category.replace('-', ' ').toUpperCase()}
                  </span>
                  {vehicle.sold && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      SOLD
                    </span>
                  )}
                </div>
                <FavoriteButton vehicleId={vehicle.id} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.title}</h1>
              <p className="text-gray-600">{vehicle.description}</p>
              
              {/* Mark as Sold Button - Only show to vehicle owner */}
              {isSignedIn && vehicle && !vehicle.sold && vehicle.seller_id === userSupabaseId && (
                <div className="mt-4">
                  <button
                    onClick={handleMarkAsSold}
                    disabled={markingAsSold}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {markingAsSold ? 'Marking as Sold...' : 'Mark as Sold'}
                  </button>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="bg-[#F5F9FF] border border-[#3AB0FF] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#3AB0FF] font-medium">Price</p>
                  <p className="text-3xl font-bold text-[#3AB0FF]">${vehicle.price.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-[#3AB0FF]" />
              </div>
            </div>

            {/* Key Specs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-900 font-bold">Year</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{vehicle.year}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center mb-2">
                  <Gauge className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-900 font-bold">Mileage</span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'New'}
                </p>
              </div>

              {vehicle.range_miles && (
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center mb-2">
                    <Battery className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-900 font-bold">Range</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{vehicle.range_miles} miles</p>
                </div>
              )}

              {vehicle.max_speed && (
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center mb-2">
                    <Zap className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-900 font-bold">Max Speed</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{vehicle.max_speed} mph</p>
                </div>
              )}
            </div>

            {/* Highlighted Features */}
            {vehicle.highlighted_features && (
              <div className="bg-white rounded-lg p-6 border mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Highlighted Features</h3>
                <p className="text-gray-700 whitespace-pre-line">{vehicle.highlighted_features}</p>
              </div>
            )}

            {/* Additional Details */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Vehicle Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-800 font-medium">Brand:</span>
                  <p className="font-semibold text-gray-900">{vehicle.brand}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Model:</span>
                  <p className="font-semibold text-gray-900">{vehicle.model}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Fuel Type:</span>
                  <p className="font-semibold text-gray-900 capitalize">{vehicle.fuel_type}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Condition:</span>
                  <p className="font-semibold text-gray-900 capitalize">{vehicle.vehicle_condition || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Title Status:</span>
                  <p className="font-semibold text-gray-900 capitalize">{vehicle.title_status || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Battery:</span>
                  <p className="font-semibold text-gray-900">{vehicle.battery_capacity || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Interior Color:</span>
                  <p className="font-semibold text-gray-900">{vehicle.interior_color || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Exterior Color:</span>
                  <p className="font-semibold text-gray-900">{vehicle.exterior_color || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Body/Seating:</span>
                  <p className="font-semibold text-gray-900">{vehicle.body_seating || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Transmission:</span>
                  <p className="font-semibold text-gray-900 capitalize">{vehicle.transmission || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Fuel Economy:</span>
                  <p className="font-semibold text-gray-900">{vehicle.combined_fuel_economy || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Horsepower:</span>
                  <p className="font-semibold text-gray-900">{vehicle.horsepower ? `${vehicle.horsepower} hp` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Electric Range:</span>
                  <p className="font-semibold text-gray-900">{vehicle.electric_mile_range ? `${vehicle.electric_mile_range} miles` : 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Battery Warranty:</span>
                  <p className="font-semibold text-gray-900">{vehicle.battery_warranty || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">Drivetrain:</span>
                  <p className="font-semibold text-gray-900 capitalize">{vehicle.drivetrain || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-800 font-medium">VIN:</span>
                  <p className="font-semibold text-gray-900 font-mono text-xs">{vehicle.vin || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-800 font-medium">Location:</span>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 text-gray-600 mr-1" />
                    <p className="font-semibold text-gray-900">{vehicle.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            {sellerInfo && (
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-bold mb-4 flex items-center text-gray-900">
                  <User className="h-5 w-5 mr-2 text-gray-700" />
                  Seller Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        {sellerInfo.seller_type === 'dealer' && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                            Dealer
                          </span>
                        )}
                        {sellerInfo.seller_type === 'private' && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Private Seller
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-gray-900">
                        {sellerInfo.full_name || 
                         (sellerInfo.email ? sellerInfo.email.split('@')[0] : 'Unknown Seller')}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {isVerifiedUser(sellerInfo.email) && (
                          <span className="text-xs bg-[#F5F9FF] text-[#3AB0FF] px-2 py-1 rounded-full flex items-center font-medium">
                            <CheckCircle className="h-4 w-4 mr-1.5 text-[#3AB0FF]" />
                            {getVerificationBadge()}
                          </span>
                        )}
                        <span className="text-xs text-gray-700 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {calculateMembershipDuration(sellerInfo.created_at)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-800 font-medium">Total Listings</p>
                      <p className="font-bold text-gray-900">{formatListingCount(sellerInfo.vehicle_count || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
