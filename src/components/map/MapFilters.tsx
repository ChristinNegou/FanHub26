'use client';

import { useState } from 'react';
import { ChevronDown, Volume2, Tv, TreePine, UtensilsCrossed, SlidersHorizontal } from 'lucide-react';
import type { BarFilters } from '@/hooks/useBars';

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

interface MapFiltersProps {
  filters: BarFilters;
  onFilterChange: (filters: BarFilters) => void;
  matches: UpcomingMatch[];
  locale: string;
}

export function MapFilters({ filters, onFilterChange, matches, locale }: MapFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isFr = locale === 'fr';

  const update = (patch: Partial<BarFilters>) =>
    onFilterChange({ ...filters, ...patch });

  const selectedMatch = matches.find((m) => m.id === filters.matchId);

  function matchLabel(m: UpcomingMatch) {
    const home = isFr
      ? (m.home_team_name_fr ?? m.home_team_placeholder ?? '?')
      : (m.home_team_name_en ?? m.home_team_placeholder ?? '?');
    const away = isFr
      ? (m.away_team_name_fr ?? m.away_team_placeholder ?? '?')
      : (m.away_team_name_en ?? m.away_team_placeholder ?? '?');
    const dt = new Date(m.kickoff_utc);
    const dateStr = dt.toLocaleDateString(isFr ? 'fr-CA' : 'en-CA', {
      month: 'short',
      day: 'numeric',
    });
    return `${home} vs ${away} — ${dateStr}`;
  }

  const chipClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-pointer select-none ${
      active
        ? 'bg-primary-700 text-white border-primary-700'
        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-primary-400'
    }`;

  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex flex-col gap-3">
      {/* Row 1: match selector + radius */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Match picker */}
        <div className="relative flex-1 min-w-[200px]">
          <select
            value={filters.matchId ?? ''}
            onChange={(e) => update({ matchId: e.target.value || null })}
            className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">{isFr ? 'Tous les matchs' : 'All matches'}</option>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                {matchLabel(m)}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={filters.sortBy ?? 'distance'}
            onChange={(e) => update({ sortBy: e.target.value as BarFilters['sortBy'] })}
            className="appearance-none bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="distance">{isFr ? 'Distance' : 'Distance'}</option>
            <option value="rating">{isFr ? 'Note' : 'Rating'}</option>
            <option value="featured">{isFr ? 'Mis en avant' : 'Featured'}</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {isFr ? 'Filtres' : 'Filters'}
        </button>
      </div>

      {/* Row 2: feature chips (always visible on desktop) */}
      <div className={`flex flex-wrap gap-2 ${showAdvanced ? '' : 'hidden sm:flex'}`}>
        <button
          className={chipClass(!!filters.sound)}
          onClick={() => update({ sound: !filters.sound })}
        >
          <Volume2 className="w-3.5 h-3.5" />
          {isFr ? 'Son activé' : 'Sound on'}
        </button>
        <button
          className={chipClass(!!filters.projector)}
          onClick={() => update({ projector: !filters.projector })}
        >
          <Tv className="w-3.5 h-3.5" />
          {isFr ? 'Écran géant' : 'Big screen'}
        </button>
        <button
          className={chipClass(!!filters.outdoor)}
          onClick={() => update({ outdoor: !filters.outdoor })}
        >
          <TreePine className="w-3.5 h-3.5" />
          {isFr ? 'Terrasse' : 'Outdoor'}
        </button>
        <button
          className={chipClass(!!filters.food)}
          onClick={() => update({ food: !filters.food })}
        >
          <UtensilsCrossed className="w-3.5 h-3.5" />
          {isFr ? 'Nourriture' : 'Food'}
        </button>

        {/* Radius */}
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isFr ? 'Rayon' : 'Radius'}
          </span>
          <select
            value={filters.radius ?? 15}
            onChange={(e) => update({ radius: parseInt(e.target.value) })}
            className="appearance-none bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={15}>15 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>
      </div>
    </div>
  );
}
