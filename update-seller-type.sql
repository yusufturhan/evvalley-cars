-- Update seller type to 'dealer' for West AutoNation
UPDATE users 
SET seller_type = 'dealer' 
WHERE email = 'info@westautonation.com';
