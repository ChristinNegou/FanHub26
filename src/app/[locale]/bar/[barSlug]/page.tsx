import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Phone, Globe, Instagram, Volume2, Tv, TreePine, UtensilsCrossed, Star, ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/Badge';
import { BarReviewForm } from '@/components/bar/BarReviewForm';
import { ShareButton } from '@/components/ui/ShareButton';
import { SaveButton } from '@/components/ui/SaveButton';

interface PageProps {
  params: { locale: string; barSlug: string };
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fanhub26.ca';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: bar } = await supabase
    .from('bars')
    .select('name, description_fr, description_en, city, cover_image_url')
    .eq('slug', params.barSlug)
    .single();

  if (!bar) return { title: 'Bar introuvable' };

  const isFr = params.locale === 'fr';
  const desc = (isFr ? bar.description_fr : bar.description_en)
    ?? `${bar.name} diffuse les matchs de la Coupe du Monde 2026 à ${bar.city}.`;
  const title = `${bar.name} — Coupe du Monde 2026 | FanHub26`;
  const ogTitle = `${bar.name} — ${isFr ? 'Watch Party Coupe du Monde 2026' : 'World Cup 2026 Watch Party'}`;
  const ogSub = `${bar.city} · FanHub26`;

  return {
    title,
    description: desc,
    openGraph: {
      title: ogTitle,
      description: desc,
      images: bar.cover_image_url
        ? [{ url: bar.cover_image_url, width: 800, height: 800 }]
        : [{ url: `${BASE_URL}/api/og?title=${encodeURIComponent(ogTitle)}&sub=${encodeURIComponent(ogSub)}`, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: ogTitle, description: desc },
    alternates: {
      canonical: `${BASE_URL}/${params.locale}/bar/${params.barSlug}`,
    },
  };
}

export default async function BarPublicPage({ params }: PageProps) {
  const { locale, barSlug } = params;
  const isFr = locale === 'fr';

  const supabase = createClient();
  const { data: bar } = await supabase
    .from('bars')
    .select('*')
    .eq('slug', barSlug)
    .eq('is_active', true)
    .single();

  if (!bar) notFound();

  const { data: reviews } = await supabase
    .from('bar_reviews')
    .select('rating, comment, atmosphere_rating, sound_quality_rating, created_at')
    .eq('bar_id', bar.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const avgRating = reviews?.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null;

  const description = isFr ? bar.description_fr : bar.description_en;

  const atmosphereLabel: Record<string, string> = {
    lively: isFr ? 'Festif / animé' : 'Lively',
    chill: isFr ? 'Décontracté' : 'Chill',
    sports_bar: isFr ? 'Bar sportif' : 'Sports bar',
    pub: 'Pub',
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BarOrPub',
    name: bar.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: bar.address,
      addressLocality: bar.city,
      addressRegion: bar.province,
      postalCode: bar.postal_code ?? undefined,
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: bar.latitude,
      longitude: bar.longitude,
    },
    ...(bar.phone && { telephone: bar.phone }),
    ...(bar.website && { url: bar.website }),
    ...(bar.cover_image_url && { image: bar.cover_image_url }),
    ...(avgRating !== null && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviews!.length,
        bestRating: 5,
      },
    }),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back link */}
      <Link
        href={`/${locale}/watch`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 dark:hover:text-primary-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {isFr ? 'Retour au Watch Finder' : 'Back to Watch Finder'}
      </Link>

      {/* Cover + gallery strip */}
      <div className="mb-6">
        <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900">
          {bar.cover_image_url ? (
            <img src={bar.cover_image_url} alt={bar.name} className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/10 text-8xl font-bold select-none">
              {bar.name.charAt(0)}
            </div>
          )}
          <div className="absolute bottom-4 left-4 flex gap-2">
            {bar.is_featured && <Badge variant="featured">⭐ Featured</Badge>}
            {bar.is_verified && <Badge variant="verified">✓ {isFr ? 'Vérifié' : 'Verified'}</Badge>}
          </div>
        </div>

        {/* Gallery thumbnails */}
        {bar.gallery_images?.length > 0 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
            {bar.gallery_images.map((url: string, i: number) => (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="shrink-0">
                <img
                  src={url}
                  alt={`${bar.name} photo ${i + 2}`}
                  className="h-20 w-20 object-cover rounded-xl border border-slate-200 dark:border-slate-700 hover:opacity-90 transition-opacity"
                />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{bar.name}</h1>
          <div className="flex items-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span>{bar.address}, {bar.city}, {bar.province}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <SaveButton
              id={bar.id}
              type="bar"
              label={isFr ? 'Sauvegarder' : 'Save'}
              labelSaved={isFr ? 'Sauvegardé' : 'Saved'}
            />
            <ShareButton
              title={`${bar.name} — FanHub26`}
              text={isFr ? `Regardez les matchs de la Coupe du Monde 2026 au ${bar.name} à ${bar.city}` : `Watch the 2026 World Cup at ${bar.name} in ${bar.city}`}
              label={isFr ? 'Partager' : 'Share'}
            />
          </div>
        </div>
        {avgRating !== null && (
          <div className="flex flex-col items-center bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-2 shrink-0">
            <span className="text-2xl font-bold text-amber-600">{avgRating.toFixed(1)}</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(avgRating) ? 'text-amber-500 fill-current' : 'text-slate-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 mt-0.5">{reviews!.length} {isFr ? 'avis' : 'reviews'}</span>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-2 mb-6">
        {bar.has_sound && (
          <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1.5 rounded-full text-sm font-medium">
            <Volume2 className="w-4 h-4" />
            {isFr ? 'Son activé' : 'Sound on'}
          </span>
        )}
        {bar.has_projector && (
          <span className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1.5 rounded-full text-sm font-medium">
            <Tv className="w-4 h-4" />
            {bar.num_screens} {bar.num_screens > 1 ? (isFr ? 'écrans' : 'screens') : (isFr ? 'écran' : 'screen')}
          </span>
        )}
        {bar.has_outdoor && (
          <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-3 py-1.5 rounded-full text-sm font-medium">
            <TreePine className="w-4 h-4" />
            {isFr ? 'Terrasse' : 'Outdoor'}
          </span>
        )}
        {bar.has_food && (
          <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-3 py-1.5 rounded-full text-sm font-medium">
            <UtensilsCrossed className="w-4 h-4" />
            {isFr ? 'Nourriture' : 'Food'}
          </span>
        )}
        {bar.atmosphere && (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full text-sm font-medium">
            {atmosphereLabel[bar.atmosphere] ?? bar.atmosphere}
          </span>
        )}
        {bar.capacity && (
          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full text-sm font-medium">
            👥 {bar.capacity} {isFr ? 'personnes' : 'people'}
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{description}</p>
      )}

      {/* Contact */}
      <div className="flex flex-wrap gap-3 mb-8">
        {bar.phone && (
          <a
            href={`tel:${bar.phone}`}
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
          >
            <Phone className="w-4 h-4" />
            {bar.phone}
          </a>
        )}
        {bar.website && (
          <a
            href={bar.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary-700 dark:text-primary-400 hover:underline"
          >
            <Globe className="w-4 h-4" />
            {isFr ? 'Site web' : 'Website'}
          </a>
        )}
        {bar.instagram && (
          <a
            href={`https://instagram.com/${bar.instagram.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-pink-600 dark:text-pink-400 hover:underline"
          >
            <Instagram className="w-4 h-4" />
            {bar.instagram.startsWith('@') ? bar.instagram : `@${bar.instagram}`}
          </a>
        )}
        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${bar.address}, ${bar.city}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors"
        >
          <MapPin className="w-4 h-4" />
          {isFr ? 'Itinéraire' : 'Directions'}
        </a>
      </div>

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            {isFr ? 'Avis' : 'Reviews'}
          </h2>
          <div className="flex flex-col gap-3">
            {reviews.map((review, i) => (
              <div
                key={i}
                className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`w-4 h-4 ${j < review.rating ? 'text-amber-500 fill-current' : 'text-slate-300'}`}
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-2">
                    {new Date(review.created_at).toLocaleDateString(isFr ? 'fr-CA' : 'en-CA', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-slate-600 dark:text-slate-400">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Write a review */}
      <BarReviewForm barId={bar.id} locale={locale} />
    </div>
  );
}
