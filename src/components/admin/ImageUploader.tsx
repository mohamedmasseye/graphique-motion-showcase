import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, Image as ImageIcon, GripVertical } from 'lucide-react';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  folder?: string;
  max?: number;
}

const CLOUD_NAME = 'dgnc9ha2n';

export default function ImageUploader({ images, onChange, folder = 'products', max = 8 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      // Get signature from our secure worker
      const sigRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
      });

      if (!sigRes.ok) {
        // Fallback: unsigned upload directly to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'ml_default');
        formData.append('folder', folder);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        return data.secure_url;
      }

      const { signature, timestamp, api_key } = await sigRes.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('api_key', api_key);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error('Upload error:', err);
      return null;
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter(f => f.type.startsWith('image/')).slice(0, max - images.length);
    if (fileArray.length === 0) return;

    setUploading(true);
    const results = await Promise.all(fileArray.map(uploadFile));
    const urls = results.filter(Boolean) as string[];
    onChange([...images, ...urls]);
    setUploading(false);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="block text-white/50 text-xs font-semibold uppercase tracking-widest mb-2">
        Images ({images.length}/{max})
      </label>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {images.map((url, i) => (
            <div key={url + i} className="relative group aspect-square rounded-lg overflow-hidden bg-white/[0.06]">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white/70 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[8px] bg-brand-teal/80 text-white px-1.5 py-0.5 rounded font-bold">
                  Principal
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {images.length < max && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-brand-teal bg-brand-teal/5'
              : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="text-brand-teal animate-spin" />
              <p className="text-white/40 text-xs">Upload en cours...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} className="text-white/20" />
              <p className="text-white/40 text-xs">
                Glissez vos images ici ou <span className="text-brand-teal">parcourir</span>
              </p>
              <p className="text-white/20 text-[10px]">PNG, JPG, WebP — max 10 MB</p>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}
