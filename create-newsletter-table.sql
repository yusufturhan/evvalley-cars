-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  campaign_type VARCHAR(50) NOT NULL DEFAULT 'general',
  source VARCHAR(50) DEFAULT 'website',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_campaign_type ON newsletter_subscribers(campaign_type);

-- Add RLS (Row Level Security) if needed
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON newsletter_subscribers TO authenticated;
GRANT ALL ON newsletter_subscribers TO anon;
GRANT USAGE, SELECT ON SEQUENCE newsletter_subscribers_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE newsletter_subscribers_id_seq TO anon;
