'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { MAPBOX_TOKEN, DEFAULT_CENTER, DEFAULT_ZOOM, MAP_STYLE } from '@/lib/mapbox/config';
import { BarPopup } from './BarPopup';
import type { BarWithDistance } from '@/lib/types/bar';

interface MapContainerProps {
  bars: BarWithDistance[];
  userLocation: { lat: number; lng: number } | null;
  selectedBar: BarWithDistance | null;
  onBarSelect: (bar: BarWithDistance | null) => void;
  locale: string;
}

export function MapContainer({
  bars,
  userLocation,
  selectedBar,
  onBarSelect,
  locale,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const popupRef = useRef<any>(null);
  const userMarkerRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current || !MAPBOX_TOKEN) return;

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapRef.current!,
        style: MAP_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      mapInstanceRef.current = map;

      // Signal that map is ready (style loaded)
      map.on('load', () => setMapReady(true));
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady || !userLocation) return;

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat]);
      } else {
        const el = document.createElement('div');
        el.style.cssText = `
          width: 16px; height: 16px;
          background: #1D4ED8; border: 3px solid white;
          border-radius: 50%; box-shadow: 0 0 0 6px rgba(29,78,216,0.2);
        `;
        userMarkerRef.current = new mapboxgl.Marker({ element: el })
          .setLngLat([userLocation.lng, userLocation.lat])
          .addTo(map);
      }

      map.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 13, duration: 1000 });
    });
  }, [userLocation, mapReady]);

  // Sync bar markers — reruns when bars change OR when map becomes ready
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      const existingIds = new Set(markersRef.current.keys());
      const newIds = new Set(bars.map((b) => b.id));

      // Remove stale markers
      for (const id of Array.from(existingIds)) {
        if (!newIds.has(id)) {
          markersRef.current.get(id)?.remove();
          markersRef.current.delete(id);
        }
      }

      // Add new markers
      for (const bar of bars) {
        if (markersRef.current.has(bar.id)) continue;

        const el = document.createElement('div');
        const featured = bar.is_featured;
        el.style.cssText = `
          width: ${featured ? 44 : 36}px;
          height: ${featured ? 44 : 36}px;
          background: ${featured ? '#F59E0B' : '#1D4ED8'};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 3px 10px rgba(0,0,0,0.35);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: ${featured ? '18px' : '15px'};
          transition: transform 0.15s, box-shadow 0.15s;
          z-index: ${featured ? 2 : 1};
          position: relative;
        `;
        el.textContent = featured ? '⭐' : '🍺';
        el.title = bar.name;

        el.addEventListener('mouseenter', () => {
          el.style.transform = 'scale(1.25)';
          el.style.boxShadow = '0 6px 18px rgba(0,0,0,0.4)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.transform = 'scale(1)';
          el.style.boxShadow = '0 3px 10px rgba(0,0,0,0.35)';
        });
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onBarSelect(bar);
        });

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([bar.longitude, bar.latitude])
          .addTo(map);

        markersRef.current.set(bar.id, marker);
      }
    });
  }, [bars, onBarSelect, mapReady]);

  // Show popup on selected bar
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    import('mapbox-gl').then(({ default: mapboxgl }) => {
      popupRef.current?.remove();
      popupRef.current = null;

      if (!selectedBar) return;

      map.flyTo({
        center: [selectedBar.longitude, selectedBar.latitude],
        zoom: Math.max(map.getZoom(), 14),
        offset: [0, -80],
        duration: 600,
      });

      const container = document.createElement('div');
      const root = createRoot(container);
      root.render(
        <BarPopup bar={selectedBar} locale={locale} onClose={() => onBarSelect(null)} />,
      );

      const popup = new mapboxgl.Popup({
        offset: [0, -8],
        closeButton: false,
        maxWidth: 'none',
        className: 'fanhub-popup',
      })
        .setLngLat([selectedBar.longitude, selectedBar.latitude])
        .setDOMContent(container)
        .addTo(map);

      popup.on('close', () => onBarSelect(null));
      popupRef.current = popup;
    });
  }, [selectedBar, locale, onBarSelect, mapReady]);

  // Close popup when clicking on map background
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;
    const handler = () => onBarSelect(null);
    map.on('click', handler);
    return () => map.off('click', handler);
  }, [mapReady, onBarSelect]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-full min-h-[400px] rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-slate-500 text-sm font-medium mb-1">Carte Mapbox</p>
          <p className="text-slate-400 text-xs">
            Ajoute <code className="font-mono bg-slate-200 px-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN</code> dans <code className="font-mono bg-slate-200 px-1 rounded">.env.local</code>
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full min-h-[400px] rounded-xl overflow-hidden" />;
}
