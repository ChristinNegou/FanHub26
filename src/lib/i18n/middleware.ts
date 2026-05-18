import { NextRequest } from 'next/server';
import { locales, defaultLocale, type Locale } from './config';

export function getLocaleFromRequest(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get('locale')?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  const acceptLanguage = request.headers.get('accept-language') ?? '';
  const browserLocale = acceptLanguage.split(',')[0]?.split('-')[0]?.toLowerCase();
  if (browserLocale && locales.includes(browserLocale as Locale)) {
    return browserLocale as Locale;
  }

  return defaultLocale;
}
