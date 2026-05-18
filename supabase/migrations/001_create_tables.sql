-- ============================================
-- TABLE: teams (48 équipes qualifiées)
-- ============================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL,
  name_en TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  group_letter CHAR(1) NOT NULL,
  flag_url TEXT NOT NULL,
  continent TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: venues (16 stades)
-- ============================================
CREATE TABLE venues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  capacity INTEGER NOT NULL,
  timezone TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: matches (104 matchs)
-- ============================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_number INTEGER NOT NULL UNIQUE,
  stage TEXT NOT NULL,
  group_letter CHAR(1),
  home_team_id UUID REFERENCES teams(id),
  away_team_id UUID REFERENCES teams(id),
  home_team_placeholder TEXT,
  away_team_placeholder TEXT,
  venue_id UUID REFERENCES venues(id) NOT NULL,
  kickoff_utc TIMESTAMPTZ NOT NULL,
  home_score INTEGER,
  away_score INTEGER,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: bars (lieux de diffusion)
-- ============================================
CREATE TABLE bars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description_fr TEXT,
  description_en TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'CA',
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  phone TEXT,
  website TEXT,
  instagram TEXT,
  has_sound BOOLEAN DEFAULT FALSE,
  has_projector BOOLEAN DEFAULT FALSE,
  has_outdoor BOOLEAN DEFAULT FALSE,
  has_food BOOLEAN DEFAULT FALSE,
  num_screens INTEGER DEFAULT 1,
  capacity INTEGER,
  atmosphere TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMPTZ,
  stripe_customer_id TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  logo_url TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bars_location ON bars USING gist (point(longitude, latitude));
CREATE INDEX idx_bars_city ON bars(city);
CREATE INDEX idx_bars_featured ON bars(is_featured) WHERE is_featured = TRUE;

-- ============================================
-- TABLE: bar_matches
-- ============================================
CREATE TABLE bar_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bar_id UUID REFERENCES bars(id) ON DELETE CASCADE,
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  sound_on BOOLEAN DEFAULT TRUE,
  special_offer TEXT,
  supporter_team_id UUID REFERENCES teams(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(bar_id, match_id)
);

CREATE INDEX idx_bar_matches_match ON bar_matches(match_id);
CREATE INDEX idx_bar_matches_bar ON bar_matches(bar_id);

-- ============================================
-- TABLE: fan_zones
-- ============================================
CREATE TABLE fan_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_fr TEXT,
  name_en TEXT,
  type TEXT NOT NULL,
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
  operating_hours TEXT,
  website TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: cities
-- ============================================
CREATE TABLE cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  province TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'CA',
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  is_host_city BOOLEAN DEFAULT FALSE,
  description_fr TEXT,
  description_en TEXT,
  transport_info_fr TEXT,
  transport_info_en TEXT,
  timezone TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: city_pois
-- ============================================
CREATE TABLE city_pois (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_fr TEXT,
  name_en TEXT,
  category TEXT NOT NULL,
  address TEXT,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  description_fr TEXT,
  description_en TEXT,
  price_range TEXT,
  rating DECIMAL(2,1),
  website TEXT,
  affiliate_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: community_events
-- ============================================
CREATE TABLE community_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id UUID REFERENCES auth.users(id),
  team_id UUID REFERENCES teams(id),
  match_id UUID REFERENCES matches(id),
  bar_id UUID REFERENCES bars(id),
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
-- TABLE: event_rsvps
-- ============================================
CREATE TABLE event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES community_events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'going',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- ============================================
-- TABLE: user_profiles
-- ============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  favorite_team_id UUID REFERENCES teams(id),
  city TEXT,
  avatar_url TEXT,
  locale TEXT DEFAULT 'fr',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE: bar_reviews
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
  UNIQUE(bar_id, user_id)
);

-- ============================================
-- TABLE: contact_submissions
-- ============================================
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
