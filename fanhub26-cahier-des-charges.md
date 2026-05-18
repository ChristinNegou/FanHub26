# CAHIER DES CHARGES — FanHub26

## Document de référence pour le développement avec Claude Code

**Projet :** FanHub26 — Web app bilingue (FR/EN) pour les fans de la Coupe du Monde FIFA 2026 au Canada
**Date :** Mai 2026
**Deadline critique :** 11 juin 2026 (coup d'envoi du tournoi)
**Cible géographique principale :** Québec, Ontario, puis tout le Canada + villes hôtes USA/Mexique

---

## TABLE DES MATIÈRES

1. [Vision et positionnement](#1-vision-et-positionnement)
2. [Architecture technique](#2-architecture-technique)
3. [Structure du projet](#3-structure-du-projet)
4. [Base de données — Schéma complet](#4-base-de-données--schéma-complet)
5. [Module 1 — Watch Party Finder (MVP)](#5-module-1--watch-party-finder-mvp)
6. [Module 2 — Calendrier des matchs](#6-module-2--calendrier-des-matchs)
7. [Module 3 — Guide des villes](#7-module-3--guide-des-villes)
8. [Module 4 — Fan Zones interactives](#8-module-4--fan-zones-interactives)
9. [Module 5 — Social / Communauté fans](#9-module-5--social--communauté-fans)
10. [Système de monétisation](#10-système-de-monétisation)
11. [Internationalisation (i18n)](#11-internationalisation-i18n)
12. [SEO et performance](#12-seo-et-performance)
13. [Design system et UI](#13-design-system-et-ui)
14. [Plan de déploiement](#14-plan-de-déploiement)
15. [API externes et intégrations](#15-api-externes-et-intégrations)
16. [Sécurité](#16-sécurité)
17. [Plan de développement par sprints](#17-plan-de-développement-par-sprints)
18. [Critères de succès (KPIs)](#18-critères-de-succès-kpis)

---

## 1. VISION ET POSITIONNEMENT

### 1.1 Problème résolu

Des millions de fans vont vivre la Coupe du Monde 2026 au Canada sans billet de stade. Ils cherchent :
- Où regarder chaque match dans un bar avec l'ambiance (son activé, écran géant, fans de leur équipe)
- Comment naviguer entre les villes hôtes (Toronto, Vancouver) et les villes touristiques (Montréal, Québec)
- Où sont les fan zones officielles et non-officielles
- Comment rencontrer d'autres fans de leur équipe nationale

Aucune solution existante ne couvre ces besoins pour le marché francophone/canadien.

### 1.2 Concurrence identifiée

| Concurrent | Points forts | Lacunes (notre opportunité) |
|---|---|---|
| watchWC.com | Bar finder spécifique Coupe du Monde, filtres son/ambiance | Anglophone uniquement, pas de guide ville, pas de social |
| GameWatch.info | 5000 villes, 500 équipes, mature | Généraliste (pas optimisé Coupe du Monde), anglophone, pas de fan zones |
| GOJO | Filtres son/projecteur, gamification | Centré Europe, faible couverture Canada |

### 1.3 Avantage compétitif FanHub26

- **Bilingue natif FR/EN** — seule plateforme pensée pour le Québec
- **Hub complet** — pas juste un bar finder, mais calendrier + guide ville + fan zones + social
- **Focus Canada** — couverture profonde des villes canadiennes (pas juste Toronto/Vancouver)
- **Communauté par nationalité** — les fans brésiliens à Montréal, les fans français à Québec, etc.
- **Monétisation locale** — partenariats avec les commerces québécois

---

## 2. ARCHITECTURE TECHNIQUE

### 2.1 Stack technologique

```
Frontend :        Next.js 14+ (App Router, Server Components)
Langage :         TypeScript (strict mode)
Styling :         Tailwind CSS 3+
Base de données : Supabase (PostgreSQL + Auth + Realtime + Storage)
Cartes :          Mapbox GL JS (ou Leaflet en fallback gratuit)
Hébergement :     Vercel (tier gratuit puis Pro si trafic)
Paiements :       Stripe (pour les bars featured)
Analytics :       Plausible ou Umami (respect vie privée)
Email :           Resend (transactionnel)
CDN images :      Supabase Storage + Vercel Image Optimization
```

### 2.2 Pourquoi ces choix

- **Next.js** : SSR pour le SEO (crucial pour capter le trafic organique "où regarder le match"), ISR pour les pages de matchs, API routes pour le backend
- **Supabase** : tier gratuit généreux (50K MAU, 500MB DB, 1GB storage), authentification intégrée, realtime pour les mises à jour de matchs en cours, Row Level Security pour les données bars
- **Mapbox** : 50K chargements de carte gratuits/mois, excellent support mobile, customisation visuelle
- **Vercel** : déploiement auto depuis GitHub, edge functions, image optimization, tier gratuit suffisant

### 2.3 Coûts estimés au lancement

| Poste | Coût mensuel |
|---|---|
| Domaine (fanhub26.ca ou fanhub26.com) | ~1.50$/mois (18$/an) |
| Vercel (Hobby → Pro si besoin) | 0$ → 20$/mois |
| Supabase (Free → Pro si besoin) | 0$ → 25$/mois |
| Mapbox (Free tier) | 0$ |
| Resend (Free tier : 3000 emails/mois) | 0$ |
| **Total lancement** | **~1.50$/mois** |
| **Total si scaling** | **~46.50$/mois** |

---

## 3. STRUCTURE DU PROJET

```
fanhub26/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── [locale]/                 # Routes i18n (fr/en)
│   │   │   ├── page.tsx              # Landing page
│   │   │   ├── layout.tsx            # Layout principal
│   │   │   ├── watch/                # Watch Party Finder
│   │   │   │   ├── page.tsx          # Page principale carte + filtres
│   │   │   │   └── [matchId]/        # Page spécifique à un match
│   │   │   │       └── page.tsx
│   │   │   ├── calendar/             # Calendrier des matchs
│   │   │   │   ├── page.tsx          # Vue calendrier
│   │   │   │   └── [matchId]/        # Détail d'un match
│   │   │   │       └── page.tsx
│   │   │   ├── guide/                # Guide des villes
│   │   │   │   ├── page.tsx          # Liste des villes
│   │   │   │   └── [citySlug]/       # Page ville
│   │   │   │       └── page.tsx
│   │   │   ├── fanzones/             # Fan zones
│   │   │   │   └── page.tsx          # Carte des fan zones
│   │   │   ├── community/            # Social / meetups
│   │   │   │   ├── page.tsx
│   │   │   │   └── [teamSlug]/       # Communauté par équipe
│   │   │   │       └── page.tsx
│   │   │   ├── bar/                  # Pages pour les bars
│   │   │   │   ├── register/         # Inscription bar
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── dashboard/        # Tableau de bord bar
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [barSlug]/        # Page publique du bar
│   │   │   │       └── page.tsx
│   │   │   └── about/
│   │   │       └── page.tsx
│   │   └── api/                      # API Routes
│   │       ├── bars/
│   │       │   ├── route.ts          # CRUD bars
│   │       │   ├── search/
│   │       │   │   └── route.ts      # Recherche géo
│   │       │   └── [id]/
│   │       │       └── route.ts
│   │       ├── matches/
│   │       │   └── route.ts
│   │       ├── fanzones/
│   │       │   └── route.ts
│   │       ├── community/
│   │       │   └── route.ts
│   │       ├── webhooks/
│   │       │   └── stripe/
│   │       │       └── route.ts
│   │       └── contact/
│   │           └── route.ts
│   ├── components/
│   │   ├── ui/                       # Composants UI réutilisables
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   ├── map/                      # Composants carte
│   │   │   ├── MapContainer.tsx      # Wrapper Mapbox
│   │   │   ├── BarMarker.tsx         # Marqueur bar
│   │   │   ├── FanZoneMarker.tsx     # Marqueur fan zone
│   │   │   ├── MapFilters.tsx        # Filtres latéraux
│   │   │   └── BarPopup.tsx          # Popup info bar
│   │   ├── match/                    # Composants matchs
│   │   │   ├── MatchCard.tsx         # Carte de match
│   │   │   ├── MatchCalendar.tsx     # Calendrier
│   │   │   ├── MatchCountdown.tsx    # Compte à rebours
│   │   │   └── TeamBadge.tsx         # Badge équipe avec drapeau
│   │   ├── bar/                      # Composants bars
│   │   │   ├── BarCard.tsx           # Carte de bar (résultat)
│   │   │   ├── BarRegistrationForm.tsx
│   │   │   ├── BarDashboard.tsx
│   │   │   └── BarFeatures.tsx       # Son, écrans, capacité
│   │   ├── guide/                    # Composants guide
│   │   │   ├── CityCard.tsx
│   │   │   ├── TransportInfo.tsx
│   │   │   └── RestaurantList.tsx
│   │   ├── community/               # Composants social
│   │   │   ├── TeamFanGroup.tsx
│   │   │   ├── MeetupCard.tsx
│   │   │   └── FanCounter.tsx
│   │   └── layout/                   # Composants layout
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── LanguageSwitcher.tsx
│   │       ├── MobileNav.tsx
│   │       └── SearchBar.tsx
│   ├── lib/                          # Utilitaires et config
│   │   ├── supabase/
│   │   │   ├── client.ts             # Client navigateur
│   │   │   ├── server.ts             # Client serveur
│   │   │   └── admin.ts              # Client admin (service role)
│   │   ├── mapbox/
│   │   │   └── config.ts
│   │   ├── stripe/
│   │   │   └── config.ts
│   │   ├── i18n/
│   │   │   ├── config.ts             # Configuration i18n
│   │   │   ├── dictionaries.ts       # Chargement des traductions
│   │   │   └── middleware.ts         # Détection langue
│   │   ├── utils/
│   │   │   ├── geo.ts                # Calculs géographiques
│   │   │   ├── dates.ts              # Formatage dates/fuseaux
│   │   │   ├── slugify.ts
│   │   │   └── constants.ts          # Données statiques (équipes, villes)
│   │   └── types/
│   │       ├── database.ts           # Types Supabase générés
│   │       ├── match.ts
│   │       ├── bar.ts
│   │       ├── fanzone.ts
│   │       └── city.ts
│   ├── hooks/                        # Hooks React custom
│   │   ├── useGeolocation.ts
│   │   ├── useMatches.ts
│   │   ├── useBars.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   └── data/                         # Données statiques (seed)
│       ├── matches.json              # Tous les 104 matchs
│       ├── teams.json                # 48 équipes + drapeaux
│       ├── cities.json               # Villes hôtes + guides
│       ├── fanzones.json             # Fan zones officielles
│       └── translations/
│           ├── fr.json
│           └── en.json
├── public/
│   ├── flags/                        # Drapeaux 48 équipes (SVG)
│   ├── icons/                        # Icônes app
│   ├── og/                           # Images Open Graph
│   └── manifest.json                 # PWA manifest
├── supabase/
│   ├── migrations/                   # Migrations SQL
│   │   ├── 001_create_tables.sql
│   │   ├── 002_rls_policies.sql
│   │   └── 003_seed_data.sql
│   └── config.toml
├── scripts/
│   ├── seed-matches.ts               # Script pour peupler les matchs
│   ├── seed-teams.ts                 # Script pour peupler les équipes
│   └── seed-fanzones.ts              # Script pour peupler les fan zones
├── .env.local                        # Variables d'environnement
├── .env.example                      # Template .env
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. BASE DE DONNÉES — SCHÉMA COMPLET

### 4.1 Tables principales

```sql
-- ============================================
-- TABLE: teams (48 équipes qualifiées)
-- ============================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL,              -- "Brésil"
  name_en TEXT NOT NULL,              -- "Brazil"
  code TEXT NOT NULL UNIQUE,          -- "BRA" (code FIFA)
  group_letter CHAR(1) NOT NULL,     -- "A" à "L"
  flag_url TEXT NOT NULL,             -- "/flags/bra.svg"
  continent TEXT NOT NULL,            -- "South America"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: venues (16 stades)
-- ============================================
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                 -- "BMO Field"
  city TEXT NOT NULL,                 -- "Toronto"
  country TEXT NOT NULL,              -- "Canada"
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  capacity INTEGER NOT NULL,
  timezone TEXT NOT NULL,             -- "America/Toronto"
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: matches (104 matchs)
-- ============================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_number INTEGER NOT NULL UNIQUE, -- 1 à 104
  stage TEXT NOT NULL,                -- "group", "round_of_32", "round_of_16", "quarter_final", "semi_final", "third_place", "final"
  group_letter CHAR(1),              -- NULL pour les phases à élimination
  home_team_id UUID REFERENCES teams(id),    -- NULL si pas encore déterminé
  away_team_id UUID REFERENCES teams(id),    -- NULL si pas encore déterminé
  home_team_placeholder TEXT,        -- "Vainqueur Groupe A" si équipe pas connue
  away_team_placeholder TEXT,
  venue_id UUID REFERENCES venues(id) NOT NULL,
  kickoff_utc TIMESTAMPTZ NOT NULL,  -- Heure de coup d'envoi en UTC
  home_score INTEGER,                -- NULL si pas joué
  away_score INTEGER,
  status TEXT DEFAULT 'scheduled',   -- "scheduled", "live", "finished", "postponed"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: bars (lieux de diffusion)
-- ============================================
CREATE TABLE bars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id), -- Propriétaire du compte
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_fr TEXT,
  description_en TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,             -- "QC", "ON", "BC"
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'CA',
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  phone TEXT,
  website TEXT,
  instagram TEXT,
  
  -- Caractéristiques
  has_sound BOOLEAN DEFAULT FALSE,        -- Diffuse avec le son
  has_projector BOOLEAN DEFAULT FALSE,    -- Écran géant / projecteur
  has_outdoor BOOLEAN DEFAULT FALSE,      -- Terrasse
  has_food BOOLEAN DEFAULT FALSE,         -- Sert de la nourriture
  num_screens INTEGER DEFAULT 1,          -- Nombre d'écrans
  capacity INTEGER,                       -- Capacité d'accueil
  atmosphere TEXT,                         -- "lively", "chill", "sports_bar", "pub"
  
  -- Monétisation
  is_featured BOOLEAN DEFAULT FALSE,      -- Bar mis en avant (payant)
  featured_until TIMESTAMPTZ,             -- Date d'expiration featured
  stripe_customer_id TEXT,
  
  -- Modération
  is_verified BOOLEAN DEFAULT FALSE,      -- Vérifié par l'équipe
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Images
  logo_url TEXT,
  cover_image_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index géographique pour la recherche par proximité
CREATE INDEX idx_bars_location ON bars USING gist (
  point(longitude, latitude)
);
CREATE INDEX idx_bars_city ON bars(city);
CREATE INDEX idx_bars_featured ON bars(is_featured) WHERE is_featured = TRUE;

-- ============================================
-- TABLE: bar_matches (quels matchs un bar diffuse)
-- ============================================
CREATE TABLE bar_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bar_id UUID REFERENCES bars(id) ON DELETE CASCADE,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sound_on BOOLEAN DEFAULT TRUE,
  special_offer TEXT,                -- "Pichets à 15$", "Happy Hour"
  supporter_team_id UUID REFERENCES teams(id), -- Si c'est un bar de supporters
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bar_id, match_id)
);

CREATE INDEX idx_bar_matches_match ON bar_matches(match_id);
CREATE INDEX idx_bar_matches_bar ON bar_matches(bar_id);

-- ============================================
-- TABLE: fan_zones (zones officielles et non-officielles)
-- ============================================
CREATE TABLE fan_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_fr TEXT,
  name_en TEXT,
  type TEXT NOT NULL,                -- "official_fifa", "city_organized", "community"
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  description_fr TEXT,
  description_en TEXT,
  capacity INTEGER,
  has_big_screen BOOLEAN DEFAULT TRUE,
  has_food BOOLEAN DEFAULT FALSE,
  has_drinks BOOLEAN DEFAULT FALSE,
  is_free BOOLEAN DEFAULT TRUE,
  opening_date DATE,
  closing_date DATE,
  operating_hours TEXT,              -- "10h-23h"
  website TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: cities (guide des villes)
-- ============================================
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,          -- "montreal", "toronto"
  province TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'CA',
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  is_host_city BOOLEAN DEFAULT FALSE, -- Ville hôte officielle FIFA
  description_fr TEXT,
  description_en TEXT,
  transport_info_fr TEXT,             -- Infos transport en JSON ou markdown
  transport_info_en TEXT,
  timezone TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: city_pois (points d'intérêt par ville)
-- ============================================
CREATE TABLE city_pois (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_fr TEXT,
  name_en TEXT,
  category TEXT NOT NULL,            -- "restaurant", "transport", "hotel", "attraction", "nightlife"
  address TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  description_fr TEXT,
  description_en TEXT,
  price_range TEXT,                  -- "$", "$$", "$$$", "$$$$"
  rating DECIMAL(2,1),
  website TEXT,
  affiliate_url TEXT,                -- Lien affilié (Booking, etc.)
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: community_events (meetups de fans)
-- ============================================
CREATE TABLE community_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES auth.users(id),
  team_id UUID REFERENCES teams(id),    -- Équipe supportée
  match_id UUID REFERENCES matches(id), -- Match associé (optionnel)
  bar_id UUID REFERENCES bars(id),      -- Bar associé (optionnel)
  title TEXT NOT NULL,
  description TEXT,
  city TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  event_date TIMESTAMPTZ NOT NULL,
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: event_rsvps (inscriptions aux meetups)
-- ============================================
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES community_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'going',       -- "going", "maybe", "cancelled"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================
-- TABLE: user_profiles (profils utilisateurs)
-- ============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  favorite_team_id UUID REFERENCES teams(id),
  city TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'fr',          -- Langue préférée
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: bar_reviews (avis sur les bars)
-- ============================================
CREATE TABLE bar_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bar_id UUID REFERENCES bars(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  atmosphere_rating INTEGER CHECK (atmosphere_rating >= 1 AND atmosphere_rating <= 5),
  sound_quality_rating INTEGER CHECK (sound_quality_rating >= 1 AND sound_quality_rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bar_id, user_id)           -- Un avis par utilisateur par bar
);

-- ============================================
-- TABLE: contact_submissions (formulaire de contact)
-- ============================================
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,             -- "partnership", "bar_inquiry", "bug_report", "other"
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 Row Level Security (RLS)

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE bars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bar_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE bar_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

-- Bars : lecture publique, écriture par le propriétaire
CREATE POLICY "bars_read_public" ON bars FOR SELECT USING (is_active = TRUE);
CREATE POLICY "bars_insert_owner" ON bars FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "bars_update_owner" ON bars FOR UPDATE USING (auth.uid() = owner_id);

-- Bar matches : lecture publique, écriture par le propriétaire du bar
CREATE POLICY "bar_matches_read" ON bar_matches FOR SELECT USING (TRUE);
CREATE POLICY "bar_matches_write" ON bar_matches FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM bars WHERE id = bar_id AND owner_id = auth.uid()));
CREATE POLICY "bar_matches_update" ON bar_matches FOR UPDATE
  USING (EXISTS (SELECT 1 FROM bars WHERE id = bar_id AND owner_id = auth.uid()));

-- Profils : lecture publique, écriture par l'utilisateur
CREATE POLICY "profiles_read" ON user_profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_write" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Reviews : lecture publique, écriture par l'auteur
CREATE POLICY "reviews_read" ON bar_reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_write" ON bar_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Events communautaires : lecture publique, écriture par l'organisateur
CREATE POLICY "events_read" ON community_events FOR SELECT USING (is_active = TRUE);
CREATE POLICY "events_write" ON community_events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "events_update" ON community_events FOR UPDATE USING (auth.uid() = organizer_id);

-- RSVPs : lecture publique, écriture par l'utilisateur
CREATE POLICY "rsvps_read" ON event_rsvps FOR SELECT USING (TRUE);
CREATE POLICY "rsvps_write" ON event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rsvps_update" ON event_rsvps FOR UPDATE USING (auth.uid() = user_id);
```

### 4.3 Fonctions et vues SQL utiles

```sql
-- Fonction : recherche de bars par proximité (rayon en km)
CREATE OR REPLACE FUNCTION search_bars_nearby(
  user_lat DECIMAL,
  user_lng DECIMAL,
  radius_km DECIMAL DEFAULT 10,
  filter_match_id UUID DEFAULT NULL,
  filter_sound BOOLEAN DEFAULT NULL,
  filter_featured BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
  bar_id UUID,
  name TEXT,
  slug TEXT,
  address TEXT,
  city TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  distance_km DECIMAL,
  has_sound BOOLEAN,
  has_projector BOOLEAN,
  num_screens INTEGER,
  capacity INTEGER,
  atmosphere TEXT,
  is_featured BOOLEAN,
  is_verified BOOLEAN,
  logo_url TEXT,
  cover_image_url TEXT,
  avg_rating DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    b.id AS bar_id,
    b.name,
    b.slug,
    b.address,
    b.city,
    b.latitude,
    b.longitude,
    (6371 * acos(
      cos(radians(user_lat)) * cos(radians(b.latitude)) *
      cos(radians(b.longitude) - radians(user_lng)) +
      sin(radians(user_lat)) * sin(radians(b.latitude))
    ))::DECIMAL AS distance_km,
    b.has_sound,
    b.has_projector,
    b.num_screens,
    b.capacity,
    b.atmosphere,
    b.is_featured,
    b.is_verified,
    b.logo_url,
    b.cover_image_url,
    COALESCE(AVG(r.rating), 0)::DECIMAL AS avg_rating
  FROM bars b
  LEFT JOIN bar_reviews r ON r.bar_id = b.id
  WHERE b.is_active = TRUE
    AND (filter_match_id IS NULL OR EXISTS (
      SELECT 1 FROM bar_matches bm WHERE bm.bar_id = b.id AND bm.match_id = filter_match_id
    ))
    AND (filter_sound IS NULL OR b.has_sound = filter_sound)
    AND (filter_featured IS NULL OR b.is_featured = filter_featured)
  GROUP BY b.id
  HAVING (6371 * acos(
    cos(radians(user_lat)) * cos(radians(b.latitude)) *
    cos(radians(b.longitude) - radians(user_lng)) +
    sin(radians(user_lat)) * sin(radians(b.latitude))
  )) <= radius_km
  ORDER BY
    b.is_featured DESC,   -- Featured en premier
    distance_km ASC;       -- Puis par proximité
END;
$$ LANGUAGE plpgsql;

-- Vue : prochains matchs avec infos équipes
CREATE OR REPLACE VIEW upcoming_matches AS
SELECT
  m.*,
  ht.name_fr AS home_team_name_fr,
  ht.name_en AS home_team_name_en,
  ht.code AS home_team_code,
  ht.flag_url AS home_team_flag,
  at.name_fr AS away_team_name_fr,
  at.name_en AS away_team_name_en,
  at.code AS away_team_code,
  at.flag_url AS away_team_flag,
  v.name AS venue_name,
  v.city AS venue_city,
  v.timezone AS venue_timezone,
  (SELECT COUNT(*) FROM bar_matches bm WHERE bm.match_id = m.id) AS bars_showing
FROM matches m
LEFT JOIN teams ht ON m.home_team_id = ht.id
LEFT JOIN teams at ON m.away_team_id = at.id
JOIN venues v ON m.venue_id = v.id
WHERE m.status != 'finished'
ORDER BY m.kickoff_utc ASC;
```

---

## 5. MODULE 1 — WATCH PARTY FINDER (MVP)

### 5.1 Description fonctionnelle

Le Watch Party Finder est le cœur viral de l'application. Il permet aux fans de trouver un bar/restaurant qui diffuse un match spécifique, filtré par localisation, caractéristiques, et équipe supportée.

### 5.2 User stories

```
En tant que fan, je veux :
- [WPF-01] Voir une carte interactive avec tous les bars qui diffusent des matchs près de moi
- [WPF-02] Filtrer les bars par match spécifique (ex: "Brésil vs Maroc")
- [WPF-03] Filtrer par caractéristiques : son activé, écran géant, terrasse, nourriture
- [WPF-04] Filtrer par équipe supportée (bars de supporters)
- [WPF-05] Voir la distance entre ma position et chaque bar
- [WPF-06] Voir les détails d'un bar : adresse, horaires, offres spéciales, avis
- [WPF-07] Voir quels matchs un bar diffuse cette semaine
- [WPF-08] Partager un bar sur les réseaux sociaux
- [WPF-09] Laisser un avis après avoir regardé un match dans un bar

En tant que propriétaire de bar, je veux :
- [WPF-10] Inscrire mon bar gratuitement avec les infos de base
- [WPF-11] Indiquer quels matchs je vais diffuser
- [WPF-12] Publier des offres spéciales pour chaque match
- [WPF-13] Voir des statistiques de visibilité de mon bar
- [WPF-14] Payer pour être "featured" (en tête des résultats)
```

### 5.3 Interface utilisateur — Watch Party Finder

**Layout de la page principale :**

```
┌─────────────────────────────────────────────────┐
│  [Logo FanHub26]  [Calendrier] [Guide] [Social] │  ← Header fixe
│  [FR/EN]                                         │
├─────────────────────────────────────────────────┤
│                                                   │
│  "Où regarder le match ?"                        │
│                                                   │
│  ┌─────────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Choisir un  │  │ Ville /  │  │ Filtres    │  │  ← Barre de filtres
│  │ match  ▼    │  │ Position │  │ avancés ▼  │  │
│  └─────────────┘  └──────────┘  └────────────┘  │
│                                                   │
│  ┌──────────────────┬────────────────────────┐   │
│  │                  │                          │   │
│  │  Liste des bars  │    Carte interactive     │   │  ← Layout split
│  │                  │    (Mapbox)               │   │
│  │  ┌────────────┐  │                          │   │
│  │  │ ⭐ Bar A   │  │        📍📍              │   │
│  │  │ Featured   │  │     📍    📍             │   │
│  │  │ 0.5 km     │  │   📍        📍           │   │
│  │  └────────────┘  │              📍           │   │
│  │  ┌────────────┐  │                          │   │
│  │  │ Bar B      │  │                          │   │
│  │  │ 1.2 km     │  │                          │   │
│  │  └────────────┘  │                          │   │
│  │  ┌────────────┐  │                          │   │
│  │  │ Bar C      │  │                          │   │
│  │  │ 2.1 km     │  │                          │   │
│  │  └────────────┘  │                          │   │
│  │                  │                          │   │
│  └──────────────────┴────────────────────────┘   │
│                                                   │
├─────────────────────────────────────────────────┤
│  Matchs du jour :                                │
│  [🇧🇷 BRA vs MAR 🇲🇦] [🇫🇷 FRA vs SEN 🇸🇳]       │  ← Bandeau matchs
│  [🇨🇦 CAN vs ARG 🇦🇷]                             │
└─────────────────────────────────────────────────┘
```

**Layout mobile (responsive) :**

```
┌──────────────────────┐
│ [☰]  FanHub26  [🌐]  │  ← Header compact
├──────────────────────┤
│ Où regarder le match?│
│ ┌──────────────────┐ │
│ │ Choisir match ▼  │ │  ← Filtres empilés
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ 📍 Ma position   │ │
│ └──────────────────┘ │
│ [Son] [Écran] [Terr] │  ← Chips filtres
│                       │
│ ┌──────────────────┐ │
│ │                    │ │
│ │  Carte (50vh)      │ │  ← Carte plein écran
│ │     📍 📍 📍       │ │
│ │                    │ │
│ └──────────────────┘ │
│                       │
│ ┌──────────────────┐ │
│ │ ⭐ Bar A          │ │  ← Liste scrollable
│ │ 🔊 Son • 📺 3 TV │ │
│ │ 0.5 km • ⭐ 4.5   │ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ Bar B              │ │
│ │ 📺 1 TV            │ │
│ │ 1.2 km • ⭐ 4.0   │ │
│ └──────────────────┘ │
└──────────────────────┘
```

### 5.4 Composants clés — Watch Party Finder

**BarCard.tsx — Carte de résultat bar :**
```
Props :
- bar: Bar (objet complet)
- distance: number (en km)
- matchInfo?: BarMatch (offre spéciale, son, etc.)
- onClick: () => void

Affiche :
- Photo de couverture (ou placeholder couleur)
- Nom du bar + badge "Featured" si applicable + badge "Vérifié" si applicable
- Distance depuis l'utilisateur
- Chips : 🔊 Son | 📺 X écrans | 🍔 Food | 🌿 Terrasse
- Note moyenne (étoiles)
- Offre spéciale du match (si applicable)
- Bouton "Voir détails" → ouvre la page du bar
```

**MapFilters.tsx — Barre de filtres :**
```
Props :
- selectedMatch: Match | null
- filters: FilterState
- onFilterChange: (filters: FilterState) => void

FilterState :
- matchId: string | null
- teamId: string | null
- soundOn: boolean
- hasProjector: boolean
- hasOutdoor: boolean
- hasFood: boolean
- atmosphere: string | null
- radius: number (km)
- sortBy: "distance" | "rating" | "featured"
```

**MapContainer.tsx — Carte Mapbox :**
```
Props :
- bars: Bar[] (avec coordonnées)
- userLocation: {lat, lng} | null
- selectedBar: Bar | null
- onBarSelect: (bar: Bar) => void
- fanzones?: FanZone[] (optionnel, pour overlay)

Comportement :
- Centre sur la position de l'utilisateur (ou Montréal par défaut)
- Clusters de marqueurs si beaucoup de bars proches
- Marqueurs différenciés : Featured (plus gros, doré), Vérifié (avec badge), Normal
- Popup au clic sur un marqueur avec infos résumées du bar
- Zoom fluide sur sélection dans la liste
```

---

## 6. MODULE 2 — CALENDRIER DES MATCHS

### 6.1 User stories

```
- [CAL-01] Voir tous les matchs dans un calendrier visuel (vue jour/semaine)
- [CAL-02] Filtrer par équipe (suivre une équipe spécifique)
- [CAL-03] Filtrer par stade/ville
- [CAL-04] Voir le compte à rebours avant le prochain match
- [CAL-05] Voir les résultats des matchs terminés
- [CAL-06] Voir l'heure du match dans mon fuseau horaire local (ET/PT/CT)
- [CAL-07] Ajouter un match à mon calendrier personnel (Google/Apple/Outlook)
- [CAL-08] Recevoir une notification avant un match (PWA push notification)
- [CAL-09] Voir combien de bars diffusent chaque match (lien vers le finder)
```

### 6.2 Interface — Page calendrier

```
┌─────────────────────────────────────────────────┐
│  Calendrier des matchs                           │
│                                                   │
│  Filtres : [Toutes les équipes ▼] [Toutes villes ▼] [Phase ▼]  │
│  Fuseau : [Heure de l'Est (ET) ▼]               │
│                                                   │
│  ── Aujourd'hui, 15 juin 2026 ──                 │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │ 13h00 ET │ 🇧🇷 Brésil vs Maroc 🇲🇦           │ │
│  │ Groupe E  │ MetLife Stadium, New Jersey       │ │
│  │           │ 📺 142 bars diffusent             │ │
│  │           │ [Trouver un bar] [📅 Ajouter]    │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │ 16h00 ET │ 🇫🇷 France vs Sénégal 🇸🇳          │ │
│  │ Groupe D  │ MetLife Stadium, New Jersey       │ │
│  │           │ 📺 98 bars diffusent              │ │
│  │           │ [Trouver un bar] [📅 Ajouter]    │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ── Demain, 16 juin 2026 ──                      │
│  ...                                              │
└─────────────────────────────────────────────────┘
```

### 6.3 Données des matchs

Les 104 matchs doivent être pré-peuplés dans la base de données via le script `seed-matches.ts`.
Source des données : calendrier officiel FIFA (https://www.fifa.com).

Format du fichier `data/matches.json` :
```json
{
  "matches": [
    {
      "match_number": 1,
      "stage": "group",
      "group": "A",
      "home_team_code": "MEX",
      "away_team_code": "RSA",
      "venue": "Estadio Azteca",
      "city": "Mexico City",
      "kickoff_utc": "2026-06-11T21:00:00Z"
    }
  ]
}
```

---

## 7. MODULE 3 — GUIDE DES VILLES

### 7.1 Villes couvertes (par priorité)

**Priorité 1 — Villes hôtes Canada :**
- Toronto (6 matchs)
- Vancouver (7 matchs)

**Priorité 2 — Villes touristiques Québec (flux de visiteurs attendu) :**
- Montréal
- Québec City
- Trois-Rivières
- Mont-Tremblant

**Priorité 3 — Villes hôtes US proches :**
- Seattle
- Boston (Foxborough)
- New York / New Jersey

### 7.2 Contenu par ville

Chaque page ville contient :

```
1. EN-TÊTE
   - Photo de la ville
   - Badge "Ville hôte FIFA" si applicable
   - Nombre de matchs accueillis
   - Météo actuelle (API gratuite)
   
2. TRANSPORT
   - Comment arriver (avion, train, bus, voiture)
   - Transport en commun (cartes, tarifs, apps à télécharger)
   - Distance depuis les autres villes hôtes
   - Liens vers VIA Rail, Porter Airlines, etc.
   
3. OÙ MANGER
   - Sélection de restaurants par catégorie (poutine, brunch, fine dining, budget)
   - Liens affiliés si disponibles
   - Carte interactive des restos
   
4. OÙ DORMIR
   - Quartiers recommandés avec fourchette de prix
   - Liens affiliés Booking.com / Hostelworld
   
5. À VOIR / À FAIRE
   - Attractions principales
   - Expériences uniques liées au foot (murales, boutiques, etc.)
   
6. INFOS PRATIQUES
   - Langue parlée, monnaie, pourboires
   - Urgences, pharmacies
   - SIM / eSIM pour les touristes
   - Loi 96 (affichage en français au Québec)
```

### 7.3 User stories

```
- [GV-01] Voir la liste des villes avec photos et résumé
- [GV-02] Naviguer dans le guide d'une ville par section
- [GV-03] Voir les restaurants/hôtels sur une carte
- [GV-04] Cliquer sur un lien affilié pour réserver (tracking)
- [GV-05] Voir les distances et options de transport entre villes
```

---

## 8. MODULE 4 — FAN ZONES INTERACTIVES

### 8.1 Données fan zones

**Fan zones officielles FIFA au Canada :**
- Toronto : Fort York National Historic Site / The Bentway
- Vancouver : Hastings Park

**Fan zones non-officielles (à enrichir) :**
- Montréal : à confirmer (probablement Vieux-Port ou Parc Jean-Drapeau)
- Québec City : Place d'Youville ou Grande Allée
- Autres villes qui organisent des watch parties publiques

### 8.2 User stories

```
- [FZ-01] Voir toutes les fan zones sur une carte interactive
- [FZ-02] Filtrer par type : officielle FIFA, organisée par la ville, communautaire
- [FZ-03] Voir les détails : horaires, capacité, nourriture, prix
- [FZ-04] Voir quels matchs sont diffusés dans chaque fan zone
- [FZ-05] Obtenir les directions (lien vers Google Maps / Apple Maps)
```

### 8.3 Interface

Carte pleine page avec overlay des fan zones. Marqueurs différenciés par type (couleur/icône).
Panneau latéral avec détails au clic sur un marqueur.

---

## 9. MODULE 5 — SOCIAL / COMMUNAUTÉ FANS

### 9.1 Concept

Permettre aux fans d'une même équipe de se retrouver. Un fan brésilien à Montréal peut trouver d'autres fans brésiliens et organiser un meetup pour regarder le match ensemble.

### 9.2 User stories

```
- [SOC-01] Choisir mon équipe favorite dans mon profil
- [SOC-02] Voir la page communauté de mon équipe (liste des fans, meetups)
- [SOC-03] Créer un meetup/watch party pour mon équipe dans ma ville
- [SOC-04] S'inscrire à un meetup existant (RSVP)
- [SOC-05] Voir combien de fans de chaque équipe sont dans chaque ville
- [SOC-06] Recevoir une notification quand un nouveau meetup est créé pour mon équipe
```

### 9.3 Interface — Page communauté équipe

```
┌─────────────────────────────────────────────────┐
│  🇧🇷 Communauté Brésil                          │
│                                                   │
│  247 fans au Canada                              │
│  [Montréal: 89] [Toronto: 102] [Vancouver: 56]  │
│                                                   │
│  Prochains meetups :                             │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │ 🍺 Watch Party Brésil vs Maroc              │ │
│  │ 13 juin 2026 • 13h00                        │ │
│  │ Bar Le Footballeur, Montréal                │ │
│  │ Organisé par @CarlosM                       │ │
│  │ 23/50 places • [S'inscrire]                 │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  [+ Créer un meetup]                             │
└─────────────────────────────────────────────────┘
```

---

## 10. SYSTÈME DE MONÉTISATION

### 10.1 Source de revenus #1 — Bars Featured (principale)

**Modèle :**
- Inscription gratuite pour tous les bars
- Option "Featured" payante : le bar apparaît en premier dans les résultats
- Prix : 49$/mois ou 99$/mois (premium avec badge doré + analytics avancés)
- Paiement via Stripe Checkout (session unique ou abonnement)

**Implémentation Stripe :**
```
1. Bar s'inscrit gratuitement → créer compte Stripe Customer
2. Bar clique "Devenir Featured" → Stripe Checkout session
3. Webhook Stripe → mettre à jour is_featured et featured_until en DB
4. Cron job quotidien → désactiver les featured expirés
```

**Plans :**
| Plan | Prix/mois | Inclus |
|---|---|---|
| Gratuit | 0$ | Listing de base, 5 matchs sélectionnables |
| Featured | 49$/mois | En tête des résultats, badge ⭐, offres spéciales illimitées |
| Premium | 99$/mois | Featured + badge doré, analytics de vues, position #1 garanti dans sa zone |

### 10.2 Source de revenus #2 — Liens affiliés

**Partenaires affiliés visés :**
- Booking.com : 25-40% de commission sur les réservations
- Hostelworld : 30% de commission
- GetYourGuide : 8% de commission sur les expériences
- Airbnb : programme d'affiliation

**Implémentation :**
- Liens avec paramètre `?aid=FANHUB26` (Booking)
- Tracking des clics dans la DB (table `affiliate_clicks`)
- Dashboard admin pour suivre les revenus

### 10.3 Source de revenus #3 — Contenu sponsorisé

**Modèle :**
- Restaurants et expériences payent pour être listés en priorité dans le guide des villes
- Prix : 25-50$/mois par listing sponsorisé
- Badge "Sponsorisé" transparent pour l'utilisateur

### 10.4 Projection de revenus (scénario conservateur)

```
Pendant le tournoi (11 juin — 19 juillet = ~6 semaines) :

Bars Featured :
- 50 bars × 49$/mois = 2 450$/mois × 1.5 mois = 3 675$
- 20 bars × 99$/mois = 1 980$/mois × 1.5 mois = 2 970$

Affiliation :
- 5 000 clics Booking × 2% conversion × 100$ panier moyen × 30% commission = 3 000$

Contenu sponsorisé :
- 30 restaurants × 25$/mois × 1.5 mois = 1 125$

TOTAL ESTIMÉ : ~10 770$ sur la durée du tournoi
```

---

## 11. INTERNATIONALISATION (i18n)

### 11.1 Configuration

Utiliser le système i18n natif de Next.js App Router avec middleware de détection de langue.

**Langues supportées :** `fr` (défaut), `en`

**Structure des routes :**
```
/fr/watch          → Watch Party Finder (français)
/en/watch          → Watch Party Finder (anglais)
/fr/calendar       → Calendrier (français)
/en/calendar       → Calendar (anglais)
```

### 11.2 Middleware de détection

```typescript
// middleware.ts
// Ordre de priorité :
// 1. Préférence utilisateur (cookie "locale")
// 2. Header Accept-Language du navigateur
// 3. Défaut : "fr" (puisque le marché primaire est le Québec)
```

### 11.3 Fichiers de traduction

```json
// data/translations/fr.json
{
  "common": {
    "app_name": "FanHub26",
    "tagline": "Vivez la Coupe du Monde 2026 au Canada",
    "search": "Rechercher",
    "filter": "Filtrer",
    "close": "Fermer",
    "share": "Partager",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "loading": "Chargement...",
    "no_results": "Aucun résultat trouvé",
    "see_more": "Voir plus",
    "back": "Retour"
  },
  "watch": {
    "title": "Où regarder le match ?",
    "subtitle": "Trouvez un bar qui diffuse la Coupe du Monde près de chez vous",
    "select_match": "Choisir un match",
    "my_location": "Ma position",
    "filters": "Filtres",
    "sound_on": "Son activé",
    "big_screen": "Écran géant",
    "outdoor": "Terrasse",
    "food": "Nourriture",
    "featured": "Mis en avant",
    "verified": "Vérifié",
    "distance": "{distance} km",
    "bars_count": "{count} bars trouvés",
    "no_bars": "Aucun bar ne diffuse ce match dans votre zone",
    "register_bar": "Vous êtes propriétaire ? Inscrivez votre bar",
    "special_offer": "Offre spéciale"
  },
  "calendar": {
    "title": "Calendrier des matchs",
    "today": "Aujourd'hui",
    "tomorrow": "Demain",
    "group_stage": "Phase de groupes",
    "round_of_32": "32èmes de finale",
    "round_of_16": "8èmes de finale",
    "quarter_final": "Quarts de finale",
    "semi_final": "Demi-finales",
    "final": "Finale",
    "kickoff": "Coup d'envoi",
    "add_to_calendar": "Ajouter à mon calendrier",
    "find_bar": "Trouver un bar",
    "bars_showing": "{count} bars diffusent ce match",
    "match_finished": "Terminé",
    "match_live": "EN DIRECT",
    "all_teams": "Toutes les équipes",
    "all_cities": "Toutes les villes"
  },
  "guide": {
    "title": "Guide des villes",
    "host_city": "Ville hôte FIFA 2026",
    "matches_hosted": "{count} matchs accueillis",
    "transport": "Transport",
    "restaurants": "Où manger",
    "hotels": "Où dormir",
    "activities": "À voir / À faire",
    "practical": "Infos pratiques",
    "book_hotel": "Réserver un hôtel",
    "sponsored": "Sponsorisé"
  },
  "fanzones": {
    "title": "Fan zones",
    "official": "Officielle FIFA",
    "city_organized": "Organisée par la ville",
    "community": "Communautaire",
    "free_entry": "Entrée gratuite",
    "capacity": "Capacité : {count} personnes",
    "get_directions": "Itinéraire"
  },
  "community": {
    "title": "Communauté",
    "fans_in_canada": "{count} fans au Canada",
    "upcoming_meetups": "Prochains meetups",
    "create_meetup": "Créer un meetup",
    "join": "S'inscrire",
    "spots_left": "{count} places restantes",
    "full": "Complet",
    "organized_by": "Organisé par {name}",
    "choose_team": "Choisir mon équipe"
  },
  "bar": {
    "register_title": "Inscrire votre bar",
    "register_subtitle": "Gratuit — attirez les fans de la Coupe du Monde",
    "dashboard": "Tableau de bord",
    "edit_info": "Modifier les infos",
    "select_matches": "Sélectionner les matchs diffusés",
    "go_featured": "Devenir Featured",
    "featured_benefits": "Apparaissez en premier dans les résultats",
    "stats": "Statistiques",
    "views": "Vues",
    "clicks": "Clics",
    "reviews": "Avis"
  },
  "auth": {
    "sign_in": "Se connecter",
    "sign_up": "Créer un compte",
    "sign_out": "Déconnexion",
    "email": "Courriel",
    "password": "Mot de passe",
    "forgot_password": "Mot de passe oublié ?",
    "with_google": "Continuer avec Google"
  }
}
```

---

## 12. SEO ET PERFORMANCE

### 12.1 Pages à optimiser en priorité

| Page | URL | Mot-clé cible |
|---|---|---|
| Watch Finder | /fr/watch | "où regarder coupe du monde montréal" |
| Match spécifique | /fr/watch/bresil-vs-maroc | "brésil maroc bar montréal" |
| Calendrier | /fr/calendar | "calendrier coupe du monde 2026 heure québec" |
| Guide Montréal | /fr/guide/montreal | "coupe du monde montréal guide touriste" |
| Guide Toronto | /en/guide/toronto | "world cup toronto guide visitor" |
| Fan zone Toronto | /en/fanzones | "world cup 2026 fan zone toronto" |

### 12.2 Métadonnées dynamiques

Chaque page doit générer des métadonnées dynamiques via `generateMetadata()` de Next.js :

```typescript
// Exemple pour une page match
export async function generateMetadata({ params }): Promise<Metadata> {
  const match = await getMatch(params.matchId);
  return {
    title: `${match.homeTeam} vs ${match.awayTeam} — Où regarder | FanHub26`,
    description: `Trouvez un bar pour regarder ${match.homeTeam} vs ${match.awayTeam} le ${formatDate(match.kickoff)}. Carte interactive, filtres son/écran, offres spéciales.`,
    openGraph: {
      title: `${match.homeTeam} vs ${match.awayTeam}`,
      description: `${match.barsShowing} bars diffusent ce match près de vous`,
      images: [{ url: `/og/match/${params.matchId}`, width: 1200, height: 630 }],
    },
  };
}
```

### 12.3 Génération statique (ISR)

```
- Pages statiques (ISR revalidate: 3600) :
  - Toutes les pages de guide de villes
  - Pages d'équipes
  - Page d'accueil

- Pages dynamiques (SSR) :
  - Watch Party Finder (dépend de la géolocalisation)
  - Résultats de recherche

- Pages statiques pures (build time) :
  - Calendrier des matchs (jusqu'à la phase de groupes)
  - Fan zones
  - À propos
```

### 12.4 Performance

**Objectifs Core Web Vitals :**
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

**Optimisations :**
- Images : format WebP, lazy loading, srcset responsive, Vercel Image Optimization
- Carte Mapbox : chargement lazy (intersection observer), placeholder skeleton
- Fonts : preload, font-display: swap
- Bundle : dynamic imports pour les composants lourds (carte, calendrier)
- Cache : ISR pour les pages statiques, SWR pour les données dynamiques

---

## 13. DESIGN SYSTEM ET UI

### 13.1 Identité visuelle

```
Nom :       FanHub26
Ton :       Énergique, inclusif, festif mais professionnel
Couleurs :
  - Primaire :    #1D4ED8 (bleu FIFA)
  - Secondaire :  #DC2626 (rouge passion foot)
  - Accent :      #F59E0B (doré/amber pour les featured)
  - Succès :      #16A34A
  - Fond :        #FFFFFF (clair) / #0F172A (sombre)
  - Texte :       #1E293B (clair) / #F1F5F9 (sombre)
  - Surface :     #F8FAFC (clair) / #1E293B (sombre)

Typographie :
  - Titres :      Inter (700, 600)
  - Corps :       Inter (400, 500)
  - Monospace :   JetBrains Mono (code, données)

Iconographie :
  - Lucide React (cohérent, léger)
  - Drapeaux : SVG circle flags (https://hatscripts.github.io/circle-flags/)
```

### 13.2 Composants UI principaux

Utiliser une combinaison de Tailwind CSS + composants custom inspirés de shadcn/ui :
- Button (primary, secondary, outline, ghost)
- Card (avec variante featured/highlighted)
- Badge (status, catégorie, featured)
- Input, Select, Textarea
- Modal / Sheet (mobile)
- Toast / Notification
- Skeleton (loading states)
- Tabs
- Chip / Toggle (pour les filtres)

### 13.3 Responsive breakpoints

```
Mobile :    < 640px    (1 colonne, carte plein écran, nav bottom)
Tablette :  640-1024px (2 colonnes, sidebar rétractable)
Desktop :   > 1024px   (layout split liste + carte)
```

### 13.4 Mode sombre

Supporter le mode sombre via Tailwind `dark:` classes et `prefers-color-scheme`.
Toutes les couleurs doivent avoir une variante dark.

---

## 14. PLAN DE DÉPLOIEMENT

### 14.1 Environnements

```
Développement :  localhost:3000
Staging :        staging.fanhub26.ca (Vercel preview deployments)
Production :     fanhub26.ca (Vercel production)
```

### 14.2 CI/CD

```
GitHub → Push sur main → Vercel auto-deploy
GitHub → Push sur branch → Vercel preview deploy
```

### 14.3 Variables d'environnement (.env.example)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxx

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=pk.xxxxxx
MAPBOX_SECRET_TOKEN=sk.xxxxxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxx

# App
NEXT_PUBLIC_APP_URL=https://fanhub26.ca
NEXT_PUBLIC_DEFAULT_LOCALE=fr

# Resend (emails)
RESEND_API_KEY=re_xxxxxx

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=fanhub26.ca
```

---

## 15. API EXTERNES ET INTÉGRATIONS

### 15.1 APIs à intégrer

| Service | Usage | Coût |
|---|---|---|
| Supabase | DB, Auth, Realtime, Storage | Gratuit (Free tier) |
| Mapbox GL JS | Cartes interactives | Gratuit (50K loads/mois) |
| Stripe | Paiements bars featured | 2.9% + 30¢/transaction |
| Resend | Emails transactionnels | Gratuit (3K/mois) |
| OpenWeather API | Météo dans guide villes | Gratuit (1000 appels/jour) |
| Google Calendar API | Export iCal des matchs | Gratuit |

### 15.2 APIs optionnelles (V2)

| Service | Usage |
|---|---|
| Football-Data.org | Scores en temps réel (si on veut du live) |
| Google Places API | Autocomplétion adresses bars |
| Twilio | SMS notifications avant les matchs |

---

## 16. SÉCURITÉ

### 16.1 Règles de sécurité

```
- Supabase RLS activé sur TOUTES les tables (voir section 4.2)
- Validation côté serveur de TOUTES les entrées utilisateur (zod)
- Rate limiting sur les API routes (ex: inscription bar limitée à 5/heure)
- CSRF protection via Next.js middleware
- Stripe webhooks vérifiés par signature
- Upload d'images : validation type MIME + taille max 5MB
- Pas de données sensibles côté client
- HTTPS obligatoire (géré par Vercel)
- CSP headers configurés dans next.config.js
- Sanitization des entrées HTML (DOMPurify si contenu riche)
```

### 16.2 Validation avec Zod

```typescript
// Exemple : schéma de validation pour l'inscription d'un bar
const barRegistrationSchema = z.object({
  name: z.string().min(2).max(100),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(50),
  province: z.enum(['QC', 'ON', 'BC', 'AB', 'MB', 'SK', 'NS', 'NB', 'NL', 'PE', 'YT', 'NT', 'NU']),
  postal_code: z.string().regex(/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().regex(/^\+?1?\d{10,11}$/).optional(),
  website: z.string().url().optional(),
  has_sound: z.boolean().default(false),
  has_projector: z.boolean().default(false),
  has_outdoor: z.boolean().default(false),
  has_food: z.boolean().default(false),
  num_screens: z.number().int().min(1).max(50).default(1),
  capacity: z.number().int().min(10).max(5000).optional(),
  atmosphere: z.enum(['lively', 'chill', 'sports_bar', 'pub']).optional(),
});
```

---

## 17. PLAN DE DÉVELOPPEMENT PAR SPRINTS

### Sprint 1 — Fondations + MVP Watch Finder (Semaines 1-2)

**Objectif :** App fonctionnelle avec le Watch Party Finder de base.

```
Jour 1-2 : Setup projet
  □ Init Next.js + TypeScript + Tailwind
  □ Configurer Supabase (projet, tables, RLS)
  □ Configurer Mapbox
  □ Structure des dossiers
  □ Layout principal (Header, Footer, LanguageSwitcher)
  □ Système i18n basique (fr/en)

Jour 3-4 : Base de données + seed
  □ Créer toutes les tables SQL (migration 001)
  □ Appliquer les politiques RLS (migration 002)
  □ Script seed : 48 équipes avec drapeaux
  □ Script seed : 16 stades
  □ Script seed : 104 matchs
  □ Script seed : fan zones officielles
  □ Tester les requêtes Supabase

Jour 5-7 : Watch Party Finder — carte + liste
  □ MapContainer avec Mapbox GL JS
  □ Hook useGeolocation (position utilisateur)
  □ Fonction search_bars_nearby (Supabase RPC)
  □ BarCard composant
  □ BarMarker composant
  □ BarPopup composant
  □ Layout split (liste + carte) desktop
  □ Layout empilé mobile

Jour 8-10 : Watch Party Finder — filtres + matchs
  □ MapFilters composant (match, son, écran, terrasse)
  □ Sélecteur de match avec drapeaux des équipes
  □ Filtrage temps réel de la liste et de la carte
  □ Tri par distance / note / featured
  □ Page détail d'un bar (/bar/[slug])

Jour 11-12 : Inscription des bars
  □ Page inscription bar (/bar/register)
  □ Formulaire avec validation Zod
  □ Auth Supabase (email + Google)
  □ Upload logo/photo (Supabase Storage)
  □ Geocoding de l'adresse (Mapbox Geocoding API)

Jour 13-14 : Dashboard bar + polish
  □ Dashboard propriétaire (/bar/dashboard)
  □ Sélection des matchs diffusés
  □ Ajout d'offres spéciales
  □ Tests manuels complets
  □ Fix responsive mobile
  □ Deploy staging sur Vercel
```

### Sprint 2 — Bars + Monétisation (Semaines 3-4)

**Objectif :** Démarchage des bars + système de paiement fonctionnel.

```
Jour 1-3 : Stripe integration
  □ Setup Stripe (produits, prix)
  □ Page "Devenir Featured" avec plans
  □ Stripe Checkout (session de paiement)
  □ Webhook Stripe → mise à jour DB
  □ Affichage badge Featured dans les résultats
  □ Logique de tri Featured-first

Jour 4-5 : SEO + Landing page
  □ Landing page avec CTA "Trouver un bar" + "Inscrire votre bar"
  □ generateMetadata sur toutes les pages
  □ Sitemap.xml dynamique
  □ robots.txt
  □ Open Graph images dynamiques (og:image)
  □ Schema.org structured data (LocalBusiness, Event)

Jour 6-8 : Calendrier des matchs
  □ Page calendrier (/calendar)
  □ Vue par jour avec scroll infini
  □ Filtres équipe / ville / phase
  □ MatchCard composant avec drapeaux + compte à rebours
  □ Sélecteur de fuseau horaire
  □ Export iCal / Google Calendar

Jour 9-10 : Reviews + Social proof
  □ Système d'avis sur les bars
  □ Formulaire d'avis (note + commentaire)
  □ Affichage note moyenne
  □ Compteur "X bars diffusent ce match"

Jour 11-14 : Démarchage bars (en parallèle du dev)
  □ Préparer un pitch deck simple (1 page)
  □ Lister les bars sportifs de Trois-Rivières, Montréal, Québec
  □ Contacter 50 bars par téléphone/email/visite
  □ Objectif : 20-30 bars inscrits
  □ Premiers bars featured (offrir le premier mois gratuit pour amorcer)
```

### Sprint 3 — Hub complet (Semaines 5-8)

**Objectif :** Ajouter le guide des villes, les fan zones et le module communautaire.

```
Semaine 5 : Guide des villes
  □ Page liste des villes (/guide)
  □ CityCard composant
  □ Pages individuelles (/guide/[citySlug])
  □ Sections : transport, restaurants, hôtels, activités, infos pratiques
  □ Intégration liens affiliés Booking
  □ Carte des POIs par ville

Semaine 6 : Fan zones
  □ Page fan zones (/fanzones)
  □ Carte interactive avec toutes les fan zones
  □ Filtres par type (officielle, ville, communautaire)
  □ FanZoneMarker composant
  □ Panneau de détails

Semaine 7 : Communauté
  □ Page communauté (/community)
  □ Pages par équipe (/community/[teamSlug])
  □ Création de meetups
  □ Système RSVP
  □ Compteur de fans par ville
  □ Profil utilisateur avec équipe favorite

Semaine 8 : Polish + Launch
  □ Tests complets (desktop + mobile)
  □ Performance audit (Lighthouse)
  □ Fix bugs critiques
  □ PWA manifest + service worker basique
  □ Analytics (Plausible)
  □ Monitoring erreurs (Sentry free tier)
  □ LAUNCH PRODUCTION 🚀
```

### Sprint 4 — Pendant le tournoi (11 juin — 19 juillet)

**Objectif :** Maintenir, itérer, et maximiser les revenus.

```
  □ Monitorer les performances serveur
  □ Répondre aux feedbacks utilisateurs
  □ Ajouter des bars au fur et à mesure des demandes
  □ Mettre à jour les résultats des matchs
  □ Publier du contenu sur les réseaux sociaux
  □ Contacter plus de bars pour le featured
  □ Suivre les revenus Stripe et affiliés
  □ A/B test sur le placement des CTA
  □ Si trafic fort : upgrade Vercel/Supabase
```

---

## 18. CRITÈRES DE SUCCÈS (KPIs)

### Avant le tournoi (11 juin)

| KPI | Objectif |
|---|---|
| Bars inscrits | 50+ |
| Bars featured (payants) | 10+ |
| Villes couvertes | 5+ (TR, MTL, QC, TO, VAN) |
| Pages indexées Google | 200+ |

### Pendant le tournoi (11 juin — 19 juillet)

| KPI | Objectif |
|---|---|
| Visiteurs uniques / jour | 1 000+ |
| Bars inscrits | 200+ |
| Bars featured (payants) | 50+ |
| Revenus mensuels | 3 000$+ |
| Avis laissés | 100+ |
| Meetups créés | 20+ |
| Taux de rebond | < 40% |

### Après le tournoi

| KPI | Objectif |
|---|---|
| Revenus totaux générés | 10 000$+ |
| Base d'utilisateurs | 5 000+ |
| Pivoter vers : ligue MLS, Ligue des Champions, bars sportifs permanent |

---

## ANNEXES

### A. Commandes Claude Code recommandées

Pour démarrer le projet avec Claude Code, utiliser ces prompts dans l'ordre :

```
1. "Lis le cahier des charges fanhub26-cahier-des-charges.md et initialise le projet Next.js avec TypeScript, Tailwind CSS, et la structure de dossiers décrite dans la section 3."

2. "Configure Supabase : crée les fichiers de migration SQL à partir du schéma de la section 4.1, incluant les tables, index, RLS policies de la section 4.2, et les fonctions SQL de la section 4.3."

3. "Crée le système i18n avec les fichiers de traduction FR/EN de la section 11, le middleware de détection de langue, et le layout principal (Header avec LanguageSwitcher, Footer)."

4. "Implémente le Watch Party Finder (section 5) : MapContainer avec Mapbox, composants BarCard, MapFilters, et la page /watch avec le layout split liste+carte."

5. "Crée la page d'inscription des bars (section 5.2, user stories WPF-10 à WPF-14) avec le formulaire validé par Zod, l'auth Supabase, et le dashboard propriétaire."

6. "Intègre Stripe pour la monétisation des bars featured (section 10.1) : checkout, webhook, et logique de tri Featured-first."

7. "Implémente le calendrier des matchs (section 6), le guide des villes (section 7), les fan zones (section 8), et le module communauté (section 9)."

8. "Optimise le SEO (section 12) : generateMetadata dynamique, sitemap.xml, robots.txt, Schema.org structured data, et Open Graph images."
```

### B. Données de seed à préparer

Les fichiers JSON suivants doivent être créés dans `src/data/` :

1. `teams.json` — 48 équipes avec code FIFA, nom FR/EN, groupe, continent
2. `matches.json` — 104 matchs avec numéro, phase, équipes, stade, heure UTC
3. `venues.json` — 16 stades avec nom, ville, coordonnées, capacité, timezone
4. `fanzones.json` — fan zones officielles et connues avec coordonnées et détails
5. `cities.json` — villes du guide avec description, transport, coordonnées

### C. Ressources externes

- Calendrier officiel FIFA : https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026
- Drapeaux SVG circulaires : https://hatscripts.github.io/circle-flags/
- Mapbox GL JS docs : https://docs.mapbox.com/mapbox-gl-js/
- Supabase docs : https://supabase.com/docs
- Next.js App Router docs : https://nextjs.org/docs/app
- Stripe Checkout docs : https://stripe.com/docs/payments/checkout
- shadcn/ui : https://ui.shadcn.com

---

*Ce document est la source de vérité pour le développement de FanHub26. Toute décision technique doit s'y référer. Mis à jour : mai 2026.*
