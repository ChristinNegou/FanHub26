import type { Metadata } from 'next';
import { WatchClient } from '@/components/watch/WatchClient';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fanhub26.ca';

export async function generateMetadata({
  params: { locale },
}: { params: { locale: string } }): Promise<Metadata> {
  const isFr = locale === 'fr';
  const title = isFr ? 'Trouver un bar — Watch Party Finder' : 'Find a Bar — Watch Party Finder';
  const description = isFr
    ? 'Carte interactive des bars qui diffusent la Coupe du Monde 2026 près de vous. Filtres son, écran géant, terrasse.'
    : 'Interactive map of bars showing the 2026 World Cup near you. Sound, big screen, patio filters.';
  const ogTitle = isFr ? 'Trouver un bar pour la Coupe du Monde' : 'Find a World Cup Bar Near You';
  const ogSub = isFr ? 'Carte interactive · Son · Écran géant · Terrasse' : 'Interactive map · Sound · Big screen · Patio';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: `${BASE_URL}/api/og?title=${encodeURIComponent(ogTitle)}&sub=${encodeURIComponent(ogSub)}`, width: 1200, height: 630 }],
    },
  };
}

export default function WatchPage({
  params: { locale },
  searchParams,
}: {
  params: { locale: string };
  searchParams: { matchId?: string };
}) {
  return <WatchClient locale={locale} initialMatchId={searchParams.matchId ?? null} />;
}
