-- Enable RLS on newsletter_subscribers table
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for newsletter_subscribers
DROP POLICY IF EXISTS "Anyone can insert newsletter subscriptions" ON newsletter_subscribers;
CREATE POLICY "Anyone can insert newsletter subscriptions" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read newsletter subscribers" ON newsletter_subscribers;
CREATE POLICY "Anyone can read newsletter subscribers" ON newsletter_subscribers
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can update newsletter subscribers" ON newsletter_subscribers;
CREATE POLICY "Anyone can update newsletter subscribers" ON newsletter_subscribers
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete newsletter subscribers" ON newsletter_subscribers;
CREATE POLICY "Anyone can delete newsletter subscribers" ON newsletter_subscribers
  FOR DELETE USING (true);
