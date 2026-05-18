import Link from 'next/link';
import type { Metadata } from 'next';
import { MapPin, CalendarDays, Zap, CheckCircle, Star, Trophy } from 'lucide-react';
import { MatchCountdown } from '@/components/match/MatchCountdown';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const isFr = locale === 'fr';
  return {
    title: isFr
      ? 'FanHub26 — Où regarder la Coupe du Monde 2026 au Canada'
      : 'FanHub26 — Where to Watch the 2026 World Cup in Canada',
    description: isFr
      ? 'Trouvez un bar qui diffuse la Coupe du Monde 2026 près de chez vous. Carte interactive, filtres son/écran géant, calendrier des matchs, fan zones.'
      : 'Find a bar showing the 2026 World Cup near you. Interactive map, sound/big screen filters, match schedule, fan zones.',
    openGraph: {
      title: isFr ? 'FanHub26 — Coupe du Monde 2026 au Canada' : 'FanHub26 — 2026 World Cup in Canada',
      description: isFr
        ? 'La seule plateforme bilingue pour vivre la Coupe du Monde 2026 au Canada.'
        : 'The only bilingual platform to experience the 2026 World Cup in Canada.',
    },
  };
}

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const isFr = locale === 'fr';

  return (
    <div className="flex flex-col">

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-slate-900 text-white overflow-hidden">
        {/* subtle pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />

        <div className="relative container mx-auto px-4 py-20 md:py-28 flex flex-col items-center text-center gap-8">
          {/* Countdown badge */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 flex flex-col items-center gap-2">
            <p className="text-xs font-semibold text-accent-400 uppercase tracking-widest">
              {isFr ? '⚽ Coup d\'envoi dans' : '⚽ Kick-off in'}
            </p>
            <MatchCountdown locale={locale} />
            <p className="text-xs text-slate-400">
              {isFr
                ? 'Mexique 🇲🇽 vs Afrique du Sud 🇿🇦 · 11 juin 2026'
                : 'Mexico 🇲🇽 vs South Africa 🇿🇦 · June 11, 2026'}
            </p>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              {isFr
                ? <>Où regarder la<br /><span className="text-accent-400">Coupe du Monde 2026</span><br />au Canada ?</>
                : <>Where to watch the<br /><span className="text-accent-400">2026 World Cup</span><br />in Canada?</>}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              {isFr
                ? 'Trouvez un bar qui diffuse chaque match, filtrez par son activé et écran géant, et rejoignez les fans de votre équipe.'
                : 'Find a bar showing every match, filter by sound and big screen, and connect with fans of your team.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link
              href={`/${locale}/watch`}
              className="bg-accent-500 hover:bg-accent-600 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors shadow-lg shadow-accent-500/30"
            >
              {isFr ? '📍 Trouver un bar près de moi' : '📍 Find a bar near me'}
            </Link>
            <Link
              href={`/${locale}/bar/register`}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors"
            >
              {isFr ? '🍺 Inscrire mon bar gratuitement' : '🍺 Register my bar for free'}
            </Link>
          </div>

          <p className="text-xs text-slate-500">
            {isFr
              ? 'Inscription gratuite · Aucune carte de crédit requise'
              : 'Free sign-up · No credit card required'}
          </p>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-4">
            {isFr ? 'Tout ce qu\'il vous faut' : 'Everything you need'}
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-12 max-w-xl mx-auto">
            {isFr
              ? 'FanHub26 est le hub complet pour les fans de la Coupe du Monde au Canada'
              : 'FanHub26 is the complete hub for World Cup fans in Canada'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
                titleFr: 'Watch Party Finder',
                titleEn: 'Watch Party Finder',
                descFr: 'Carte interactive de tous les bars qui diffusent chaque match. Filtres : son activé, écran géant, terrasse, distance.',
                descEn: 'Interactive map of bars showing every match. Filters: sound, big screen, outdoor patio, distance.',
                href: '/watch',
                ctaFr: 'Trouver un bar →',
                ctaEn: 'Find a bar →',
              },
              {
                icon: CalendarDays,
                color: 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400',
                titleFr: 'Calendrier des 104 matchs',
                titleEn: '104-match schedule',
                descFr: 'Tous les matchs avec l\'heure en heure de l\'Est. Filtre par équipe, ville ou phase de tournoi.',
                descEn: 'All matches with Eastern Time kickoffs. Filter by team, city, or tournament stage.',
                href: '/calendar',
                ctaFr: 'Voir le calendrier →',
                ctaEn: 'View schedule →',
              },
              {
                icon: Zap,
                color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400',
                titleFr: 'Fan zones & communauté',
                titleEn: 'Fan zones & community',
                descFr: 'Fan zones officielles FIFA au Canada + meetups de fans par nationalité dans chaque ville.',
                descEn: 'Official FIFA fan zones in Canada + fan meetups by nationality in every city.',
                href: '/fanzones',
                ctaFr: 'Explorer →',
                ctaEn: 'Explore →',
              },
            ].map(({ icon: Icon, color, titleFr, titleEn, descFr, descEn, href, ctaFr, ctaEn }) => (
              <div key={href} className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 flex flex-col gap-4 border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    {isFr ? titleFr : titleEn}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                    {isFr ? descFr : descEn}
                  </p>
                </div>
                <Link
                  href={`/${locale}${href}`}
                  className="text-sm font-semibold text-primary-700 dark:text-primary-400 group-hover:underline mt-auto"
                >
                  {isFr ? ctaFr : ctaEn}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            {isFr ? 'Comment ça marche' : 'How it works'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                titleFr: 'Choisissez votre match',
                titleEn: 'Pick your match',
                descFr: 'Sélectionnez un match dans le calendrier ou cherchez directement sur la carte.',
                descEn: 'Select a match from the schedule or search directly on the map.',
              },
              {
                step: '2',
                titleFr: 'Trouvez votre bar',
                titleEn: 'Find your bar',
                descFr: 'Filtrez par son activé, écran géant, terrasse. Voyez les offres spéciales.',
                descEn: 'Filter by sound, big screen, patio. See special offers for the match.',
              },
              {
                step: '3',
                titleFr: 'Profitez du match !',
                titleEn: 'Enjoy the match!',
                descFr: 'Rejoignez d\'autres fans, laissez un avis et revenez pour le prochain match.',
                descEn: 'Join other fans, leave a review and come back for the next match.',
              },
            ].map(({ step, titleFr, titleEn, descFr, descEn }) => (
              <div key={step} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-primary-700 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-md shadow-primary-700/30">
                  {step}
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">
                  {isFr ? titleFr : titleEn}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                  {isFr ? descFr : descEn}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href={`/${locale}/watch`}
              className="bg-primary-700 hover:bg-primary-800 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors inline-block"
            >
              {isFr ? 'Commencer maintenant' : 'Get started'}
            </Link>
          </div>
        </div>
      </section>

      {/* ── BAR OWNER CTA ── */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="text-4xl mb-4">🍺</div>
              <h2 className="text-3xl font-bold mb-4">
                {isFr
                  ? 'Vous êtes propriétaire d\'un bar ?'
                  : 'Do you own a bar?'}
              </h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                {isFr
                  ? 'Inscrivez votre établissement gratuitement et attirez des centaines de fans pendant la Coupe du Monde. Indiquez les matchs que vous diffusez, vos caractéristiques, et vos offres spéciales.'
                  : 'Register your establishment for free and attract hundreds of fans during the World Cup. List the matches you\'re showing, your features, and your special offers.'}
              </p>
              <ul className="flex flex-col gap-2 mb-8">
                {(isFr
                  ? ['Inscription 100% gratuite', 'Visible sur la carte interactive', 'Sélectionnez vos matchs diffusés', 'Option "Featured" pour être en tête des résultats']
                  : ['100% free registration', 'Visible on the interactive map', 'Select the matches you\'re showing', '"Featured" option to top the results']
                ).map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/bar/register`}
                className="bg-accent-500 hover:bg-accent-600 text-white font-bold px-8 py-4 rounded-xl text-base transition-colors inline-block"
              >
                {isFr ? 'Inscrire mon bar gratuitement' : 'Register my bar for free'}
              </Link>
            </div>

            {/* Mock bar card */}
            <div className="w-full md:w-72 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 shrink-0">
              <div className="h-28 bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center text-white/20 text-6xl font-bold">
                B
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Le Bar du Stade</span>
                  <span className="bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">⭐ Featured</span>
                </div>
                <span className="text-xs text-slate-400">Montréal · 0.4 km</span>
                <div className="flex gap-1.5 flex-wrap">
                  {['🔊 Son', '📺 4 écrans', '🌿 Terrasse'].map((f) => (
                    <span key={f} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs">
                  {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                  <span className="text-slate-400 ml-1">4.8</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CITIES BANNER ── */}
      <section className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-6">
            {isFr ? 'Couverture Canada + villes hôtes' : 'Canada coverage + host cities'}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { flag: '🇨🇦', name: 'Montréal' },
              { flag: '🇨🇦', name: 'Québec' },
              { flag: '🇨🇦', name: 'Toronto' },
              { flag: '🇨🇦', name: 'Vancouver' },
              { flag: '🇺🇸', name: 'New York' },
              { flag: '🇺🇸', name: 'Boston' },
              { flag: '🇺🇸', name: 'Seattle' },
              { flag: '🇲🇽', name: 'Mexico' },
            ].map(({ flag, name }) => (
              <span key={name} className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium px-4 py-2 rounded-full">
                {flag} {name}
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
