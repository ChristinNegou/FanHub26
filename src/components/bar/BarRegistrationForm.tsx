'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Loader2, CheckCircle2, AlertCircle, ImagePlus, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { MAPBOX_TOKEN } from '@/lib/mapbox/config';

interface FormData {
  name: string;
  phone: string;
  website: string;
  instagram: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
  has_sound: boolean;
  has_projector: boolean;
  has_outdoor: boolean;
  has_food: boolean;
  num_screens: number;
  capacity: string;
  atmosphere: string;
  description_fr: string;
  description_en: string;
  cover_image_url: string | null;
  logo_url: string | null;
}

const PROVINCES = [
  { value: 'QC', label: 'Québec' },
  { value: 'ON', label: 'Ontario' },
  { value: 'BC', label: 'Colombie-Britannique' },
  { value: 'AB', label: 'Alberta' },
  { value: 'MB', label: 'Manitoba' },
  { value: 'SK', label: 'Saskatchewan' },
  { value: 'NS', label: 'Nouvelle-Écosse' },
  { value: 'NB', label: 'Nouveau-Brunswick' },
  { value: 'NL', label: 'Terre-Neuve-et-Labrador' },
  { value: 'PE', label: 'Île-du-Prince-Édouard' },
  { value: 'YT', label: 'Yukon' },
  { value: 'NT', label: 'Territoires du Nord-Ouest' },
  { value: 'NU', label: 'Nunavut' },
];

const ATMOSPHERES = [
  { value: 'sports_bar', label: 'Bar sportif' },
  { value: 'pub', label: 'Pub' },
  { value: 'lively', label: 'Festif / animé' },
  { value: 'chill', label: 'Décontracté' },
];

const initial: FormData = {
  name: '', phone: '', website: '', instagram: '',
  address: '', city: '', province: 'QC', postal_code: '',
  latitude: null, longitude: null,
  has_sound: false, has_projector: false, has_outdoor: false, has_food: false,
  num_screens: 1, capacity: '', atmosphere: '', description_fr: '', description_en: '',
  cover_image_url: null, logo_url: null,
};

interface BarRegistrationFormProps {
  locale: string;
}

export function BarRegistrationForm({ locale }: BarRegistrationFormProps) {
  const isFr = locale === 'fr';
  const router = useRouter();

  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [geocoding, setGeocoding] = useState(false);
  const [geocoded, setGeocoded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const set = (field: keyof FormData, value: unknown) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
    if (field === 'address' || field === 'city' || field === 'province') {
      setGeocoded(false);
    }
  };

  const geocodeAddress = async () => {
    if (!form.address || !form.city || !form.province) {
      setErrors((e) => ({ ...e, address: isFr ? 'Remplis l\'adresse, la ville et la province' : 'Fill in address, city and province' }));
      return;
    }

    setGeocoding(true);
    const query = `${form.address}, ${form.city}, ${form.province}, Canada`;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=CA&limit=1`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].center;
        set('latitude', lat);
        set('longitude', lng);
        setGeocoded(true);
        setErrors((e) => { const n = { ...e }; delete n.address; return n; });
      } else {
        setErrors((e) => ({ ...e, address: isFr ? 'Adresse introuvable — vérifie l\'orthographe' : 'Address not found — check spelling' }));
      }
    } catch {
      setErrors((e) => ({ ...e, address: isFr ? 'Erreur de géocodage' : 'Geocoding error' }));
    } finally {
      setGeocoding(false);
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = isFr ? 'Nom requis' : 'Name required';
    if (!form.address.trim()) e.address = isFr ? 'Adresse requise' : 'Address required';
    if (!form.city.trim()) e.city = isFr ? 'Ville requise' : 'City required';
    if (!form.province) e.province = isFr ? 'Province requise' : 'Province required';
    if (!geocoded || form.latitude === null) e.address = isFr ? 'Clique sur "Vérifier l\'adresse" d\'abord' : 'Click "Verify address" first';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/bars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          city: form.city,
          province: form.province,
          postal_code: form.postal_code,
          phone: form.phone,
          website: form.website,
          instagram: form.instagram,
          latitude: form.latitude,
          longitude: form.longitude,
          has_sound: form.has_sound,
          has_projector: form.has_projector,
          has_outdoor: form.has_outdoor,
          has_food: form.has_food,
          num_screens: form.num_screens,
          capacity: form.capacity ? parseInt(form.capacity) : null,
          atmosphere: form.atmosphere || null,
          description_fr: form.description_fr,
          description_en: form.description_en,
          cover_image_url: form.cover_image_url,
          logo_url: form.logo_url,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error?.message ?? (isFr ? 'Une erreur est survenue' : 'An error occurred'));
        return;
      }

      router.push(`/${locale}/bar/dashboard`);
    } catch {
      setSubmitError(isFr ? 'Erreur réseau — réessaie' : 'Network error — try again');
    } finally {
      setSubmitting(false);
    }
  };

  // Center-crop to square then scale to target size
  const cropToSquare = (file: File, size: number): Promise<Blob> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const { width, height } = img;
        const side = Math.min(width, height);
        const sx = Math.round((width - side) / 2);
        const sy = Math.round((height - side) / 2);
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d')!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        canvas.toBlob(
          (blob) => blob ? resolve(blob) : reject(new Error('toBlob failed')),
          'image/webp',
          0.92,
        );
      };
      img.onerror = reject;
      img.src = objectUrl;
    });

  const uploadImage = async (
    file: File,
    field: 'cover_image_url' | 'logo_url',
    setUploading: (v: boolean) => void,
  ) => {
    setUploading(true);
    try {
      const size = field === 'logo_url' ? 400 : 800;
      const blob = await cropToSquare(file, size);
      const supabase = createClient();
      const path = `${Date.now()}-${field}.webp`;
      const { data, error } = await supabase.storage
        .from('bar-images')
        .upload(path, blob, { contentType: 'image/webp', upsert: true });
      if (error) {
        setErrors((e) => ({ ...e, [field]: isFr ? 'Erreur upload' : 'Upload error' }));
      } else {
        const { data: { publicUrl } } = supabase.storage.from('bar-images').getPublicUrl(data.path);
        set(field, publicUrl);
      }
    } catch {
      setErrors((e) => ({ ...e, [field]: isFr ? 'Erreur de traitement de l\'image' : 'Image processing error' }));
    } finally {
      setUploading(false);
    }
  };

  const ToggleChip = ({ field, label }: { field: keyof FormData; label: string }) => (
    <button
      type="button"
      onClick={() => set(field, !form[field])}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
        form[field]
          ? 'bg-primary-700 text-white border-primary-700'
          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-primary-400'
      }`}
    >
      {label}
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Section 1: Infos générales */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
          {isFr ? '1. Informations générales' : '1. General info'}
        </h2>
        <Input
          label={isFr ? 'Nom du bar *' : 'Bar name *'}
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
          placeholder="Le Footballeur"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={isFr ? 'Téléphone' : 'Phone'}
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="+1 418 555-0100"
            type="tel"
          />
          <Input
            label="Site web"
            value={form.website}
            onChange={(e) => set('website', e.target.value)}
            placeholder="https://..."
            type="url"
          />
        </div>
        <Input
          label="Instagram"
          value={form.instagram}
          onChange={(e) => set('instagram', e.target.value)}
          placeholder="@lefoothubmtl"
        />
      </section>

      {/* Section 2: Localisation */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
          {isFr ? '2. Localisation' : '2. Location'}
        </h2>
        <Input
          label={isFr ? 'Adresse *' : 'Address *'}
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
          error={errors.address}
          placeholder="123 Rue Sainte-Catherine"
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label={isFr ? 'Ville *' : 'City *'}
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              error={errors.city}
              placeholder={isFr ? 'Montréal' : 'Montreal'}
            />
          </div>
          <Select
            label={isFr ? 'Province *' : 'Province *'}
            value={form.province}
            onChange={(e) => set('province', e.target.value)}
            error={errors.province}
          >
            {PROVINCES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </Select>
        </div>
        <Input
          label={isFr ? 'Code postal' : 'Postal code'}
          value={form.postal_code}
          onChange={(e) => set('postal_code', e.target.value)}
          placeholder="H2X 1Y4"
          className="max-w-[160px]"
        />

        {/* Geocode button */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={geocodeAddress}
            disabled={geocoding}
          >
            {geocoding ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4 mr-2" />
            )}
            {isFr ? 'Vérifier l\'adresse' : 'Verify address'}
          </Button>

          {geocoded && form.latitude && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              {isFr
                ? `Localisé : ${form.latitude.toFixed(4)}, ${form.longitude!.toFixed(4)}`
                : `Located: ${form.latitude.toFixed(4)}, ${form.longitude!.toFixed(4)}`}
            </span>
          )}
        </div>
      </section>

      {/* Section 3: Caractéristiques */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
          {isFr ? '3. Caractéristiques' : '3. Features'}
        </h2>
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {isFr ? 'Ce que vous offrez' : 'What you offer'}
          </p>
          <div className="flex flex-wrap gap-2">
            <ToggleChip field="has_sound" label={isFr ? '🔊 Son activé' : '🔊 Sound on'} />
            <ToggleChip field="has_projector" label={isFr ? '📺 Écran géant' : '📺 Big screen'} />
            <ToggleChip field="has_outdoor" label={isFr ? '🌿 Terrasse' : '🌿 Outdoor'} />
            <ToggleChip field="has_food" label={isFr ? '🍔 Nourriture' : '🍔 Food'} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {isFr ? 'Nombre d\'écrans' : 'Number of screens'}
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={form.num_screens}
              onChange={(e) => set('num_screens', parseInt(e.target.value) || 1)}
              className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 w-24"
            />
          </div>
          <Input
            label={isFr ? 'Capacité (personnes)' : 'Capacity (people)'}
            value={form.capacity}
            onChange={(e) => set('capacity', e.target.value)}
            type="number"
            min={10}
            max={5000}
            placeholder="150"
          />
        </div>

        <Select
          label={isFr ? 'Ambiance' : 'Atmosphere'}
          value={form.atmosphere}
          onChange={(e) => set('atmosphere', e.target.value)}
        >
          <option value="">{isFr ? '— Choisir —' : '— Choose —'}</option>
          {ATMOSPHERES.map((a) => (
            <option key={a.value} value={a.value}>{a.label}</option>
          ))}
        </Select>
      </section>

      {/* Section 4: Description */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
          {isFr ? '4. Description (optionnel)' : '4. Description (optional)'}
        </h2>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {isFr ? 'Description en français' : 'French description'}
          </label>
          <textarea
            value={form.description_fr}
            onChange={(e) => set('description_fr', e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder={isFr ? 'Bar sportif au cœur du Plateau...' : 'Sports bar in the heart of...'}
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {isFr ? 'Description en anglais' : 'English description'}
          </label>
          <textarea
            value={form.description_en}
            onChange={(e) => set('description_en', e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder="Sports bar in the heart of..."
            className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          />
        </div>
      </section>

      {/* Section 5: Photos */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
          {isFr ? '5. Photos (optionnel)' : '5. Photos (optional)'}
        </h2>

        {/* Cover image */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {isFr ? 'Photo de couverture' : 'Cover photo'}
          </label>
          {form.cover_image_url ? (
            <div className="relative w-48 h-48 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <img src={form.cover_image_url} alt="cover" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => set('cover_image_url', null)}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className={`flex flex-col items-center justify-center w-48 h-48 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              uploadingCover ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 bg-white dark:bg-slate-800'
            }`}>
              {uploadingCover ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary-700" />
              ) : (
                <>
                  <ImagePlus className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isFr ? 'Cliquer pour uploader (max 5 Mo)' : 'Click to upload (max 5 MB)'}
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file, 'cover_image_url', setUploadingCover);
                }}
              />
            </label>
          )}
          {errors.cover_image_url && (
            <p className="text-xs text-red-600">{errors.cover_image_url}</p>
          )}
        </div>

        {/* Logo */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {isFr ? 'Logo du bar' : 'Bar logo'}
          </label>
          {form.logo_url ? (
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
              <img src={form.logo_url} alt="logo" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => set('logo_url', null)}
                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <label className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
              uploadingLogo ? 'border-primary-300 bg-primary-50 dark:bg-primary-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-primary-400 bg-white dark:bg-slate-800'
            }`}>
              {uploadingLogo ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary-700" />
              ) : (
                <ImagePlus className="w-5 h-5 text-slate-400" />
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadImage(file, 'logo_url', setUploadingLogo);
                }}
              />
            </label>
          )}
          {errors.logo_url && (
            <p className="text-xs text-red-600">{errors.logo_url}</p>
          )}
        </div>
      </section>

      {/* Submit */}
      {submitError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {submitError}
        </div>
      )}

      <Button type="submit" size="lg" disabled={submitting} className="self-start">
        {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isFr ? 'Inscrire mon bar gratuitement' : 'Register my bar for free'}
      </Button>
    </form>
  );
}
