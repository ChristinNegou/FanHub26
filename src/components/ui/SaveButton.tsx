'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface Props {
  id: string;
  type: 'bar' | 'fanzone' | 'match';
  label?: string;
  labelSaved?: string;
  className?: string;
}

export function SaveButton({ id, type, label, labelSaved, className = '' }: Props) {
  const key = `fanhub26_saved_${type}_${id}`;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(localStorage.getItem(key) === '1');
  }, [key]);

  const toggle = () => {
    const next = !saved;
    if (next) {
      localStorage.setItem(key, '1');
    } else {
      localStorage.removeItem(key);
    }
    setSaved(next);
  };

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-1.5 text-sm transition-colors border px-3 py-1.5 rounded-lg ${
        saved
          ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-400'
          : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-300'
      } ${className}`}
    >
      {saved ? (
        <>
          <BookmarkCheck className="w-3.5 h-3.5" />
          {labelSaved && <span>{labelSaved}</span>}
        </>
      ) : (
        <>
          <Bookmark className="w-3.5 h-3.5" />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
}
