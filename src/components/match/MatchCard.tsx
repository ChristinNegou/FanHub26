'use client';

import Link from 'next/link';
import { MapPin, CalendarPlus, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatMatchTime } from '@/lib/utils/dates';
import { getFlagUrl } from '@/lib/utils/flags';

export interface CalendarMatch {
  id: string;
  match_number: number;
  stage: string;
  group_letter: string | null;
  home_team_id: string | null;
  away_team_id: string | null;
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
  status: string;
  bars_showing: number;
}

const STAGE_LABELS: Record<string, { fr: string; en: string }> = {
  group:         { fr: 'Phase de groupes', en: 'Group stage' },
  round_of_32:   { fr: '32es de finale',   en: 'Round of 32' },
  round_of_16:   { fr: '8es de finale',    en: 'Round of 16' },
  quarter_final: { fr: 'Quart de finale',  en: 'Quarter-final' },
  semi_final:    { fr: 'Demi-finale',       en: 'Semi-final' },
  third_place:   { fr: '3e place',          en: '3rd place' },
  final:         { fr: 'Finale',            en: 'Final' },
};

function toIcalDate(utc: string) {
  return new Date(utc).toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
}

function TeamFlag({ code }: { code: string | null }) {
  const url = getFlagUrl(code);
  if (url) {
    return (
      <img
        src={url}
        alt={code ?? ''}
        width={28}
        height={21}
        className="rounded object-cover border border-slate-200 dark:border-slate-600 shrink-0"
      />
    );
  }
  return (
    <div className="w-7 h-5 rounded bg-slate-200 dark:bg-slate-600 flex items-center justify-center text-xs shrink-0">
      ?
    </div>
  );
}

interface MatchCardProps {
  match: CalendarMatch;
  timezone: string;
  locale: string;
}

export function MatchCard({ match: m, timezone, locale }: MatchCardProps) {
  const isFr = locale === 'fr';

  const homeName = isFr ? (m.home_team_name_fr ?? m.home_team_placeholder ?? '?')
                        : (m.home_team_name_en ?? m.home_team_placeholder ?? '?');
  const awayName = isFr ? (m.away_team_name_fr ?? m.away_team_placeholder ?? '?')
                        : (m.away_team_name_en ?? m.away_team_placeholder ?? '?');

  const time = formatMatchTime(m.kickoff_utc, timezone, locale);
  const stageLabel = STAGE_LABELS[m.stage] ?? { fr: m.stage, en: m.stage };
  const stageFull = isFr
    ? stageLabel.fr + (m.group_letter ? ` — Groupe ${m.group_letter}` : '')
    : stageLabel.en + (m.group_letter ? ` — Group ${m.group_letter}` : '');

  const isLive = m.status === 'live';
  const isFinished = m.status === 'finished';

  // Google Calendar link
  const gcTitle = encodeURIComponent(`${homeName} vs ${awayName} — FIFA 2026`);
  const gcStart = toIcalDate(m.kickoff_utc);
  const gcEnd = toIcalDate(new Date(new Date(m.kickoff_utc).getTime() + 2 * 3600_000).toISOString());
  const gcDetails = encodeURIComponent(`${stageFull} · ${m.venue_name}, ${m.venue_city}`);
  const gcLocation = encodeURIComponent(`${m.venue_name}, ${m.venue_city}`);
  const gcLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${gcTitle}&dates=${gcStart}/${gcEnd}&details=${gcDetails}&location=${gcLocation}`;

  return (
    <div className={`
      bg-white dark:bg-slate-800 rounded-xl border transition-colors
      ${isLive ? 'border-red-400 dark:border-red-500 shadow-md shadow-red-100 dark:shadow-red-900/20' : 'border-slate-200 dark:border-slate-700'}
    `}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4">

        {/* Time */}
        <div className="flex flex-col items-start sm:items-center sm:w-20 shrink-0">
          {isLive ? (
            <Badge variant="live">EN DIRECT</Badge>
          ) : isFinished ? (
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              {isFr ? 'Terminé' : 'Finished'}
            </span>
          ) : (
            <span className="text-lg font-bold tabular-nums text-slate-900 dark:text-white">
              {time}
            </span>
          )}
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{stageFull}</span>
        </div>

        {/* Teams */}
        <div className="flex-1 flex flex-col gap-2">
          {/* Home */}
          <div className="flex items-center gap-2.5">
            <TeamFlag code={m.home_team_code} />
            <span className={`font-semibold text-sm ${isFinished ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
              {homeName}
            </span>
          </div>
          {/* Away */}
          <div className="flex items-center gap-2.5">
            <TeamFlag code={m.away_team_code} />
            <span className={`font-semibold text-sm ${isFinished ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
              {awayName}
            </span>
          </div>
        </div>

        {/* Venue + CTAs */}
        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3 h-3" />
            <span>{m.venue_city}</span>
          </div>

          {m.bars_showing > 0 && (
            <span className="text-xs text-primary-700 dark:text-primary-400 font-medium">
              📺 {m.bars_showing} {isFr ? 'bars' : 'bars'}
            </span>
          )}

          <div className="flex items-center gap-2 mt-1">
            {!isFinished && (
              <Link
                href={`/${locale}/watch?matchId=${m.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold bg-primary-700 text-white px-3 py-1.5 rounded-lg hover:bg-primary-800 transition-colors"
              >
                <MapPin className="w-3 h-3" />
                {isFr ? 'Trouver un bar' : 'Find a bar'}
              </Link>
            )}
            {!isFinished && (
              <a
                href={gcLink}
                target="_blank"
                rel="noopener noreferrer"
                title={isFr ? 'Ajouter à Google Calendar' : 'Add to Google Calendar'}
                className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors border border-slate-200 dark:border-slate-700 px-2 py-1.5 rounded-lg"
              >
                <CalendarPlus className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
