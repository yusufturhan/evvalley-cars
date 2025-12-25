"use client";

import { useRef, useState, useEffect } from "react";
import { uploadTempVideo } from "@/lib/storage";
import { Upload } from "lucide-react";

interface VideoUploadProps {
  value?: string | null;
  onChange?: (url: string | null) => void;
  maxDurationSec?: number; // default 60
  maxSizeMB?: number; // default 50
}

export default function VideoUpload({ value, onChange, maxDurationSec = 60, maxSizeMB = 50 }: VideoUploadProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tempIdRef = useRef<string>(crypto.randomUUID());

  // Restore video URL from localStorage on mount
  useEffect(() => {
    const savedVideo = localStorage.getItem('sellFormVideo');
    if (savedVideo && !videoUrl) {
      setVideoUrl(savedVideo);
      onChange?.(savedVideo);
      console.log('🎥 Video restored from localStorage');
    }
  }, []);

  // Save video URL to localStorage when it changes
  useEffect(() => {
    if (videoUrl) {
      localStorage.setItem('sellFormVideo', videoUrl);
    }
  }, [videoUrl]);

  const pickFile = () => inputRef.current?.click();

  const validateAndUpload = async (file: File) => {
    setError(null);
    
    try {
      // Check file size
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setError(`Video too large. Max ${maxSizeMB}MB.`);
        return;
      }

      // Check file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file.');
        return;
      }

      // Validate video duration
      const url = URL.createObjectURL(file);
      const probe = document.createElement('video');
      probe.preload = 'metadata';
      probe.src = url;
      
      await new Promise((res, rej) => {
        probe.onloadedmetadata = () => {
          const duration = probe.duration;
          URL.revokeObjectURL(url);
          if (duration > maxDurationSec + 0.5) {
            setError(`Video is ${Math.round(duration)}s. Max ${maxDurationSec}s.`);
            rej(new Error('too long'));
          } else {
            res(null);
          }
        };
        probe.onerror = () => {
          URL.revokeObjectURL(url);
          setError('Invalid video file. Please try another video.');
          rej(new Error('metadata error'));
        };
      });

      // If we get here, validation passed
      setUploading(true);
      try {
        const { publicUrl } = await uploadTempVideo(file, tempIdRef.current);
        setVideoUrl(publicUrl);
        onChange?.(publicUrl);
        console.log('🎥 Video uploaded successfully');
      } catch (e: any) {
        console.error('Video upload failed:', e);
        setError(e?.message || 'Upload failed. Please try again.');
      } finally {
        setUploading(false);
      }
    } catch (error) {
      console.error('Video validation failed:', error);
      setError('Video validation failed. Please try another video.');
    }
  };

  const onDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) await validateAndUpload(file);
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
      {!videoUrl && (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) validateAndUpload(file);
            }}
          />
          <div className="space-y-2">
            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <p className="text-lg font-medium text-gray-900">Upload short video</p>
              <p className="text-sm text-gray-500">Drag and drop a file here, or click to select</p>
              <p className="text-xs text-gray-400 mt-1">One video, ≤ {maxDurationSec}s, ≤ {maxSizeMB}MB</p>
            </div>
            <button
              type="button"
              onClick={pickFile}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Select Video
            </button>
            {uploading && (
              <div className="mt-3 text-sm text-gray-700">Uploading...</div>
            )}
          </div>
        </div>
      )}

      {videoUrl && (
        <div className="space-y-2">
          <video src={videoUrl} controls playsInline className="w-full rounded-lg max-h-64 bg-black" />
          <div className="flex gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-1.5 bg-gray-100 rounded">Replace</button>
            <button
              type="button"
              onClick={() => { 
                setVideoUrl(null); 
                onChange?.(null);
                localStorage.removeItem('sellFormVideo');
                console.log('🎥 Video removed and localStorage cleared');
              }}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded"
            >Remove</button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) validateAndUpload(file);
            }}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}


