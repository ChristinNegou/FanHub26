'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { LocateFixed, MapPin, AlertCircle, Search } from 'lucide-react';
import { BarCard } from '@/components/bar/BarCard';
import { MapFilters } from '@/components/map/MapFilters';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useBars, type BarFilters } from '@/hooks/useBars';
import type { BarWithDistance } from '@/lib/types/bar';

const MapContainer = dynamic(
  () => import('@/components/map/MapContainer').then((m) => m.MapContainer),
  { ssr: false, loading: () => <Skeleton className="w-full h-full min-h-[400px] rounded-xl" /> },
);

interface UpcomingMatch {
  id: string;
  match_number: number;
  stage: string;
  group_letter: string | null;
  home_team_name_fr: string | null;
  home_team_name_en: string | null;
  home_team_code: string | null;
  home_team_flag: string | null;
  home_team_placeholder: string | null;
  away_team_name_fr: string | null;
  away_team_name_en: string | null;
  away_team_code: string | null;
  away_team_flag: string | null;
  away_team_placeholder: string | null;
  kickoff_utc: string;
  venue_name: string;
  venue_city: string;
}

interface WatchClientProps {
  locale: string;
  initialMatchId: string | null;
}

export function WatchClient({ locale, initialMatchId }: WatchClientProps) {
  const isFr = locale === 'fr';

  const geo = useGeolocation();
  const userLocation =
    geo.lat && geo.lng ? { lat: geo.lat, lng: geo.lng } : null;

  const [filters, setFilters] = useState<BarFilters>({
    radius: 15,
    sortBy: 'distance',
    matchId: initialMatchId,
  });
  const [selectedBar, setSelectedBar] = useState<BarWithDistance | null>(null);
  const [matches, setMatches] = useState<UpcomingMatch[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(true);

  const { bars, loading: barsLoading } = useBars({
    lat: geo.lat,
    lng: geo.lng,
    filters,
  });

  useEffect(() => {
    fetch('/api/matches')
      .then((r) => r.json())
      .then((d) => setMatches(d.matches ?? []))
      .finally(() => setMatchesLoading(false));
  }, []);

  const handleBarSelect = useCallback((bar: BarWithDistance | null) => {
    setSelectedBar(bar);
    if (bar) {
      const el = document.getElementById(`bar-${bar.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {!matchesLoading && (
        <MapFilters
          filters={filters}
          onFilterChange={setFilters}
          matches={matches}
          locale={locale}
        />
      )}

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        {/* LEFT: Bar list */}
        <aside className="w-full lg:w-[380px] flex flex-col border-r border-slate-200 dark:border-slate-700 order-2 lg:order-1 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
            <h1 className="text-base font-semibold text-slate-900 dark:text-white">
              {isFr ? 'Où regarder le match ?' : 'Where to watch?'}
            </h1>
            {!geo.loading && geo.lat && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {barsLoading
                  ? (isFr ? 'Recherche...' : 'Searching...')
                  : `${bars.length} ${isFr ? 'bars' : 'bars'}`}
              </span>
            )}
          </div>

          {!geo.lat && !geo.loading && (
            <div className="flex flex-col items-center justify-center flex-1 px-6 py-10 text-center gap-4">
              <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                <MapPin className="w-7 h-7 text-primary-700 dark:text-primary-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                  {isFr ? 'Activez votre position' : 'Enable your location'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isFr
                    ? 'Pour trouver les bars qui diffusent la Coupe du Monde près de chez vous'
                    : 'To find bars showing the World Cup near you'}
                </p>
              </div>
              {geo.error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 w-full">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{geo.error}</span>
                </div>
              )}
              <Button onClick={geo.request} disabled={geo.loading} size="md">
                <LocateFixed className="w-4 h-4 mr-2" />
                {geo.loading
                  ? (isFr ? 'Localisation...' : 'Locating...')
                  : (isFr ? 'Me localiser' : 'Locate me')}
              </Button>
              <p className="text-xs text-slate-400">
                {isFr
                  ? 'ou parcourez la carte à droite'
                  : 'or browse the map on the right'}
              </p>
            </div>
          )}

          {(barsLoading || geo.loading) && geo.lat && (
            <div className="flex flex-col gap-3 p-4 overflow-y-auto">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full rounded-xl" />
              ))}
            </div>
          )}

          {!barsLoading && !geo.loading && geo.lat && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {bars.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                  <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {isFr
                      ? 'Aucun bar trouvé dans cette zone'
                      : 'No bars found in this area'}
                  </p>
                  <a
                    href={`/${locale}/bar/register`}
                    className="text-xs text-primary-700 dark:text-primary-400 hover:underline"
                  >
                    {isFr
                      ? 'Vous êtes propriétaire ? Inscrivez votre bar →'
                      : "Bar owner? Register your bar →"}
                  </a>
                </div>
              ) : (
                bars.map((bar) => (
                  <div key={bar.id} id={`bar-${bar.id}`}>
                    <BarCard
                      bar={bar}
                      locale={locale}
                      isSelected={selectedBar?.id === bar.id}
                      onClick={() => handleBarSelect(selectedBar?.id === bar.id ? null : bar)}
                    />
                  </div>
                ))
              )}
            </div>
          )}
        </aside>

        {/* RIGHT: Map */}
        <div className="flex-1 relative order-1 lg:order-2 h-[50vh] lg:h-auto">
          {!geo.lat && (
            <button
              onClick={geo.request}
              disabled={geo.loading}
              className="absolute top-3 left-3 z-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              <LocateFixed className="w-4 h-4 text-primary-700" />
              {geo.loading
                ? (isFr ? 'Localisation...' : 'Locating...')
                : (isFr ? 'Me localiser' : 'Locate me')}
            </button>
          )}

          <MapContainer
            bars={bars}
            userLocation={userLocation}
            selectedBar={selectedBar}
            onBarSelect={handleBarSelect}
            locale={locale}
          />
        </div>
      </div>
    </div>
  );
}
