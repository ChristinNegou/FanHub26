export const HOST_CITIES = [
  { name: 'Toronto', slug: 'toronto', province: 'ON', lat: 43.6532, lng: -79.3832, matches: 6 },
  { name: 'Vancouver', slug: 'vancouver', province: 'BC', lat: 49.2827, lng: -123.1207, matches: 7 },
] as const;

export const TOURIST_CITIES = [
  { name: 'Montréal', slug: 'montreal', province: 'QC', lat: 45.5019, lng: -73.5674 },
  { name: 'Québec City', slug: 'quebec-city', province: 'QC', lat: 46.8139, lng: -71.2082 },
  { name: 'Trois-Rivières', slug: 'trois-rivieres', province: 'QC', lat: 46.3432, lng: -72.5432 },
] as const;

export const MATCH_STAGES = [
  'group',
  'round_of_32',
  'round_of_16',
  'quarter_final',
  'semi_final',
  'third_place',
  'final',
] as const;

export type MatchStage = (typeof MATCH_STAGES)[number];

export const ATMOSPHERE_TYPES = ['lively', 'chill', 'sports_bar', 'pub'] as const;
export type AtmosphereType = (typeof ATMOSPHERE_TYPES)[number];
