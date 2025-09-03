-- First, let's check the current table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'newsletter_subscribers';

-- Drop the existing table if it exists (WARNING: This will delete all data)
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;

-- Create the newsletter_subscribers table with correct structure
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  campaign_type VARCHAR(50) NOT NULL DEFAULT 'general',
  source VARCHAR(50) DEFAULT 'website',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_campaign_type ON newsletter_subscribers(campaign_type);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON newsletter_subscribers TO authenticated;
GRANT ALL ON newsletter_subscribers TO anon;
GRANT USAGE, SELECT ON SEQUENCE newsletter_subscribers_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE newsletter_subscribers_id_seq TO anon;

-- Verify the table was created correctly
SELECT * FROM newsletter_subscribers LIMIT 0;
