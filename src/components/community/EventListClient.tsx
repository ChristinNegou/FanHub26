'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Loader2, CheckCircle2 } from 'lucide-react';

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

function useRsvp(eventId: string) {
  const [rsvped, setRsvped] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/events/${eventId}/rsvp`)
      .then((r) => r.json())
      .then((d) => setRsvped(d.rsvped ?? false))
      .catch(() => {});
  }, [eventId]);

  const toggle = async () => {
    setLoading(true);
    try {
      const method = rsvped ? 'DELETE' : 'POST';
      const res = await fetch(`/api/events/${eventId}/rsvp`, { method });
      if (res.ok) setRsvped(!rsvped);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return { rsvped, loading, toggle };
}

function EventCard({ event, locale }: { event: Event; locale: string }) {
  const isFr = locale === 'fr';
  const { rsvped, loading, toggle } = useRsvp(event.id);
  const [attendees, setAttendees] = useState(event.current_attendees);

  const date = new Date(event.event_date);
  const spotsLeft = event.max_attendees ? event.max_attendees - attendees : null;
  const isFull = spotsLeft !== null && spotsLeft <= 0 && !rsvped;

  const handleToggle = async () => {
    const wasRsvped = rsvped;
    await toggle();
    setAttendees((prev) => wasRsvped ? Math.max(0, prev - 1) : prev + 1);
  };

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
        {attendees > 0 && (
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {attendees} {isFr ? 'inscrits' : 'attending'}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleToggle}
          disabled={loading || isFull}
          className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-colors disabled:opacity-50 ${
            rsvped
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400'
              : 'bg-primary-700 hover:bg-primary-800 text-white'
          }`}
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : rsvped ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : null}
          {rsvped
            ? (isFr ? "Je n'y vais plus" : 'Cancel RSVP')
            : isFull
            ? (isFr ? 'Complet' : 'Full')
            : (isFr ? "Je participe" : 'Join')}
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
    </div>
  );
}

export function EventListClient({ events, locale }: Props) {
  const isFr = locale === 'fr';

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
        <EventCard key={event.id} event={event} locale={locale} />
      ))}
    </div>
  );
}
