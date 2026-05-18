export type MatchStage =
  | 'group'
  | 'round_of_32'
  | 'round_of_16'
  | 'quarter_final'
  | 'semi_final'
  | 'third_place'
  | 'final';

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed';

export interface Team {
  id: string;
  name_fr: string;
  name_en: string;
  code: string;
  group_letter: string;
  flag_url: string;
  continent: string;
}

export interface Venue {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  capacity: number;
  timezone: string;
  image_url: string | null;
}

export interface Match {
  id: string;
  match_number: number;
  stage: MatchStage;
  group_letter: string | null;
  home_team_id: string | null;
  away_team_id: string | null;
  home_team_placeholder: string | null;
  away_team_placeholder: string | null;
  venue_id: string;
  kickoff_utc: string;
  home_score: number | null;
  away_score: number | null;
  status: MatchStatus;
}

export interface MatchWithTeams extends Match {
  home_team: Team | null;
  away_team: Team | null;
  venue: Venue;
  bars_showing?: number;
}
