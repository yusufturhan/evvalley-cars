import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient as createServerClient } from '@/lib/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (uses anon key only)
// Note: This file is kept for backward compatibility but should use @/lib/database instead
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Re-export server-side client from database.ts for backward compatibility
// This function uses SUPABASE_SERVICE_ROLE_KEY and should only be used server-side
export const createServerSupabaseClient = createServerClient; 