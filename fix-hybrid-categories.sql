-- Fix hybrid vehicle categories to be consistent
-- Update all vehicles with inconsistent hybrid categories
UPDATE vehicles 
SET category = 'hybrid-car' 
WHERE category IN ('Hybrid Car', 'hybrid_vehicle', 'hybrid')
AND (title ILIKE '%hybrid%' OR fuel_type = 'hybrid');

-- Also fix any vehicles that should be hybrid based on their title
UPDATE vehicles 
SET category = 'hybrid-car' 
WHERE title ILIKE '%hybrid%' 
AND category NOT IN ('hybrid-car', 'ev-car', 'ev-scooter', 'e-bike');

-- Verify the changes
SELECT id, title, brand, category, price, fuel_type
FROM vehicles 
WHERE title ILIKE '%hybrid%' OR fuel_type = 'hybrid'
ORDER BY created_at DESC;
