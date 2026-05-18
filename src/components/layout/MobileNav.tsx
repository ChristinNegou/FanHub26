'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface MobileNavProps {
  locale: string;
}

const navLinks = [
  { href: '/watch', labelFr: 'Watch Finder', labelEn: 'Watch Finder' },
  { href: '/calendar', labelFr: 'Calendrier', labelEn: 'Calendar' },
  { href: '/guide', labelFr: 'Guide villes', labelEn: 'City guide' },
  { href: '/fanzones', labelFr: 'Fan zones', labelEn: 'Fan zones' },
  { href: '/community', labelFr: 'Communauté', labelEn: 'Community' },
];

export function MobileNav({ locale }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isFr = locale === 'fr';

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-600 dark:text-slate-400"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isOpen && (
        <div className="absolute inset-x-0 top-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-primary-700 transition-colors"
              >
                {isFr ? link.labelFr : link.labelEn}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
