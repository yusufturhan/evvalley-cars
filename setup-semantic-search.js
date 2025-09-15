const { createClient } = require('@supabase/supabase-js');

// Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupSemanticSearch() {
  console.log('🚀 Setting up semantic search in Supabase...');
  
  try {
    // 1. Enable pgvector extension
    console.log('📦 Enabling pgvector extension...');
    const { error: extensionError } = await supabase.rpc('exec_sql', {
      sql: 'create extension if not exists vector;'
    });
    
    if (extensionError) {
      console.log('⚠️  Extension might already exist or need manual setup:', extensionError.message);
    } else {
      console.log('✅ pgvector extension enabled');
    }

    // 2. Create vehicles_search_index table
    console.log('📊 Creating vehicles_search_index table...');
    const createTableSQL = `
      create table if not exists public.vehicles_search_index (
        id uuid primary key default gen_random_uuid(),
        vehicle_id uuid not null unique references public.vehicles(id) on delete cascade,
        embedding vector(1536) not null,
        search_document text not null,
        created_at timestamp with time zone default now(),
        updated_at timestamp with time zone default now()
      );
    `;
    
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    });
    
    if (tableError) {
      console.log('⚠️  Table might already exist:', tableError.message);
    } else {
      console.log('✅ vehicles_search_index table created');
    }

    // 3. Create indexes
    console.log('🔍 Creating indexes...');
    const indexSQL = `
      create index if not exists vehicles_search_embedding_idx
        on public.vehicles_search_index using ivfflat (embedding vector_cosine_ops)
        with (lists = 100);
      
      create index if not exists vehicles_search_vehicle_id_idx
        on public.vehicles_search_index(vehicle_id);
    `;
    
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: indexSQL
    });
    
    if (indexError) {
      console.log('⚠️  Indexes might already exist:', indexError.message);
    } else {
      console.log('✅ Indexes created');
    }

    // 4. Create semantic search function
    console.log('🔧 Creating semantic search function...');
    const functionSQL = `
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
    `;
    
    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: functionSQL
    });
    
    if (functionError) {
      console.log('⚠️  Function might already exist:', functionError.message);
    } else {
      console.log('✅ Semantic search function created');
    }

    // 5. Check if we have vehicles to index
    console.log('📋 Checking existing vehicles...');
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id, title, brand, model, color, exterior_color, location, price, mileage, year, category')
      .eq('sold', false)
      .limit(5);
    
    if (vehiclesError) {
      console.error('❌ Error fetching vehicles:', vehiclesError);
      return;
    }
    
    console.log(`📊 Found ${vehicles.length} vehicles to index`);
    if (vehicles.length > 0) {
      console.log('📝 Sample vehicle:', vehicles[0]);
    }

    console.log('✅ Semantic search setup completed!');
    console.log('🎯 Next step: Run populate-embeddings.js to generate embeddings');

  } catch (error) {
    console.error('❌ Error setting up semantic search:', error);
  }
}

// Run if called directly
if (require.main === module) {
  setupSemanticSearch().catch(console.error);
}

module.exports = { setupSemanticSearch };
