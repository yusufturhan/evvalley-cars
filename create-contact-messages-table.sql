-- Create contact_messages table for storing contact form submissions
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read their own messages (if needed)
-- CREATE POLICY "Users can view their own contact messages" ON contact_messages
--   FOR SELECT USING (auth.uid()::text = email);

-- Create policy to allow public insert (for contact form)
CREATE POLICY "Allow public insert for contact form" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Create policy to allow admin users to read all messages
CREATE POLICY "Allow admin to read all contact messages" ON contact_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Create policy to allow admin users to update messages
CREATE POLICY "Allow admin to update contact messages" ON contact_messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contact_messages_updated_at 
    BEFORE UPDATE ON contact_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
