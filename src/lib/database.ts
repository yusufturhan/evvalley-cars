// Re-export client-side supabase from supabase-browser
export { supabase } from './supabase-browser';

// Re-export server-side client from supabase-server
export { createServerSupabaseClient } from './supabase-server';

// Enhanced database client with retry logic
export const createRetrySupabaseClient = (maxRetries = 3, delay = 1000) => {
  const client = createServerSupabaseClient();
  
  return {
    ...client,
    async queryWithRetry<T>(queryFn: () => Promise<T>): Promise<T> {
      let lastError: any;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await queryFn();
        } catch (error) {
          lastError = error;
          console.warn(`Database query attempt ${attempt} failed:`, error);
          
          if (attempt < maxRetries) {
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
          }
        }
      }
      
      throw lastError;
    }
  };
};

// Health check function for database
export const checkDatabaseHealth = async () => {
  try {
    const client = createServerSupabaseClient();
    const { data, error } = await client
      .from('vehicles')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Database health check failed:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Database health check error:', error);
    return false;
  }
};

// Database types
export interface Vehicle {
  id: string;
  title: string;
  description: string;
  price: number;
  old_price?: number;
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
  video_url?: string | null;
  seller_id: string;
  seller_email?: string;
  location: string;
  // Optional enhanced location fields
  location_text?: string | null;
  place_id?: string | null;
  lat?: number | null;
  lng?: number | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_price_change_at?: string;
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
  highlighted_features?: string;
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