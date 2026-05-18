'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';
import { CreateMeetupForm } from '@/components/community/CreateMeetupForm';
import teamsData from '@/data/teams.json';
import { flagUrl } from '@/lib/utils/fifaFlags';

interface PageProps {
  params: { locale: string; teamSlug: string };
}

export default function CreateMeetupPage({ params }: PageProps) {
  const { locale, teamSlug } = params;
  const isFr = locale === 'fr';
  const router = useRouter();
  const { user, loading } = useAuth();

  const team = teamsData.teams.find((t) => t.code.toLowerCase() === teamSlug.toLowerCase());
  const teamName = team ? (isFr ? team.name_fr : team.name_en) : teamSlug;

  // Auth form state
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signupDone, setSignupDone] = useState(false);

  useEffect(() => {
    if (!team) router.replace(`/${locale}/community`);
  }, [team, locale, router]);

  if (!team) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    const supabase = createClient();

    if (authMode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { setAuthError(isFr ? error.message : error.message); }
      else setSignupDone(true);
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(isFr ? 'Email ou mot de passe incorrect.' : 'Invalid email or password.');
    }
    setAuthLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
      </div>
    );
  }

  const flag = flagUrl(team.code);

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href={`/${locale}/community/${teamSlug}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-700 dark:hover:text-primary-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        {isFr ? 'Retour à la communauté' : 'Back to community'}
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {flag && (
          <img src={flag} alt={teamName} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
        )}
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {isFr ? `Créer un meetup — ${teamName}` : `Create a meetup — ${teamName}`}
        </h1>
      </div>

      {!user ? (
        /* Auth gate */
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <LogIn className="w-5 h-5 text-primary-600" />
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              {isFr ? 'Connectez-vous pour continuer' : 'Sign in to continue'}
            </p>
          </div>

          {signupDone ? (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-sm text-green-700 dark:text-green-300">
              {isFr
                ? 'Compte créé ! Vérifiez votre email pour confirmer votre inscription, puis connectez-vous.'
                : 'Account created! Check your email to confirm, then sign in.'}
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${authMode === 'signup' ? 'bg-primary-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  {isFr ? 'Créer un compte' : 'Sign up'}
                </button>
                <button
                  onClick={() => setAuthMode('signin')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${authMode === 'signin' ? 'bg-primary-700 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
                >
                  {isFr ? 'Se connecter' : 'Sign in'}
                </button>
              </div>

              <form onSubmit={handleAuth} className="flex flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isFr ? 'Courriel' : 'Email'}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isFr ? 'Mot de passe (6 caractères min.)' : 'Password (min 6 characters)'}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
                {authError && (
                  <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {authMode === 'signup'
                    ? (isFr ? 'Créer un compte' : 'Create account')
                    : (isFr ? 'Se connecter' : 'Sign in')}
                </button>
              </form>
            </>
          )}
        </div>
      ) : (
        /* Meetup form — user is logged in */
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
          <CreateMeetupForm locale={locale} teamCode={team.code} teamName={teamName} />
        </div>
      )}
    </div>
  );
}
