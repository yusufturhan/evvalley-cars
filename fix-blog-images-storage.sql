-- Supabase Storage: blog-images bucket için RLS politikaları
-- Bu SQL'i Supabase Dashboard > SQL Editor'de çalıştırın

-- 1. Önce mevcut politikaları temizle (eğer varsa)
DROP POLICY IF EXISTS "Public Access for blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Service role can upload to blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to blog-images" ON storage.objects;

-- 2. Herkesin blog-images bucket'ındaki dosyaları okuyabilmesi için
CREATE POLICY "Public Access for blog-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

-- 3. INSERT için policy - Service role kullanıldığı için aslında gerekli değil
-- ama yine de ekleyelim (herhangi bir kullanıcı yükleyebilir)
CREATE POLICY "Anyone can upload to blog-images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'blog-images');

-- 4. UPDATE için policy (opsiyonel - dosya güncelleme için)
CREATE POLICY "Anyone can update blog-images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'blog-images')
WITH CHECK (bucket_id = 'blog-images');

-- 5. DELETE için policy (opsiyonel - dosya silme için)
CREATE POLICY "Anyone can delete blog-images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'blog-images');

-- 6. Bucket'ın public olduğundan emin olun:
-- Supabase Dashboard > Storage > blog-images > Settings
-- "Public bucket" seçeneğinin açık olduğundan emin olun

-- 7. Test için bucket'ı kontrol et:
-- SELECT * FROM storage.buckets WHERE id = 'blog-images';




