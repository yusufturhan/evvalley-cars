-- Update EV Scooters table
ALTER TABLE ev_scooters 
DROP COLUMN IF EXISTS title_status,
ADD COLUMN IF NOT EXISTS color TEXT;

-- Update E-Bikes table  
ALTER TABLE e_bikes 
DROP COLUMN IF EXISTS title_status,
ADD COLUMN IF NOT EXISTS color TEXT;

-- Add indexes for new color field
CREATE INDEX IF NOT EXISTS idx_ev_scooters_color ON ev_scooters(color);
CREATE INDEX IF NOT EXISTS idx_e_bikes_color ON e_bikes(color);

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'ev_scooters' 
ORDER BY ordinal_position;

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'e_bikes' 
ORDER BY ordinal_position; 