export const CANADIAN_TIMEZONES = [
  { value: 'America/Toronto', label: 'Heure de l\'Est (ET)', labelEn: 'Eastern Time (ET)' },
  { value: 'America/Winnipeg', label: 'Heure du Centre (CT)', labelEn: 'Central Time (CT)' },
  { value: 'America/Edmonton', label: 'Heure des Rocheuses (MT)', labelEn: 'Mountain Time (MT)' },
  { value: 'America/Vancouver', label: 'Heure du Pacifique (PT)', labelEn: 'Pacific Time (PT)' },
] as const;

export function formatMatchTime(utcDate: string, timezone: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-CA' : 'en-CA', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
    hour12: false,
  }).format(new Date(utcDate));
}

export function formatMatchDate(utcDate: string, timezone: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-CA' : 'en-CA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  }).format(new Date(utcDate));
}
