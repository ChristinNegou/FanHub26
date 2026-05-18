import type { Metadata } from 'next';
import { CommunityClient } from '@/components/community/CommunityClient';
import teamsData from '@/data/teams.json';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fan-hub26.vercel.app';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const isFr = locale === 'fr';
  const title = isFr
    ? 'Communauté fans — Coupe du Monde 2026 Canada'
    : 'Fan Community — FIFA World Cup 2026 Canada';
  const description = isFr
    ? 'Rejoignez la communauté de fans de votre équipe au Canada. Organisez des watch parties, trouvez des fans de votre nationalité à Montréal, Toronto ou Vancouver.'
    : 'Join your team\'s fan community in Canada. Organize watch parties and find fans of your nationality in Montreal, Toronto or Vancouver.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&sub=FanHub26`, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/community`,
      languages: { fr: `${BASE_URL}/fr/community`, en: `${BASE_URL}/en/community` },
    },
  };
}

export default function CommunityPage({ params: { locale } }: PageProps) {
  return <CommunityClient teams={teamsData.teams} locale={locale} />;
}
