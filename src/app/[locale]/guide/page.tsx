import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Trophy } from 'lucide-react';
import { cities } from '@/data/cities';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fan-hub26.vercel.app';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const isFr = locale === 'fr';
  const title = isFr
    ? 'Guide des villes — Coupe du Monde 2026 Canada'
    : 'City Guide — FIFA World Cup 2026 Canada';
  const description = isFr
    ? 'Guide complet des villes hôtes de la Coupe du Monde 2026 au Canada : transport, restaurants, hôtels et activités à Montréal, Québec, Toronto et Vancouver.'
    : 'Complete guide to FIFA World Cup 2026 host cities in Canada: transport, restaurants, hotels and activities in Montreal, Quebec City, Toronto and Vancouver.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: `${BASE_URL}/api/og?title=${encodeURIComponent(title)}&sub=FanHub26`, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `${BASE_URL}/${locale}/guide`,
      languages: { fr: `${BASE_URL}/fr/guide`, en: `${BASE_URL}/en/guide` },
    },
  };
}

export default function GuidePage({ params: { locale } }: PageProps) {
  const isFr = locale === 'fr';

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
          {isFr ? 'Guide des villes' : 'City Guide'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          {isFr
            ? 'Tout ce qu\'il faut savoir pour vivre la Coupe du Monde 2026 au Canada.'
            : 'Everything you need to know to experience the 2026 World Cup in Canada.'}
        </p>
      </div>

      {/* City grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cities.map((city) => (
          <Link
            key={city.slug}
            href={`/${locale}/guide/${city.slug}`}
            className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* Gradient background */}
            <div
              className="h-48 w-full flex flex-col justify-end p-5"
              style={{ background: `linear-gradient(135deg, ${city.color_from}, ${city.color_to})` }}
            >
              {/* Emoji watermark */}
              <span className="absolute top-4 right-5 text-5xl opacity-20 select-none group-hover:opacity-30 transition-opacity">
                {city.emoji}
              </span>

              {/* Host city badge */}
              {city.is_host_city && (
                <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-0.5 rounded-full mb-2 w-fit">
                  <Trophy className="w-3 h-3" />
                  {isFr ? 'Ville hôte' : 'Host city'}
                </span>
              )}

              {/* City name */}
              <h2 className="text-2xl font-bold text-white">
                {isFr ? city.name_fr : city.name_en}
              </h2>
              <p className="text-white/70 text-sm mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {isFr ? city.province_fr : city.province_en}
              </p>
            </div>

            {/* Card body */}
            <div className="bg-white dark:bg-slate-800 px-5 py-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {isFr ? city.tagline_fr : city.tagline_en}
              </p>
              <div className="flex gap-3 mt-3 text-xs text-slate-400 dark:text-slate-500 flex-wrap">
                <span>🍽️ {city.restaurants.length} {isFr ? 'restos' : 'restaurants'}</span>
                <span>🚇 {city.transport.length} {isFr ? 'options transport' : 'transport options'}</span>
                <span>🎯 {city.activities.length} {isFr ? 'activités' : 'activities'}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
