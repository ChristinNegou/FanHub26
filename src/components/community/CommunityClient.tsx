'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface Team {
  code: string;
  name_fr: string;
  name_en: string;
  group_letter: string;
  flag_url: string;
  continent: string;
}

const CONTINENT_ORDER = [
  'North America',
  'South America',
  'Europe',
  'Africa',
  'Asia',
  'Oceania',
];

const CONTINENT_LABELS: Record<string, { fr: string; en: string }> = {
  'North America':  { fr: 'Amérique du Nord', en: 'North America' },
  'South America':  { fr: 'Amérique du Sud', en: 'South America' },
  'Europe':         { fr: 'Europe', en: 'Europe' },
  'Africa':         { fr: 'Afrique', en: 'Africa' },
  'Asia':           { fr: 'Asie', en: 'Asia' },
  'Oceania':        { fr: 'Océanie', en: 'Oceania' },
};

interface Props {
  teams: Team[];
  locale: string;
}

export function CommunityClient({ teams, locale }: Props) {
  const isFr = locale === 'fr';
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? teams.filter((t) =>
        t.name_fr.toLowerCase().includes(query.toLowerCase()) ||
        t.name_en.toLowerCase().includes(query.toLowerCase()) ||
        t.code.toLowerCase().includes(query.toLowerCase())
      )
    : teams;

  const grouped: Record<string, Team[]> = {};
  for (const t of filtered) {
    if (!grouped[t.continent]) grouped[t.continent] = [];
    grouped[t.continent].push(t);
  }

  const continents = query.trim()
    ? Object.keys(grouped)
    : CONTINENT_ORDER.filter((c) => grouped[c]?.length);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          {isFr ? 'Communauté fans' : 'Fan Community'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {isFr
            ? 'Rejoignez les fans de votre équipe au Canada — organisez des watch parties et retrouvez votre tribu.'
            : 'Join your team\'s fans in Canada — organize watch parties and find your tribe.'}
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mx-auto mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isFr ? 'Chercher une équipe...' : 'Search a team...'}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
      </div>

      {/* Teams grouped by continent */}
      {continents.length === 0 ? (
        <p className="text-center text-slate-400 py-12">
          {isFr ? 'Aucune équipe trouvée.' : 'No team found.'}
        </p>
      ) : (
        continents.map((continent) => (
          <div key={continent} className="mb-8">
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              {isFr ? CONTINENT_LABELS[continent]?.fr : CONTINENT_LABELS[continent]?.en ?? continent}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {grouped[continent].map((team) => (
                <Link
                  key={team.code}
                  href={`/${locale}/community/${team.code.toLowerCase()}`}
                  className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 hover:border-primary-400 hover:shadow-md transition-all group"
                >
                  <img
                    src={team.flag_url}
                    alt={isFr ? team.name_fr : team.name_en}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://flagcdn.com/w40/${team.code.toLowerCase()}.png`; }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                      {isFr ? team.name_fr : team.name_en}
                    </p>
                    <p className="text-xs text-slate-400">Groupe {team.group_letter}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
