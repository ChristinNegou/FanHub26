import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CalendarClient } from '@/components/match/CalendarClient';
import teamsData from '@/data/teams.json';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isFr = locale === 'fr';
  return {
    title: isFr
      ? 'Calendrier des 104 matchs — Coupe du Monde 2026 | FanHub26'
      : '104-Match Schedule — 2026 World Cup | FanHub26',
    description: isFr
      ? 'Tous les matchs de la Coupe du Monde FIFA 2026 avec horaires en heure de l\'Est, du Centre, des Rocheuses et du Pacifique. Filtrez par équipe, ville ou phase.'
      : 'All 2026 FIFA World Cup matches with Eastern, Central, Mountain and Pacific times. Filter by team, city, or stage.',
  };
}

export default async function CalendarPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isFr = locale === 'fr';
  const supabase = createClient();

  const { data, error } = await supabase
    .from('upcoming_matches')
    .select('*')
    .order('kickoff_utc', { ascending: true });

  if (error) console.error('Calendar fetch error:', error);

  const matches = (data ?? []).map((m: any) => ({
    id: m.id,
    match_number: m.match_number,
    stage: m.stage,
    group_letter: m.group_letter,
    home_team_id: m.home_team_id,
    away_team_id: m.away_team_id,
    home_team_name_fr: m.home_team_name_fr ?? null,
    home_team_name_en: m.home_team_name_en ?? null,
    home_team_code: m.home_team_code ?? null,
    home_team_flag: m.home_team_flag ?? null,
    home_team_placeholder: m.home_team_placeholder ?? null,
    away_team_name_fr: m.away_team_name_fr ?? null,
    away_team_name_en: m.away_team_name_en ?? null,
    away_team_code: m.away_team_code ?? null,
    away_team_flag: m.away_team_flag ?? null,
    away_team_placeholder: m.away_team_placeholder ?? null,
    kickoff_utc: m.kickoff_utc,
    venue_name: m.venue_name ?? '',
    venue_city: m.venue_city ?? '',
    status: m.status ?? 'scheduled',
    bars_showing: m.bars_showing ?? 0,
  }));

  const teams = teamsData.teams
    .map((t) => ({ code: t.code, name_fr: t.name_fr, name_en: t.name_en }))
    .sort((a, b) =>
      (isFr ? a.name_fr : a.name_en).localeCompare(
        isFr ? b.name_fr : b.name_en,
        isFr ? 'fr' : 'en',
      ),
    );

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
          {isFr ? 'Calendrier des matchs' : 'Match schedule'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {isFr
            ? `${matches.length} matchs · du 11 juin au 19 juillet 2026`
            : `${matches.length} matches · June 11 to July 19, 2026`}
        </p>
      </div>

      <CalendarClient matches={matches} teams={teams} locale={locale} />
    </div>
  );
}
