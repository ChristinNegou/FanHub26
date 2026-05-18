import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileNav } from './MobileNav';

interface HeaderProps {
  locale: string;
}

const navLinks = [
  { href: '/watch', labelFr: 'Watch Finder', labelEn: 'Watch Finder' },
  { href: '/calendar', labelFr: 'Calendrier', labelEn: 'Calendar' },
  { href: '/guide', labelFr: 'Guide villes', labelEn: 'City guide' },
  { href: '/fanzones', labelFr: 'Fan zones', labelEn: 'Fan zones' },
  { href: '/community', labelFr: 'Communauté', labelEn: 'Community' },
];

export function Header({ locale }: HeaderProps) {
  const isFr = locale === 'fr';

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="text-xl font-bold text-primary-700 dark:text-primary-400"
        >
          FanHub26
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className="text-sm font-medium text-slate-600 hover:text-primary-700 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
            >
              {isFr ? link.labelFr : link.labelEn}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher currentLocale={locale} />
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
}
