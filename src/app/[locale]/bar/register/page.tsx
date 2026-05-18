'use client';

import { useState } from 'react';
import { Loader2, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { BarRegistrationForm } from '@/components/bar/BarRegistrationForm';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase/client';

export default function BarRegisterPage({ params: { locale } }: { params: { locale: string } }) {
  const isFr = locale === 'fr';
  const { user, loading } = useAuth();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signupDone, setSignupDone] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const supabase = createClient();

    if (authMode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/${locale}/bar/register` },
      });
      if (error) {
        setAuthError(error.message);
      } else {
        setSignupDone(true);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(isFr ? 'Courriel ou mot de passe incorrect' : 'Invalid email or password');
    }

    setAuthLoading(false);
  };

  const handleGoogle = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/${locale}/bar/register` },
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary-700" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {isFr ? 'Inscrire votre bar' : 'Register your bar'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {isFr
            ? 'Gratuit — attirez les fans de la Coupe du Monde 2026'
            : 'Free — attract World Cup 2026 fans'}
        </p>
      </div>

      {/* Not authenticated → show auth UI */}
      {!user && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-sm">
          {signupDone ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📧</div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                {isFr ? 'Vérifiez votre courriel' : 'Check your email'}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {isFr
                  ? `Un lien de confirmation a été envoyé à ${email}`
                  : `A confirmation link was sent to ${email}`}
              </p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    authMode === 'signup'
                      ? 'bg-primary-700 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <UserPlus className="w-4 h-4 inline mr-1.5" />
                  {isFr ? 'Créer un compte' : 'Create account'}
                </button>
                <button
                  onClick={() => setAuthMode('signin')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                    authMode === 'signin'
                      ? 'bg-primary-700 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <LogIn className="w-4 h-4 inline mr-1.5" />
                  {isFr ? 'Se connecter' : 'Sign in'}
                </button>
              </div>

              <form onSubmit={handleAuth} className="flex flex-col gap-4">
                <Input
                  label={isFr ? 'Courriel' : 'Email'}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="vous@exemple.ca"
                />
                <Input
                  label={isFr ? 'Mot de passe' : 'Password'}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />

                {authError && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {authError}
                  </div>
                )}

                <Button type="submit" disabled={authLoading} className="w-full">
                  {authLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {authMode === 'signup'
                    ? (isFr ? 'Créer mon compte' : 'Create account')
                    : (isFr ? 'Se connecter' : 'Sign in')}
                </Button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                </div>
                <div className="relative flex justify-center text-xs text-slate-400">
                  <span className="bg-white dark:bg-slate-800 px-2">
                    {isFr ? 'ou' : 'or'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 border border-slate-300 dark:border-slate-600 rounded-lg py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isFr ? 'Continuer avec Google' : 'Continue with Google'}
              </button>
            </>
          )}
        </div>
      )}

      {/* Authenticated → show form */}
      {user && (
        <>
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6 bg-slate-50 dark:bg-slate-800 rounded-lg px-4 py-2">
            <span>
              {isFr ? 'Connecté en tant que' : 'Signed in as'}{' '}
              <strong className="text-slate-700 dark:text-slate-200">{user.email}</strong>
            </span>
          </div>
          <BarRegistrationForm locale={locale} />
        </>
      )}
    </div>
  );
}
