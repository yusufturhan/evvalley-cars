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
import { Vehicle } from "@/lib/database";
import { calculateMembershipDuration, isVerifiedUser, getVerificationBadge, formatListingCount } from "@/lib/userUtils";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showMessaging, setShowMessaging] = useState(false);
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [markingAsSold, setMarkingAsSold] = useState(false);
  const [userSupabaseId, setUserSupabaseId] = useState<string | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchVehicleDetails();
    }
  }, [params.id]);

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

  const fetchVehicleDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/vehicles/${params.id}`);
      const data = await response.json();
      
      if (response.ok) {
        setVehicle(data.vehicle);
        
        // Fetch seller information
        if (data.vehicle.seller_id) {
          try {
            const sellerResponse = await fetch(`/api/users/${data.vehicle.seller_id}`);
            const sellerData = await sellerResponse.json();
            console.log('Seller API Response:', sellerData); // Debug için
            if (sellerResponse.ok) {
              console.log('Seller Info:', sellerData.user); // Debug için
              setSellerInfo(sellerData.user);
            }
          } catch (error) {
            console.error('Error fetching seller info:', error);
          }
        }
      } else {
        setError(data.error || 'Vehicle not found');
      }
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      setError('Failed to load vehicle details');
    } finally {
      setLoading(false);
    }
  };

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
        // Refresh vehicle data
        await fetchVehicleDetails();
        alert('Vehicle marked as sold successfully! The listing will remain visible with a "SOLD" badge.');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
                      <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-[500px] lg:h-[600px] bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="text-6xl mb-4">🚗</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Not Found</h1>
            <p className="text-gray-600 mb-8">{error || 'The vehicle you are looking for does not exist.'}</p>
            <button 
              onClick={() => router.push('/vehicles')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Back to Vehicles
            </button>
          </div>
        </div>
      </div>
    );
  }

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
                ) : (
                  <div className="text-center">
                    <div className="text-8xl mb-4">🚗</div>
                    <div className="text-gray-600">{vehicle.brand} {vehicle.model}</div>
                  </div>
                )}
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
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="hidden items-center justify-center h-full">
                      <ImageIcon className="h-6 w-6 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Contact Actions - Moved here from right panel */}
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

            {/* Messaging Component - Moved here from bottom */}
            {showMessaging && isSignedIn && vehicle && !vehicle.sold && (
              <div className="mt-6">
                <SimpleChat
                  vehicleId={vehicle.id}
                  currentUserEmail={user?.emailAddresses[0]?.emailAddress || 'anonymous@evvalley.com'}
                  sellerEmail={vehicle.seller_email || 'evvalley12@gmail.com'} // Use actual seller email
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
                  <span className="text-sm text-gray-800 font-medium">Year</span>
                </div>
                <p className="text-lg font-bold text-gray-900">{vehicle.year}</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center mb-2">
                  <Gauge className="h-5 w-5 text-gray-600 mr-2" />
                  <span className="text-sm text-gray-800 font-medium">Mileage</span>
                </div>
                <p className="text-lg font-bold text-gray-900">
                  {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'New'}
                </p>
              </div>

              {vehicle.range_miles && (
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center mb-2">
                    <Battery className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-800 font-medium">Range</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{vehicle.range_miles} miles</p>
                </div>
              )}

              {vehicle.max_speed && (
                <div className="bg-white rounded-lg p-4 border">
                  <div className="flex items-center mb-2">
                    <Zap className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-800 font-medium">Max Speed</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{vehicle.max_speed} mph</p>
                </div>
              )}
            </div>

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
                {vehicle.battery_capacity && (
                  <div>
                    <span className="text-gray-800 font-medium">Battery:</span>
                    <p className="font-semibold text-gray-900">{vehicle.battery_capacity}</p>
                  </div>
                )}
                {vehicle.interior_color && (
                  <div>
                    <span className="text-gray-800 font-medium">Interior Color:</span>
                    <p className="font-semibold text-gray-900">{vehicle.interior_color}</p>
                  </div>
                )}
                {vehicle.exterior_color && (
                  <div>
                    <span className="text-gray-800 font-medium">Exterior Color:</span>
                    <p className="font-semibold text-gray-900">{vehicle.exterior_color}</p>
                  </div>
                )}
                {vehicle.body_seating && (
                  <div>
                    <span className="text-gray-800 font-medium">Body/Seating:</span>
                    <p className="font-semibold text-gray-900">{vehicle.body_seating}</p>
                  </div>
                )}
                {vehicle.transmission && (
                  <div>
                    <span className="text-gray-800 font-medium">Transmission:</span>
                    <p className="font-semibold text-gray-900 capitalize">{vehicle.transmission}</p>
                  </div>
                )}
                {vehicle.combined_fuel_economy && (
                  <div>
                    <span className="text-gray-800 font-medium">Fuel Economy:</span>
                    <p className="font-semibold text-gray-900">{vehicle.combined_fuel_economy}</p>
                  </div>
                )}
                {vehicle.horsepower && (
                  <div>
                    <span className="text-gray-800 font-medium">Horsepower:</span>
                    <p className="font-semibold text-gray-900">{vehicle.horsepower} hp</p>
                  </div>
                )}
                {vehicle.electric_mile_range && (
                  <div>
                    <span className="text-gray-800 font-medium">Electric Range:</span>
                    <p className="font-semibold text-gray-900">{vehicle.electric_mile_range} miles</p>
                  </div>
                )}
                {vehicle.battery_warranty && (
                  <div>
                    <span className="text-gray-800 font-medium">Battery Warranty:</span>
                    <p className="font-semibold text-gray-900">{vehicle.battery_warranty}</p>
                  </div>
                )}
                {vehicle.drivetrain && (
                  <div>
                    <span className="text-gray-800 font-medium">Drivetrain:</span>
                    <p className="font-semibold text-gray-900 capitalize">{vehicle.drivetrain}</p>
                  </div>
                )}
                {vehicle.vin && (
                  <div>
                    <span className="text-gray-800 font-medium">VIN:</span>
                    <p className="font-semibold text-gray-900 font-mono text-xs">{vehicle.vin}</p>
                  </div>
                )}
                {vehicle.location && (
                  <div className="col-span-2">
                    <span className="text-gray-800 font-medium">Location:</span>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 text-gray-600 mr-1" />
                      <p className="font-semibold text-gray-900">{vehicle.location}</p>
                    </div>
                  </div>
                )}
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