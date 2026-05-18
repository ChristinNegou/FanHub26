'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Props {
  barId: string;
  locale: string;
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(n)}
          className="focus:outline-none"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              n <= (hover || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-300 dark:text-slate-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export function BarReviewForm({ barId, locale }: Props) {
  const isFr = locale === 'fr';
  const router = useRouter();

  const [user, setUser] = useState<null | { id: string }>(null);
  const [checked, setChecked] = useState(false);
  const [rating, setRating] = useState(0);
  const [atmosphereRating, setAtmosphereRating] = useState(0);
  const [soundRating, setSoundRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Auth modal state
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signupDone, setSignupDone] = useState(false);

  const checkAuth = async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    setUser(data.user ? { id: data.user.id } : null);
    setChecked(true);
    setShowForm(true);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    const supabase = createClient();
    if (authMode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthError(error.message);
      else setSignupDone(true);
    } else {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(isFr ? 'Email ou mot de passe incorrect.' : 'Invalid email or password.');
      else setUser({ id: data.user!.id });
    }
    setAuthLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError(isFr ? 'Choisissez une note.' : 'Please choose a rating.');
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/bars/${barId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating,
        comment: comment.trim() || null,
        atmosphere_rating: atmosphereRating || null,
        sound_quality_rating: soundRating || null,
      }),
    });

    if (!res.ok) {
      const d = await res.json();
      setError(d.error ?? (isFr ? 'Erreur lors de la soumission.' : 'Submission error.'));
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => router.refresh(), 800);
  };

  if (!showForm) {
    return (
      <button
        onClick={checkAuth}
        className="inline-flex items-center gap-2 text-sm font-semibold bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-700 px-4 py-2 rounded-xl transition-colors"
      >
        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
        {isFr ? 'Laisser un avis' : 'Write a review'}
      </button>
    );
  }

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-2xl p-4 text-green-700 dark:text-green-400 text-sm font-medium">
        ✓ {isFr ? 'Avis publié ! Merci.' : 'Review published! Thank you.'}
      </div>
    );
  }

  if (checked && !user) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
        <p className="font-semibold text-slate-800 dark:text-slate-100 mb-4">
          {isFr ? 'Connectez-vous pour laisser un avis' : 'Sign in to leave a review'}
        </p>
        {signupDone ? (
          <p className="text-sm text-green-600 dark:text-green-400">
            {isFr ? 'Vérifiez votre email, puis connectez-vous.' : 'Check your email, then sign in.'}
          </p>
        ) : (
          <>
            <div className="flex gap-2 mb-3">
              {(['signin', 'signup'] as const).map((m) => (
                <button key={m} onClick={() => setAuthMode(m)}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${authMode === m ? 'bg-primary-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {m === 'signin' ? (isFr ? 'Connexion' : 'Sign in') : (isFr ? 'Créer un compte' : 'Sign up')}
                </button>
              ))}
            </div>
            <form onSubmit={handleAuth} className="flex flex-col gap-2">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder={isFr ? 'Courriel' : 'Email'}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                placeholder={isFr ? 'Mot de passe' : 'Password'}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500" />
              {authError && <p className="text-xs text-red-500">{authError}</p>}
              <button type="submit" disabled={authLoading}
                className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 disabled:opacity-60">
                {authLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {authMode === 'signin' ? (isFr ? 'Se connecter' : 'Sign in') : (isFr ? 'Créer un compte' : 'Sign up')}
              </button>
            </form>
          </>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 flex flex-col gap-4">
      <h3 className="font-semibold text-slate-900 dark:text-white">
        {isFr ? 'Votre avis' : 'Your review'}
      </h3>

      <div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
          {isFr ? 'Note globale *' : 'Overall rating *'}
        </p>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            {isFr ? 'Ambiance' : 'Atmosphere'}
          </p>
          <StarPicker value={atmosphereRating} onChange={setAtmosphereRating} />
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            {isFr ? 'Qualité du son' : 'Sound quality'}
          </p>
          <StarPicker value={soundRating} onChange={setSoundRating} />
        </div>
      </div>

      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder={isFr ? 'Partagez votre expérience... (optionnel)' : 'Share your experience... (optional)'}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
        />
        <p className="text-xs text-slate-400 mt-1 text-right">{comment.length}/500</p>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isFr ? 'Publier mon avis' : 'Publish review'}
      </button>
    </form>
  );
}
