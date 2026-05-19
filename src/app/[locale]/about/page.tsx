import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Tv, Users, CalendarDays, Star, ShieldCheck } from 'lucide-react';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isFr = params.locale === 'fr';
  return {
    title: isFr ? 'À propos — FanHub26' : 'About — FanHub26',
    description: isFr
      ? 'FanHub26 connecte les fans de la Coupe du Monde FIFA 2026 partout au Canada — bars, fan zones, communautés d\'équipes et calendrier des matchs.'
      : 'FanHub26 connects FIFA World Cup 2026 fans across Canada — bars, fan zones, team communities and match schedule.',
  };
}

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const isFr = locale === 'fr';

  const features = [
    {
      icon: MapPin,
      title: 'Watch Party Finder',
      desc: isFr
        ? 'Trouvez les bars qui diffusent les matchs près de chez vous. Filtrez par son activé, écran géant, terrasse, ambiance et plus.'
        : 'Find bars showing matches near you. Filter by sound on, big screen, outdoor seating, atmosphere and more.',
    },
    {
      icon: CalendarDays,
      title: isFr ? 'Calendrier des 104 matchs' : '104-match schedule',
      desc: isFr
        ? 'Le calendrier complet de la Coupe du Monde avec filtres par équipe, ville et phase. Ajoutez les matchs à votre agenda en un clic.'
        : 'The full World Cup schedule with filters by team, city and stage. Add matches to your calendar in one click.',
    },
    {
      icon: Users,
      title: isFr ? 'Communautés de fans' : 'Fan communities',
      desc: isFr
        ? 'Rejoignez la communauté de votre équipe parmi les 48 nations qualifiées. Organisez et rejoignez des meetups dans votre ville.'
        : 'Join the community of your team among all 48 qualified nations. Organise and join meetups in your city.',
    },
    {
      icon: Tv,
      title: isFr ? 'Fan Zones officielles' : 'Official Fan Zones',
      desc: isFr
        ? '6 fan zones au Canada sur une carte interactive — espaces FIFA officiels et zones communautaires dans toutes les villes hôtes.'
        : '6 fan zones across Canada on an interactive map — official FIFA spaces and community zones in all host cities.',
    },
    {
      icon: Star,
      title: isFr ? 'Avis de bars vérifiés' : 'Verified bar reviews',
      desc: isFr
        ? 'Notes globales, ambiance et qualité du son évaluées par de vrais fans. Laissez votre avis après la match.'
        : 'Overall ratings, atmosphere and sound quality rated by real fans. Leave your review after the match.',
    },
    {
      icon: ShieldCheck,
      title: isFr ? 'Guide des villes hôtes' : 'Host city guide',
      desc: isFr
        ? 'Infos pratiques sur Montréal, Toronto, Vancouver et Québec — transport, hôtels, restaurants et activités incontournables.'
        : 'Practical info on Montréal, Toronto, Vancouver and Québec City — transit, hotels, restaurants and must-do activities.',
    },
  ];

  const cities = [
    { name: 'Montréal', matches: 8, venue: 'Stade Saputo' },
    { name: 'Toronto', matches: 8, venue: 'BMO Field' },
    { name: 'Vancouver', matches: 8, venue: 'BC Place' },
    { name: isFr ? 'Québec' : 'Québec City', matches: 0, venue: isFr ? 'Ville d\'accueil' : 'Host city' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* Hero */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
          🏆 FIFA World Cup 2026 · Canada
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 leading-tight">
          {isFr ? 'La plateforme des fans canadiens' : 'The Canadian fans\' platform'}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {isFr
            ? 'FanHub26 connecte les fans de la Coupe du Monde FIFA 2026 partout au Canada. Trouvez où regarder les matchs, rejoignez votre communauté et vivez l\'événement à fond.'
            : 'FanHub26 connects FIFA World Cup 2026 fans across Canada. Find where to watch matches, join your community and make the most of the tournament.'}
        </p>
        <div className="flex flex-wrap gap-3 justify-center mt-7">
          <Link href={`/${locale}/watch`}
            className="bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            {isFr ? 'Trouver un bar' : 'Find a bar'}
          </Link>
          <Link href={`/${locale}/community`}
            className="border border-primary-300 text-primary-700 dark:text-primary-400 dark:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-semibold px-6 py-3 rounded-xl transition-colors">
            {isFr ? 'Rejoindre ma communauté' : 'Join my community'}
          </Link>
        </div>
      </div>

      {/* Features grid */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">
          {isFr ? 'Tout ce dont vous avez besoin' : 'Everything you need'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5">
              <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-primary-700 dark:text-primary-400" />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Host cities */}
      <section className="mb-14 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {isFr ? '🇨🇦 Le Canada, pays hôte' : '🇨🇦 Canada, host nation'}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
          {isFr
            ? 'Pour la première fois, le Canada co-organise la Coupe du Monde FIFA avec les États-Unis et le Mexique. 3 villes canadiennes accueilleront 24 matchs du 11 juin au 19 juillet 2026.'
            : 'For the first time, Canada co-hosts the FIFA World Cup alongside the USA and Mexico. 3 Canadian cities will host 24 matches from June 11 to July 19, 2026.'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {cities.map((c) => (
            <div key={c.name} className="bg-white/80 dark:bg-slate-800/60 rounded-xl p-4 text-center">
              <p className="font-bold text-slate-900 dark:text-white">{c.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.venue}</p>
              {c.matches > 0 && (
                <p className="text-xs font-semibold text-primary-700 dark:text-primary-400 mt-1">
                  {c.matches} {isFr ? 'matchs' : 'matches'}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* For bar owners */}
      <section className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-8 text-white text-center mb-14">
        <h2 className="text-2xl font-bold mb-3">
          {isFr ? 'Vous êtes propriétaire de bar ?' : 'Are you a bar owner?'}
        </h2>
        <p className="text-slate-300 mb-6 max-w-xl mx-auto text-sm leading-relaxed">
          {isFr
            ? 'Inscrivez votre établissement gratuitement. Soyez visible par des milliers de fans, gérez vos diffusions de matchs, recevez des avis et mettez-vous en vedette pour encore plus de visibilité.'
            : 'Register your establishment for free. Be visible to thousands of fans, manage your match broadcasts, receive reviews and get featured for even more visibility.'}
        </p>
        <Link href={`/${locale}/bar/register`}
          className="inline-block bg-amber-500 hover:bg-amber-400 text-white font-bold px-7 py-3 rounded-xl transition-colors">
          {isFr ? 'Inscrire mon bar gratuitement →' : 'Register my bar for free →'}
        </Link>
      </section>

      {/* Bilingual note */}
      <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>
          {isFr
            ? 'FanHub26 est entièrement disponible en français et en anglais pour tous les fans du Canada.'
            : 'FanHub26 is fully available in French and English for all fans across Canada.'}
        </p>
      </div>
    </div>
  );
}
