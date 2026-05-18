'use client';

import { Volume2, Tv, TreePine, UtensilsCrossed, Star, X } from 'lucide-react';
import type { BarWithDistance } from '@/lib/types/bar';

interface BarPopupProps {
  bar: BarWithDistance;
  locale: string;
  onClose: () => void;
}

export function BarPopup({ bar, locale, onClose }: BarPopupProps) {
  const isFr = locale === 'fr';

  return (
    <div className="w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="relative h-24 bg-gradient-to-br from-primary-700 to-primary-900">
        {bar.cover_image_url && (
          <img src={bar.cover_image_url} alt={bar.name} className="w-full h-full object-cover" />
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-0.5 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
        {bar.is_featured && (
          <span className="absolute bottom-2 left-2 bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            ⭐ Featured
          </span>
        )}
      </div>

      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{bar.name}</h3>
          {bar.avg_rating > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-amber-600 shrink-0">
              <Star className="w-3 h-3 fill-current" />
              {bar.avg_rating.toFixed(1)}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{bar.address}</p>

        <div className="flex flex-wrap gap-1 mt-0.5">
          {bar.has_sound && (
            <span className="inline-flex items-center gap-0.5 text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">
              <Volume2 className="w-3 h-3" />
              {isFr ? 'Son' : 'Sound'}
            </span>
          )}
          {bar.has_projector && (
            <span className="inline-flex items-center gap-0.5 text-xs bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded-full">
              <Tv className="w-3 h-3" />
              {bar.num_screens}
            </span>
          )}
          {bar.has_outdoor && (
            <span className="inline-flex items-center gap-0.5 text-xs bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">
              <TreePine className="w-3 h-3" />
            </span>
          )}
          {bar.has_food && (
            <span className="inline-flex items-center gap-0.5 text-xs bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-full">
              <UtensilsCrossed className="w-3 h-3" />
            </span>
          )}
        </div>

        <a
          href={`/${locale}/bar/${bar.slug}`}
          className="mt-1 text-center text-xs font-semibold bg-primary-700 text-white rounded-lg py-1.5 hover:bg-primary-800 transition-colors"
        >
          {isFr ? 'Voir le bar' : 'View bar'}
        </a>
      </div>
    </div>
  );
}
