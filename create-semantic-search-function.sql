-- Create semantic search function for vehicles
CREATE OR REPLACE FUNCTION search_vehicles_semantic(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 20
)
RETURNS TABLE (
  vehicle_id uuid,
  similarity float
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    v.vehicle_id,
    1 - (v.embedding <=> query_embedding) as similarity
  FROM vehicles_search_index v
  WHERE 1 - (v.embedding <=> query_embedding) > match_threshold
  ORDER BY v.embedding <=> query_embedding
  LIMIT match_count;
$$;
