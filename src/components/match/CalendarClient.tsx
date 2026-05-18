'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { MatchCard, type CalendarMatch } from './MatchCard';
import { formatMatchDate } from '@/lib/utils/dates';
import { CANADIAN_TIMEZONES } from '@/lib/utils/dates';

const STAGES = [
  { value: '', labelFr: 'Toutes les phases', labelEn: 'All stages' },
  { value: 'group', labelFr: 'Phase de groupes', labelEn: 'Group stage' },
  { value: 'round_of_32', labelFr: '32es de finale', labelEn: 'Round of 32' },
  { value: 'round_of_16', labelFr: '8es de finale', labelEn: 'Round of 16' },
  { value: 'quarter_final', labelFr: 'Quarts de finale', labelEn: 'Quarter-finals' },
  { value: 'semi_final', labelFr: 'Demi-finales', labelEn: 'Semi-finals' },
  { value: 'final', labelFr: 'Finale', labelEn: 'Final' },
];

interface Team { code: string; name_fr: string; name_en: string }

interface CalendarClientProps {
  matches: CalendarMatch[];
  teams: Team[];
  locale: string;
}

export function CalendarClient({ matches, teams, locale }: CalendarClientProps) {
  const isFr = locale === 'fr';

  const [timezone, setTimezone] = useState('America/Toronto');
  const [stage, setStage] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return matches.filter((m) => {
      if (stage && m.stage !== stage) return false;
      if (teamCode) {
        const isHome = m.home_team_code === teamCode;
        const isAway = m.away_team_code === teamCode;
        if (!isHome && !isAway) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const homeFr = m.home_team_name_fr?.toLowerCase() ?? '';
        const homeEn = m.home_team_name_en?.toLowerCase() ?? '';
        const awayFr = m.away_team_name_fr?.toLowerCase() ?? '';
        const awayEn = m.away_team_name_en?.toLowerCase() ?? '';
        const city = m.venue_city.toLowerCase();
        if (![homeFr, homeEn, awayFr, awayEn, city].some((v) => v.includes(q))) return false;
      }
      return true;
    });
  }, [matches, stage, teamCode, search]);

  // Group by day in selected timezone
  const byDay = useMemo(() => {
    const groups: Record<string, CalendarMatch[]> = {};
    for (const m of filtered) {
      const day = formatMatchDate(m.kickoff_utc, timezone, locale);
      if (!groups[day]) groups[day] = [];
      groups[day].push(m);
    }
    return groups;
  }, [filtered, timezone, locale]);

  const selectClass = "appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 pr-8 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500";

  return (
    <div className="flex flex-col gap-6">

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col gap-3">
        {/* Row 1: search + timezone */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isFr ? 'Équipe ou ville...' : 'Team or city...'}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700 dark:text-slate-200"
            />
          </div>

          <div className="relative">
            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={selectClass}>
              {CANADIAN_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {isFr ? tz.label : tz.labelEn}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Row 2: stage + team */}
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select value={stage} onChange={(e) => setStage(e.target.value)} className={selectClass}>
              {STAGES.map((s) => (
                <option key={s.value} value={s.value}>
                  {isFr ? s.labelFr : s.labelEn}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select value={teamCode} onChange={(e) => setTeamCode(e.target.value)} className={selectClass}>
              <option value="">{isFr ? 'Toutes les équipes' : 'All teams'}</option>
              {teams.map((t) => (
                <option key={t.code} value={t.code}>
                  {isFr ? t.name_fr : t.name_en}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {(stage || teamCode || search) && (
            <button
              onClick={() => { setStage(''); setTeamCode(''); setSearch(''); }}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
            >
              {isFr ? 'Réinitialiser' : 'Reset'}
            </button>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          {filtered.length} {isFr ? 'matchs' : 'matches'}
          {stage || teamCode || search ? (isFr ? ' trouvés' : ' found') : ''}
        </p>
      </div>

      {/* Match list */}
      {Object.keys(byDay).length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          {isFr ? 'Aucun match pour ces filtres.' : 'No matches for these filters.'}
        </div>
      ) : (
        Object.entries(byDay).map(([day, dayMatches]) => (
          <section key={day}>
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 capitalize">
              {day}
            </h2>
            <div className="flex flex-col gap-2">
              {dayMatches.map((m) => (
                <MatchCard key={m.id} match={m} timezone={timezone} locale={locale} />
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
