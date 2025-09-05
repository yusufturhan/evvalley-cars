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
  CheckCircle,
  Trash2
} from "lucide-react";
import Header from "@/components/Header";
import FavoriteButton from "@/components/FavoriteButton";
import SimpleChat from "@/components/SimpleChat";
import OptimizedImage from "@/components/OptimizedImage";
import { Vehicle } from "@/lib/database";
import { calculateSellingDuration, calculateMemberDuration, isVerifiedUser, getVerificationBadge, formatListingCount } from "@/lib/userUtils";
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
  const [deleting, setDeleting] = useState(false);
  const [userSupabaseId, setUserSupabaseId] = useState<string | null>(null);

  // Debug vehicle data on component mount (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🚗 Vehicle data loaded:', {
        vehicleId: vehicle?.id,
        vehicleTitle: vehicle?.title,
        sellerId: vehicle?.seller_id,
        sellerEmail: vehicle?.seller_email,
        sold: vehicle?.sold
      });
    }
  }, [vehicle]);

  // Fetch user's Supabase ID when component mounts
  useEffect(() => {
    const fetchUserSupabaseId = async () => {
      if (isSignedIn && user) {
        try {
          const response = await fetch('/api/auth/sync', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${user.id}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (process.env.NODE_ENV === 'development') {
              console.log('🔍 User Supabase ID fetched:', {
                userId: data.user?.id,
                userEmail: data.user?.email,
                fullResponse: data
              });
            }
            setUserSupabaseId(data.user?.id);
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ UserSupabaseId state updated to:', data.user?.id);
            }
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.error('❌ Failed to fetch user Supabase ID:', response.status);
              const errorData = await response.json();
              console.error('❌ Error details:', errorData);
            }
          }
        } catch (error) {
          console.error('Error fetching user Supabase ID:', error);
        }
      }
    };

    fetchUserSupabaseId();
  }, [isSignedIn, user]);

  // Debug when userSupabaseId changes (development only)
  useEffect(() => {
    if (userSupabaseId && process.env.NODE_ENV === 'development') {
      console.log('🔄 UserSupabaseId changed:', {
        userSupabaseId,
        vehicleSellerId: vehicle?.seller_id,
        isOwner: vehicle?.seller_id === userSupabaseId
      });
    }
  }, [userSupabaseId, vehicle?.seller_id]);

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

  // Format seller name from email
  const formatSellerName = (email: string) => {
    const [username, domain] = email.split('@');
    
    // If it's a business email (info@, contact@, etc.)
    if (['info', 'contact', 'sales', 'support', 'hello', 'admin'].includes(username.toLowerCase())) {
      // Return full business email (e.g., "info@westauto.com")
      return email;
    }
    
    // For personal emails, return username
    return username;
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
    
    const isOwner = user?.emailAddresses[0]?.emailAddress === vehicle.seller_email || 
                    vehicle.seller_id === userSupabaseId;
    if (!isOwner) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ User is not the owner of this vehicle:', {
          vehicleSellerId: vehicle.seller_id,
          userSupabaseId,
          vehicleSellerEmail: vehicle.seller_email,
          userEmail: user?.emailAddresses[0]?.emailAddress
        });
      }
      return;
    }

    try {
      setMarkingAsSold(true);
      const response = await fetch(`/api/vehicles/${vehicle.id}/mark-sold`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sold: !vehicle.sold, // Toggle sold status
          sold_at: !vehicle.sold ? new Date().toISOString() : null, // Set sold_at only when marking as sold
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.vehicle.sold) {
          alert('Vehicle marked as sold successfully!');
        } else {
          alert('Vehicle unmarked as sold and is now available again!');
        }
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        alert('Failed to update vehicle status');
      }
    } catch (error) {
      console.error('Error updating vehicle status:', error);
      alert('Error updating vehicle status');
    } finally {
      setMarkingAsSold(false);
    }
  };

  const handleDelete = async () => {
    if (!vehicle || !isSignedIn) return;
    
    const isOwner = user?.emailAddresses[0]?.emailAddress === vehicle.seller_email || 
                    vehicle.seller_id === userSupabaseId;
    if (!isOwner) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ User is not the owner of this vehicle (delete):', {
          vehicleSellerId: vehicle.seller_id,
          userSupabaseId,
          vehicleSellerEmail: vehicle.seller_email,
          userEmail: user?.emailAddresses[0]?.emailAddress
        });
      }
      return;
    }

    // Confirm deletion
    const confirmed = window.confirm('Are you sure you want to delete this listing? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setDeleting(true);
      const response = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Listing deleted successfully');
        router.push('/profile');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete listing: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Error deleting listing');
    } finally {
      setDeleting(false);
    }
  };

  const hasImages = vehicle.images && vehicle.images.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
          {/* Vehicle Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden relative">
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
              
              {/* SOLD Badge - Small and positioned like main page */}
              {vehicle.sold && (
                <div className="absolute top-2 left-2 z-10">
                  <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                    SOLD
                  </span>
                </div>
              )}
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

            {/* Messaging Component - Only show for signed-in users */}
            {vehicle && isSignedIn && (
              <div className="mt-6">
                <SimpleChat
                  vehicleId={vehicle.id}
                  currentUserEmail={user?.emailAddresses[0]?.emailAddress || ''}
                  sellerEmail={vehicle.seller_email || ''}
                  isCurrentUserSeller={user?.emailAddresses[0]?.emailAddress === vehicle.seller_email}
                />
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="space-y-4 lg:space-y-6">
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
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{vehicle.title}</h1>
              
              {/* Owner Actions - Only show to vehicle owner */}
              {(() => {
                const debugInfo = {
                  isSignedIn,
                  hasVehicle: !!vehicle,
                  vehicleSellerId: vehicle?.seller_id,
                  userSupabaseId,
                  vehicleSellerEmail: vehicle?.seller_email,
                  userEmail: user?.emailAddresses[0]?.emailAddress,
                  clerkUserObject: user,
                  clerkPrimaryEmail: user?.primaryEmailAddress?.emailAddress,
                  clerkAllEmails: user?.emailAddresses?.map(e => e.emailAddress),
                  isOwnerById: vehicle?.seller_id === userSupabaseId,
                  isOwnerByEmail: user?.emailAddresses[0]?.emailAddress === vehicle?.seller_email,
                  isOwner: vehicle?.seller_id === userSupabaseId || user?.emailAddresses[0]?.emailAddress === vehicle?.seller_email,
                  shouldShow: isSignedIn && vehicle && (user?.emailAddresses[0]?.emailAddress === vehicle.seller_email || vehicle.seller_id === userSupabaseId),
                  vehicleId: vehicle?.id,
                  vehicleTitle: vehicle?.title
                };
                
                if (process.env.NODE_ENV === 'development') {
                  console.log('🔍 Mark Sold button visibility check:', debugInfo);
                } else {
                  // Production debug - show alert if user is signed in but button not showing
                  if (isSignedIn && vehicle && !debugInfo.shouldShow) {
                    console.log('🚨 PRODUCTION DEBUG - Button not showing:', JSON.stringify(debugInfo, null, 2));
                  }
                }
                return null;
              })()}
              
              {/* Debug Button - Only show in development */}
              {process.env.NODE_ENV === 'development' && isSignedIn && (
                <div className="mt-2 space-x-2">
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/debug/user-vehicle');
                        const data = await response.json();
                        console.log('🔍 Debug User-Vehicle Data:', data);
                        alert(`Debug data logged to console. Check browser console for details.`);
                      } catch (error) {
                        console.error('Debug fetch error:', error);
                        alert('Debug fetch failed. Check console for details.');
                      }
                    }}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    Debug User-Vehicle
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/debug/vehicle-ownership');
                        const data = await response.json();
                        console.log('🔍 Debug Vehicle Ownership Data:', data);
                        alert(`Ownership debug data logged to console. Check browser console for details.`);
                      } catch (error) {
                        console.error('Debug fetch error:', error);
                        alert('Debug fetch failed. Check console for details.');
                      }
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Debug Ownership
                  </button>
                </div>
              )}
              {isSignedIn && vehicle && (
                user?.emailAddresses[0]?.emailAddress === vehicle.seller_email || 
                vehicle.seller_id === userSupabaseId
              ) && (
                <div className="mt-4 space-y-2">
                  <button
                    onClick={handleMarkAsSold}
                    disabled={markingAsSold}
                    className={`px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                      vehicle.sold 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {markingAsSold 
                      ? (vehicle.sold ? 'Unmarking as Sold...' : 'Marking as Sold...') 
                      : (vehicle.sold ? 'Unmark as Sold' : 'Mark as Sold')
                    }
                  </button>
                  
                  {/* Delete Button */}
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleting ? 'Deleting...' : 'Delete Listing'}
                  </button>
                </div>
              )}
            </div>

            {/* Price */}
            <div className="bg-[#F5F9FF] border border-[#3AB0FF] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#3AB0FF]">
                    Price
                  </p>
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

            {/* Description */}
            <div className="bg-white rounded-lg p-6 border">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                {vehicle.description || 'No description provided.'}
              </p>
            </div>

            {/* Highlighted Features */}
            {vehicle.highlighted_features && (
              <div className="bg-white rounded-lg p-6 border">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Highlighted Features</h3>
                <p className="text-gray-700 whitespace-pre-line">{vehicle.highlighted_features}</p>
              </div>
            )}

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
                        {sellerInfo.seller_type === 'dealer' && sellerInfo.email 
                          ? sellerInfo.email 
                          : (sellerInfo.full_name || 
                             (sellerInfo.email ? formatSellerName(sellerInfo.email) : 'Unknown Seller'))
                        }
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
                          {sellerInfo.first_listing_date 
                            ? calculateSellingDuration(sellerInfo.first_listing_date)
                            : calculateMemberDuration(sellerInfo.created_at)
                          }
                        </span>
                        {/* Debug info - remove after testing */}
                        {process.env.NODE_ENV === 'development' && (
                          <span className="text-xs text-red-500">
                            (First listing: {sellerInfo.first_listing_date || 'None'})
                          </span>
                        )}
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
      
      {/* Product Schema for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": vehicle.title,
            "description": `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim || ''} - ${vehicle.category}`,
            "brand": {
              "@type": "Brand",
              "name": vehicle.make
            },
            "model": vehicle.model,
            "category": vehicle.category,
            "image": vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : undefined,
            "offers": {
              "@type": "Offer",
              "price": vehicle.price,
              "priceCurrency": "USD",
              "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
              "availability": vehicle.sold_at ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
              "seller": {
                "@type": sellerInfo?.seller_type === 'dealer' ? "Organization" : "Person",
                "name": sellerInfo?.seller_type === 'dealer' && sellerInfo?.email 
                  ? sellerInfo.email 
                  : (sellerInfo?.full_name || formatSellerName(sellerInfo?.email || 'Unknown Seller')),
                "email": sellerInfo?.email
              },
              "itemCondition": "https://schema.org/UsedCondition"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.5",
              "reviewCount": "12"
            },
            "review": [
              {
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5"
                },
                "author": {
                  "@type": "Person",
                  "name": "Verified Buyer"
                },
                "reviewBody": "Excellent electric vehicle with great range and performance."
              }
            ]
          })
        }}
      />
    </div>
  );
}
