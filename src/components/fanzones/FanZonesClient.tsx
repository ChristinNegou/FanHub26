'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Tv, UtensilsCrossed, Beer, ExternalLink } from 'lucide-react';
import { MAPBOX_TOKEN } from '@/lib/mapbox/config';
import type { FanZone, FanZoneType } from '@/lib/types/fanzone';

const TYPE_CONFIG: Record<FanZoneType, { label_fr: string; label_en: string; color: string; dot: string }> = {
  official_fifa: {
    label_fr: 'Officielle FIFA',
    label_en: 'Official FIFA',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    dot: '#F59E0B',
  },
  city_organized: {
    label_fr: 'Organisée par la ville',
    label_en: 'City organized',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    dot: '#3B82F6',
  },
  community: {
    label_fr: 'Communautaire',
    label_en: 'Community',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    dot: '#16A34A',
  },
};

interface Props {
  fanzones: FanZone[];
  locale: string;
}

export function FanZonesClient({ fanzones, locale }: Props) {
  const isFr = locale === 'fr';
  const [selected, setSelected] = useState<FanZone | null>(null);
  const [filter, setFilter] = useState<FanZoneType | 'all'>('all');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  const filtered = filter === 'all' ? fanzones : fanzones.filter((fz) => fz.type === filter);

  // Init map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !MAPBOX_TOKEN) return;

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      const map = new mapboxgl.Map({
        container: mapRef.current!,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-79.4014, 56.0], // Centred on Canada roughly
        zoom: 3.5,
      });
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      mapInstanceRef.current = map;

      map.on('load', () => {
        fanzones.forEach((fz) => {
          const el = document.createElement('div');
          el.style.cssText = `width:32px;height:32px;cursor:pointer;`;
          const inner = document.createElement('div');
          const dot = TYPE_CONFIG[fz.type].dot;
          inner.style.cssText = `
            width:100%;height:100%;
            background:${dot};
            border:3px solid white;border-radius:50%;
            box-shadow:0 3px 10px rgba(0,0,0,0.35);
            display:flex;align-items:center;justify-content:center;
            font-size:14px;
            transition:transform 0.15s,box-shadow 0.15s;
            transform-origin:center;
          `;
          inner.textContent = '🏟️';
          el.appendChild(inner);
          el.addEventListener('mouseenter', () => { inner.style.transform = 'scale(1.25)'; });
          el.addEventListener('mouseleave', () => { inner.style.transform = 'scale(1)'; });
          el.addEventListener('click', () => setSelected(fz));

          const marker = new mapboxgl.Marker({ element: el })
            .setLngLat([fz.longitude, fz.latitude])
            .addTo(map);
          markersRef.current.set(fz.id, marker);
        });
      });
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [fanzones]);

  // Fly to selected
  useEffect(() => {
    if (!selected || !mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: [selected.longitude, selected.latitude],
      zoom: 13,
      duration: 900,
    });
  }, [selected]);

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div className="w-full lg:w-96 flex-shrink-0 flex flex-col overflow-y-auto border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
            {isFr ? 'Fan zones' : 'Fan zones'}
          </h1>
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'official_fifa', 'city_organized', 'community'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === t
                    ? 'bg-primary-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {t === 'all'
                  ? (isFr ? 'Toutes' : 'All')
                  : (isFr ? TYPE_CONFIG[t].label_fr : TYPE_CONFIG[t].label_en)}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            {filtered.length} {isFr ? 'fan zones' : 'fan zones'}
          </p>
        </div>

        {/* Card list */}
        <div className="flex-1 p-3 flex flex-col gap-3">
          {filtered.map((fz) => {
            const cfg = TYPE_CONFIG[fz.type];
            const isActive = selected?.id === fz.id;
            return (
              <button
                key={fz.id}
                onClick={() => setSelected(fz)}
                className={`text-left rounded-xl border p-4 transition-all ${
                  isActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">
                    {isFr ? fz.name_fr : fz.name_en}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${cfg.color}`}>
                    {isFr ? cfg.label_fr : cfg.label_en}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
                  <MapPin className="w-3 h-3" />
                  {fz.city}, {fz.province}
                </p>
                <div className="flex gap-3 text-xs text-slate-400">
                  {fz.has_big_screen && <span className="flex items-center gap-0.5"><Tv className="w-3 h-3" /> Grand écran</span>}
                  {fz.has_food && <span className="flex items-center gap-0.5"><UtensilsCrossed className="w-3 h-3" /> Food</span>}
                  {fz.has_drinks && <span className="flex items-center gap-0.5"><Beer className="w-3 h-3" /> Boissons</span>}
                  {fz.is_free && <span className="text-green-600 dark:text-green-400 font-medium">{isFr ? 'Gratuit' : 'Free'}</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map + detail panel */}
      <div className="flex-1 flex flex-col relative">
        {/* Map */}
        <div ref={mapRef} className="flex-1" />

        {/* Detail panel (slides up on selection) */}
        {selected && (
          <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 shadow-2xl max-h-64 overflow-y-auto">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  {isFr ? selected.name_fr : selected.name_en}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {selected.address}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {isFr ? selected.description_fr : selected.description_en}
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              {selected.capacity && (
                <span className="text-slate-500 dark:text-slate-400">
                  👥 {selected.capacity.toLocaleString()} {isFr ? 'personnes' : 'people'}
                </span>
              )}
              {selected.operating_hours && (
                <span className="text-slate-500 dark:text-slate-400">
                  🕐 {selected.operating_hours}
                </span>
              )}
              {selected.opening_date && (
                <span className="text-slate-500 dark:text-slate-400">
                  📅 {new Date(selected.opening_date).toLocaleDateString(isFr ? 'fr-CA' : 'en-CA', { month: 'short', day: 'numeric' })} – {new Date(selected.closing_date!).toLocaleDateString(isFr ? 'fr-CA' : 'en-CA', { month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selected.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm bg-primary-700 hover:bg-primary-800 text-white px-3 py-1.5 rounded-lg transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                {isFr ? 'Itinéraire' : 'Directions'}
              </a>
              {selected.website && (
                <a
                  href={selected.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  {isFr ? 'Site web' : 'Website'}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
