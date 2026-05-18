export interface City {
  id: string;
  name: string;
  slug: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
  is_host_city: boolean;
  description_fr: string | null;
  description_en: string | null;
  transport_info_fr: string | null;
  transport_info_en: string | null;
  timezone: string;
  image_url: string | null;
  created_at: string;
}

export interface CityPOI {
  id: string;
  city_id: string;
  name: string;
  name_fr: string | null;
  name_en: string | null;
  category: 'restaurant' | 'transport' | 'hotel' | 'attraction' | 'nightlife';
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  description_fr: string | null;
  description_en: string | null;
  price_range: '$' | '$$' | '$$$' | '$$$$' | null;
  rating: number | null;
  website: string | null;
  affiliate_url: string | null;
  image_url: string | null;
}
