'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Users, Loader2, CheckCircle2, Lock, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Event {
  id: string;
  title: string;
  description: string | null;
  city: string;
  address: string | null;
  event_date: string;
  max_attendees: number | null;
  current_attendees: number;
}

interface Props {
  events: Event[];
  locale: string;
}

// ── Inline auth form shown when user must sign in to RSVP ──────────────────
function AuthGate({
  isFr,
  onSuccess,
  onClose,
}: {
  isFr: boolean;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupDone, setSignupDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setSignupDone(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(isFr ? 'Email ou mot de passe incorrect.' : 'Invalid email or password.');
      else onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="mt-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" />
          {isFr ? 'Connectez-vous pour participer' : 'Sign in to join'}
        </p>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      {signupDone ? (
        <p className="text-sm text-green-600 dark:text-green-400">
          {isFr ? 'Vérifiez votre email, puis connectez-vous.' : 'Check your email, then sign in.'}
        </p>
      ) : (
        <>
          <div className="flex gap-1.5 mb-3">
            {(['signin', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(null); }}
                className={`flex-1 py-1 rounded-lg text-xs font-medium transition-colors ${
                  mode === m
                    ? 'bg-primary-700 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {m === 'signin'
                  ? (isFr ? 'Connexion' : 'Sign in')
                  : (isFr ? 'Créer un compte' : 'Sign up')}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isFr ? 'Courriel' : 'Email'}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isFr ? 'Mot de passe (min. 6 car.)' : 'Password (min. 6 chars)'}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold py-1.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 disabled:opacity-60"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {mode === 'signin'
                ? (isFr ? 'Se connecter' : 'Sign in')
                : (isFr ? 'Créer un compte' : 'Sign up')}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

// ── Single event card ───────────────────────────────────────────────────────
function EventCard({
  event,
  locale,
  userId,
}: {
  event: Event;
  locale: string;
  userId: string | null;
}) {
  const isFr = locale === 'fr';
  const [rsvped, setRsvped] = useState(false);
  const [attendees, setAttendees] = useState(event.current_attendees);
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Load RSVP status from DB on mount (persists across refreshes for logged-in users)
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/events/${event.id}/rsvp`)
      .then((r) => r.json())
      .then((d) => setRsvped(d.rsvped ?? false))
      .catch(() => {});
  }, [event.id, userId]);

  const date = new Date(event.event_date);
  const spotsLeft = event.max_attendees ? event.max_attendees - attendees : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0 && !rsvped;

  const handleToggle = useCallback(async () => {
    if (!userId) {
      setShowAuth(true);
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const wasRsvped = rsvped;
      const method = wasRsvped ? 'DELETE' : 'POST';
      const res = await fetch(`/api/events/${event.id}/rsvp`, { method });

      if (res.ok) {
        setRsvped(!wasRsvped);
        // Only update local count on confirmed success
        setAttendees((prev) => wasRsvped ? Math.max(0, prev - 1) : prev + 1);
      } else if (res.status === 409) {
        // Already registered — sync state
        setRsvped(true);
      }
    } finally {
      setLoading(false);
    }
  }, [userId, loading, rsvped, event.id]);

  const googleCalendarUrl = (() => {
    const start = date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const end = new Date(date.getTime() + 3 * 60 * 60 * 1000)
      .toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const details = `${event.description ?? ''}\n${event.address ? `📍 ${event.address}, ${event.city}` : ''}`.trim();
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(`${event.address ?? ''} ${event.city}`)}`;
  })();

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-slate-900 dark:text-white">{event.title}</h3>
        {isFull ? (
          <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full font-medium shrink-0">
            {isFr ? 'Complet' : 'Full'}
          </span>
        ) : spotsLeft !== null ? (
          <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-medium shrink-0">
            {spotsLeft} {isFr ? 'places' : 'spots'}
          </span>
        ) : null}
      </div>

      {event.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">{event.description}</p>
      )}

      <div className="flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400 mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {date.toLocaleDateString(isFr ? 'fr-CA' : 'en-CA', {
            weekday: 'short', month: 'short', day: 'numeric',
          })}{' '}
          {date.toLocaleTimeString(isFr ? 'fr-CA' : 'en-CA', {
            hour: '2-digit', minute: '2-digit',
          })}
        </span>
        {event.address && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {event.address}, {event.city}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Users className="w-3.5 h-3.5" />
          {attendees} {isFr ? 'inscrits' : 'attending'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleToggle}
          disabled={loading || isFull}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50 ${
            rsvped
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400'
              : isFull
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-600'
              : 'bg-primary-700 hover:bg-primary-800 text-white'
          }`}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : rsvped ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : !userId ? (
            <Lock className="w-3.5 h-3.5" />
          ) : null}
          {rsvped
            ? (isFr ? "Je n'y vais plus" : 'Cancel RSVP')
            : isFull
            ? (isFr ? 'Complet' : 'Full')
            : (isFr ? 'Je participe' : 'Join')}
        </button>

        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-primary-400 hover:text-primary-700 dark:hover:text-primary-400 px-3 py-2 rounded-xl transition-colors"
        >
          <Calendar className="w-3.5 h-3.5" />
          {isFr ? 'Agenda' : 'Calendar'}
        </a>
      </div>

      {showAuth && (
        <AuthGate
          isFr={isFr}
          onSuccess={() => {
            setShowAuth(false);
            // After sign-in, re-trigger toggle (auth state will update via onAuthStateChange)
            setTimeout(handleToggle, 300);
          }}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}

// ── List ────────────────────────────────────────────────────────────────────
export function EventListClient({ events, locale }: Props) {
  const isFr = locale === 'fr';
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (events.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-2xl">
        <p className="text-4xl mb-3">🏟️</p>
        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">
          {isFr ? "Aucun meetup prévu pour l'instant" : 'No meetups scheduled yet'}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isFr
            ? 'Soyez le premier à organiser un watch party dans votre ville !'
            : 'Be the first to organize a watch party in your city!'}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} locale={locale} userId={userId} />
      ))}
    </div>
  );
}
