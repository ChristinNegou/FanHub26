'use client';

import { useState, useEffect } from 'react';
import { Heart, Loader2 } from 'lucide-react';

interface Props {
  teamId: string;
  locale: string;
}

export function FavoriteTeamButton({ teamId, locale }: Props) {
  const isFr = locale === 'fr';
  const lsKey = `fanhub26_fav_team`;
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFav(localStorage.getItem(lsKey) === teamId);
    // Also check DB (best-effort)
    fetch('/api/user/favorite-team')
      .then((r) => r.json())
      .then((d) => {
        if (d.favorite_team_id) {
          setIsFav(d.favorite_team_id === teamId);
          if (d.favorite_team_id === teamId) {
            localStorage.setItem(lsKey, teamId);
          }
        }
      })
      .catch(() => {});
  }, [teamId]);

  const toggle = async () => {
    setLoading(true);
    const next = !isFav;
    // Optimistic update
    setIsFav(next);
    if (next) {
      localStorage.setItem(lsKey, teamId);
    } else {
      localStorage.removeItem(lsKey);
    }

    try {
      const res = await fetch('/api/user/favorite-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: next ? teamId : null }),
      });
      // If unauthorized (not logged in), keep local state only — no rollback
      if (!res.ok && res.status !== 401) {
        setIsFav(!next);
        if (!next) localStorage.setItem(lsKey, teamId);
        else localStorage.removeItem(lsKey);
      }
    } catch {
      // Keep local state if network fails
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-50 ${
        isFav
          ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400'
          : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300'
      }`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
      )}
      {isFav
        ? (isFr ? 'Mon équipe' : 'My team')
        : (isFr ? 'Ajouter à mes favoris' : 'Add to favourites')}
    </button>
  );
}
