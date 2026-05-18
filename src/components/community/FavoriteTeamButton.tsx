'use client';

import { useState, useEffect, useRef } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  teamId: string;
  locale: string;
}

export function FavoriteTeamButton({ teamId, locale }: Props) {
  const isFr = locale === 'fr';
  const lsKey = 'fanhub26_fav_team';

  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const supabase = createClient();

    // Auth state (real-time)
    supabase.auth.getUser().then(({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);

      if (uid) {
        // Logged in: load from DB (source of truth)
        fetch('/api/user/favorite-team')
          .then((r) => r.json())
          .then((d) => {
            const fav = d.favorite_team_id === teamId;
            setIsFav(fav);
            // Keep localStorage in sync with DB
            if (fav) localStorage.setItem(lsKey, teamId);
            else if (localStorage.getItem(lsKey) === teamId) localStorage.removeItem(lsKey);
          })
          .catch(() => {});
      } else {
        // Guest: use localStorage
        setIsFav(localStorage.getItem(lsKey) === teamId);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, [teamId]);

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const toggle = async () => {
    setLoading(true);
    const next = !isFav;
    setIsFav(next);

    if (next) {
      localStorage.setItem(lsKey, teamId);
    } else {
      localStorage.removeItem(lsKey);
    }

    if (userId) {
      // Logged-in: persist to DB
      const res = await fetch('/api/user/favorite-team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: next ? teamId : null }),
      });
      if (!res.ok) {
        // Roll back
        setIsFav(!next);
        if (!next) localStorage.setItem(lsKey, teamId);
        else localStorage.removeItem(lsKey);
      } else if (next) {
        showToast(isFr ? 'Équipe ajoutée à vos favoris !' : 'Team added to favourites!');
      }
    } else {
      // Guest: localStorage only — prompt soft sign-in
      if (next) {
        showToast(
          isFr
            ? 'Sauvegardé localement. Connectez-vous pour synchroniser sur tous vos appareils.'
            : 'Saved locally. Sign in to sync across devices.'
        );
      }
    }

    setLoading(false);
  };

  return (
    <div className="relative">
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
          : (isFr ? 'Ajouter en favori' : 'Add to favourites')}
      </button>

      {toast && (
        <div className="absolute left-0 top-full mt-2 z-10 w-72 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded-lg px-3 py-2 shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
