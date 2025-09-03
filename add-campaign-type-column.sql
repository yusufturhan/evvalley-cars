-- Add missing campaign_type column to existing newsletter_subscribers table
ALTER TABLE newsletter_subscribers 
ADD COLUMN IF NOT EXISTS campaign_type VARCHAR(50) NOT NULL DEFAULT 'general';

-- Add missing source column
ALTER TABLE newsletter_subscribers 
ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'website';

-- Add missing is_active column
ALTER TABLE newsletter_subscribers 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Create index for campaign_type if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_campaign_type 
ON newsletter_subscribers(campaign_type);

-- Verify the updated table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'newsletter_subscribers'
ORDER BY ordinal_position;

-- Test insert to make sure everything works
INSERT INTO newsletter_subscribers (email, campaign_type, source) 
VALUES ('test@example.com', 'buyer_updates', 'website')
ON CONFLICT (email) DO NOTHING;

-- Show the test record
SELECT * FROM newsletter_subscribers WHERE email = 'test@example.com';

-- Clean up test record
DELETE FROM newsletter_subscribers WHERE email = 'test@example.com';
