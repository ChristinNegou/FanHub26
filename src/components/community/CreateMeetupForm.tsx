'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Calendar, MapPin, Users, FileText } from 'lucide-react';

interface Props {
  locale: string;
  teamCode: string;
  teamName: string;
}

export function CreateMeetupForm({ locale, teamCode, teamName }: Props) {
  const isFr = locale === 'fr';
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const minDate = new Date();
  minDate.setMinutes(minDate.getMinutes() - minDate.getTimezoneOffset());
  const minDateStr = minDate.toISOString().slice(0, 16);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch('/api/community', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        team_code: teamCode,
        city,
        address,
        event_date: new Date(eventDate).toISOString(),
        max_attendees: maxAttendees ? Number(maxAttendees) : null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? (isFr ? 'Une erreur est survenue.' : 'An error occurred.'));
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    // Redirect back to team page after short delay
    setTimeout(() => {
      router.push(`/${locale}/community/${teamCode.toLowerCase()}`);
      router.refresh();
    }, 1500);
  };

  if (success) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">🎉</p>
        <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {isFr ? 'Meetup créé !' : 'Meetup created!'}
        </p>
        <p className="text-slate-500 dark:text-slate-400">
          {isFr ? 'Redirection en cours...' : 'Redirecting...'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          <FileText className="inline w-4 h-4 mr-1" />
          {isFr ? 'Titre du meetup *' : 'Meetup title *'}
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={isFr ? `Watch party ${teamName} vs ...` : `${teamName} watch party vs ...`}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {isFr ? 'Description (optionnel)' : 'Description (optional)'}
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder={isFr ? 'Infos supplémentaires, ambiance, dress code...' : 'Additional info, vibe, dress code...'}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm resize-none"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          <Calendar className="inline w-4 h-4 mr-1" />
          {isFr ? 'Date et heure *' : 'Date and time *'}
        </label>
        <input
          type="datetime-local"
          required
          min={minDateStr}
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          <MapPin className="inline w-4 h-4 mr-1" />
          {isFr ? 'Ville *' : 'City *'}
        </label>
        <input
          type="text"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder={isFr ? 'Montréal, Québec, Toronto...' : 'Montreal, Quebec City, Toronto...'}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {isFr ? 'Adresse ou nom du bar (optionnel)' : 'Address or bar name (optional)'}
        </label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={isFr ? '123 rue Sainte-Catherine, Bar Le Footballeur...' : '123 Main St, The Sports Bar...'}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
      </div>

      {/* Max attendees */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          <Users className="inline w-4 h-4 mr-1" />
          {isFr ? 'Nombre max de participants (optionnel)' : 'Max attendees (optional)'}
        </label>
        <input
          type="number"
          min="2"
          max="500"
          value={maxAttendees}
          onChange={(e) => setMaxAttendees(e.target.value)}
          placeholder={isFr ? 'Laisser vide = illimité' : 'Leave empty = unlimited'}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-700 hover:bg-primary-800 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {isFr ? 'Créer le meetup' : 'Create meetup'}
      </button>
    </form>
  );
}
