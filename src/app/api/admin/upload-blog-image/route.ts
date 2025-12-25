import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/database';

export async function POST(request: NextRequest) {
  let file: File | null = null;
  try {
    const formData = await request.formData();
    file = formData.get('file') as File;
    const blogSlug = formData.get('blogSlug') as string;
    const blogId = formData.get('blogId') as string;

    if (!file || !blogSlug || !blogId) {
      return NextResponse.json(
        { error: 'Dosya, blog slug ve blog ID gerekli!' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Sadece resim dosyaları yüklenebilir!' },
        { status: 400 }
      );
    }

    // Validate file size (max 20MB)
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Dosya boyutu 20MB\'dan küçük olmalı!' },
        { status: 400 }
      );
    }

    // Create a safe filename that matches Supabase Storage requirements
    // Supabase Storage requires: lowercase, alphanumeric, hyphens, underscores, dots only
    const originalExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const validExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(originalExt) ? originalExt : 'jpg';
    
    // Clean slug: only lowercase letters, numbers, hyphens, and underscores
    const safeSlug = blogSlug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')  // Replace invalid chars with hyphens
      .replace(/-+/g, '-')           // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '');        // Remove leading/trailing hyphens
    
    // Create filename: use timestamp + slug for uniqueness
    const timestamp = Date.now();
    const fileName = `${timestamp}-${safeSlug.substring(0, 50)}.${validExt}`;
    
    // Use folder structure like other successful uploads (vehicles/{id}/{file})
    // This matches the pattern used in storage.ts
    const filePath = `blog/${fileName}`;

    // Try to upload to Supabase Storage first
    const supabase = createServerSupabaseClient();
    
    // Fallback URL (will be replaced with actual Supabase URL if upload succeeds)
    let imageUrl = `/blog-images/${filePath}`;
    let uploadSuccess = false;
    let errorDetails: any = null;

    // First, check if bucket exists and get bucket info
    try {
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      console.log('📦 Available buckets:', buckets?.map(b => ({ id: b.id, public: b.public })));
      
      if (bucketError) {
        console.error('❌ Error listing buckets:', bucketError);
        errorDetails = {
          message: `Bucket listesi alınamadı: ${bucketError.message}`,
          error: bucketError
        };
      } else {
        const blogImagesBucket = buckets?.find(b => b.id === 'blog-images');
        if (!blogImagesBucket) {
          console.error('❌ blog-images bucket not found!');
          errorDetails = {
            message: 'blog-images bucket bulunamadı. Supabase Dashboard\'dan bucket\'ı oluşturduğunuzdan emin olun.',
            suggestion: 'Supabase Dashboard > Storage > New bucket > blog-images (Public: true)'
          };
        } else {
          console.log('✅ blog-images bucket found:', {
            id: blogImagesBucket.id,
            public: blogImagesBucket.public,
            name: blogImagesBucket.name
          });
          
          if (!blogImagesBucket.public) {
            console.warn('⚠️ blog-images bucket is not public!');
            errorDetails = {
              message: 'blog-images bucket public değil. Bucket ayarlarından "Public bucket" seçeneğini açın.',
              suggestion: 'Supabase Dashboard > Storage > blog-images > Settings > Public bucket: ON'
            };
          }
        }
      }
    } catch (bucketCheckError) {
      console.error('Error checking buckets:', bucketCheckError);
      errorDetails = {
        message: `Bucket kontrolü başarısız: ${bucketCheckError instanceof Error ? bucketCheckError.message : String(bucketCheckError)}`,
        error: bucketCheckError
      };
    }

    // Validate file path format (Supabase Storage requirements)
    if (!filePath || filePath.length === 0) {
      errorDetails = {
        message: 'Dosya adı oluşturulamadı',
        suggestion: 'Blog slug veya dosya adı geçersiz. Lütfen farklı bir dosya deneyin.'
      };
    } else if (filePath.length > 255) {
      errorDetails = {
        message: 'Dosya adı çok uzun (max 255 karakter)',
        suggestion: 'Daha kısa bir dosya adı kullanın.'
      };
    }

    // Only try upload if bucket exists and file path is valid
    if ((!errorDetails || errorDetails.suggestion) && filePath && filePath.length > 0 && filePath.length <= 255) {
      try {
        // Try uploading to 'blog-images' bucket
        console.log('📤 Attempting to upload to blog-images bucket...');
        console.log('File path:', filePath);
        console.log('File name:', fileName);
        console.log('File size:', file.size, 'bytes');
        console.log('File type:', file.type);
        console.log('File path length:', filePath.length);
        console.log('File object type:', file.constructor.name);
        console.log('File object:', {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        });
        
        // Final validation: ensure file path only contains allowed characters (with folder structure)
        // Supabase allows: alphanumeric, hyphens, underscores, dots, and forward slashes for folders
        if (!/^[a-z0-9._\/-]+$/i.test(filePath)) {
          throw new Error(`Dosya yolu geçersiz karakterler içeriyor: ${filePath}. Sadece harf, rakam, nokta, tire, alt çizgi ve slash kullanılabilir.`);
        }
        
        // Convert File to Blob if needed (some Next.js versions return Blob instead of File)
        let fileToUpload: Blob | File = file;
        const fileAsAny = file as any;
        if (!(fileAsAny instanceof File) && fileAsAny instanceof Blob) {
          console.log('File is Blob, using as-is');
          fileToUpload = fileAsAny;
        } else if (!(fileAsAny instanceof File) && !(fileAsAny instanceof Blob)) {
          // Convert to Blob if it's neither File nor Blob
          console.log('Converting to Blob...');
          const arrayBuffer = await fileAsAny.arrayBuffer();
          fileToUpload = new Blob([arrayBuffer], { type: fileAsAny.type });
        }
        
        // Use file directly (File or Blob both work with Supabase)
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(filePath, fileToUpload, {
            contentType: file.type || 'image/jpeg',
            upsert: true, // Allow overwriting
            cacheControl: '3600'
          });

        if (!uploadError && uploadData) {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('blog-images')
            .getPublicUrl(filePath);
          
          imageUrl = urlData.publicUrl || `/blog-images/${filePath}`;
          uploadSuccess = true;
          console.log('✅ Successfully uploaded to blog-images bucket:', imageUrl);
        } else {
          console.error('❌ blog-images bucket upload error:', uploadError);
          console.error('Error details:', {
            message: uploadError?.message,
            error: uploadError
          });
          
          // Parse error message for better user feedback
          const errorMsg = uploadError?.message || 'Yükleme başarısız';
          let suggestion = 'Bucket ayarlarını ve RLS politikalarını kontrol edin.';
          
          if (errorMsg.includes('pattern') || errorMsg.includes('string did not match')) {
            suggestion = 'Dosya adı formatı geçersiz. Dosya adını kontrol edin veya farklı bir dosya deneyin.';
          } else if (errorMsg.includes('policy') || errorMsg.includes('permission') || errorMsg.includes('403')) {
            suggestion = 'RLS politikaları eksik olabilir. fix-blog-images-storage.sql dosyasındaki SQL\'i Supabase SQL Editor\'de çalıştırın.';
          } else if (errorMsg.includes('bucket') || errorMsg.includes('not found')) {
            suggestion = 'blog-images bucket\'ı bulunamadı. Supabase Dashboard\'dan bucket\'ı oluşturun.';
          } else if (errorMsg.includes('size') || errorMsg.includes('too large')) {
            suggestion = 'Dosya boyutu çok büyük. 20MB\'dan küçük bir dosya deneyin.';
          }
          
          errorDetails = {
            message: errorMsg,
            error: uploadError,
            suggestion: suggestion
          };
        }
      } catch (storageError) {
        console.error('Storage upload error:', storageError);
        console.error('Storage error details:', {
          message: storageError instanceof Error ? storageError.message : String(storageError),
          stack: storageError instanceof Error ? storageError.stack : undefined
        });
        
        errorDetails = {
          message: storageError instanceof Error ? storageError.message : String(storageError),
          error: storageError,
          suggestion: 'Supabase Storage bağlantısı başarısız. RLS politikalarını ve bucket ayarlarını kontrol edin.'
        };
      }
    }

    // If Supabase upload failed, return the local path with detailed error
    // User will need to manually add the file to public/blog-images/
    if (!uploadSuccess) {
      const errorMsg = errorDetails?.message || 'Bilinmeyen hata';
      const errorCode = errorDetails?.statusCode || errorDetails?.status || 'N/A';
      const suggestion = errorDetails?.suggestion || '';
      
      // Check if it's an RLS policy error
      const isRLSError = errorMsg?.toLowerCase().includes('policy') || 
                        errorMsg?.toLowerCase().includes('permission') ||
                        errorCode === 403;
      
      return NextResponse.json({
        success: false,
        error: 'Supabase Storage\'a yükleme başarısız',
        details: errorMsg,
        errorCode: errorCode,
        imageUrl: imageUrl,
        fileName: fileName,
        filePath: imageUrl,
        isRLSError: isRLSError,
        suggestion: suggestion || (isRLSError 
          ? 'RLS politikaları eksik. fix-blog-images-storage.sql dosyasındaki SQL\'i Supabase SQL Editor\'de çalıştırın.'
          : 'Bucket ayarlarını ve RLS politikalarını kontrol edin.'),
        message: `❌ Supabase Storage'a yükleme başarısız!\n\nHata: ${errorMsg}\nKod: ${errorCode}\n\n${suggestion ? `💡 Öneri: ${suggestion}\n\n` : ''}Çözüm Adımları:\n1. Supabase Dashboard > Storage > blog-images bucket'ının var olduğundan emin olun\n2. Bucket'ın "Public" olduğundan emin olun (Settings > Public bucket: ON)\n3. SQL Editor'de RLS politikalarını çalıştırın (fix-blog-images-storage.sql)\n4. Veya görseli manuel olarak 'public/blog-images/${fileName}' klasörüne ekleyin`,
        needsManualUpload: true,
        needsRLSPolicy: isRLSError
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      fileName: fileName,
      filePath: filePath,
      message: 'Görsel başarıyla yüklendi!'
    });

  } catch (error) {
    console.error('Upload error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    
    // Log detailed error for debugging
    console.error('Detailed error:', {
      message: errorMessage,
      details: errorDetails,
      fileSize: file?.size,
      fileType: file?.type,
      fileName: file?.name
    });
    
    return NextResponse.json(
      { 
        error: 'Görsel yüklenirken bir hata oluştu',
        details: errorMessage,
        suggestion: 'Supabase Storage bucket\'ları (blog-images veya public) mevcut olmayabilir. Görseli manuel olarak public/blog-images/ klasörüne ekleyebilirsiniz.'
      },
      { status: 500 }
    );
  }
}

