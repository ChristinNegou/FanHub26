'use client';

import { useRef, useState } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  photos: string[];
  logo: string | null;
  onPhotosChange: (urls: string[]) => void;
  onLogoChange: (url: string | null) => void;
  locale: string;
}

function resizeImage(file: File, maxW: number, maxH: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(src);
      let { width, height } = img;
      const ratio = Math.min(maxW / width, maxH / height, 1);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('toBlob failed')),
        'image/webp',
        0.88,
      );
    };
    img.onerror = reject;
    img.src = src;
  });
}

async function uploadBlob(blob: Blob, prefix: string): Promise<string | null> {
  const supabase = createClient();
  const path = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
  const { data, error } = await supabase.storage
    .from('bar-images')
    .upload(path, blob, { contentType: 'image/webp', upsert: true });
  if (error) return null;
  const { data: { publicUrl } } = supabase.storage.from('bar-images').getPublicUrl(data.path);
  return publicUrl;
}

export function PhotoGalleryEditor({ photos, logo, onPhotosChange, onLogoChange, locale }: Props) {
  const isFr = locale === 'fr';
  const photoRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handlePhotosSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = 10 - photos.length;
    if (remaining <= 0) return;
    const toProcess = Array.from(files).slice(0, remaining);
    setUploading(true);
    setUploadError(null);
    setProgress(0);
    const uploaded: string[] = [];
    for (let i = 0; i < toProcess.length; i++) {
      try {
        const blob = await resizeImage(toProcess[i], 1600, 1200);
        const url = await uploadBlob(blob, 'photo');
        if (url) uploaded.push(url);
      } catch { /* skip failed file */ }
      setProgress(Math.round(((i + 1) / toProcess.length) * 100));
    }
    if (uploaded.length === 0) {
      setUploadError(isFr ? 'Échec de l\'upload — réessayez' : 'Upload failed — try again');
    } else {
      onPhotosChange([...photos, ...uploaded]);
    }
    setUploading(false);
    setProgress(0);
    if (photoRef.current) photoRef.current.value = '';
  };

  const handleLogoSelected = async (file: File) => {
    setUploadingLogo(true);
    try {
      const blob = await resizeImage(file, 400, 400);
      const url = await uploadBlob(blob, 'logo');
      if (url) onLogoChange(url);
    } catch { /* ignore */ }
    setUploadingLogo(false);
    if (logoRef.current) logoRef.current.value = '';
  };

  const removePhoto = (i: number) => onPhotosChange(photos.filter((_, j) => j !== i));

  const moveLeft = (i: number) => {
    if (i === 0) return;
    const arr = [...photos];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    onPhotosChange(arr);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Photos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {isFr ? 'Photos du bar' : 'Bar photos'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isFr
                ? 'La 1ère photo sera la couverture. Survol → ← pour réordonner, × pour supprimer.'
                : '1st photo is the cover. Hover → ← to reorder, × to remove.'}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{photos.length}/10</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {photos.map((url, i) => (
            <div key={url + i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <img src={url} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded pointer-events-none">
                  {isFr ? 'Couverture' : 'Cover'}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {i > 0 && (
                  <button type="button" onClick={() => moveLeft(i)}
                    title={isFr ? 'Vers la gauche' : 'Move left'}
                    className="bg-white/90 text-slate-800 rounded-full w-7 h-7 flex items-center justify-center font-bold text-sm hover:bg-white">
                    ←
                  </button>
                )}
                <button type="button" onClick={() => removePhoto(i)}
                  title={isFr ? 'Supprimer' : 'Remove'}
                  className="bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {photos.length < 10 && (
            <label className={`aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
              uploading
                ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20'
                : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 bg-white dark:bg-slate-800'
            }`}>
              {uploading ? (
                <div className="flex flex-col items-center gap-1">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-700" />
                  {progress > 0 && <span className="text-xs text-primary-700 font-medium">{progress}%</span>}
                </div>
              ) : (
                <ImagePlus className="w-5 h-5 text-slate-400" />
              )}
              <input ref={photoRef} type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => handlePhotosSelected(e.target.files)} />
            </label>
          )}
        </div>

        {photos.length === 0 && !uploading && (
          <label className="mt-2 flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-primary-400 bg-white dark:bg-slate-800 cursor-pointer transition-colors">
            <ImagePlus className="w-7 h-7 text-slate-400 mb-1" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {isFr ? 'Cliquer pour ajouter des photos' : 'Click to add photos'}
            </span>
            <span className="text-xs text-slate-400 mt-0.5">
              {isFr ? 'JPG, PNG, HEIC — sélection multiple possible' : 'JPG, PNG, HEIC — multiple selection allowed'}
            </span>
            <input ref={photoRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => handlePhotosSelected(e.target.files)} />
          </label>
        )}

        {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
      </div>

      {/* Logo */}
      <div>
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {isFr ? 'Logo (optionnel)' : 'Logo (optional)'}
        </p>
        {logo ? (
          <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
            <button type="button" onClick={() => onLogoChange(null)}
              className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 hover:bg-black/80">
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <label className={`flex items-center justify-center w-16 h-16 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
            uploadingLogo
              ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20'
              : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 bg-white dark:bg-slate-800'
          }`}>
            {uploadingLogo
              ? <Loader2 className="w-4 h-4 animate-spin text-primary-700" />
              : <ImagePlus className="w-4 h-4 text-slate-400" />}
            <input ref={logoRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLogoSelected(f); }} />
          </label>
        )}
      </div>
    </div>
  );
}
