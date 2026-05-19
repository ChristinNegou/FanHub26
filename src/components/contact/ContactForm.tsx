'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const SUBJECTS_FR = [
  { value: 'bar_inquiry', label: 'Inscrire / gérer mon bar' },
  { value: 'partnership', label: 'Partenariat / publicité' },
  { value: 'bug_report', label: 'Signaler un problème' },
  { value: 'other', label: 'Autre' },
] as const;

const SUBJECTS_EN = [
  { value: 'bar_inquiry', label: 'Register / manage my bar' },
  { value: 'partnership', label: 'Partnership / advertising' },
  { value: 'bug_report', label: 'Report an issue' },
  { value: 'other', label: 'Other' },
] as const;

export function ContactForm({ locale }: { locale: string }) {
  const isFr = locale === 'fr';
  const subjects = isFr ? SUBJECTS_FR : SUBJECTS_EN;

  const [form, setForm] = useState({
    name: '', email: '', subject: 'bar_inquiry' as string, message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => { const n = { ...e }; delete n[field]; return n; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = isFr ? 'Nom requis' : 'Name required';
    if (!form.email.trim() || !form.email.includes('@')) e.email = isFr ? 'Email invalide' : 'Invalid email';
    if (!form.message.trim() || form.message.length < 10) e.message = isFr ? 'Message trop court (min. 10 caractères)' : 'Message too short (min. 10 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? (isFr ? 'Une erreur est survenue' : 'An error occurred'));
        return;
      }
      setSuccess(true);
    } catch {
      setSubmitError(isFr ? 'Erreur réseau — réessayez' : 'Network error — try again');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {isFr ? 'Message envoyé !' : 'Message sent!'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {isFr ? 'Nous vous répondrons dans les meilleurs délais.' : "We'll get back to you as soon as possible."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label={isFr ? 'Nom *' : 'Name *'}
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
          error={errors.name}
          placeholder="Alex Tremblay"
        />
        <Input
          label="Email *"
          type="email"
          value={form.email}
          onChange={(e) => set('email', e.target.value)}
          error={errors.email}
          placeholder="alex@exemple.com"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {isFr ? 'Sujet *' : 'Subject *'}
        </label>
        <select
          value={form.subject}
          onChange={(e) => set('subject', e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-700 dark:text-slate-200"
        >
          {subjects.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {isFr ? 'Message *' : 'Message *'}
          </label>
          <span className="text-xs text-slate-400">{form.message.length}/2000</span>
        </div>
        <textarea
          value={form.message}
          onChange={(e) => set('message', e.target.value)}
          rows={6}
          maxLength={2000}
          placeholder={isFr ? 'Décrivez votre demande...' : 'Describe your request...'}
          className={`rounded-lg border px-3 py-2 text-sm bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-slate-900 dark:text-white ${
            errors.message ? 'border-red-400 dark:border-red-500' : 'border-slate-300 dark:border-slate-600'
          }`}
        />
        {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
      </div>

      {submitError && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {submitError}
        </div>
      )}

      <Button type="submit" disabled={submitting} size="lg" className="self-start">
        {submitting
          ? <span className="animate-pulse">{isFr ? 'Envoi...' : 'Sending...'}</span>
          : <><Send className="w-4 h-4 mr-2" />{isFr ? 'Envoyer le message' : 'Send message'}</>
        }
      </Button>
    </form>
  );
}
