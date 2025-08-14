-- Veritabanı Şemasını Düzeltme Scripti
-- Bu script benzersizlik kısıtlamaları ve VIN kontrolü ekler

-- 1. VIN numarası için benzersizlik kısıtlaması ekle (eğer VIN varsa)
ALTER TABLE vehicles ADD CONSTRAINT IF NOT EXISTS unique_vin UNIQUE (vin) WHERE vin IS NOT NULL;

-- 2. Aynı araç için benzersizlik kontrolü (marka + model + yıl + VIN kombinasyonu)
-- Bu kısıtlama aynı araçların farklı konumlarda olmasını engeller
CREATE UNIQUE INDEX IF NOT EXISTS unique_vehicle_identity 
ON vehicles (brand, model, year, vin) 
WHERE vin IS NOT NULL;

-- 3. VIN numarası için check constraint (17 karakter)
ALTER TABLE vehicles ADD CONSTRAINT IF NOT EXISTS valid_vin_length 
CHECK (vin IS NULL OR length(vin) = 17);

-- 4. Fiyat için check constraint (pozitif olmalı)
ALTER TABLE vehicles ADD CONSTRAINT IF NOT EXISTS valid_price 
CHECK (price > 0);

-- 5. Yıl için check constraint (1900-2030 arası)
ALTER TABLE vehicles ADD CONSTRAINT IF NOT EXISTS valid_year 
CHECK (year >= 1900 AND year <= 2030);

-- 6. Konum için check constraint (boş olmamalı)
ALTER TABLE vehicles ADD CONSTRAINT IF NOT EXISTS valid_location 
CHECK (location IS NOT NULL AND length(trim(location)) > 0);

-- 7. Satıcı email için check constraint (geçerli email formatı)
ALTER TABLE vehicles ADD CONSTRAINT IF NOT EXISTS valid_seller_email 
CHECK (seller_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- 8. Araç durumu için check constraint
ALTER TABLE vehicles ADD CONSTRAINT IF NOT EXISTS valid_vehicle_condition 
CHECK (vehicle_condition IS NULL OR vehicle_condition IN ('excellent', 'good', 'fair', 'poor'));

-- 9. Başlık durumu için check constraint
ALTER TABLE vehicles ADD CONSTRAINT IF NOT EXISTS valid_title_status 
CHECK (title_status IS NULL OR title_status IN ('clean', 'salvage', 'rebuilt', 'lien'));

-- 10. Kategori için check constraint
ALTER TABLE vehicles ADD CONSTRAINT IF NOT EXISTS valid_category 
CHECK (category IN ('ev-car', 'hybrid-car', 'gas-car', 'motorcycle', 'scooter'));

-- 11. Yakıt tipi için check constraint
ALTER TABLE vehicles ADD CONSTRAINT IF NOT EXISTS valid_fuel_type 
CHECK (fuel_type IS NULL OR fuel_type IN ('electric', 'hybrid', 'gasoline', 'diesel', 'hydrogen'));

-- 12. Şanzıman için check constraint
ALTER TABLE vehicles ADD CONSTRAINT IF NOT EXISTS valid_transmission 
CHECK (transmission IS NULL OR transmission IN ('automatic', 'manual', 'cvt', 'semi-automatic'));

-- 13. Çekiş için check constraint
ALTER TABLE vehicles ADD CONSTRAINT IF NOT EXISTS valid_drivetrain 
CHECK (drivetrain IS NULL OR drivetrain IN ('FWD', 'RWD', 'AWD', '4WD'));

-- 14. Mevcut araçları kontrol et ve düzelt
UPDATE vehicles SET 
  location = COALESCE(location, 'Unknown'),
  seller_email = COALESCE(seller_email, 'unknown@example.com'),
  vehicle_condition = COALESCE(vehicle_condition, 'good'),
  title_status = COALESCE(title_status, 'clean')
WHERE location IS NULL OR seller_email IS NULL OR vehicle_condition IS NULL OR title_status IS NULL;

-- 15. Aynı araçları bul ve raporla
-- Bu sorgu aynı marka/model/yıl araçları bulur
SELECT 
  brand, 
  model, 
  year, 
  COUNT(*) as duplicate_count,
  array_agg(id) as vehicle_ids,
  array_agg(location) as locations,
  array_agg(seller_email) as sellers
FROM vehicles 
GROUP BY brand, model, year 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- 16. VIN numarası olmayan araçları raporla
SELECT 
  id, 
  title, 
  brand, 
  model, 
  year, 
  location,
  seller_email,
  'MISSING VIN' as issue
FROM vehicles 
WHERE vin IS NULL OR vin = '';

-- 17. Geçersiz email formatı olan araçları raporla
SELECT 
  id, 
  title, 
  seller_email,
  'INVALID EMAIL' as issue
FROM vehicles 
WHERE seller_email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';

-- 18. Geçersiz fiyatı olan araçları raporla
SELECT 
  id, 
  title, 
  price,
  'INVALID PRICE' as issue
FROM vehicles 
WHERE price <= 0;

-- 19. Geçersiz yılı olan araçları raporla
SELECT 
  id, 
  title, 
  year,
  'INVALID YEAR' as issue
FROM vehicles 
WHERE year < 1900 OR year > 2030; 