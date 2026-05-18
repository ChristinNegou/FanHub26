-- Activer RLS sur toutes les tables
ALTER TABLE bars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bar_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE bar_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_rsvps ENABLE ROW LEVEL SECURITY;

-- Bars
CREATE POLICY "bars_read_public" ON bars FOR SELECT USING (is_active = TRUE);
CREATE POLICY "bars_insert_owner" ON bars FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "bars_update_owner" ON bars FOR UPDATE USING (auth.uid() = owner_id);

-- Bar matches
CREATE POLICY "bar_matches_read" ON bar_matches FOR SELECT USING (TRUE);
CREATE POLICY "bar_matches_write" ON bar_matches FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM bars WHERE id = bar_id AND owner_id = auth.uid()));
CREATE POLICY "bar_matches_update" ON bar_matches FOR UPDATE
  USING (EXISTS (SELECT 1 FROM bars WHERE id = bar_id AND owner_id = auth.uid()));

-- Profils
CREATE POLICY "profiles_read" ON user_profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_write" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Reviews
CREATE POLICY "reviews_read" ON bar_reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_write" ON bar_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Events communautaires
CREATE POLICY "events_read" ON community_events FOR SELECT USING (is_active = TRUE);
CREATE POLICY "events_write" ON community_events FOR INSERT WITH CHECK (auth.uid() = organizer_id);
CREATE POLICY "events_update" ON community_events FOR UPDATE USING (auth.uid() = organizer_id);

-- RSVPs
CREATE POLICY "rsvps_read" ON event_rsvps FOR SELECT USING (TRUE);
CREATE POLICY "rsvps_write" ON event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rsvps_update" ON event_rsvps FOR UPDATE USING (auth.uid() = user_id);
