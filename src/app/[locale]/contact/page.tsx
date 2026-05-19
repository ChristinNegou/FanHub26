import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://fanhub26.ca';

interface PageProps {
  params: { locale: string };
}

export async function generateMetadata({ params: { locale } }: PageProps): Promise<Metadata> {
  const isFr = locale === 'fr';
  const title = isFr ? 'Nous contacter — FanHub26' : 'Contact us — FanHub26';
  const description = isFr
    ? 'Contactez l\'équipe FanHub26 pour inscrire votre bar, signaler un problème ou toute autre demande.'
    : 'Contact the FanHub26 team to register your bar, report an issue, or any other request.';
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/contact`,
      languages: { fr: `${BASE_URL}/fr/contact`, en: `${BASE_URL}/en/contact` },
    },
  };
}

export default function ContactPage({ params: { locale } }: PageProps) {
  const isFr = locale === 'fr';

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-sm font-semibold px-3 py-1.5 rounded-full mb-4">
          <Mail className="w-4 h-4" />
          {isFr ? 'Nous contacter' : 'Contact us'}
        </div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {isFr ? 'Une question ?' : 'Got a question?'}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {isFr
            ? 'Pour inscrire votre bar, signaler un problème ou toute autre demande — on vous répond rapidement.'
            : 'To register your bar, report an issue, or any other request — we reply quickly.'}
        </p>
      </div>

      <ContactForm locale={locale} />

      {/* Quick links */}
      <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
          {isFr ? 'Accès rapide' : 'Quick links'}
        </p>
        <div className="flex flex-col gap-2 text-sm">
          <Link href={`/${locale}/bar/register`} className="text-primary-700 dark:text-primary-400 hover:underline">
            → {isFr ? 'Inscrire mon bar gratuitement' : 'Register my bar for free'}
          </Link>
          <Link href={`/${locale}/watch`} className="text-primary-700 dark:text-primary-400 hover:underline">
            → {isFr ? 'Trouver un bar qui diffuse' : 'Find a bar showing matches'}
          </Link>
          <Link href={`/${locale}/calendar`} className="text-primary-700 dark:text-primary-400 hover:underline">
            → {isFr ? 'Calendrier des matchs' : 'Match schedule'}
          </Link>
        </div>
      </div>
    </div>
  );
}
