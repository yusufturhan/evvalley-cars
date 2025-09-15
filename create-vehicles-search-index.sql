-- Enable pgvector extension (idempotent)
create extension if not exists vector;

-- Create semantic search index table (idempotent)
create table if not exists public.vehicles_search_index (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null unique references public.vehicles(id) on delete cascade,
  embedding vector(1536) not null,
  search_document text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- IVFFlat index for fast cosine similarity (requires analyze)
create index if not exists vehicles_search_embedding_idx
  on public.vehicles_search_index using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Helpful index for lookups
create index if not exists vehicles_search_vehicle_id_idx
  on public.vehicles_search_index(vehicle_id);


