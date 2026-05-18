import type { Metadata } from 'next';
import { FanZonesClient } from '@/components/fanzones/FanZonesClient';
import fanzonesData from '@/data/fanzones.json';
import type { FanZone } from '@/lib/types/fanzone';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fan-hub26.vercel.app';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const isFr = locale === 'fr';
  const title = isFr
    ? 'Fan zones — Coupe du Monde 2026 Canada'
    : 'Fan Zones — FIFA World Cup 2026 Canada';
  const description = isFr
    ? 'Toutes les fan zones officielles FIFA, organisées par les villes et communautaires pour la Coupe du Monde 2026 au Canada — Toronto, Vancouver, Montréal, Québec.'
    : 'All official FIFA, city-organized and community fan zones for the 2026 World Cup in Canada — Toronto, Vancouver, Montreal, Quebec City.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&sub=FanHub26`, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/fanzones`,
      languages: { fr: `${BASE_URL}/fr/fanzones`, en: `${BASE_URL}/en/fanzones` },
    },
  };
}

export default function FanZonesPage({ params: { locale } }: PageProps) {
  return (
    <FanZonesClient
      fanzones={fanzonesData.fanzones as unknown as FanZone[]}
      locale={locale}
    />
  );
}
