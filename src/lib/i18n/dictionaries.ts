import type { Locale } from './config';

const dictionaries = {
  fr: () => import('@/data/translations/fr.json').then((m) => m.default),
  en: () => import('@/data/translations/en.json').then((m) => m.default),
};

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
