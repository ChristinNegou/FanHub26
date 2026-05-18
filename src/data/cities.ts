export interface CityRestaurant {
  name: string;
  category_fr: string;
  category_en: string;
  price: '$' | '$$' | '$$$' | '$$$$';
  description_fr: string;
  description_en: string;
  neighborhood_fr: string;
  neighborhood_en: string;
}

export interface CityHotel {
  neighborhood_fr: string;
  neighborhood_en: string;
  price_fr: string;
  price_en: string;
  tip_fr: string;
  tip_en: string;
}

export interface CityActivity {
  emoji: string;
  name_fr: string;
  name_en: string;
  description_fr: string;
  description_en: string;
}

export interface CityTransportItem {
  emoji: string;
  title_fr: string;
  title_en: string;
  description_fr: string;
  description_en: string;
}

export interface CityGuide {
  slug: string;
  name_fr: string;
  name_en: string;
  province_fr: string;
  province_en: string;
  country: 'CA' | 'US' | 'MX';
  is_host_city: boolean;
  matches_count?: number;
  venue_name?: string;
  venue_name_fr?: string;
  emoji: string;
  color_from: string;
  color_to: string;
  tagline_fr: string;
  tagline_en: string;
  description_fr: string;
  description_en: string;
  lat: number;
  lng: number;
  transport: CityTransportItem[];
  restaurants: CityRestaurant[];
  hotels: CityHotel[];
  activities: CityActivity[];
  practical: {
    language_fr: string;
    language_en: string;
    currency_fr: string;
    currency_en: string;
    tip_fr: string;
    tip_en: string;
    emergency_fr: string;
    emergency_en: string;
    app_fr?: string;
    app_en?: string;
  };
}

export const cities: CityGuide[] = [
  // ── MONTRÉAL ───────────────────────────────────────────────────────────────
  {
    slug: 'montreal',
    name_fr: 'Montréal',
    name_en: 'Montreal',
    province_fr: 'Québec',
    province_en: 'Quebec',
    country: 'CA',
    is_host_city: false,
    emoji: '🏙️',
    color_from: '#1e3a8a',
    color_to: '#3b82f6',
    tagline_fr: 'La métropole francophone des fans',
    tagline_en: 'The francophone fan metropolis',
    description_fr: 'Montréal est la capitale mondiale du fan watching pendant la Coupe du Monde. Avec des centaines de bars sportifs et une culture du foot qui explose, c\'est LA ville pour vivre les matchs avec l\'ambiance unique du Québec.',
    description_en: 'Montreal is the world capital of fan watching during the World Cup. With hundreds of sports bars and an exploding football culture, it\'s THE city to experience matches with Quebec\'s unique atmosphere.',
    lat: 45.5017,
    lng: -73.5673,
    transport: [
      {
        emoji: '✈️',
        title_fr: 'Aéroport',
        title_en: 'Airport',
        description_fr: 'Aéroport international Pierre-Elliott-Trudeau (YUL). Bus 747 Express vers le centre-ville (10$) ou taxi (~50$). Trajet : 30-45 min.',
        description_en: 'Pierre-Elliott-Trudeau International Airport (YUL). Bus 747 Express to downtown ($10) or taxi (~$50). Journey: 30-45 min.',
      },
      {
        emoji: '🚇',
        title_fr: 'Métro',
        title_en: 'Metro',
        description_fr: '4 lignes de métro couvrent tout le centre-ville. Billet : 3.75$ | Carte Opus journalière : 11$. App : Chrono pour les horaires en temps réel.',
        description_en: '4 metro lines cover all of downtown. Single fare: $3.75 | Daily Opus card: $11. App: Chrono for real-time schedules.',
      },
      {
        emoji: '🚂',
        title_fr: 'Train VIA Rail',
        title_en: 'VIA Rail Train',
        description_fr: 'Liaison directe Toronto–Montréal (5h) et Québec–Montréal (3h). Réservez à l\'avance pour les prix les plus bas sur viarail.ca.',
        description_en: 'Direct Toronto–Montreal (5h) and Quebec City–Montreal (3h) routes. Book early for best prices at viarail.ca.',
      },
      {
        emoji: '🚌',
        title_fr: 'Bus Orléans Express / Flixbus',
        title_en: 'Bus Orléans Express / Flixbus',
        description_fr: 'Liaisons économiques depuis Québec, Ottawa, Toronto. Gare centrale d\'autobus au centre-ville.',
        description_en: 'Affordable connections from Quebec City, Ottawa, Toronto. Central bus station downtown.',
      },
    ],
    restaurants: [
      {
        name: 'La Banquise',
        category_fr: 'Poutine emblématique',
        category_en: 'Iconic poutine',
        price: '$',
        description_fr: 'La poutine légendaire de Montréal, ouverte 24h/24. Plus de 30 variétés. File d\'attente garantie mais ça vaut le coup.',
        description_en: 'Montreal\'s legendary poutine, open 24/7. Over 30 varieties. Guaranteed lineup but worth it.',
        neighborhood_fr: 'Plateau-Mont-Royal',
        neighborhood_en: 'Plateau-Mont-Royal',
      },
      {
        name: 'Schwartz\'s Deli',
        category_fr: 'Smoked meat montréalais',
        category_en: 'Montreal smoked meat',
        price: '$',
        description_fr: 'L\'institution montréalaise depuis 1928. Le meilleur smoked meat au monde — à ne pas manquer.',
        description_en: 'Montreal institution since 1928. The world\'s best smoked meat — not to be missed.',
        neighborhood_fr: 'Plateau-Mont-Royal',
        neighborhood_en: 'Plateau-Mont-Royal',
      },
      {
        name: 'Jardin de Panos',
        category_fr: 'Grec authentique',
        category_en: 'Authentic Greek',
        price: '$$',
        description_fr: 'Le meilleur du Quartier grec, terrasse animée, parfait pour les groupes de fans.',
        description_en: 'The best of the Greek Quarter, lively patio, perfect for fan groups.',
        neighborhood_fr: 'Quartier grec',
        neighborhood_en: 'Greek Quarter',
      },
      {
        name: 'Joe Beef',
        category_fr: 'Gastronomie locale',
        category_en: 'Local gastronomy',
        price: '$$$$',
        description_fr: 'Le restaurant phare de Montréal, cuisine québécoise revisitée. Réservation obligatoire des semaines à l\'avance.',
        description_en: 'Montreal\'s flagship restaurant, revisited Quebec cuisine. Reservations required weeks in advance.',
        neighborhood_fr: 'Petite-Bourgogne',
        neighborhood_en: 'Little Burgundy',
      },
      {
        name: 'Marché Jean-Talon',
        category_fr: 'Marché public',
        category_en: 'Public market',
        price: '$',
        description_fr: 'Le plus grand marché en plein air du Canada. Idéal pour un brunch avant le match — fruits frais, fromages québécois, pains artisanaux.',
        description_en: 'Canada\'s largest outdoor market. Ideal for pre-match brunch — fresh fruits, Quebec cheeses, artisan breads.',
        neighborhood_fr: 'Little Italy',
        neighborhood_en: 'Little Italy',
      },
    ],
    hotels: [
      {
        neighborhood_fr: 'Vieux-Montréal',
        neighborhood_en: 'Old Montreal',
        price_fr: '150-350$/nuit',
        price_en: '$150-350/night',
        tip_fr: 'Charme historique, proche des restaurants. Idéal mais plus cher.',
        tip_en: 'Historic charm, close to restaurants. Ideal but pricier.',
      },
      {
        neighborhood_fr: 'Plateau-Mont-Royal',
        neighborhood_en: 'Plateau-Mont-Royal',
        price_fr: '100-200$/nuit',
        price_en: '$100-200/night',
        tip_fr: 'Ambiance locale, bars et restos à pied. Meilleur rapport qualité-prix.',
        tip_en: 'Local vibe, bars and restaurants on foot. Best value for money.',
      },
      {
        neighborhood_fr: 'Centre-ville / McGill',
        neighborhood_en: 'Downtown / McGill',
        price_fr: '120-280$/nuit',
        price_en: '$120-280/night',
        tip_fr: 'Pratique pour les transports, hôtels d\'affaires avec bons tarifs le week-end.',
        tip_en: 'Convenient for transport, business hotels with good weekend rates.',
      },
    ],
    activities: [
      {
        emoji: '⛪',
        name_fr: 'Oratoire Saint-Joseph',
        name_en: 'Saint Joseph\'s Oratory',
        description_fr: 'La plus grande église de Canada avec vue panoramique sur toute la ville.',
        description_en: 'Canada\'s largest church with panoramic city views.',
      },
      {
        emoji: '🏔️',
        name_fr: 'Mont Royal',
        name_en: 'Mount Royal',
        description_fr: 'Le poumon vert de Montréal. Montez jusqu\'au belvédère pour une vue époustouflante sur les gratte-ciels.',
        description_en: 'Montreal\'s green lung. Hike to the belvedere for stunning skyline views.',
      },
      {
        emoji: '🎨',
        name_fr: 'Murales de rue (Mile End)',
        name_en: 'Street murals (Mile End)',
        description_fr: 'Montréal est une galerie d\'art à ciel ouvert. Le quartier Mile End concentre les meilleures œuvres.',
        description_en: 'Montreal is an open-air art gallery. Mile End has the best works.',
      },
      {
        emoji: '🍻',
        name_fr: 'Croisière sur le Saint-Laurent',
        name_en: 'St. Lawrence River cruise',
        description_fr: 'Profitez d\'une croisière d\'2h avec vue sur le Vieux-Port — parfait entre deux matchs.',
        description_en: 'Enjoy a 2h cruise with Old Port views — perfect between two matches.',
      },
    ],
    practical: {
      language_fr: 'Français (officiel) + Anglais dans les zones touristiques. Les serveurs parlent les deux.',
      language_en: 'French (official) + English in tourist areas. Servers speak both.',
      currency_fr: 'Dollar canadien (CAD). Taxes : 14.975% sur les repas/hébergements.',
      currency_en: 'Canadian Dollar (CAD). Tax: 14.975% on food/accommodation.',
      tip_fr: 'Pourboire standard : 15-18%. Dans les bars sportifs : 1-2$/bière minimum.',
      tip_en: 'Standard tip: 15-18%. In sports bars: $1-2/beer minimum.',
      emergency_fr: 'Urgences : 911 | Police non-urgence : 514-280-2222',
      emergency_en: 'Emergency: 911 | Non-emergency police: 514-280-2222',
      app_fr: 'Apps utiles : STM (métro/bus), Chrono, Bixi (vélos), Communauto (voitures)',
      app_en: 'Useful apps: STM (metro/bus), Chrono, Bixi (bikes), Communauto (cars)',
    },
  },

  // ── QUÉBEC CITY ─────────────────────────────────────────────────────────────
  {
    slug: 'quebec',
    name_fr: 'Québec',
    name_en: 'Quebec City',
    province_fr: 'Québec',
    province_en: 'Quebec',
    country: 'CA',
    is_host_city: false,
    emoji: '🏰',
    color_from: '#1a3a2e',
    color_to: '#16a34a',
    tagline_fr: 'La capitale, le charme, les fans',
    tagline_en: 'The capital, the charm, the fans',
    description_fr: 'Québec est la seule ville fortifiée d\'Amérique du Nord. Son atmosphère médiévale, ses bars animés de la Grande Allée et sa fierté francophone en font un lieu unique pour vivre la Coupe du Monde.',
    description_en: 'Quebec City is the only fortified city in North America. Its medieval atmosphere, lively Grande Allée bars, and francophone pride make it a unique place to experience the World Cup.',
    lat: 46.8139,
    lng: -71.2080,
    transport: [
      {
        emoji: '✈️',
        title_fr: 'Aéroport',
        title_en: 'Airport',
        description_fr: 'Aéroport international Jean-Lesage (YQB). Taxi vers le centre-ville : ~35$. Pas de navette directe — prendre un taxi ou Uber.',
        description_en: 'Jean-Lesage International Airport (YQB). Taxi to downtown: ~$35. No direct shuttle — take taxi or Uber.',
      },
      {
        emoji: '🚂',
        title_fr: 'Train VIA Rail',
        title_en: 'VIA Rail Train',
        description_fr: 'Gare du Palais au cœur du Vieux-Québec. Montréal–Québec : 3h, ~45-80$ selon réservation.',
        description_en: 'Palais Station in the heart of Old Quebec. Montreal–Quebec City: 3h, ~$45-80 depending on booking.',
      },
      {
        emoji: '🚌',
        title_fr: 'Orléans Express',
        title_en: 'Orléans Express',
        description_fr: 'Bus confortable depuis Montréal (3h), Trois-Rivières (1h30). Gare centrale à Sainte-Foy.',
        description_en: 'Comfortable bus from Montreal (3h), Trois-Rivières (1.5h). Central station in Sainte-Foy.',
      },
      {
        emoji: '🚌',
        title_fr: 'RTC (bus urbain)',
        title_en: 'RTC (city bus)',
        description_fr: 'Le réseau de bus couvre toute la ville. Billet : 3.60$ | Forfait journalier : 9$. App RTC mobile.',
        description_en: 'Bus network covers the whole city. Single fare: $3.60 | Day pass: $9. RTC mobile app.',
      },
    ],
    restaurants: [
      {
        name: 'Chez Ashton',
        category_fr: 'Poutine iconique de Québec',
        category_en: 'Quebec City\'s iconic poutine',
        price: '$',
        description_fr: 'L\'institution québécoise depuis 1969. La meilleure poutine de la capitale, disponible partout en ville.',
        description_en: 'Quebec institution since 1969. The capital\'s best poutine, available throughout the city.',
        neighborhood_fr: 'Plusieurs succursales',
        neighborhood_en: 'Multiple locations',
      },
      {
        name: 'Le Lapin Sauté',
        category_fr: 'Cuisine québécoise traditionnelle',
        category_en: 'Traditional Quebec cuisine',
        price: '$$',
        description_fr: 'Spécialités au lapin dans le Vieux-Québec. Terrasse pittoresque sur les remparts.',
        description_en: 'Rabbit specialties in Old Quebec. Picturesque patio on the ramparts.',
        neighborhood_fr: 'Vieux-Québec (Basse-Ville)',
        neighborhood_en: 'Old Quebec (Lower Town)',
      },
      {
        name: 'Pub Saint-Patrick',
        category_fr: 'Pub irlandais — parfait match day',
        category_en: 'Irish pub — perfect match day',
        price: '$$',
        description_fr: 'Le meilleur spot pour regarder les matchs en grande ambiance. Plusieurs écrans, bières pression, Grande Allée.',
        description_en: 'The best spot to watch matches in a great atmosphere. Multiple screens, draft beer, Grande Allée.',
        neighborhood_fr: 'Grande Allée',
        neighborhood_en: 'Grande Allée',
      },
      {
        name: 'Le Clocher Penché',
        category_fr: 'Bistro local et bières artisanales',
        category_en: 'Local bistro and craft beer',
        price: '$$',
        description_fr: 'Cuisine locale créative et excellente sélection de microbrasseries québécoises.',
        description_en: 'Creative local cuisine and excellent selection of Quebec microbreweries.',
        neighborhood_fr: 'Saint-Roch',
        neighborhood_en: 'Saint-Roch',
      },
    ],
    hotels: [
      {
        neighborhood_fr: 'Vieux-Québec (Haute-Ville)',
        neighborhood_en: 'Old Quebec (Upper Town)',
        price_fr: '180-400$/nuit',
        price_en: '$180-400/night',
        tip_fr: 'Vue sur le Château Frontenac, ambiance unique. Réservez 2-3 mois à l\'avance pour juin.',
        tip_en: 'Views of Château Frontenac, unique atmosphere. Book 2-3 months in advance for June.',
      },
      {
        neighborhood_fr: 'Saint-Roch / Limoilou',
        neighborhood_en: 'Saint-Roch / Limoilou',
        price_fr: '90-180$/nuit',
        price_en: '$90-180/night',
        tip_fr: 'Quartiers branchés et abordables. Excellents bars et restaurants à pied.',
        tip_en: 'Trendy and affordable neighborhoods. Excellent bars and restaurants on foot.',
      },
      {
        neighborhood_fr: 'Sainte-Foy (proche autoroute)',
        neighborhood_en: 'Sainte-Foy (highway access)',
        price_fr: '80-150$/nuit',
        price_en: '$80-150/night',
        tip_fr: 'Option économique avec voiture. Plusieurs grands hôtels de chaîne avec stationnement gratuit.',
        tip_en: 'Budget option with a car. Several chain hotels with free parking.',
      },
    ],
    activities: [
      {
        emoji: '🏰',
        name_fr: 'Château Frontenac & Terrasse Dufferin',
        name_en: 'Château Frontenac & Dufferin Terrace',
        description_fr: 'L\'hôtel le plus photographié au monde. La terrasse offre une vue imprenable sur le Saint-Laurent.',
        description_en: 'The world\'s most photographed hotel. The terrace offers stunning views of the St. Lawrence.',
      },
      {
        emoji: '🚶',
        name_fr: 'Promenade sur les Plaines d\'Abraham',
        name_en: 'Walk on the Plains of Abraham',
        description_fr: 'Le grand parc historique au cœur de la ville. Fan zone non-officielle pendant la Coupe du Monde.',
        description_en: 'The large historic park in the heart of the city. Unofficial fan zone during the World Cup.',
      },
      {
        emoji: '🍺',
        name_fr: 'Grande Allée — bar-hopping',
        name_en: 'Grande Allée — bar-hopping',
        description_fr: 'La rue la plus festive du Québec. Des dizaines de bars avec terrasses côte à côte — ambiance garantie pendant les matchs.',
        description_en: 'Quebec\'s most festive street. Dozens of bars with patios side by side — guaranteed atmosphere during matches.',
      },
      {
        emoji: '⛵',
        name_fr: 'Île d\'Orléans',
        name_en: 'Île d\'Orléans',
        description_fr: 'À 15 min du centre-ville, une île agricole hors du temps. Cidres, fromages, chocolats artisanaux.',
        description_en: '15 min from downtown, a timeless agricultural island. Ciders, cheeses, artisan chocolates.',
      },
    ],
    practical: {
      language_fr: 'Français dominant — l\'anglais est moins courant qu\'à Montréal. Un effort en français est très apprécié.',
      language_en: 'French dominant — English is less common than in Montreal. An effort in French is very appreciated.',
      currency_fr: 'Dollar canadien (CAD). Taxes : 14.975%.',
      currency_en: 'Canadian Dollar (CAD). Tax: 14.975%.',
      tip_fr: 'Pourboire : 15-18%. Obligatoire dans les restaurants, optionnel dans les bars.',
      tip_en: 'Tip: 15-18%. Expected in restaurants, optional in bars.',
      emergency_fr: 'Urgences : 911 | Police non-urgence : 418-641-6000',
      emergency_en: 'Emergency: 911 | Non-emergency police: 418-641-6000',
      app_fr: 'Apps : RTC Mobile (bus), Uber (disponible), Netlift (covoiturage)',
      app_en: 'Apps: RTC Mobile (bus), Uber (available), Netlift (carpooling)',
    },
  },

  // ── TORONTO ─────────────────────────────────────────────────────────────────
  {
    slug: 'toronto',
    name_fr: 'Toronto',
    name_en: 'Toronto',
    province_fr: 'Ontario',
    province_en: 'Ontario',
    country: 'CA',
    is_host_city: true,
    matches_count: 6,
    venue_name: 'BMO Field',
    emoji: '🏟️',
    color_from: '#7c2d12',
    color_to: '#dc2626',
    tagline_fr: 'Ville hôte — 6 matchs au BMO Field',
    tagline_en: 'Host city — 6 matches at BMO Field',
    description_fr: 'Toronto accueille 6 matchs dont des matchs de poule et potentiellement des phases éliminatoires au BMO Field. La ville la plus multiculturelle du monde offre une expérience unique — chaque quartier représente une équipe différente.',
    description_en: 'Toronto hosts 6 matches including group stage and potentially knockout rounds at BMO Field. The world\'s most multicultural city offers a unique experience — each neighbourhood represents a different team.',
    lat: 43.6532,
    lng: -79.3832,
    transport: [
      {
        emoji: '✈️',
        title_fr: 'Aéroport Pearson (YYZ)',
        title_en: 'Pearson Airport (YYZ)',
        description_fr: 'UP Express depuis Pearson → Union Station (25 min, 12.35$). Taxi : ~55$. Uber : ~40-50$. Évitez le taxi entre 17h-19h (embouteillages).',
        description_en: 'UP Express from Pearson → Union Station (25 min, $12.35). Taxi: ~$55. Uber: ~$40-50. Avoid taxi 5-7pm (traffic).',
      },
      {
        emoji: '🚇',
        title_fr: 'TTC (métro + bus)',
        title_en: 'TTC (subway + bus)',
        description_fr: '4 lignes de métro. Billet : 3.30$ | Journée : 13.50$ | Carte Presto recommandée (3.20$/trajet). App : Transit.',
        description_en: '4 subway lines. Single: $3.30 | Day pass: $13.50 | Presto card recommended ($3.20/ride). App: Transit.',
      },
      {
        emoji: '🚂',
        title_fr: 'Union Station — gare centrale',
        title_en: 'Union Station — central hub',
        description_fr: 'Hub de transport : VIA Rail (Montréal 5h, Ottawa 4h), GO Train (banlieues), UP Express (aéroport).',
        description_en: 'Transport hub: VIA Rail (Montreal 5h, Ottawa 4h), GO Train (suburbs), UP Express (airport).',
      },
      {
        emoji: '🏟️',
        title_fr: 'BMO Field — accès',
        title_en: 'BMO Field — access',
        description_fr: 'Métro ligne 2 → Exhibition, puis marche 10 min. Ou street car 509/511 depuis Union. Pas de parking — venez en transports.',
        description_en: 'Subway line 2 → Exhibition, then 10 min walk. Or streetcar 509/511 from Union. No parking — use transit.',
      },
    ],
    restaurants: [
      {
        name: 'St. Lawrence Market',
        category_fr: 'Marché historique — brunch',
        category_en: 'Historic market — brunch',
        price: '$',
        description_fr: 'Le marché le plus connu de Toronto depuis 1803. Sandwich au peameal bacon mythique — à faire avant chaque match.',
        description_en: 'Toronto\'s most famous market since 1803. Legendary peameal bacon sandwich — a must before every match.',
        neighborhood_fr: 'Old Town / Waterfront',
        neighborhood_en: 'Old Town / Waterfront',
      },
      {
        name: 'Pai Northern Thai Kitchen',
        category_fr: 'Thaïlandais — meilleur de la ville',
        category_en: 'Thai — best in the city',
        price: '$$',
        description_fr: 'Considéré comme le meilleur restaurant thaï du Canada. File d\'attente fréquente, vaut chaque minute.',
        description_en: 'Considered the best Thai restaurant in Canada. Frequent wait, worth every minute.',
        neighborhood_fr: 'Entertainment District',
        neighborhood_en: 'Entertainment District',
      },
      {
        name: 'Kensington Market',
        category_fr: 'Quartier multiculturel — street food',
        category_en: 'Multicultural neighbourhood — street food',
        price: '$',
        description_fr: 'Le quartier le plus éclectique de Toronto. Cuisine du monde entière à petit prix — parfait pour les fans internationaux.',
        description_en: 'Toronto\'s most eclectic neighbourhood. World cuisine at low prices — perfect for international fans.',
        neighborhood_fr: 'Kensington Market',
        neighborhood_en: 'Kensington Market',
      },
      {
        name: 'Bar Hop',
        category_fr: 'Bar craft beer — match day',
        category_en: 'Craft beer bar — match day',
        price: '$$',
        description_fr: 'Le meilleur bar sportif du centre-ville avec 40+ bières en pression. Ambiance électrique pour les matchs.',
        description_en: 'The best sports bar downtown with 40+ beers on tap. Electric atmosphere for matches.',
        neighborhood_fr: 'King West',
        neighborhood_en: 'King West',
      },
      {
        name: 'Little Portugal (Dundas West)',
        category_fr: 'Quartier portugais — incontournable',
        category_en: 'Portuguese quarter — must visit',
        price: '$$',
        description_fr: 'La plus grande communauté portugaise hors d\'Europe. Restaurants authentiques avec terrasses animées — les fans du Portugal seront à la maison.',
        description_en: 'The largest Portuguese community outside Europe. Authentic restaurants with lively patios — Portugal fans will feel at home.',
        neighborhood_fr: 'Little Portugal',
        neighborhood_en: 'Little Portugal',
      },
    ],
    hotels: [
      {
        neighborhood_fr: 'Entertainment District / King West',
        neighborhood_en: 'Entertainment District / King West',
        price_fr: '160-350$/nuit',
        price_en: '$160-350/night',
        tip_fr: 'À 5 min du BMO Field en streetcar. Ideal pour les soirs de match.',
        tip_en: '5 min from BMO Field by streetcar. Ideal for match nights.',
      },
      {
        neighborhood_fr: 'Midtown / Yorkville',
        neighborhood_en: 'Midtown / Yorkville',
        price_fr: '200-500$/nuit',
        price_en: '$200-500/night',
        tip_fr: 'Quartier chic, boutiques de luxe. Ligne de métro directe vers BMO Field.',
        tip_en: 'Upscale neighbourhood, luxury boutiques. Direct metro line to BMO Field.',
      },
      {
        neighborhood_fr: 'East End / Leslieville',
        neighborhood_en: 'East End / Leslieville',
        price_fr: '100-180$/nuit',
        price_en: '$100-180/night',
        tip_fr: 'Quartier branché et abordable. Airbnb disponibles. 20 min du centre en métro.',
        tip_en: 'Trendy and affordable. Airbnbs available. 20 min from downtown by metro.',
      },
    ],
    activities: [
      {
        emoji: '🗼',
        name_fr: 'Tour CN',
        name_en: 'CN Tower',
        description_fr: 'Symbole de Toronto, vue à 360° sur le lac Ontario. Réservez l\'EdgeWalk pour les aventuriers.',
        description_en: 'Toronto\'s symbol, 360° views over Lake Ontario. Book EdgeWalk for the adventurous.',
      },
      {
        emoji: '🏝️',
        name_fr: 'Îles de Toronto',
        name_en: 'Toronto Islands',
        description_fr: 'Ferry de 13 min depuis le Waterfront. Plages, BBQ, vélos. Vue imprenable sur le skyline — parfait entre deux matchs.',
        description_en: '13-min ferry from the Waterfront. Beaches, BBQ, bikes. Stunning skyline views — perfect between matches.',
      },
      {
        emoji: '🎨',
        name_fr: 'Distillery District',
        name_en: 'Distillery District',
        description_fr: 'Quartier victorien piétonnier avec galeries, restaurants et bars. Instagram garanti.',
        description_en: 'Pedestrian Victorian district with galleries, restaurants, and bars. Instagram guaranteed.',
      },
      {
        emoji: '🛍️',
        name_fr: 'Kensington Market & Chinatown',
        name_en: 'Kensington Market & Chinatown',
        description_fr: 'Deux quartiers côte à côte, le cœur multiculturel de Toronto. Parfait pour une après-midi de découverte.',
        description_en: 'Two adjacent neighbourhoods, Toronto\'s multicultural heart. Perfect for an afternoon of discovery.',
      },
    ],
    practical: {
      language_fr: 'Anglais dominant. La communauté francophone est petite mais présente (quartier Francophone au nord).',
      language_en: 'English dominant. French-speaking community is small but present.',
      currency_fr: 'Dollar canadien (CAD). HST (taxe) : 13% en Ontario.',
      currency_en: 'Canadian Dollar (CAD). HST (tax): 13% in Ontario.',
      tip_fr: 'Pourboire : 15-20%. Plus élevé qu\'au Québec dans les bonnes tables.',
      tip_en: 'Tip: 15-20%. Higher than in Quebec at good restaurants.',
      emergency_fr: 'Urgences : 911 | Police non-urgence : 416-808-2222',
      emergency_en: 'Emergency: 911 | Non-emergency police: 416-808-2222',
      app_fr: 'Apps : Transit (TTC), Presto (carte transport), Uber, Bike Share Toronto',
      app_en: 'Apps: Transit (TTC), Presto (transit card), Uber, Bike Share Toronto',
    },
  },

  // ── VANCOUVER ───────────────────────────────────────────────────────────────
  {
    slug: 'vancouver',
    name_fr: 'Vancouver',
    name_en: 'Vancouver',
    province_fr: 'Colombie-Britannique',
    province_en: 'British Columbia',
    country: 'CA',
    is_host_city: true,
    matches_count: 7,
    venue_name: 'BC Place',
    emoji: '🌊',
    color_from: '#0c4a6e',
    color_to: '#0284c7',
    tagline_fr: 'Ville hôte — 7 matchs au BC Place',
    tagline_en: 'Host city — 7 matches at BC Place',
    description_fr: 'Vancouver accueille le plus grand nombre de matchs au Canada (7). Encadrée par les montagnes et l\'océan Pacifique, c\'est l\'une des villes les plus belles du monde. Son multiculturalisme en fait un lieu de rencontre parfait pour les fans du monde entier.',
    description_en: 'Vancouver hosts the most matches in Canada (7). Framed by mountains and the Pacific Ocean, it\'s one of the world\'s most beautiful cities. Its multiculturalism makes it a perfect meeting place for fans from around the world.',
    lat: 49.2827,
    lng: -123.1207,
    transport: [
      {
        emoji: '✈️',
        title_fr: 'Aéroport YVR',
        title_en: 'YVR Airport',
        description_fr: 'Canada Line (SkyTrain) directe depuis l\'aéroport → centre-ville en 25 min (11.25$). Taxi : ~40$. L\'option SkyTrain est de loin la meilleure.',
        description_en: 'Canada Line (SkyTrain) direct from airport → downtown in 25 min ($11.25). Taxi: ~$40. SkyTrain is by far the best option.',
      },
      {
        emoji: '🚇',
        title_fr: 'SkyTrain + bus TransLink',
        title_en: 'SkyTrain + TransLink bus',
        description_fr: '3 lignes de SkyTrain + réseau de bus dense. Billet : 3.15$ (zones) | Journée : 11.25$. Carte Compass recommandée.',
        description_en: '3 SkyTrain lines + dense bus network. Fare: $3.15 (zones) | Day: $11.25. Compass card recommended.',
      },
      {
        emoji: '🏟️',
        title_fr: 'BC Place — accès',
        title_en: 'BC Place — access',
        description_fr: 'SkyTrain Expo/Millennium Line → Stadium-Chinatown. 5 min à pied du stade. Parfait — pas besoin de voiture.',
        description_en: 'SkyTrain Expo/Millennium Line → Stadium-Chinatown. 5 min walk to stadium. Perfect — no car needed.',
      },
      {
        emoji: '⛴️',
        title_fr: 'SeaBus & ferries',
        title_en: 'SeaBus & ferries',
        description_fr: 'SeaBus vers North Vancouver (12 min, compris dans le billet TransLink). BC Ferries pour l\'île de Vancouver.',
        description_en: 'SeaBus to North Vancouver (12 min, included in TransLink fare). BC Ferries to Vancouver Island.',
      },
    ],
    restaurants: [
      {
        name: 'Granville Island Public Market',
        category_fr: 'Marché public — incontournable',
        category_en: 'Public market — must-visit',
        price: '$',
        description_fr: 'Le meilleur marché de Vancouver avec artisans, poissonneries et restos. Parfait pour un repas avant le match.',
        description_en: 'Vancouver\'s best market with artisans, fishmongers, and eateries. Perfect for a pre-match meal.',
        neighborhood_fr: 'Granville Island',
        neighborhood_en: 'Granville Island',
      },
      {
        name: 'Vij\'s',
        category_fr: 'Cuisine indienne — légendaire',
        category_en: 'Indian cuisine — legendary',
        price: '$$$',
        description_fr: 'Le restaurant indien le plus célèbre du Canada. File d\'attente fréquente — arrivez tôt ou réservez.',
        description_en: 'Canada\'s most famous Indian restaurant. Frequent wait — arrive early or reserve.',
        neighborhood_fr: 'Cambie Village',
        neighborhood_en: 'Cambie Village',
      },
      {
        name: 'Japantown (Robson Street)',
        category_fr: 'Ramen & sushis authentiques',
        category_en: 'Authentic ramen & sushi',
        price: '$$',
        description_fr: 'Vancouver a la meilleure scène japonaise en dehors du Japon. Ramen Danbo, Tojo\'s sushi — un must.',
        description_en: 'Vancouver has the best Japanese food scene outside Japan. Ramen Danbo, Tojo\'s sushi — a must.',
        neighborhood_fr: 'West End / Robson',
        neighborhood_en: 'West End / Robson',
      },
      {
        name: 'Forage',
        category_fr: 'Farm-to-table canadien',
        category_en: 'Canadian farm-to-table',
        price: '$$$',
        description_fr: 'Cuisine locale et saisonnière, ingrédients de Colombie-Britannique. Happy hour excellent de 15h à 17h.',
        description_en: 'Local seasonal cuisine, BC ingredients. Excellent happy hour 3-5pm.',
        neighborhood_fr: 'West End',
        neighborhood_en: 'West End',
      },
    ],
    hotels: [
      {
        neighborhood_fr: 'Downtown / Coal Harbour',
        neighborhood_en: 'Downtown / Coal Harbour',
        price_fr: '200-500$/nuit',
        price_en: '$200-500/night',
        tip_fr: 'Vue sur les montagnes et le port. 5-10 min à pied du BC Place.',
        tip_en: 'Mountain and harbour views. 5-10 min walk from BC Place.',
      },
      {
        neighborhood_fr: 'Gastown',
        neighborhood_en: 'Gastown',
        price_fr: '150-300$/nuit',
        price_en: '$150-300/night',
        tip_fr: 'Quartier historique branché, bars et galeries. Très proche du stade. Réservez tôt.',
        tip_en: 'Trendy historic neighbourhood, bars and galleries. Very close to stadium. Book early.',
      },
      {
        neighborhood_fr: 'Kitsilano / West Side',
        neighborhood_en: 'Kitsilano / West Side',
        price_fr: '120-250$/nuit',
        price_en: '$120-250/night',
        tip_fr: 'Quartier résidentiel détendu, plages à proximité. 20 min du centre en SkyTrain.',
        tip_en: 'Relaxed residential neighbourhood, beaches nearby. 20 min from downtown by SkyTrain.',
      },
    ],
    activities: [
      {
        emoji: '🌲',
        name_fr: 'Stanley Park',
        name_en: 'Stanley Park',
        description_fr: 'Le plus grand parc urbain du Canada (400 ha). Piste cyclable de 10 km, plages, forêt primaire en plein centre-ville.',
        description_en: 'Canada\'s largest urban park (400 ha). 10 km cycling path, beaches, old-growth forest in the city centre.',
      },
      {
        emoji: '🚡',
        name_fr: 'Grouse Mountain',
        name_en: 'Grouse Mountain',
        description_fr: 'Téléphérique depuis North Vancouver. Vue panoramique sur toute la ville et l\'océan. Randonnée ou ski selon la saison.',
        description_en: 'Gondola from North Vancouver. Panoramic views of the entire city and ocean. Hiking or skiing depending on season.',
      },
      {
        emoji: '🏪',
        name_fr: 'Gastown & Chinatown',
        name_en: 'Gastown & Chinatown',
        description_fr: 'Deux quartiers historiques côte à côte. Gastown : boutiques vintage et bars. Chinatown : le 2e plus grand en Amérique du Nord.',
        description_en: 'Two historic neighbourhoods side by side. Gastown: vintage shops and bars. Chinatown: 2nd largest in North America.',
      },
      {
        emoji: '🏄',
        name_fr: 'Wreck Beach & English Bay',
        name_en: 'Wreck Beach & English Bay',
        description_fr: 'Les plages de Vancouver sont étonnamment belles. English Bay : animations estivales, couchers de soleil époustouflants.',
        description_en: 'Vancouver\'s beaches are surprisingly beautiful. English Bay: summer events, stunning sunsets.',
      },
    ],
    practical: {
      language_fr: 'Anglais dominant. Forte communauté asiatique (cantonais, mandarin, punjabi courants). Peu de français.',
      language_en: 'English dominant. Strong Asian community (Cantonese, Mandarin, Punjabi common). Little French.',
      currency_fr: 'Dollar canadien (CAD). GST + PST : 12% en Colombie-Britannique.',
      currency_en: 'Canadian Dollar (CAD). GST + PST: 12% in British Columbia.',
      tip_fr: 'Pourboire : 15-18%. Très ancré dans la culture locale.',
      tip_en: 'Tip: 15-18%. Deeply ingrained in local culture.',
      emergency_fr: 'Urgences : 911 | Police non-urgence : 604-717-3321',
      emergency_en: 'Emergency: 911 | Non-emergency police: 604-717-3321',
      app_fr: 'Apps : TransLink (bus/SkyTrain), Mobi (vélos en libre-service), Uber, BC Ferries',
      app_en: 'Apps: TransLink (bus/SkyTrain), Mobi (bike share), Uber, BC Ferries',
    },
  },
];

export function getCityBySlug(slug: string): CityGuide | undefined {
  return cities.find((c) => c.slug === slug);
}
