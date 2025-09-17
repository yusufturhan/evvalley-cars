"use client";

import { useRef, useState } from "react";
import { uploadTempVideo } from "@/lib/storage";

interface VideoUploadProps {
  value?: string | null;
  onChange?: (url: string | null) => void;
  maxDurationSec?: number; // default 60
  maxSizeMB?: number; // default 50
}

export default function VideoUpload({ value, onChange, maxDurationSec = 60, maxSizeMB = 50 }: VideoUploadProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(value || null);
  const [tempUrl, setTempUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tempIdRef = useRef<string>(crypto.randomUUID());

  const pickFile = () => inputRef.current?.click();

  const handleFile = async (file: File) => {
    setError(null);
    // Size check
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`Video too large. Max ${maxSizeMB}MB.`);
      return;
    }

    // Duration check using HTMLVideoElement
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = url;
    await new Promise((res, rej) => {
      video.onloadedmetadata = () => {
        const duration = video.duration;
        URL.revokeObjectURL(url);
        if (duration > maxDurationSec + 0.5) {
          setError(`Video is ${Math.round(duration)}s. Max ${maxDurationSec}s.`);
          rej(new Error('too long'));
        } else {
          res(null);
        }
      };
      video.onerror = () => rej(new Error('metadata error'));
    }).catch(() => undefined);
    if (error) return;

    setUploading(true);
    try {
      const { publicUrl } = await uploadTempVideo(file, tempIdRef.current);
      setVideoUrl(publicUrl);
      setTempUrl(publicUrl);
      onChange?.(publicUrl);
    } catch (e: any) {
      setError(e?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {!videoUrl ? (
        <button type="button" onClick={pickFile} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Upload short video (≤ {maxDurationSec}s, ≤ {maxSizeMB}MB)
        </button>
      ) : (
        <div className="space-y-2">
          <video src={videoUrl} controls playsInline className="w-full rounded-lg max-h-64 bg-black" />
          <div className="flex gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-1.5 bg-gray-100 rounded">Replace</button>
            <button
              type="button"
              onClick={() => { setVideoUrl(null); onChange?.(null); }}
              className="px-3 py-1.5 bg-red-100 text-red-700 rounded"
            >Remove</button>
          </div>
        </div>
      )}

      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}


