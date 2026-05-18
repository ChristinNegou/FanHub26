-- Seed data will be populated via scripts/seed-*.ts
-- This file is a placeholder for any static SQL seeds.

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
