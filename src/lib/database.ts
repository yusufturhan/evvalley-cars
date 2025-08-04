import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client for admin operations
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Database types
export interface Vehicle {
  id: string;
  title: string;
  description: string;
  price: number;
  year: number;
  mileage?: number;
  fuel_type: string;
  transmission?: string;
  color?: string;
  brand: string;
  model: string;
  category: string;
  range_miles?: number;
  max_speed?: number;
  battery_capacity?: string;
  images?: string[];
  seller_id: string;
  seller_email?: string;
  location: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // New fields from sell form
  interior_color?: string;
  exterior_color?: string;
  body_seating?: string;
  combined_fuel_economy?: string;
  horsepower?: number;
  electric_mile_range?: number;
  battery_warranty?: string;
  drivetrain?: string;
  vin?: string;
  sold?: boolean;
  sold_at?: string;
  sold_to_email?: string;
  // New fields
  vehicle_condition?: string;
  title_status?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  vehicle_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehicleMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  vehicle_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  sender?: {
    id: string;
    full_name: string;
    email: string;
  };
  receiver?: {
    id: string;
    full_name: string;
    email: string;
  };
  vehicle?: {
    id: string;
    title: string;
    brand: string;
    model: string;
  };
}

export interface User {
  id: string;
  clerk_id: string;
  email: string;
  full_name?: string;
  phone?: string;
  seller_type?: 'private' | 'dealer';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  vehicle_id: string;
  created_at: string;
} 