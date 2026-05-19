'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  BarChart3, MapPin, Star, Users, Loader2,
  CheckCircle2, PlusCircle, ExternalLink, Sparkles, ChevronDown,
  Pencil, Trash2, X, AlertTriangle, ShieldCheck, Clock, ChevronUp,
} from 'lucide-react';
import { MAPBOX_TOKEN } from '@/lib/mapbox/config';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { PhotoGalleryEditor } from '@/components/bar/PhotoGalleryEditor';
import type { Bar } from '@/lib/types/bar';

const PROVINCES = [
  { value: 'QC', label: 'Québec' }, { value: 'ON', label: 'Ontario' },
  { value: 'BC', label: 'Colombie-Britannique' }, { value: 'AB', label: 'Alberta' },
  { value: 'MB', label: 'Manitoba' }, { value: 'SK', label: 'Saskatchewan' },
  { value: 'NS', label: 'Nouvelle-Écosse' }, { value: 'NB', label: 'Nouveau-Brunswick' },
  { value: 'NL', label: 'Terre-Neuve-et-Labrador' }, { value: 'PE', label: 'Î.-P.-É.' },
  { value: 'YT', label: 'Yukon' }, { value: 'NT', label: 'T.N.-O.' }, { value: 'NU', label: 'Nunavut' },
];

const ATMOSPHERES = [
  { value: 'sports_bar', label: 'Bar sportif' },
  { value: 'pub', label: 'Pub' },
  { value: 'lively', label: 'Festif / animé' },
  { value: 'chill', label: 'Décontracté' },
];

interface EditForm {
  name: string; phone: string; website: string; instagram: string;
  address: string; city: string; province: string; postal_code: string;
  latitude: number; longitude: number;
  has_sound: boolean; has_projector: boolean; has_outdoor: boolean; has_food: boolean;
  num_screens: number; capacity: string; atmosphere: string;
  description_fr: string; description_en: string;
  photo_urls: string[]; logo_url: string | null;
}

interface ReviewRow {
  rating: number;
  comment: string | null;
  atmosphere_rating: number | null;
  sound_quality_rating: number | null;
  created_at: string;
}

interface MatchRow {
  id: string;
  match_number: number;
  home_team_name_fr: string | null;
  home_team_name_en: string | null;
  away_team_name_fr: string | null;
  away_team_name_en: string | null;
  home_team_placeholder: string | null;
  away_team_placeholder: string | null;
  kickoff_utc: string;
  venue_city: string;
}

export default function BarDashboardPage({ params: { locale } }: { params: { locale: string } }) {
  const isFr = locale === 'fr';
  const router = useRouter();
  const searchParams = useSearchParams();
  const showFeaturedSuccess = searchParams.get('featured') === 'success';
  const { user, loading: authLoading, signOut } = useAuth();

  const [bars, setBars] = useState<Bar[]>([]);
  const [selectedBarId, setSelectedBarId] = useState<string | null>(null);
  const [barsLoading, setBarsLoading] = useState(true);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [selectedMatchIds, setSelectedMatchIds] = useState<Set<string>>(new Set());
  const [savingMatches, setSavingMatches] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewRow[]>([]);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editSection, setEditSection] = useState<'basic' | 'location' | 'features' | 'descriptions' | 'photos'>('basic');
  const [editForm, setEditForm] = useState<EditForm>({
    name: '', phone: '', website: '', instagram: '',
    address: '', city: '', province: 'QC', postal_code: '', latitude: 0, longitude: 0,
    has_sound: false, has_projector: false, has_outdoor: false, has_food: false,
    num_screens: 1, capacity: '', atmosphere: '', description_fr: '', description_en: '',
    photo_urls: [], logo_url: null,
  });
  const [editGeocoded, setEditGeocoded] = useState(true);
  const [editGeocoding, setEditGeocoding] = useState(false);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) router.push(`/${locale}/bar/register`);
  }, [user, authLoading, locale, router]);

  // Fetch all owner's bars
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from('bars')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        const result = data ?? [];
        setBars(result);
        if (result.length > 0) setSelectedBarId(result[0].id);
        setBarsLoading(false);
      });
  }, [user]);

  const bar = bars.find((b) => b.id === selectedBarId) ?? null;

  // Fetch matches + bar_matches when selected bar changes
  useEffect(() => {
    if (!bar) return;
    const supabase = createClient();
    setSelectedMatchIds(new Set());

    Promise.all([
      fetch('/api/matches').then((r) => r.json()),
      supabase.from('bar_matches').select('match_id').eq('bar_id', bar.id),
    ]).then(([matchData, { data: barMatchData }]) => {
      setMatches(matchData.matches ?? []);
      setSelectedMatchIds(new Set((barMatchData ?? []).map((bm: any) => bm.match_id)));
    });
  }, [bar?.id]);

  // Fetch reviews for the selected bar
  useEffect(() => {
    if (!bar) return;
    const supabase = createClient();
    supabase
      .from('bar_reviews')
      .select('rating, comment, atmosphere_rating, sound_quality_rating, created_at')
      .eq('bar_id', bar.id)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => setReviews(data ?? []));
  }, [bar?.id]);

  // Re-fetch bars after Stripe redirect to pick up is_featured update from webhook
  useEffect(() => {
    if (!showFeaturedSuccess || !user) return;
    const timer = setTimeout(() => {
      const supabase = createClient();
      supabase
        .from('bars')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: true })
        .then(({ data }) => { if (data) setBars(data); });
    }, 2500);
    return () => clearTimeout(timer);
  }, [showFeaturedSuccess, user]);

  const openEdit = () => {
    if (!bar) return;
    setEditForm({
      name: bar.name,
      phone: bar.phone ?? '',
      website: bar.website ?? '',
      instagram: bar.instagram ?? '',
      address: bar.address,
      city: bar.city,
      province: bar.province,
      postal_code: bar.postal_code ?? '',
      latitude: bar.latitude,
      longitude: bar.longitude,
      has_sound: bar.has_sound,
      has_projector: bar.has_projector,
      has_outdoor: bar.has_outdoor,
      has_food: bar.has_food,
      num_screens: bar.num_screens,
      capacity: bar.capacity?.toString() ?? '',
      atmosphere: bar.atmosphere ?? '',
      description_fr: bar.description_fr ?? '',
      description_en: bar.description_en ?? '',
      photo_urls: bar.cover_image_url
        ? [bar.cover_image_url, ...(bar.gallery_images ?? [])]
        : (bar.gallery_images ?? []),
      logo_url: bar.logo_url ?? null,
    });
    setEditGeocoded(true);
    setEditError(null);
    setEditSection('basic');
    setEditing(true);
  };

  const geocodeEditAddress = async () => {
    if (!editForm.address || !editForm.city || !editForm.province) return;
    setEditGeocoding(true);
    const query = `${editForm.address}, ${editForm.city}, ${editForm.province}, Canada`;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=CA&limit=1`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.features?.length > 0) {
        const [lng, lat] = data.features[0].center;
        setEditForm((f) => ({ ...f, latitude: lat, longitude: lng }));
        setEditGeocoded(true);
      } else {
        setEditGeocoded(false);
      }
    } finally {
      setEditGeocoding(false);
    }
  };

  const saveEdit = async () => {
    if (!bar || !editGeocoded) return;
    setEditSaving(true);
    setEditError(null);
    const res = await fetch(`/api/bars/${bar.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editForm.name,
        phone: editForm.phone || null,
        website: editForm.website || null,
        instagram: editForm.instagram || null,
        address: editForm.address,
        city: editForm.city,
        province: editForm.province,
        postal_code: editForm.postal_code || null,
        latitude: editForm.latitude,
        longitude: editForm.longitude,
        has_sound: editForm.has_sound,
        has_projector: editForm.has_projector,
        has_outdoor: editForm.has_outdoor,
        has_food: editForm.has_food,
        num_screens: editForm.num_screens,
        capacity: editForm.capacity ? parseInt(editForm.capacity) : null,
        atmosphere: editForm.atmosphere || null,
        description_fr: editForm.description_fr || null,
        description_en: editForm.description_en || null,
        cover_image_url: editForm.photo_urls[0] ?? null,
        gallery_images: editForm.photo_urls.slice(1),
        logo_url: editForm.logo_url,
      }),
    });
    if (res.ok) {
      const { bar: updated } = await res.json();
      setBars((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setEditing(false);
    } else {
      const d = await res.json();
      setEditError(d.error?.message ?? (isFr ? 'Erreur lors de la sauvegarde' : 'Save error'));
    }
    setEditSaving(false);
  };

  const deleteBar = async () => {
    if (!bar) return;
    setDeleting(true);
    const res = await fetch(`/api/bars/${bar.id}`, { method: 'DELETE' });
    if (res.ok) {
      const newBars = bars.filter((b) => b.id !== bar.id);
      setBars(newBars);
      setSelectedBarId(newBars[0]?.id ?? null);
      setConfirmDelete(false);
    }
    setDeleting(false);
  };

  const toggleMatch = (matchId: string) => {
    setSelectedMatchIds((prev) => {
      const next = new Set(prev);
      next.has(matchId) ? next.delete(matchId) : next.add(matchId);
      return next;
    });
    setSaveSuccess(false);
  };

  const saveMatches = async () => {
    if (!bar) return;
    setSavingMatches(true);
    const supabase = createClient();

    const { data: current } = await supabase
      .from('bar_matches').select('match_id').eq('bar_id', bar.id);

    const currentIds = new Set((current ?? []).map((bm: any) => bm.match_id));
    const toAdd = Array.from(selectedMatchIds).filter((id) => !currentIds.has(id));
    const toRemove = Array.from(currentIds).filter((id) => !selectedMatchIds.has(id));

    if (toAdd.length) {
      await supabase.from('bar_matches').insert(
        toAdd.map((match_id) => ({ bar_id: bar.id, match_id, sound_on: bar.has_sound })),
      );
    }
    if (toRemove.length) {
      await supabase.from('bar_matches').delete().eq('bar_id', bar.id).in('match_id', toRemove);
    }

    setSavingMatches(false);
    setSaveSuccess(true);
  };

  const startFeaturedCheckout = async () => {
    if (!bar) return;
    setCheckingOut(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barId: bar.id, locale }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setCheckingOut(false);
    }
  };

  const matchLabel = (m: MatchRow) => {
    const home = isFr ? (m.home_team_name_fr ?? m.home_team_placeholder ?? '?')
                      : (m.home_team_name_en ?? m.home_team_placeholder ?? '?');
    const away = isFr ? (m.away_team_name_fr ?? m.away_team_placeholder ?? '?')
                      : (m.away_team_name_en ?? m.away_team_placeholder ?? '?');
    const dt = new Date(m.kickoff_utc);
    return {
      teams: `${home} vs ${away}`,
      date: dt.toLocaleDateString(isFr ? 'fr-CA' : 'en-CA', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: dt.toLocaleTimeString(isFr ? 'fr-CA' : 'en-CA', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Toronto' }),
    };
  };

  const matchesByDate = matches.reduce<Record<string, MatchRow[]>>((acc, m) => {
    const date = new Date(m.kickoff_utc).toLocaleDateString(isFr ? 'fr-CA' : 'en-CA', {
      weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Toronto',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(m);
    return acc;
  }, {});

  // Loading state
  if (authLoading || barsLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!user) return null;

  // No bar yet
  if (bars.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl text-center">
        <div className="text-5xl mb-4">🍺</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {isFr ? 'Aucun bar enregistré' : 'No bar registered'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          {isFr
            ? 'Inscrivez votre bar pour apparaître dans le Watch Party Finder.'
            : 'Register your bar to appear in the Watch Party Finder.'}
        </p>
        <Link href={`/${locale}/bar/register`}>
          <Button size="lg">
            <PlusCircle className="w-4 h-4 mr-2" />
            {isFr ? 'Inscrire mon bar' : 'Register my bar'}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl flex flex-col gap-8">

      {/* Featured success banner */}
      {showFeaturedSuccess && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          <p className="text-sm font-medium text-green-800 dark:text-green-200">
            {isFr ? 'Paiement confirmé — votre bar est maintenant en vedette !' : 'Payment confirmed — your bar is now featured!'}
          </p>
        </div>
      )}

      {/* Bar selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 shrink-0">
          {isFr ? 'Gérer :' : 'Manage:'}
        </p>

        {bars.length <= 4 ? (
          // Tabs for ≤ 4 bars
          <div className="flex flex-wrap gap-2">
            {bars.map((b) => (
              <button
                key={b.id}
                onClick={() => { setSelectedBarId(b.id); setSaveSuccess(false); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                  b.id === selectedBarId
                    ? 'bg-primary-700 text-white border-primary-700'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-primary-400'
                }`}
              >
                {b.name}
                {b.is_featured && ' ⭐'}
              </button>
            ))}
          </div>
        ) : (
          // Dropdown for > 4 bars
          <div className="relative">
            <select
              value={selectedBarId ?? ''}
              onChange={(e) => { setSelectedBarId(e.target.value); setSaveSuccess(false); }}
              className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-1.5 pr-8 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {bars.map((b) => (
                <option key={b.id} value={b.id}>{b.name}{b.is_featured ? ' ⭐' : ''}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        )}

        <Link
          href={`/${locale}/bar/register`}
          className="inline-flex items-center gap-1.5 text-sm text-primary-700 dark:text-primary-400 hover:underline font-medium"
        >
          <PlusCircle className="w-4 h-4" />
          {isFr ? 'Ajouter un bar' : 'Add a bar'}
        </Link>
      </div>

      {bar && (
        <>
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{bar.name}</h1>
              <div className="flex items-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400 text-sm">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{bar.address}, {bar.city}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end shrink-0">
              {bar.is_featured && <Badge variant="featured">⭐ Featured</Badge>}
              {bar.is_verified && <Badge variant="verified">✓ {isFr ? 'Vérifié' : 'Verified'}</Badge>}
              <button
                onClick={openEdit}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-primary-700 dark:hover:text-primary-400 border border-slate-200 dark:border-slate-600 rounded-lg px-2.5 py-1.5 hover:border-primary-300 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                {isFr ? 'Modifier' : 'Edit'}
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 border border-red-200 dark:border-red-800 rounded-lg px-2.5 py-1.5 hover:border-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isFr ? 'Supprimer' : 'Delete'}
              </button>
            </div>
          </div>

          {/* Edit form — full accordion */}
          {editing && (() => {
            const ef = editForm;
            const setEf = (patch: Partial<EditForm>) => setEditForm((f) => ({ ...f, ...patch }));
            const inputCls = 'rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full';
            const labelCls = 'text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block';
            const sections: { key: typeof editSection; label: string }[] = [
              { key: 'basic', label: isFr ? '1. Informations générales' : '1. General info' },
              { key: 'location', label: isFr ? '2. Localisation' : '2. Location' },
              { key: 'features', label: isFr ? '3. Caractéristiques' : '3. Features' },
              { key: 'descriptions', label: isFr ? '4. Description' : '4. Description' },
              { key: 'photos', label: isFr ? '5. Photos' : '5. Photos' },
            ];

            return (
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                {/* Accordion header */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/70 px-5 py-3">
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {isFr ? 'Modifier le bar' : 'Edit bar'}
                  </h2>
                  <button onClick={() => setEditing(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Section tabs */}
                <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                  {sections.map((s) => (
                    <button key={s.key} onClick={() => setEditSection(s.key)}
                      className={`px-4 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                        editSection === s.key
                          ? 'border-primary-600 text-primary-700 dark:text-primary-400'
                          : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }`}>
                      {s.label}
                    </button>
                  ))}
                </div>

                <div className="p-5 bg-white dark:bg-slate-900">
                  {/* 1. Basic */}
                  {editSection === 'basic' && (
                    <div className="flex flex-col gap-3">
                      <div><label className={labelCls}>{isFr ? 'Nom du bar *' : 'Bar name *'}</label>
                        <input value={ef.name} onChange={(e) => setEf({ name: e.target.value })} className={inputCls} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls}>{isFr ? 'Téléphone' : 'Phone'}</label>
                          <input value={ef.phone} onChange={(e) => setEf({ phone: e.target.value })} className={inputCls} placeholder="+1 514 555-0100" /></div>
                        <div><label className={labelCls}>Site web</label>
                          <input value={ef.website} onChange={(e) => setEf({ website: e.target.value })} className={inputCls} placeholder="https://..." /></div>
                      </div>
                      <div><label className={labelCls}>Instagram</label>
                        <input value={ef.instagram} onChange={(e) => setEf({ instagram: e.target.value })} className={inputCls} placeholder="@monbar" /></div>
                    </div>
                  )}

                  {/* 2. Location */}
                  {editSection === 'location' && (
                    <div className="flex flex-col gap-3">
                      <div><label className={labelCls}>{isFr ? 'Adresse *' : 'Address *'}</label>
                        <input value={ef.address}
                          onChange={(e) => { setEf({ address: e.target.value }); setEditGeocoded(false); }}
                          className={inputCls} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><label className={labelCls}>{isFr ? 'Ville *' : 'City *'}</label>
                          <input value={ef.city}
                            onChange={(e) => { setEf({ city: e.target.value }); setEditGeocoded(false); }}
                            className={inputCls} /></div>
                        <div><label className={labelCls}>{isFr ? 'Province *' : 'Province *'}</label>
                          <select value={ef.province} onChange={(e) => { setEf({ province: e.target.value }); setEditGeocoded(false); }}
                            className={inputCls}>
                            {PROVINCES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                          </select></div>
                      </div>
                      <div className="max-w-[160px]"><label className={labelCls}>{isFr ? 'Code postal' : 'Postal code'}</label>
                        <input value={ef.postal_code} onChange={(e) => setEf({ postal_code: e.target.value })} className={inputCls} placeholder="H2X 1Y4" /></div>
                      {!editGeocoded ? (
                        <button type="button" onClick={geocodeEditAddress} disabled={editGeocoding}
                          className="self-start flex items-center gap-2 text-xs border border-primary-300 text-primary-700 dark:text-primary-400 px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20">
                          {editGeocoding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
                          {isFr ? 'Vérifier l\'adresse' : 'Verify address'}
                        </button>
                      ) : (
                        <p className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isFr ? `Localisé : ${ef.latitude.toFixed(4)}, ${ef.longitude.toFixed(4)}` : `Located: ${ef.latitude.toFixed(4)}, ${ef.longitude.toFixed(4)}`}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 3. Features */}
                  {editSection === 'features' && (
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className={labelCls}>{isFr ? 'Ce que vous offrez' : 'What you offer'}</p>
                        <div className="flex flex-wrap gap-2">
                          {([
                            { field: 'has_sound' as const, label: '🔊 Son' },
                            { field: 'has_projector' as const, label: '📺 Écran géant' },
                            { field: 'has_outdoor' as const, label: '🌿 Terrasse' },
                            { field: 'has_food' as const, label: '🍔 Nourriture' },
                          ]).map(({ field, label }) => (
                            <button key={field} type="button" onClick={() => setEf({ [field]: !ef[field] })}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                ef[field] ? 'bg-primary-700 text-white border-primary-700' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-primary-400'
                              }`}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelCls}>{isFr ? 'Nombre d\'écrans' : 'Screens'}</label>
                          <input type="number" min={1} max={50} value={ef.num_screens}
                            onChange={(e) => setEf({ num_screens: parseInt(e.target.value) || 1 })}
                            className={`${inputCls} w-24`} />
                        </div>
                        <div>
                          <label className={labelCls}>{isFr ? 'Capacité' : 'Capacity'}</label>
                          <input type="number" min={10} max={5000} value={ef.capacity}
                            onChange={(e) => setEf({ capacity: e.target.value })}
                            className={inputCls} placeholder="150" />
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>{isFr ? 'Ambiance' : 'Atmosphere'}</label>
                        <select value={ef.atmosphere} onChange={(e) => setEf({ atmosphere: e.target.value })} className={inputCls}>
                          <option value="">{isFr ? '— Choisir —' : '— Choose —'}</option>
                          {ATMOSPHERES.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* 4. Descriptions */}
                  {editSection === 'descriptions' && (
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className={labelCls}>{isFr ? 'Description en français' : 'French description'}</label>
                        <textarea value={ef.description_fr} onChange={(e) => setEf({ description_fr: e.target.value })}
                          rows={4} maxLength={1000}
                          className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full resize-none" />
                        <p className="text-xs text-slate-400 text-right mt-0.5">{ef.description_fr.length}/1000</p>
                      </div>
                      <div>
                        <label className={labelCls}>{isFr ? 'Description en anglais' : 'English description'}</label>
                        <textarea value={ef.description_en} onChange={(e) => setEf({ description_en: e.target.value })}
                          rows={4} maxLength={1000}
                          className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 w-full resize-none" />
                        <p className="text-xs text-slate-400 text-right mt-0.5">{ef.description_en.length}/1000</p>
                      </div>
                    </div>
                  )}

                  {/* 5. Photos */}
                  {editSection === 'photos' && (
                    <PhotoGalleryEditor
                      photos={ef.photo_urls}
                      logo={ef.logo_url}
                      onPhotosChange={(urls) => setEf({ photo_urls: urls })}
                      onLogoChange={(url) => setEf({ logo_url: url })}
                      locale={locale}
                    />
                  )}

                  {/* Error */}
                  {editError && (
                    <p className="mt-3 text-xs text-red-500 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> {editError}
                    </p>
                  )}

                  {/* Footer buttons */}
                  <div className="flex gap-2 justify-end mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                      {isFr ? 'Annuler' : 'Cancel'}
                    </Button>
                    <Button size="sm" onClick={saveEdit} disabled={editSaving || !editGeocoded}>
                      {editSaving && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                      {isFr ? 'Enregistrer les modifications' : 'Save changes'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Delete confirmation */}
          {confirmDelete && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">
                    {isFr ? `Supprimer "${bar.name}" ?` : `Delete "${bar.name}"?`}
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                    {isFr
                      ? 'Cette action est irréversible. Tous les matchs associés seront supprimés.'
                      : 'This action is irreversible. All associated matches will be removed.'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)} disabled={deleting}>
                  {isFr ? 'Annuler' : 'Cancel'}
                </Button>
                <button
                  onClick={deleteBar}
                  disabled={deleting}
                  className="flex items-center gap-1.5 text-xs bg-red-600 hover:bg-red-700 text-white rounded-lg px-3 py-1.5 font-medium transition-colors disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  {isFr ? 'Supprimer définitivement' : 'Delete permanently'}
                </button>
              </div>
            </div>
          )}

          {/* Quick stats */}
          {(() => {
            const avgRating = reviews.length
              ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
              : null;
            const stats = [
              {
                icon: Star,
                label: isFr ? 'Note moyenne' : 'Avg. rating',
                value: avgRating !== null ? `${avgRating.toFixed(1)} / 5` : '—',
                sub: reviews.length > 0 ? `${reviews.length} ${isFr ? 'avis' : 'reviews'}` : (isFr ? 'Aucun avis' : 'No reviews yet'),
                color: 'text-amber-500',
              },
              {
                icon: Users,
                label: isFr ? 'Avis reçus' : 'Reviews received',
                value: reviews.length.toString(),
                sub: reviews.length > 0
                  ? `${isFr ? 'Dernier : ' : 'Latest: '}${new Date(reviews[0].created_at).toLocaleDateString(isFr ? 'fr-CA' : 'en-CA', { month: 'short', day: 'numeric' })}`
                  : '—',
                color: 'text-primary-600',
              },
              {
                icon: BarChart3,
                label: isFr ? 'Matchs diffusés' : 'Matches showing',
                value: selectedMatchIds.size.toString(),
                sub: isFr ? 'matchs sélectionnés' : 'matches selected',
                color: 'text-green-600',
              },
            ];
            return (
              <div className="grid grid-cols-3 gap-4">
                {stats.map(({ icon: Icon, label, value, sub, color }) => (
                  <div key={label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
                    <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                    {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Public page link */}
          <div className="flex items-center gap-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl px-4 py-3 text-sm">
            <CheckCircle2 className="w-4 h-4 text-primary-700 dark:text-primary-400 shrink-0" />
            <span className="text-slate-700 dark:text-slate-300">
              {isFr ? 'Page publique : ' : 'Public page: '}
            </span>
            <Link
              href={`/${locale}/bar/${bar.slug}`}
              className="text-primary-700 dark:text-primary-400 hover:underline font-medium flex items-center gap-1"
            >
              /bar/{bar.slug}
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Featured upgrade */}
          {bar.is_featured ? (
            (() => {
              const expiry = bar.featured_until ? new Date(bar.featured_until) : null;
              const now = new Date();
              const isExpired = expiry && expiry < now;
              const daysLeft = expiry ? Math.ceil((expiry.getTime() - now.getTime()) / 86_400_000) : null;
              const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && !isExpired;

              return (
                <div className={`flex flex-col gap-3 border rounded-xl p-4 ${
                  isExpired
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : isExpiringSoon
                    ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700'
                }`}>
                  <div className="flex items-start gap-3">
                    {isExpired ? (
                      <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    ) : (
                      <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className={`font-semibold text-sm ${isExpired ? 'text-red-800 dark:text-red-200' : 'text-amber-900 dark:text-amber-200'}`}>
                        {isExpired
                          ? (isFr ? 'Abonnement expiré' : 'Subscription expired')
                          : (isFr ? 'Bar en vedette ✓' : 'Featured bar ✓')}
                      </p>
                      {expiry && (
                        <p className={`text-xs mt-0.5 ${isExpired ? 'text-red-600 dark:text-red-400' : isExpiringSoon ? 'text-orange-700 dark:text-orange-400' : 'text-amber-700 dark:text-amber-400'}`}>
                          {isExpired
                            ? (isFr ? `Expiré le ${expiry.toLocaleDateString(isFr ? 'fr-CA' : 'en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}` : `Expired on ${expiry.toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}`)
                            : isExpiringSoon
                            ? (isFr ? `⚠ Expire dans ${daysLeft} jour${daysLeft! > 1 ? 's' : ''}` : `⚠ Expires in ${daysLeft} day${daysLeft! > 1 ? 's' : ''}`)
                            : (isFr ? `Actif jusqu'au ${expiry.toLocaleDateString('fr-CA', { month: 'long', day: 'numeric', year: 'numeric' })}` : `Active until ${expiry.toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })}`)}
                        </p>
                      )}
                    </div>
                    {!isExpired && <Badge variant="featured">⭐ Featured</Badge>}
                  </div>

                  {/* Verification confirmation */}
                  {!isExpired && (
                    <div className="flex items-center gap-2 bg-white/60 dark:bg-slate-800/40 rounded-lg px-3 py-2">
                      <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {isFr
                          ? 'Votre bar apparaît en tête des résultats du Watch Finder dans votre ville.'
                          : 'Your bar appears at the top of Watch Finder results in your city.'}
                      </p>
                    </div>
                  )}

                  {(isExpired || isExpiringSoon) && (
                    <Button size="sm" onClick={startFeaturedCheckout} disabled={checkingOut} className="self-start">
                      {checkingOut && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      {isExpired
                        ? (isFr ? 'Renouveler — 49 $/mois' : 'Renew — $49/month')
                        : (isFr ? 'Renouveler maintenant' : 'Renew now')}
                    </Button>
                  )}
                </div>
              );
            })()
          ) : (
            <div className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border border-primary-200 dark:border-primary-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary-700 dark:text-primary-400" />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    {isFr ? 'Passer en vedette' : 'Get featured'}
                  </span>
                  <span className="text-xs bg-primary-700 text-white rounded-full px-2 py-0.5 font-semibold">49 $/mois</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {isFr
                    ? 'Apparaissez en tête des résultats de recherche. Annulez à tout moment.'
                    : 'Appear at the top of search results. Cancel anytime.'}
                </p>
              </div>
              <Button size="sm" onClick={startFeaturedCheckout} disabled={checkingOut} className="shrink-0">
                {checkingOut && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                {isFr ? 'Mettre en avant' : 'Get featured'}
              </Button>
            </div>
          )}

          {/* Latest reviews */}
          {reviews.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500" />
                {isFr ? 'Derniers avis clients' : 'Latest customer reviews'}
              </h2>
              <div className="flex flex-col gap-3">
                {reviews.slice(0, 5).map((review, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={`w-3.5 h-3.5 ${j < review.rating ? 'text-amber-500 fill-current' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        {review.atmosphere_rating && (
                          <span>{isFr ? 'Ambiance' : 'Atmosphere'}: {review.atmosphere_rating}/5</span>
                        )}
                        {review.sound_quality_rating && (
                          <span>{isFr ? 'Son' : 'Sound'}: {review.sound_quality_rating}/5</span>
                        )}
                        <span className="flex items-center gap-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(review.created_at).toLocaleDateString(isFr ? 'fr-CA' : 'en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{review.comment}</p>
                    )}
                    {!review.comment && (
                      <p className="text-xs text-slate-400 italic mt-1">{isFr ? 'Sans commentaire' : 'No comment'}</p>
                    )}
                  </div>
                ))}
              </div>
              {reviews.length > 5 && (
                <p className="text-xs text-slate-400 mt-2 text-right">
                  {isFr ? `+${reviews.length - 5} autres avis` : `+${reviews.length - 5} more reviews`}
                </p>
              )}
            </section>
          )}

          {/* Match selection */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {isFr ? 'Matchs que vous diffusez' : 'Matches you are showing'}
              </h2>
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isFr ? 'Enregistré' : 'Saved'}
                  </span>
                )}
                <Button size="sm" onClick={saveMatches} disabled={savingMatches}>
                  {savingMatches && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                  {isFr ? 'Enregistrer' : 'Save'}
                </Button>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {selectedMatchIds.size} {isFr
                ? `match${selectedMatchIds.size !== 1 ? 's' : ''} sélectionné${selectedMatchIds.size !== 1 ? 's' : ''}`
                : `match${selectedMatchIds.size !== 1 ? 'es' : ''} selected`}
            </p>

            <div className="flex flex-col gap-6">
              {Object.entries(matchesByDate).map(([date, dayMatches]) => (
                <div key={date}>
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 capitalize">
                    {date}
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {dayMatches.map((m) => {
                      const { teams, time } = matchLabel(m);
                      const selected = selectedMatchIds.has(m.id);
                      return (
                        <button
                          key={m.id}
                          onClick={() => toggleMatch(m.id)}
                          className={`flex items-center justify-between rounded-xl px-4 py-3 text-left border transition-colors ${
                            selected
                              ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div>
                            <p className={`text-sm font-medium ${selected ? 'text-primary-700 dark:text-primary-300' : 'text-slate-900 dark:text-white'}`}>
                              {teams}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {time} ET · {m.venue_city}
                            </p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            selected ? 'bg-primary-700 border-primary-700' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Sign out */}
      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <button
          onClick={() => { signOut(); router.push(`/${locale}`); }}
          className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          {isFr ? 'Se déconnecter' : 'Sign out'}
        </button>
      </div>
    </div>
  );
}
