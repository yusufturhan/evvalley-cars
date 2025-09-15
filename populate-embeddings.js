const { createClient } = require('@supabase/supabase-js');

// Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function generateEmbedding(text) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not found');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

function createSearchDocument(vehicle) {
  const parts = [];
  
  // Basic info
  if (vehicle.title) parts.push(vehicle.title);
  if (vehicle.brand) parts.push(vehicle.brand);
  if (vehicle.model) parts.push(vehicle.model);
  if (vehicle.year) parts.push(vehicle.year.toString());
  
  // Colors
  if (vehicle.color) parts.push(vehicle.color);
  if (vehicle.exterior_color) parts.push(vehicle.exterior_color);
  
  // Location
  if (vehicle.location) parts.push(vehicle.location);
  
  // Price and mileage
  if (vehicle.price) parts.push(`$${vehicle.price.toLocaleString()}`);
  if (vehicle.mileage) parts.push(`${vehicle.mileage.toLocaleString()} miles`);
  
  // Category
  if (vehicle.category) {
    const categoryMap = {
      'ev-car': 'electric car',
      'hybrid-car': 'hybrid car',
      'e-bike': 'electric bike',
      'ev-scooter': 'electric scooter'
    };
    parts.push(categoryMap[vehicle.category] || vehicle.category);
  }
  
  return parts.join(' ').toLowerCase();
}

async function populateEmbeddings() {
  console.log('🚀 Starting embedding population...');
  
  try {
    // Get all unsold vehicles
    console.log('📋 Fetching vehicles...');
    const { data: vehicles, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('id, title, brand, model, color, exterior_color, location, price, mileage, year, category')
      .eq('sold', false);
    
    if (vehiclesError) {
      throw new Error(`Error fetching vehicles: ${vehiclesError.message}`);
    }
    
    console.log(`📊 Found ${vehicles.length} vehicles to process`);
    
    if (vehicles.length === 0) {
      console.log('⚠️  No vehicles found to index');
      return;
    }

    // Process vehicles in batches
    const batchSize = 5;
    let processed = 0;
    let errors = 0;

    for (let i = 0; i < vehicles.length; i += batchSize) {
      const batch = vehicles.slice(i, i + batchSize);
      console.log(`\n🔄 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(vehicles.length / batchSize)}`);
      
      const batchPromises = batch.map(async (vehicle) => {
        try {
          // Create search document
          const searchDocument = createSearchDocument(vehicle);
          console.log(`📝 Vehicle ${vehicle.id}: "${searchDocument}"`);
          
          // Generate embedding
          const embedding = await generateEmbedding(searchDocument);
          
          // Insert into search index
          const { error: insertError } = await supabase
            .from('vehicles_search_index')
            .upsert({
              vehicle_id: vehicle.id,
              embedding: embedding,
              search_document: searchDocument,
              updated_at: new Date().toISOString()
            });
          
          if (insertError) {
            console.error(`❌ Error inserting vehicle ${vehicle.id}:`, insertError.message);
            errors++;
          } else {
            console.log(`✅ Indexed vehicle ${vehicle.id}`);
            processed++;
          }
          
        } catch (error) {
          console.error(`❌ Error processing vehicle ${vehicle.id}:`, error.message);
          errors++;
        }
      });
      
      await Promise.all(batchPromises);
      
      // Small delay between batches to avoid rate limiting
      if (i + batchSize < vehicles.length) {
        console.log('⏳ Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    console.log(`\n✅ Embedding population completed!`);
    console.log(`📊 Processed: ${processed} vehicles`);
    console.log(`❌ Errors: ${errors} vehicles`);
    
    // Verify the index
    console.log('\n🔍 Verifying search index...');
    const { data: indexCount, error: countError } = await supabase
      .from('vehicles_search_index')
      .select('id', { count: 'exact' });
    
    if (countError) {
      console.error('❌ Error verifying index:', countError.message);
    } else {
      console.log(`📊 Search index contains ${indexCount.length} entries`);
    }

  } catch (error) {
    console.error('❌ Error populating embeddings:', error);
  }
}

// Run if called directly
if (require.main === module) {
  populateEmbeddings().catch(console.error);
}

module.exports = { populateEmbeddings };
