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
  
  // Generate title: "{year} {make} {model} for Sale | EvValley"
  const make = vehicle.brand || '';
  const model = vehicle.model || '';
  const year = vehicle.year ? vehicle.year.toString() : '';
  const title = year && make && model 
    ? `${year} ${make} ${model} for Sale | EvValley`
    : vehicle.title 
    ? `${vehicle.title} for Sale | EvValley`
    : 'Vehicle for Sale | EvValley';

  // Description: "View price, mileage, photos, and message the seller directly on EvValley."
  const description = "View price, mileage, photos, and message the seller directly on EvValley.";

  // OpenGraph image (first image if available)
  const ogImage = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : undefined;
  const ogImages = ogImage ? [ogImage] : [];

  return {
    title,
    description,
    metadataBase: new URL('https://www.evvalley.com'),
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
    openGraph: {
      title,
      description,
      url: vehicleUrl,
      images: ogImages.length > 0 ? ogImages : [],
      type: 'website',
      siteName: 'Evvalley',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.length > 0 ? ogImages : [],
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
      <VehicleDetailClient vehicle={vehicle} />
    );
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    notFound();
  }
} 