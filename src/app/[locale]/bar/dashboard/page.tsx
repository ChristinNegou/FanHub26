'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3, MapPin, Settings, Star, Eye, Loader2,
  CheckCircle2, AlertCircle, PlusCircle, ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import type { Bar } from '@/lib/types/bar';

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
  const { user, loading: authLoading, signOut } = useAuth();

  const [bar, setBar] = useState<Bar | null>(null);
  const [barLoading, setBarLoading] = useState(true);
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [selectedMatchIds, setSelectedMatchIds] = useState<Set<string>>(new Set());
  const [savingMatches, setSavingMatches] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Redirect to register if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/bar/register`);
    }
  }, [user, authLoading, locale, router]);

  // Fetch owner's bar
  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    supabase
      .from('bars')
      .select('*')
      .eq('owner_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setBar(data);
        setBarLoading(false);
      });
  }, [user]);

  // Fetch upcoming matches + already selected ones
  useEffect(() => {
    if (!bar) return;
    const supabase = createClient();

    Promise.all([
      fetch('/api/matches').then((r) => r.json()),
      supabase
        .from('bar_matches')
        .select('match_id')
        .eq('bar_id', bar.id),
    ]).then(([matchData, { data: barMatchData }]) => {
      setMatches(matchData.matches ?? []);
      setSelectedMatchIds(new Set((barMatchData ?? []).map((bm: any) => bm.match_id)));
    });
  }, [bar]);

  const toggleMatch = (matchId: string) => {
    setSelectedMatchIds((prev) => {
      const next = new Set(prev);
      if (next.has(matchId)) next.delete(matchId);
      else next.add(matchId);
      return next;
    });
    setSaveSuccess(false);
  };

  const saveMatches = async () => {
    if (!bar) return;
    setSavingMatches(true);

    const supabase = createClient();

    // Fetch current bar_matches
    const { data: current } = await supabase
      .from('bar_matches')
      .select('match_id')
      .eq('bar_id', bar.id);

    const currentIds = new Set((current ?? []).map((bm: any) => bm.match_id));
    const toAdd = Array.from(selectedMatchIds).filter((id) => !currentIds.has(id));
    const toRemove = Array.from(currentIds).filter((id) => !selectedMatchIds.has(id));

    if (toAdd.length) {
      await supabase.from('bar_matches').insert(
        toAdd.map((match_id) => ({ bar_id: bar.id, match_id, sound_on: bar.has_sound })),
      );
    }
    if (toRemove.length) {
      await supabase
        .from('bar_matches')
        .delete()
        .eq('bar_id', bar.id)
        .in('match_id', toRemove);
    }

    setSavingMatches(false);
    setSaveSuccess(true);
  };

  if (authLoading || barLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-3xl flex flex-col gap-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (!user) return null;

  // No bar yet → prompt to register
  if (!bar) {
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

  const matchLabel = (m: MatchRow) => {
    const home = isFr
      ? (m.home_team_name_fr ?? m.home_team_placeholder ?? '?')
      : (m.home_team_name_en ?? m.home_team_placeholder ?? '?');
    const away = isFr
      ? (m.away_team_name_fr ?? m.away_team_placeholder ?? '?')
      : (m.away_team_name_en ?? m.away_team_placeholder ?? '?');
    const dt = new Date(m.kickoff_utc);
    return {
      teams: `${home} vs ${away}`,
      date: dt.toLocaleDateString(isFr ? 'fr-CA' : 'en-CA', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: dt.toLocaleTimeString(isFr ? 'fr-CA' : 'en-CA', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Toronto' }),
    };
  };

  // Group matches by date
  const matchesByDate = matches.reduce<Record<string, MatchRow[]>>((acc, m) => {
    const date = new Date(m.kickoff_utc).toLocaleDateString(isFr ? 'fr-CA' : 'en-CA', {
      weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Toronto',
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(m);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{bar.name}</h1>
          <div className="flex items-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            {bar.city}, {bar.province}
          </div>
        </div>
        <div className="flex gap-2">
          {bar.is_featured && <Badge variant="featured">⭐ Featured</Badge>}
          {bar.is_verified && <Badge variant="verified">✓ {isFr ? 'Vérifié' : 'Verified'}</Badge>}
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Eye, label: isFr ? 'Vues' : 'Views', value: '—' },
          { icon: Star, label: isFr ? 'Note moy.' : 'Avg. rating', value: '—' },
          { icon: BarChart3, label: isFr ? 'Matchs diffusés' : 'Matches showing', value: selectedMatchIds.size.toString() },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
            <Icon className="w-5 h-5 text-primary-700 dark:text-primary-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Public page link */}
      <div className="flex items-center gap-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl px-4 py-3 text-sm">
        <CheckCircle2 className="w-4 h-4 text-primary-700 dark:text-primary-400 shrink-0" />
        <span className="text-slate-700 dark:text-slate-300">
          {isFr ? 'Votre page publique : ' : 'Your public page: '}
        </span>
        <Link
          href={`/${locale}/bar/${bar.slug}`}
          className="text-primary-700 dark:text-primary-400 hover:underline font-medium flex items-center gap-1"
        >
          /bar/{bar.slug}
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

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
          {isFr
            ? `${selectedMatchIds.size} match${selectedMatchIds.size !== 1 ? 's' : ''} sélectionné${selectedMatchIds.size !== 1 ? 's' : ''}`
            : `${selectedMatchIds.size} match${selectedMatchIds.size !== 1 ? 'es' : ''} selected`}
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
                        selected
                          ? 'bg-primary-700 border-primary-700'
                          : 'border-slate-300 dark:border-slate-600'
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
