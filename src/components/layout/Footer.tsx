import Link from 'next/link';

interface FooterProps {
  locale: string;
}

export function Footer({ locale }: FooterProps) {
  const isFr = locale === 'fr';

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold mb-3">FanHub26</h3>
            <p className="text-sm">
              {isFr
                ? 'La plateforme des fans de la Coupe du Monde 2026 au Canada.'
                : 'The platform for 2026 World Cup fans in Canada.'}
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">{isFr ? 'Explorer' : 'Explore'}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/watch`} className="hover:text-white transition-colors">Watch Finder</Link></li>
              <li><Link href={`/${locale}/calendar`} className="hover:text-white transition-colors">{isFr ? 'Calendrier' : 'Calendar'}</Link></li>
              <li><Link href={`/${locale}/guide`} className="hover:text-white transition-colors">{isFr ? 'Guide villes' : 'City guide'}</Link></li>
              <li><Link href={`/${locale}/fanzones`} className="hover:text-white transition-colors">Fan zones</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">{isFr ? 'Propriétaires' : 'Bar owners'}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/bar/register`} className="hover:text-white transition-colors">{isFr ? 'Inscrire votre bar' : 'Register your bar'}</Link></li>
              <li><Link href={`/${locale}/bar/dashboard`} className="hover:text-white transition-colors">{isFr ? 'Tableau de bord' : 'Dashboard'}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">{isFr ? 'À propos' : 'About'}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/about`} className="hover:text-white transition-colors">{isFr ? 'À propos' : 'About'}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-6 text-sm text-center">
          © 2026 FanHub26. {isFr ? 'Tous droits réservés.' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
}
