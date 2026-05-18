export interface Bar {
  id: string;
  owner_id: string | null;
  name: string;
  slug: string;
  description_fr: string | null;
  description_en: string | null;
  address: string;
  city: string;
  province: string;
  postal_code: string | null;
  country: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  website: string | null;
  instagram: string | null;
  has_sound: boolean;
  has_projector: boolean;
  has_outdoor: boolean;
  has_food: boolean;
  num_screens: number;
  capacity: number | null;
  atmosphere: 'lively' | 'chill' | 'sports_bar' | 'pub' | null;
  is_featured: boolean;
  featured_until: string | null;
  is_verified: boolean;
  is_active: boolean;
  logo_url: string | null;
  cover_image_url: string | null;
  gallery_images: string[];
  created_at: string;
  updated_at: string;
}

export interface BarMatch {
  id: string;
  bar_id: string;
  match_id: string;
  sound_on: boolean;
  special_offer: string | null;
  supporter_team_id: string | null;
  created_at: string;
}

export interface BarWithDistance extends Bar {
  distance_km: number;
  avg_rating: number;
}
