-- Supabase Storage bucket için RLS politikaları
-- Bu SQL'i Supabase SQL Editor'de çalıştırın

-- 1. Bucket'ın var olduğundan emin olun (Supabase Dashboard'dan oluşturulmuş olmalı)
-- Bucket adı: blog-images
-- Public: true

-- 2. Storage objects için RLS politikaları oluştur

-- Herkesin blog-images bucket'ındaki dosyaları okuyabilmesi için (zaten public bucket)
CREATE POLICY "Public Access for blog-images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'blog-images');

-- Service role ile yazma izni (API'den yükleme için)
-- Not: Service role key kullanıldığı için bu policy gerekli olmayabilir
-- Ama yine de ekleyelim

-- Authenticated users için yazma izni (opsiyonel - eğer admin authentication kullanıyorsanız)
-- CREATE POLICY "Authenticated users can upload to blog-images"
-- ON storage.objects
-- FOR INSERT
-- WITH CHECK (bucket_id = 'blog-images' AND auth.role() = 'authenticated');

-- Service role kullanıldığı için yukarıdaki policy gerekli değil
-- createServerSupabaseClient() service role key kullanıyor, bu yüzden RLS bypass edilir

-- 3. Eğer hala çalışmıyorsa, bucket'ın public olduğundan emin olun:
-- Supabase Dashboard > Storage > blog-images bucket > Settings
-- "Public bucket" seçeneğinin açık olduğundan emin olun

