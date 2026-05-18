'use client';

import { useState, useEffect } from 'react';
import type { BarWithDistance } from '@/lib/types/bar';

export interface BarFilters {
  matchId?: string | null;
  sound?: boolean;
  projector?: boolean;
  outdoor?: boolean;
  food?: boolean;
  radius?: number;
  sortBy?: 'distance' | 'rating' | 'featured';
}

interface UseBarsParams {
  lat?: number | null;
  lng?: number | null;
  filters?: BarFilters;
}

export function useBars({ lat, lng, filters = {} }: UseBarsParams = {}) {
  const [bars, setBars] = useState<BarWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { matchId, sound, projector, outdoor, food, radius = 15, sortBy = 'distance' } = filters;

  useEffect(() => {
    if (!lat || !lng) return;

    setLoading(true);
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString(),
    });

    if (matchId) params.set('matchId', matchId);
    if (sound) params.set('sound', 'true');
    if (projector) params.set('projector', 'true');

    fetch(`/api/bars/search?${params}`)
      .then((r) => r.json())
      .then((data) => {
        let result: BarWithDistance[] = data.bars ?? [];

        if (outdoor) result = result.filter((b) => b.has_outdoor);
        if (food) result = result.filter((b) => b.has_food);

        if (sortBy === 'rating') {
          result = [...result].sort((a, b) => b.avg_rating - a.avg_rating);
        } else if (sortBy === 'featured') {
          result = [...result].sort((a, b) => Number(b.is_featured) - Number(a.is_featured));
        }

        setBars(result);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [lat, lng, radius, matchId, sound, projector, outdoor, food, sortBy]);

  return { bars, loading, error };
}
