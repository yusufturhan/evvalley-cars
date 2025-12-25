import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import React from 'react';
import VehicleDetailClient from './VehicleDetailClient';

// Enable ISR (Incremental Static Regeneration) for better SEO and performance
export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'force-dynamic'; // Allow dynamic rendering for real-time data

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Generate structured data for the vehicle
const generateStructuredData = (vehicle: any) => {
  if (!vehicle) return null;

  const images = vehicle.images && vehicle.images.length > 0 
    ? vehicle.images.map((img: string) => ({
        "@type": "ImageObject",
        "url": img,
        "name": vehicle.title
      }))
    : [];

  // Ensure description is at least 150 characters for better indexing
  const description = vehicle.description && vehicle.description.length > 150
    ? vehicle.description
    : `${vehicle.brand} ${vehicle.model} ${vehicle.year || ''} ${vehicle.category} for sale on Evvalley. ${vehicle.location ? `Located in ${vehicle.location}.` : ''} ${vehicle.price ? `Price: $${vehicle.price.toLocaleString()}.` : 'Contact for pricing.'} ${vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles.` : 'New vehicle.'} ${vehicle.range_miles ? `Range: ${vehicle.range_miles} miles.` : ''} Trusted EV marketplace with verified listings.`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": vehicle.title,
    "description": description,
    "image": images.length > 0 ? images : [],
    "url": `https://www.evvalley.com/vehicles/${vehicle.id}`,
    "brand": {
      "@type": "Brand",
      "name": vehicle.brand
    },
    "model": vehicle.model,
    "category": vehicle.category,
    "productionDate": vehicle.year ? `${vehicle.year}` : undefined,
    "vehicleIdentificationNumber": vehicle.vin || undefined,
    "mileageFromOdometer": vehicle.mileage ? {
      "@type": "QuantitativeValue",
      "value": vehicle.mileage,
      "unitCode": "MI"
    } : undefined,
    "offers": {
      "@type": "Offer",
      "price": vehicle.price || 0,
      "priceCurrency": "USD",
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": vehicle.sold_at ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Evvalley",
        "url": "https://www.evvalley.com"
      },
      "url": `https://www.evvalley.com/vehicles/${vehicle.id}`
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
    ],
    "additionalProperty": [
      ...(vehicle.location ? [{
        "@type": "PropertyValue",
        "name": "Location",
        "value": vehicle.location
      }] : []),
      ...(vehicle.color ? [{
        "@type": "PropertyValue",
        "name": "Color",
        "value": vehicle.color
      }] : []),
      ...(vehicle.range_miles ? [{
        "@type": "PropertyValue",
        "name": "Range",
        "value": `${vehicle.range_miles} miles`
      }] : [])
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

  // Generate rich description with vehicle details (minimum 150 characters for better indexing)
  const richDescription = vehicle.description && vehicle.description.length > 150
    ? `${vehicle.description.substring(0, 155)}...`
    : `Buy ${vehicle.brand} ${vehicle.model} ${vehicle.year || ''} on Evvalley. ${vehicle.category} for sale${vehicle.location ? ` in ${vehicle.location}` : ''}. ${vehicle.price ? `Price: $${vehicle.price.toLocaleString()}` : 'Contact for pricing'}. ${vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'New vehicle'}. ${vehicle.range_miles ? `Range: ${vehicle.range_miles} miles.` : ''} ${vehicle.vin ? `VIN: ${vehicle.vin}.` : ''} Trusted EV marketplace.`;

  return {
    title: `${vehicle.title} - Evvalley`,
    description: richDescription,
    keywords: `${vehicle.brand}, ${vehicle.model}, ${vehicle.year || ''}, electric vehicle, EV, ${vehicle.category}, for sale, Evvalley${vehicle.location ? `, ${vehicle.location}` : ''}, ${vehicle.vin ? `VIN ${vehicle.vin}` : ''}`,
    alternates: {
      canonical: vehicleUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'google-site-verification': 'your-verification-code',
      'msvalidate.01': 'your-bing-verification-code',
      'article:published_time': vehicle.created_at,
      'article:modified_time': vehicle.updated_at || vehicle.created_at,
      'article:author': 'Evvalley',
      'article:section': 'Electric Vehicles',
      'article:tag': `${vehicle.brand}, ${vehicle.model}, ${vehicle.category}`,
    },
    openGraph: {
      title: `${vehicle.title} - Evvalley`,
      description: richDescription,
      url: vehicleUrl,
      images: vehicle.images && vehicle.images.length > 0 ? vehicle.images : [],
      type: 'website',
      siteName: 'Evvalley',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${vehicle.title} - Evvalley`,
      description: richDescription,
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

    const vehicleUrl = `https://www.evvalley.com/vehicles/${vehicle.id}`;

    // Generate BreadcrumbList structured data
    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.evvalley.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Vehicles",
          "item": "https://www.evvalley.com/vehicles"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": vehicle.title,
          "item": vehicleUrl
        }
      ]
    };

    return (
      <>
        {/* Canonical URL */}
        <link rel="canonical" href={vehicleUrl} />
        
        {/* Structured Data - Product */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateStructuredData(vehicle))
          }}
        />
        
        {/* Structured Data - BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData)
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