-- Find duplicate Ford Fusion Hybrid listings
SELECT 
  id,
  title,
  created_at,
  seller_email,
  price,
  mileage
FROM vehicles 
WHERE title = '2015 Ford Fusion Hybrid' 
ORDER BY created_at ASC;
