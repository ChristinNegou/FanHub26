'use client';

import { Volume2, Tv, TreePine, UtensilsCrossed, Star, X, MapPin, Globe, Phone, ExternalLink, Navigation } from 'lucide-react';
import type { BarWithDistance } from '@/lib/types/bar';

interface BarPopupProps {
  bar: BarWithDistance;
  locale: string;
  onClose: () => void;
}

export function BarPopup({ bar, locale, onClose }: BarPopupProps) {
  const isFr = locale === 'fr';

  const amenities = [
    bar.has_sound    && { icon: Volume2,        label: isFr ? 'Son activé' : 'Sound on',    bg: 'bg-blue-50 text-blue-700' },
    bar.has_projector && { icon: Tv,            label: isFr ? `${bar.num_screens} écran${(bar.num_screens ?? 1) > 1 ? 's' : ''}` : `${bar.num_screens} screen${(bar.num_screens ?? 1) > 1 ? 's' : ''}`, bg: 'bg-purple-50 text-purple-700' },
    bar.has_outdoor  && { icon: TreePine,       label: isFr ? 'Terrasse' : 'Outdoor',       bg: 'bg-green-50 text-green-700' },
    bar.has_food     && { icon: UtensilsCrossed, label: isFr ? 'Nourriture' : 'Food',        bg: 'bg-orange-50 text-orange-700' },
  ].filter(Boolean) as { icon: any; label: string; bg: string }[];

  const distanceLabel = bar.distance_km != null
    ? bar.distance_km < 1
      ? `${Math.round(bar.distance_km * 1000)} m`
      : `${bar.distance_km.toFixed(1)} km`
    : null;

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${bar.latitude},${bar.longitude}`;

  return (
    <div className="w-72 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100" style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* Cover image / header */}
      <div className="relative h-28 bg-gradient-to-br from-primary-700 to-primary-900 flex-shrink-0">
        {bar.cover_image_url ? (
          <img src={bar.cover_image_url} alt={bar.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🍺</div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Featured badge */}
        {bar.is_featured && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
            ⭐ Vedette
          </span>
        )}

        {/* Bar logo */}
        {bar.logo_url && (
          <div className="absolute -bottom-5 left-3 w-10 h-10 rounded-full border-2 border-white shadow overflow-hidden bg-white">
            <img src={bar.logo_url} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <div className={`p-3 flex flex-col gap-2 ${bar.logo_url ? 'pt-7' : ''}`}>

        {/* Name + rating */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">{bar.name}</h3>
            {distanceLabel && (
              <p className="text-xs text-slate-400 mt-0.5">{distanceLabel} {isFr ? 'de vous' : 'away'}</p>
            )}
          </div>
          {bar.avg_rating > 0 && (
            <div className="flex items-center gap-0.5 bg-amber-50 text-amber-700 rounded-full px-2 py-0.5 shrink-0">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-semibold">{bar.avg_rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-1.5 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
          <span className="leading-tight">{bar.address}, {bar.city}</span>
        </div>

        {/* Amenities chips */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {amenities.map(({ icon: Icon, label, bg }) => (
              <span key={label} className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${bg}`}>
                <Icon className="w-3 h-3" />
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Action buttons */}
        <div className="flex gap-2">
          <a
            href={`/${locale}/bar/${bar.slug}`}
            className="flex-1 text-center text-xs font-semibold bg-primary-700 text-white rounded-lg py-2 hover:bg-primary-800 transition-colors"
          >
            {isFr ? 'Voir le bar' : 'View bar'}
          </a>
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={isFr ? 'Itinéraire' : 'Directions'}
            className="flex items-center justify-center gap-1 text-xs text-slate-600 border border-slate-200 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-primary-700" />
            {isFr ? 'Y aller' : 'Go'}
          </a>
        </div>

        {/* Website / Phone */}
        {(bar.website || bar.phone) && (
          <div className="flex flex-wrap gap-2 pt-0.5">
            {bar.website && (
              <a
                href={bar.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary-700 hover:underline"
              >
                <Globe className="w-3 h-3" />
                {isFr ? 'Site web' : 'Website'}
              </a>
            )}
            {bar.phone && (
              <a
                href={`tel:${bar.phone}`}
                className="inline-flex items-center gap-1 text-xs text-primary-700 hover:underline"
              >
                <Phone className="w-3 h-3" />
                {bar.phone}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
