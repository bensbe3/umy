import { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import './ImageUpload.css';

interface ImageUploadProps {
  bucket: 'article-images' | 'actualite-images' | 'profile-images';
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  label?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  bucket,
  onUploadComplete,
  currentImage,
  label = 'Upload Image',
  maxSizeMB = 5
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`Image size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    if (!supabase) {
      toast.error('Storage not configured');
      return;
    }

    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      console.log('=== IMAGE UPLOAD SUCCESS ===');
      console.log('File path:', filePath);
      console.log('Public URL:', publicUrl);
      console.log('Bucket:', bucket);

      onUploadComplete(publicUrl);
      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      
      if (error.message?.includes('not found')) {
        toast.error(`Storage bucket "${bucket}" not found. Please create it in Supabase Dashboard.`);
      } else if (error.message?.includes('policy')) {
        toast.error('Upload permission denied. Please check storage policies.');
      } else {
        toast.error(error.message || 'Failed to upload image');
      }
      
      setPreview(currentImage || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="image-upload-container">
      <label className="image-upload-label">{label}</label>
      
      {preview ? (
        <div className="image-upload-preview-container">
          <img src={preview} alt="Preview" className="image-upload-preview" />
          <div className="image-upload-overlay">
            <button
              type="button"
              onClick={handleRemove}
              className="image-upload-remove-btn"
              disabled={uploading}
            >
              <X size={20} />
              Remove
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="image-upload-change-btn"
              disabled={uploading}
            >
              <Upload size={20} />
              Change
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="image-upload-button"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon size={24} />
              <span>Click to upload image</span>
              <span className="image-upload-hint">
                PNG, JPG, WebP up to {maxSizeMB}MB
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="image-upload-input"
        disabled={uploading}
      />
    </div>
  );
}
