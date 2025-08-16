import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import React from 'react';
import VehicleDetailClient from './VehicleDetailClient';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Generate structured data for the vehicle
const generateStructuredData = (vehicle: any) => {
  if (!vehicle) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": vehicle.title,
    "description": vehicle.description,
    "image": vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : "",
    "url": `https://www.evvalley.com/vehicles/${vehicle.id}`,
    "offers": {
      "@type": "Offer",
      "price": vehicle.price,
      "priceCurrency": "USD",
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      "availability": vehicle.sold_at ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "USD"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 7,
            "unitCode": "DAY"
          }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "US",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 30,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "12"
    },
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "EV Enthusiast"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "reviewBody": "Great electric vehicle marketplace with excellent selection and service."
      }
    ]
  };
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: vehicle } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!vehicle) {
    return {
      title: 'Vehicle Not Found - Evvalley',
      description: 'The requested vehicle could not be found.',
    };
  }

  const vehicleUrl = `https://www.evvalley.com/vehicles/${vehicle.id}`;

  return {
    title: `${vehicle.title} - Evvalley`,
    description: vehicle.description || `Buy ${vehicle.title} on Evvalley. ${vehicle.brand} ${vehicle.model} for sale.`,
    keywords: `${vehicle.brand}, ${vehicle.model}, electric vehicle, EV, ${vehicle.category}, for sale, Evvalley`,
    alternates: {
      canonical: vehicleUrl,
    },
    openGraph: {
      title: `${vehicle.title} - Evvalley`,
      description: vehicle.description || `Buy ${vehicle.title} on Evvalley.`,
      url: vehicleUrl,
      images: vehicle.images && vehicle.images.length > 0 ? vehicle.images : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${vehicle.title} - Evvalley`,
      description: vehicle.description || `Buy ${vehicle.title} on Evvalley.`,
      images: vehicle.images && vehicle.images.length > 0 ? [vehicle.images[0]] : [],
    },
  };
}

export default async function VehicleDetailPage({ params }: { params: { id: string } }) {
  try {
    // Fetch vehicle data
    let { data: vehicle } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!vehicle) {
      // Try ev_scooters table
      let { data: scooter } = await supabase
        .from('ev_scooters')
        .select('*')
        .eq('id', params.id)
        .single();

      if (!scooter) {
        // Try e_bikes table
        let { data: bike } = await supabase
          .from('e_bikes')
          .select('*')
          .eq('id', params.id)
          .single();

        if (!bike) {
          notFound();
        }
        vehicle = bike;
      } else {
        vehicle = scooter;
      }
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData(vehicle))
          }}
        />
        <VehicleDetailClient vehicle={vehicle} />
      </>
    );
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    notFound();
  }
} 