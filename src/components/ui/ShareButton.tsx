'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

interface Props {
  title: string;
  text?: string;
  url?: string;
  label?: string;
  className?: string;
}

export function ShareButton({ title, text, url, label, className = '' }: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = url ?? window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
        return;
      } catch {
        // User cancelled or unsupported — fall through to clipboard
      }
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-primary-700 dark:hover:text-primary-400 transition-colors border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg hover:border-primary-400 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-green-500" />
          <span className="text-green-600 dark:text-green-400">Copié !</span>
        </>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5" />
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
}
