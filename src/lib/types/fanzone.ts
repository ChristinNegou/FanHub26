export type FanZoneType = 'official_fifa' | 'city_organized' | 'community';

export interface FanZone {
  id: string;
  name: string;
  name_fr: string | null;
  name_en: string | null;
  type: FanZoneType;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  description_fr: string | null;
  description_en: string | null;
  capacity: number | null;
  has_big_screen: boolean;
  has_food: boolean;
  has_drinks: boolean;
  is_free: boolean;
  opening_date: string | null;
  closing_date: string | null;
  operating_hours: string | null;
  website: string | null;
  image_url: string | null;
  created_at: string;
}
