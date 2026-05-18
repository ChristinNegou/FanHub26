import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'FanHub26 — Vivez la Coupe du Monde 2026 au Canada',
    template: '%s | FanHub26',
  },
  description:
    'Trouvez un bar qui diffuse la Coupe du Monde 2026 près de chez vous. Calendrier des matchs, guide des villes hôtes, fan zones interactives.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://fanhub26.ca'),
};

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <Header locale={locale} />
        <main>{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
