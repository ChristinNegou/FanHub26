'use client';

import Link from 'next/link';
import { MapPin, Volume2, Tv, UtensilsCrossed, TreePine, Star, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { BarWithDistance } from '@/lib/types/bar';

interface BarCardProps {
  bar: BarWithDistance;
  locale: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function BarCard({ bar, locale, isSelected, onClick }: BarCardProps) {
  const isFr = locale === 'fr';

  return (
    <div
      onClick={onClick}
      className={`
        flex flex-col bg-white dark:bg-slate-800 rounded-xl border transition-all cursor-pointer
        hover:shadow-md hover:border-primary-300 dark:hover:border-primary-700
        ${isSelected
          ? 'border-primary-500 shadow-md ring-2 ring-primary-200 dark:ring-primary-800'
          : 'border-slate-200 dark:border-slate-700'
        }
      `}
    >
      {/* Cover image / placeholder */}
      <div className="relative aspect-square rounded-t-xl overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 flex-shrink-0">
        {bar.cover_image_url ? (
          <img
            src={bar.cover_image_url}
            alt={bar.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-5xl font-bold select-none">
            {bar.name.charAt(0)}
          </div>
        )}

        <div className="absolute top-2 left-2 flex gap-1.5">
          {bar.is_featured && (
            <Badge variant="featured">⭐ {isFr ? 'Mis en avant' : 'Featured'}</Badge>
          )}
          {bar.is_verified && (
            <Badge variant="verified">✓ {isFr ? 'Vérifié' : 'Verified'}</Badge>
          )}
        </div>
      </div>

      <div className="p-3 flex flex-col gap-2">
        {/* Name + distance */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">
            {bar.name}
          </h3>
          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <MapPin className="w-3 h-3" />
            {bar.distance_km < 1
              ? `${Math.round(bar.distance_km * 1000)} m`
              : `${bar.distance_km.toFixed(1)} km`}
          </span>
        </div>

        {/* Address */}
        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{bar.address}</p>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-1.5">
          {bar.has_sound && (
            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-0.5 rounded-full">
              <Volume2 className="w-3 h-3" />
              {isFr ? 'Son' : 'Sound'}
            </span>
          )}
          {bar.has_projector && (
            <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-2 py-0.5 rounded-full">
              <Tv className="w-3 h-3" />
              {bar.num_screens > 1 ? `${bar.num_screens} ${isFr ? 'écrans' : 'screens'}` : (isFr ? 'Écran géant' : 'Big screen')}
            </span>
          )}
          {bar.has_outdoor && (
            <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full">
              <TreePine className="w-3 h-3" />
              {isFr ? 'Terrasse' : 'Outdoor'}
            </span>
          )}
          {bar.has_food && (
            <span className="inline-flex items-center gap-1 text-xs bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 px-2 py-0.5 rounded-full">
              <UtensilsCrossed className="w-3 h-3" />
              {isFr ? 'Resto' : 'Food'}
            </span>
          )}
        </div>

        {/* Rating */}
        {bar.avg_rating > 0 && (
          <div className="flex items-center gap-1 text-xs text-amber-600">
            <Star className="w-3 h-3 fill-current" />
            <span>{bar.avg_rating.toFixed(1)}</span>
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/${locale}/bar/${bar.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-primary-700 dark:text-primary-400 hover:underline mt-1"
        >
          <ExternalLink className="w-3 h-3" />
          {isFr ? 'Voir détails' : 'View details'}
        </Link>
      </div>
    </div>
  );
}
