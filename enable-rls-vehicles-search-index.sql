-- Enable Row Level Security on vehicles_search_index table
ALTER TABLE public.vehicles_search_index ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all search index entries
CREATE POLICY "Allow authenticated users to read vehicles_search_index" 
ON public.vehicles_search_index 
FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow service role to manage search index
CREATE POLICY "Allow service role to manage vehicles_search_index" 
ON public.vehicles_search_index 
FOR ALL 
TO service_role 
USING (true);
