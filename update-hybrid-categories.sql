-- Update hybrid vehicle categories to match other listings
UPDATE vehicles 
SET category = 'Hybrid Car' 
WHERE title IN ('2015 Ford Fusion Hybrid', '2014 Toyota Prius Plug-In Hybrid');
