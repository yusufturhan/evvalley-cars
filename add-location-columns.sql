-- Add enhanced location columns to vehicles table
-- These columns are used by LocationPicker component for better location filtering

-- Add city column
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS city VARCHAR(100);

-- Add state column  
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS state VARCHAR(50);

-- Add postal_code column
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS postal_code VARCHAR(20);

-- Add location_text column (formatted address)
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS location_text TEXT;

-- Add place_id column (Google Places ID)
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS place_id VARCHAR(255);

-- Add latitude and longitude for map display
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS lat DECIMAL(10, 8);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS lng DECIMAL(11, 8);

-- Create indexes for better performance on location-based queries
CREATE INDEX IF NOT EXISTS idx_vehicles_city ON vehicles(city);
CREATE INDEX IF NOT EXISTS idx_vehicles_state ON vehicles(state);
CREATE INDEX IF NOT EXISTS idx_vehicles_postal_code ON vehicles(postal_code);
CREATE INDEX IF NOT EXISTS idx_vehicles_lat_lng ON vehicles(lat, lng);

-- Update existing records: copy location to location_text if location_text is null
UPDATE vehicles 
SET location_text = location 
WHERE location_text IS NULL AND location IS NOT NULL;

-- Log completion
DO $$ 
BEGIN 
  RAISE NOTICE 'Enhanced location columns added successfully to vehicles table';
END $$;
