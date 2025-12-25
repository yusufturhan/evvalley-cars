"use client";

import { useState, useRef, useEffect } from "react";
import { uploadTempImage } from "@/lib/storage";
import { Upload, X, Image as ImageIcon, Move } from "lucide-react";

interface ImageUploadProps {
  onImagesChange?: (images: File[]) => void; // legacy
  onUrlsChange?: (urls: string[]) => void;   // new: uploaded URLs
  maxImages?: number;
}

export default function ImageUpload({ onImagesChange, onUrlsChange, maxImages = 5 }: ImageUploadProps) {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tempIdRef = useRef<string>(crypto.randomUUID());

  // Image compression function with error handling
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          try {
            // Calculate new dimensions (max 1920px width)
            const maxWidth = 1920;
            const maxHeight = 1080;
            let { width, height } = img;
            
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
            
            canvas.width = width;
            canvas.height = height;
            
            // Draw and compress
            ctx?.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                resolve(file); // Fallback to original file
              }
            }, 'image/jpeg', 0.8);
          } catch (error) {
            console.error('Error compressing image:', error);
            resolve(file); // Fallback to original file
          }
        };
        
        img.onerror = () => {
          console.error('Error loading image for compression');
          resolve(file); // Fallback to original file
        };
        
        img.src = URL.createObjectURL(file);
      } catch (error) {
        console.error('Error setting up compression:', error);
        resolve(file); // Fallback to original file
      }
    });
  };

  // Restore uploaded URLs from localStorage on mount
  useEffect(() => {
    const savedUrls = localStorage.getItem('sellFormImages');
    if (savedUrls) {
      try {
        const parsed = JSON.parse(savedUrls);
        setUploadedUrls(parsed);
        // Create previews from saved URLs
        setPreviews(parsed);
        console.log('🖼️ Images restored from localStorage:', parsed.length);
      } catch (error) {
        console.error('❌ Error parsing saved images:', error);
      }
    }
  }, []);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (images.length + imageFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    // No file size limit - users can upload any size
    // Compression is available but not actively used to avoid issues

    const newImages = [...images, ...imageFiles];
    setImages(newImages);
    if (onImagesChange) onImagesChange(newImages);

    // upload sequentially to avoid big payloads
    setUploading(true);
    const urls: string[] = [...uploadedUrls];
    let completed = 0;
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      try {
        const { publicUrl } = await uploadTempImage(file, tempIdRef.current, uploadedUrls.length + i);
        urls.push(publicUrl);
      } catch (e) {
        console.error('Image upload failed:', e);
      } finally {
        completed += 1;
        setProgress(Math.round((completed / imageFiles.length) * 100));
      }
    }
    setUploadedUrls(urls);
    
    // Update localStorage
    localStorage.setItem('sellFormImages', JSON.stringify(urls));
    
    if (onUrlsChange) onUrlsChange(urls);
    setUploading(false);

    // Create previews
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    const newUrls = uploadedUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviews(newPreviews);
    setUploadedUrls(newUrls);
    
    // Update localStorage
    localStorage.setItem('sellFormImages', JSON.stringify(newUrls));
    
    if (onImagesChange) onImagesChange(newImages);
    if (onUrlsChange) onUrlsChange(newUrls);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (images.length + imageFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    const newImages = [...images, ...imageFiles];
    setImages(newImages);
    if (onImagesChange) onImagesChange(newImages);

    // upload sequentially to avoid big payloads
    setUploading(true);
    const urls: string[] = [...uploadedUrls];
    let completed = 0;
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      try {
        const { publicUrl } = await uploadTempImage(file, tempIdRef.current, uploadedUrls.length + i);
        urls.push(publicUrl);
      } catch (e) {
        console.error('Image upload failed:', e);
      } finally {
        completed += 1;
        setProgress(Math.round((completed / imageFiles.length) * 100));
      }
    }
    setUploadedUrls(urls);
    
    // Update localStorage
    localStorage.setItem('sellFormImages', JSON.stringify(urls));
    
    if (onUrlsChange) onUrlsChange(urls);
    setUploading(false);

    // Create previews
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Drag and drop reordering functions
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverReorder = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const applyReorder = (from: number, to: number) => {
    if (from === to || from < 0 || to < 0 || from >= images.length || to >= images.length) return;
    const newImages = [...images];
    const newPreviews = [...previews];
    const newUrls = [...uploadedUrls];
    const draggedImage = newImages[from];
    const draggedPreview = newPreviews[from];
    const draggedUrl = newUrls[from];
    newImages.splice(from, 1);
    newPreviews.splice(from, 1);
    newUrls.splice(from, 1);
    newImages.splice(to, 0, draggedImage);
    newPreviews.splice(to, 0, draggedPreview);
    newUrls.splice(to, 0, draggedUrl);
    setImages(newImages);
    setPreviews(newPreviews);
    setUploadedUrls(newUrls);
    
    // Update localStorage
    localStorage.setItem('sellFormImages', JSON.stringify(newUrls));
    
    if (onImagesChange) onImagesChange(newImages);
    if (onUrlsChange) onUrlsChange(newUrls);
  };

  const handleDropReorder = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }
    applyReorder(draggedIndex, dropIndex);
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        
        <div className="space-y-2">
          <Upload className="h-12 w-12 text-gray-400 mx-auto" />
          <div>
            <p className="text-lg font-medium text-gray-900">
              Upload Vehicle Images
            </p>
            <p className="text-sm text-gray-500">
              Drag and drop images here, or click to select files
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Maximum {maxImages} images (large images will be compressed)
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Select Images
          </button>
          {uploading && (
            <div className="mt-3 text-sm text-gray-700">Uploading... {progress}%</div>
          )}
        </div>
      </div>

      {/* Image Previews with Reordering */}
      {previews.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Image Order (First image = Cover Photo)</h4>
            <p className="text-xs text-gray-500">Drag to reorder</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div 
                key={index} 
                className={`relative group cursor-move ${
                  draggedIndex === index ? 'opacity-50' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOverReorder}
                onDrop={(e) => handleDropReorder(e, index)}
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                
                {/* Cover Photo Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-8 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Cover
                  </div>
                )}
                
                {/* Position Number */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                  {index + 1}
                </div>
                
                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-100 z-10"
                >
                  <X className="h-4 w-4" />
                </button>
                
                {/* Drag Handle */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white rounded-full p-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <Move className="h-4 w-4" />
                </div>

                {/* Mobile-friendly controls - also show on web for consistency */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                  <button
                    type="button"
                    aria-label="Move left"
                    onClick={() => applyReorder(index, Math.max(0, index - 1))}
                    className="bg-white text-gray-800 rounded px-2 py-0.5 text-xs shadow hover:bg-gray-100"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    aria-label="Move right"
                    onClick={() => applyReorder(index, Math.min(previews.length - 1, index + 1))}
                    className="bg-white text-gray-800 rounded px-2 py-0.5 text-xs shadow hover:bg-gray-100"
                  >
                    ▶
                  </button>
                  <button
                    type="button"
                    aria-label="Set as cover"
                    onClick={() => applyReorder(index, 0)}
                    className="bg-green-600 text-white rounded px-2 py-0.5 text-xs shadow hover:bg-green-700"
                  >
                    Set cover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <p className="text-sm text-gray-500">
          {images.length} of {maxImages} images selected
        </p>
      )}

      {uploadedUrls.length > 0 && (
        <p className="text-xs text-gray-500">Uploaded: {uploadedUrls.length} images</p>
      )}
    </div>
  );
} 