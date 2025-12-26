import { createClient } from '@supabase/supabase-js';
import { generateVehicleJsonLd } from '@/lib/seo/vehicleJsonLd';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fetchVehicle(id: string) {
  // Try vehicles table first
  let { data: vehicle } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single();

  if (!vehicle) {
    // Try ev_scooters table
    let { data: scooter } = await supabase
      .from('ev_scooters')
      .select('*')
      .eq('id', id)
      .single();

    if (!scooter) {
      // Try e_bikes table
      let { data: bike } = await supabase
        .from('e_bikes')
        .select('*')
        .eq('id', id)
        .single();

      if (bike) {
        vehicle = bike;
      } else {
        vehicle = scooter;
      }
    } else {
      vehicle = scooter;
    }
  }

  return vehicle;
}

export default async function VehicleDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const vehicle = await fetchVehicle(params.id);
  const canonicalUrl = `https://www.evvalley.com/vehicles/${params.id}`;
  const jsonLd = vehicle ? generateVehicleJsonLd(vehicle, canonicalUrl) : null;

  return (
    <>
      {/* Vehicle JSON-LD in HEAD */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      )}
      {children}
    </>
  );
}

