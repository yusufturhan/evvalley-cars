import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client for admin operations
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

// Upload image to Supabase Storage
export const uploadImage = async (file: File, vehicleId: string, index: number) => {
  try {
    console.log('uploadImage called with:', { 
      fileName: file.name, 
      fileSize: file.size, 
      fileType: file.type,
      vehicleId,
      index 
    });

    const fileExt = file.name.split('.').pop();
    const fileName = `${vehicleId}_${index}.${fileExt}`;
    const filePath = `vehicles/${vehicleId}/${fileName}`;

    console.log('Generated file path:', filePath);

    console.log('Attempting to upload to Supabase Storage...');
    const { data, error } = await supabase.storage
      .from('vehicle-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    console.log('Upload successful, getting public URL...');
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(filePath);

    console.log('Public URL generated:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Upload image to a temporary folder before the listing is created
// Path: vehicle-images/temp/{tempId}/{filename}
export const uploadTempImage = async (
  file: File,
  tempId: string,
  index: number
) => {
  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const safeName = `${Date.now()}_${index}.${fileExt}`;
    const filePath = `temp/${tempId}/${safeName}`;

    const { error } = await supabase.storage
      .from('vehicle-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('vehicle-images')
      .getPublicUrl(filePath);

    return { publicUrl: urlData.publicUrl, path: filePath };
  } catch (error) {
    throw error;
  }
};

// Delete image from Supabase Storage
export const deleteImage = async (filePath: string) => {
  try {
    const { error } = await supabase.storage
      .from('vehicle-images')
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}; 