import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { createServerSupabaseClient as createServerClient } from '@/lib/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (uses anon key only)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Re-export server-side client from database.ts for backward compatibility
export const createServerSupabaseClient = createServerClient; 