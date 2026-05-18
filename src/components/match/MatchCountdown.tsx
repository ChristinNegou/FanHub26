'use client';

import { useState, useEffect } from 'react';

const KICKOFF = new Date('2026-06-11T19:00:00Z');

interface Props { locale: string }

export function MatchCountdown({ locale }: Props) {
  const isFr = locale === 'fr';
  const [diff, setDiff] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setDiff(Math.max(0, KICKOFF.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (diff === null) return null;

  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);

  const pad = (n: number) => String(n).padStart(2, '0');

  if (diff === 0) {
    return (
      <p className="text-accent-400 font-bold text-lg animate-pulse">
        {isFr ? '🏆 Le tournoi est en cours !' : '🏆 The tournament is live!'}
      </p>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {[
        { value: d, label: isFr ? 'jours' : 'days' },
        { value: h, label: isFr ? 'h' : 'h' },
        { value: m, label: isFr ? 'min' : 'min' },
        { value: s, label: isFr ? 's' : 's' },
      ].map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="text-3xl font-bold tabular-nums text-white leading-none">
            {label === (isFr ? 'jours' : 'days') ? value : pad(value)}
          </span>
          <span className="text-xs text-slate-400 mt-0.5">{label}</span>
        </div>
      ))}
    </div>
  );
}
