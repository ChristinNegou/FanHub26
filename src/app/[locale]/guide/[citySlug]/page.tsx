import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Trophy } from 'lucide-react';
import { cities, getCityBySlug } from '@/data/cities';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fan-hub26.vercel.app';

interface PageProps {
  params: { locale: string; citySlug: string };
}

export function generateStaticParams() {
  return cities.map((c) => ({ citySlug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const city = getCityBySlug(params.citySlug);
  if (!city) return { title: 'Ville introuvable' };

  const isFr = params.locale === 'fr';
  const name = isFr ? city.name_fr : city.name_en;
  const title = `${name} — Guide Coupe du Monde 2026 | FanHub26`;
  const description = isFr ? city.description_fr : city.description_en;
  const ogTitle = `Guide ${name} — FIFA World Cup 2026`;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description,
      images: [{ url: `${BASE_URL}/api/og?title=${encodeURIComponent(ogTitle)}&sub=${encodeURIComponent(`${isFr ? city.province_fr : city.province_en} · FanHub26`)}`, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `${BASE_URL}/${params.locale}/guide/${params.citySlug}`,
      languages: {
        fr: `${BASE_URL}/fr/guide/${params.citySlug}`,
        en: `${BASE_URL}/en/guide/${params.citySlug}`,
      },
    },
  };
}

export default function CityGuidePage({ params }: PageProps) {
  const city = getCityBySlug(params.citySlug);
  if (!city) notFound();

  const isFr = params.locale === 'fr';
  const name = isFr ? city.name_fr : city.name_en;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href={`/${params.locale}/guide`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 dark:hover:text-primary-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {isFr ? 'Toutes les villes' : 'All cities'}
      </Link>

      {/* Hero */}
      <div
        className="relative h-44 md:h-56 rounded-2xl overflow-hidden mb-6 flex flex-col justify-end p-6"
        style={{ background: `linear-gradient(135deg, ${city.color_from}, ${city.color_to})` }}
      >
        <span className="absolute top-4 right-6 text-7xl opacity-15 select-none">{city.emoji}</span>
        {city.is_host_city && (
          <span className="inline-flex items-center gap-1 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full mb-2 w-fit">
            <Trophy className="w-3 h-3" />
            {isFr ? 'Ville hôte' : 'Host city'}
          </span>
        )}
        <h1 className="text-3xl font-bold text-white">{name}</h1>
        <p className="text-white/70 text-sm mt-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          {isFr ? city.province_fr : city.province_en}
        </p>
      </div>

      {/* Description */}
      <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
        {isFr ? city.description_fr : city.description_en}
      </p>

      {/* Transport */}
      <Section title={isFr ? '🚇 Transport' : '🚇 Getting Around'}>
        <div className="flex flex-col gap-3">
          {city.transport.map((t, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <div className="font-semibold text-slate-800 dark:text-slate-100 mb-0.5">
                {t.emoji} {isFr ? t.title_fr : t.title_en}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isFr ? t.description_fr : t.description_en}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Restaurants */}
      <Section title={isFr ? '🍽️ Où manger' : '🍽️ Where to Eat'}>
        <div className="flex flex-col gap-3">
          {city.restaurants.map((r, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{r.name}</span>
                  <span className="text-xs text-slate-400">{isFr ? r.category_fr : r.category_en}</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {isFr ? r.description_fr : r.description_en}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  📍 {isFr ? r.neighborhood_fr : r.neighborhood_en}
                </p>
              </div>
              <PriceBadge price={r.price} />
            </div>
          ))}
        </div>
      </Section>

      {/* Hotels */}
      <Section title={isFr ? '🏨 Où dormir' : '🏨 Where to Stay'}>
        <div className="flex flex-col gap-3">
          {city.hotels.map((h, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {isFr ? h.neighborhood_fr : h.neighborhood_en}
                </span>
                <span className="text-sm font-medium text-primary-700 dark:text-primary-400 shrink-0">
                  {isFr ? h.price_fr : h.price_en}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isFr ? h.tip_fr : h.tip_en}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Activities */}
      <Section title={isFr ? '🎯 À faire' : '🎯 Things to Do'}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {city.activities.map((a, i) => (
            <div key={i} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
              <div className="font-semibold text-slate-800 dark:text-slate-100 mb-1">
                {a.emoji} {isFr ? a.name_fr : a.name_en}
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isFr ? a.description_fr : a.description_en}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Practical info */}
      <Section title={isFr ? 'ℹ️ Infos pratiques' : 'ℹ️ Practical Info'}>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl divide-y divide-slate-200 dark:divide-slate-700">
          <PracticalRow label={isFr ? '🗣️ Langue' : '🗣️ Language'} value={isFr ? city.practical.language_fr : city.practical.language_en} />
          <PracticalRow label={isFr ? '💵 Monnaie' : '💵 Currency'} value={isFr ? city.practical.currency_fr : city.practical.currency_en} />
          <PracticalRow label={isFr ? '🤝 Pourboire' : '🤝 Tipping'} value={isFr ? city.practical.tip_fr : city.practical.tip_en} />
          <PracticalRow label={isFr ? '🚨 Urgences' : '🚨 Emergency'} value={isFr ? city.practical.emergency_fr : city.practical.emergency_en} />
          {(isFr ? city.practical.app_fr : city.practical.app_en) && (
            <PracticalRow label="📱 Apps" value={(isFr ? city.practical.app_fr : city.practical.app_en)!} />
          )}
        </div>
      </Section>

      {/* CTA */}
      <div className="mt-10 p-5 rounded-2xl text-center"
        style={{ background: `linear-gradient(135deg, ${city.color_from}22, ${city.color_to}22)` }}
      >
        <p className="font-semibold text-slate-800 dark:text-slate-100 mb-3">
          {isFr
            ? `Trouver un bar qui diffuse les matchs à ${name}`
            : `Find a bar showing the matches in ${name}`}
        </p>
        <Link
          href={`/${params.locale}/watch?city=${name}`}
          className="inline-block bg-primary-700 hover:bg-primary-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          {isFr ? 'Watch Party Finder →' : 'Watch Party Finder →'}
        </Link>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">{title}</h2>
      {children}
    </section>
  );
}

function PracticalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-4 py-3 flex flex-col sm:flex-row sm:gap-4">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-32 shrink-0">{label}</span>
      <span className="text-sm text-slate-500 dark:text-slate-400">{value}</span>
    </div>
  );
}

function PriceBadge({ price }: { price: '$' | '$$' | '$$$' | '$$$$' }) {
  const colors: Record<string, string> = {
    '$': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    '$$': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    '$$$': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    '$$$$': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-lg h-fit shrink-0 ${colors[price]}`}>
      {price}
    </span>
  );
}
