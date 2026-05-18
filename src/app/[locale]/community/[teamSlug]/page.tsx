import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Users, Calendar, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import teamsData from '@/data/teams.json';
import { flagUrl2x } from '@/lib/utils/fifaFlags';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fan-hub26.vercel.app';

interface PageProps {
  params: { locale: string; teamSlug: string };
}

function getTeam(slug: string) {
  return teamsData.teams.find((t) => t.code.toLowerCase() === slug.toLowerCase());
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const team = getTeam(params.teamSlug);
  if (!team) return { title: 'Équipe introuvable' };

  const isFr = params.locale === 'fr';
  const name = isFr ? team.name_fr : team.name_en;
  const title = isFr
    ? `Communauté ${name} au Canada — FanHub26`
    : `${name} Fan Community in Canada — FanHub26`;
  const description = isFr
    ? `Rejoignez les fans de ${name} au Canada pour la Coupe du Monde 2026. Watch parties, meetups et communauté de supporters.`
    : `Join ${name} fans in Canada for the 2026 World Cup. Watch parties, meetups and supporters community.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&sub=FanHub26`, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `${BASE_URL}/${params.locale}/community/${params.teamSlug}`,
    },
  };
}

export default async function TeamCommunityPage({ params }: PageProps) {
  const team = getTeam(params.teamSlug);
  if (!team) notFound();

  const isFr = params.locale === 'fr';
  const name = isFr ? team.name_fr : team.name_en;
  const flag = flagUrl2x(team.code);

  let events: Array<{
    id: string;
    title: string;
    description: string | null;
    city: string;
    address: string | null;
    event_date: string;
    max_attendees: number | null;
    current_attendees: number;
  }> = [];

  let fanCount = 0;

  try {
    const supabase = createClient();

    const { data: teamRow } = await supabase
      .from('teams')
      .select('id')
      .eq('code', team.code)
      .single();

    if (teamRow) {
      const { data: eventRows } = await supabase
        .from('community_events')
        .select('id, title, description, city, address, event_date, max_attendees, current_attendees')
        .eq('team_id', teamRow.id)
        .eq('is_active', true)
        .gte('event_date', new Date().toISOString())
        .order('event_date', { ascending: true })
        .limit(20);

      events = eventRows ?? [];

      const { count } = await supabase
        .from('user_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('favorite_team_id', teamRow.id);

      fanCount = count ?? 0;
    }
  } catch {
    // DB unavailable — show empty state
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href={`/${params.locale}/community`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 dark:hover:text-primary-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {isFr ? 'Toutes les équipes' : 'All teams'}
      </Link>

      {/* Hero */}
      <div className="flex items-center gap-5 mb-6">
        {flag ? (
          <img
            src={flag}
            alt={name}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-lg"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 border-4 border-white dark:border-slate-700 shadow-lg flex items-center justify-center text-2xl font-bold text-primary-700">
            {team.code}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{name}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
            {isFr ? `Groupe ${team.group_letter}` : `Group ${team.group_letter}`}
          </p>
          {fanCount > 0 && (
            <p className="flex items-center gap-1.5 text-sm text-primary-700 dark:text-primary-400 mt-1 font-medium">
              <Users className="w-4 h-4" />
              {fanCount} {isFr ? 'fans au Canada' : 'fans in Canada'}
            </p>
          )}
        </div>
      </div>

      {/* Create meetup CTA */}
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-slate-800 dark:text-slate-100">
            {isFr ? `Organisez un watch party ${name}` : `Organize a ${name} watch party`}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {isFr
              ? 'Invitez des fans de votre équipe dans votre ville'
              : 'Invite fans of your team in your city'}
          </p>
        </div>
        <Link
          href={`/${params.locale}/community/${params.teamSlug}/create`}
          className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          {isFr ? 'Créer un meetup' : 'Create a meetup'}
        </Link>
      </div>

      {/* Events list */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          {isFr ? 'Watch parties à venir' : 'Upcoming watch parties'}
        </h2>

        {events.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-2xl">
            <p className="text-4xl mb-3">🏟️</p>
            <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isFr ? "Aucun meetup prévu pour l'instant" : 'No meetups scheduled yet'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isFr
                ? 'Soyez le premier à organiser un watch party dans votre ville !'
                : 'Be the first to organize a watch party in your city!'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {events.map((event) => {
              const date = new Date(event.event_date);
              const spotsLeft = event.max_attendees
                ? event.max_attendees - event.current_attendees
                : null;
              const isFull = spotsLeft !== null && spotsLeft <= 0;

              return (
                <div
                  key={event.id}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{event.title}</h3>
                    {isFull ? (
                      <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full font-medium shrink-0">
                        {isFr ? 'Complet' : 'Full'}
                      </span>
                    ) : spotsLeft !== null ? (
                      <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-medium shrink-0">
                        {spotsLeft} {isFr ? 'places' : 'spots'}
                      </span>
                    ) : null}
                  </div>

                  {event.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{event.description}</p>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {date.toLocaleDateString(isFr ? 'fr-CA' : 'en-CA', {
                        weekday: 'short', month: 'short', day: 'numeric',
                      })}{' '}
                      {date.toLocaleTimeString(isFr ? 'fr-CA' : 'en-CA', {
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                    {event.address && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {event.address}, {event.city}
                      </span>
                    )}
                    {event.current_attendees > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {event.current_attendees} {isFr ? 'inscrits' : 'attending'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Watch finder CTA */}
      <div className="mt-10 p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center">
        <p className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
          {isFr
            ? `Trouver un bar pour regarder ${name}`
            : `Find a bar to watch ${name}`}
        </p>
        <Link
          href={`/${params.locale}/watch`}
          className="inline-block bg-primary-700 hover:bg-primary-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          Watch Party Finder →
        </Link>
      </div>
    </div>
  );
}
