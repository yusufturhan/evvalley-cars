-- Drop vehicles search index table and related objects from Supabase
-- Run this in Supabase SQL Editor

-- Drop the semantic search function if it exists
DROP FUNCTION IF EXISTS public.search_vehicles_semantic(vector, float);

-- Drop RLS policies on vehicles_search_index
DROP POLICY IF EXISTS "Allow authenticated users to read vehicles_search_index" ON public.vehicles_search_index;
DROP POLICY IF EXISTS "Allow service role to manage vehicles_search_index" ON public.vehicles_search_index;

-- Drop indexes on vehicles_search_index
DROP INDEX IF EXISTS public.vehicles_search_embedding_idx;
DROP INDEX IF EXISTS public.vehicles_search_vehicle_id_idx;

-- Drop the vehicles_search_index table
DROP TABLE IF EXISTS public.vehicles_search_index;

-- Verify deletion
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'vehicles_search_index') 
    THEN 'Table still exists - check for dependencies'
    ELSE 'Table dropped successfully'
  END as status;

