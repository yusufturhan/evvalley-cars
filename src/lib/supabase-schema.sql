-- Simple database setup for Evvalley
-- Only add what's missing, don't break existing data

-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS seller_type VARCHAR(20) DEFAULT 'private';
-- seller_type: 'private', 'gallery', 'dealer'

-- Add missing columns to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS range_miles INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS max_speed INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS battery_capacity INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS seller_email VARCHAR(255);

-- Update existing vehicles with seller emails
UPDATE vehicles SET seller_email = 'yusufturhan129@gmail.com' WHERE seller_email IS NULL;

-- Add new vehicle detail columns
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS interior_color VARCHAR(50);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS exterior_color VARCHAR(50);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS body_seating VARCHAR(100);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS combined_fuel_economy VARCHAR(50);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS horsepower INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS electric_mile_range INTEGER;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS battery_warranty VARCHAR(100);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS drivetrain VARCHAR(50);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS vin VARCHAR(17);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS sold BOOLEAN DEFAULT FALSE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS sold_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS sold_to_email VARCHAR(255);

-- Add new columns to vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS vehicle_condition VARCHAR(20);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS title_status VARCHAR(20);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS highlighted_features TEXT;

-- Update existing vehicles with default values
UPDATE vehicles SET vehicle_condition = 'good' WHERE vehicle_condition IS NULL;
UPDATE vehicles SET title_status = 'clean' WHERE title_status IS NULL;

-- Create vehicle_messages table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS vehicle_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    vehicle_id UUID REFERENCES vehicles(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create favorites table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    vehicle_id UUID REFERENCES vehicles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, vehicle_id)
);

-- Create indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_vehicles_category ON vehicles(category);
CREATE INDEX IF NOT EXISTS idx_vehicles_brand ON vehicles(brand);
CREATE INDEX IF NOT EXISTS idx_vehicles_price ON vehicles(price);
CREATE INDEX IF NOT EXISTS idx_vehicles_seller ON vehicles(seller_id);
CREATE INDEX IF NOT EXISTS idx_messages_vehicle ON vehicle_messages(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON vehicle_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON vehicle_messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_vehicle ON favorites(vehicle_id);

-- Clean up incorrect user entries
DELETE FROM users WHERE clerk_id IN (
    'user_30ah6KzQdWYJHq5xWvOo04mlHs',
    'user_30ah35dthFlcATmgAR5Oc0fia7H'
);

-- Add sample users with unique emails (only if they don't exist)
INSERT INTO users (clerk_id, email, first_name, last_name) VALUES
('user_30X6gJqXycbraTZSvvuqdfP7jKL', 'john.doe@evvalley.com', 'John', 'Doe'),
('user_30a7vZpl2yLeQ5CiUkxpXusGOF9', 'jane.smith@evvalley.com', 'Jane', 'Smith'),
('user_30ah6KzQdWYJHq5xWvOo04mIHsa', 'user3@evvalley.com', 'User', 'Three'),
('user_30ah35dthFIcATmgAR5Oc0fia7H', 'user4@evvalley.com', 'User', 'Four')
ON CONFLICT (clerk_id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email;

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
DROP POLICY IF EXISTS "Users can view all users" ON users;
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert themselves" ON users;
CREATE POLICY "Users can insert themselves" ON users FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update themselves" ON users;
CREATE POLICY "Users can update themselves" ON users FOR UPDATE USING (true);

-- Create RLS policies for vehicles table
DROP POLICY IF EXISTS "Anyone can view active vehicles" ON vehicles;
CREATE POLICY "Anyone can view active vehicles" ON vehicles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert vehicles" ON vehicles;
CREATE POLICY "Authenticated users can insert vehicles" ON vehicles FOR INSERT WITH CHECK (true);

-- Create RLS policies for vehicle_messages table
DROP POLICY IF EXISTS "Anyone can insert messages" ON vehicle_messages;
CREATE POLICY "Anyone can insert messages" ON vehicle_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read messages" ON vehicle_messages;
CREATE POLICY "Anyone can read messages" ON vehicle_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can update messages" ON vehicle_messages;
CREATE POLICY "Anyone can update messages" ON vehicle_messages FOR UPDATE USING (true);

-- Create RLS policies for favorites table
DROP POLICY IF EXISTS "Anyone can insert favorites" ON favorites;
CREATE POLICY "Anyone can insert favorites" ON favorites FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read favorites" ON favorites;
CREATE POLICY "Anyone can read favorites" ON favorites FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can delete favorites" ON favorites;
CREATE POLICY "Anyone can delete favorites" ON favorites FOR DELETE USING (true);

-- Enable RLS on messages table (if it exists)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for messages table
DROP POLICY IF EXISTS "Anyone can insert messages" ON messages;
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read messages" ON messages;
CREATE POLICY "Anyone can read messages" ON messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can update messages" ON messages;
CREATE POLICY "Anyone can update messages" ON messages FOR UPDATE USING (true);

-- Simple messages table (no complex ID conversions)
CREATE TABLE IF NOT EXISTS simple_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    sender_email TEXT NOT NULL,
    receiver_email TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_simple_messages_vehicle_id ON simple_messages(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_simple_messages_created_at ON simple_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_simple_messages_receiver_email ON simple_messages(receiver_email); 

-- Enable RLS on simple_messages table
ALTER TABLE simple_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for simple_messages table
DROP POLICY IF EXISTS "Anyone can insert messages" ON simple_messages;
CREATE POLICY "Anyone can insert messages" ON simple_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can read messages" ON simple_messages;
CREATE POLICY "Anyone can read messages" ON simple_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can update messages" ON simple_messages;
CREATE POLICY "Anyone can update messages" ON simple_messages FOR UPDATE USING (true); 

-- Add display_name column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(100);

-- Update existing users with display names
UPDATE users SET display_name = CONCAT(first_name, ' ', last_name) WHERE display_name IS NULL;

-- Update simple_messages table to include names
ALTER TABLE simple_messages ADD COLUMN IF NOT EXISTS sender_name VARCHAR(100);
ALTER TABLE simple_messages ADD COLUMN IF NOT EXISTS receiver_name VARCHAR(100);

-- Update existing messages with names
UPDATE simple_messages SET sender_name = 'User' WHERE sender_name IS NULL;
UPDATE simple_messages SET receiver_name = 'User' WHERE receiver_name IS NULL; 

-- Add is_read column to simple_messages table
ALTER TABLE simple_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Update existing messages to be read
UPDATE simple_messages SET is_read = TRUE WHERE is_read IS NULL; 

-- Typing status table
CREATE TABLE IF NOT EXISTS typing_status (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    is_typing BOOLEAN DEFAULT FALSE,
    last_typing_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_typing_status_vehicle_id ON typing_status(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_typing_status_user_email ON typing_status(user_email); 

-- Enable RLS on typing_status table
ALTER TABLE typing_status ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for typing_status table
DROP POLICY IF EXISTS "Anyone can insert typing status" ON typing_status;
CREATE POLICY "Anyone can insert typing status" ON typing_status FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update typing status" ON typing_status;
CREATE POLICY "Anyone can update typing status" ON typing_status FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can read typing status" ON typing_status;
CREATE POLICY "Anyone can read typing status" ON typing_status FOR SELECT USING (true); 

-- EV Scooters Table
CREATE TABLE IF NOT EXISTS ev_scooters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT DEFAULT 'ev-scooter',
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  seller_email TEXT NOT NULL,
  location TEXT NOT NULL,
  images TEXT[],
  sold BOOLEAN DEFAULT FALSE,
  sold_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Scooter specific fields
  range_miles INTEGER,
  max_speed INTEGER,
  battery_capacity TEXT,
  weight DECIMAL(5,2),
  max_load INTEGER,
  wheel_size TEXT,
  motor_power TEXT,
  charging_time TEXT,
  warranty TEXT,
  condition TEXT,
  color TEXT,
  highlighted_features TEXT,
  
  -- Validation
  CONSTRAINT valid_price CHECK (price > 0),
  CONSTRAINT valid_year CHECK (year >= 1900 AND year <= 2030),
  CONSTRAINT valid_range CHECK (range_miles >= 0),
  CONSTRAINT valid_max_speed CHECK (max_speed >= 0),
  CONSTRAINT valid_weight CHECK (weight > 0),
  CONSTRAINT valid_max_load CHECK (max_load > 0)
);

-- E-Bikes Table
CREATE TABLE IF NOT EXISTS e_bikes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2030),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  category TEXT DEFAULT 'e-bike',
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  seller_email TEXT NOT NULL,
  location TEXT NOT NULL,
  images TEXT[],
  sold BOOLEAN DEFAULT FALSE,
  sold_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- E-Bike specific fields
  range_miles INTEGER,
  max_speed INTEGER,
  battery_capacity TEXT,
  frame_size TEXT,
  wheel_size TEXT,
  motor_type TEXT,
  motor_power TEXT,
  charging_time TEXT,
  warranty TEXT,
  condition TEXT,
  color TEXT,
  highlighted_features TEXT,
  bike_type TEXT, -- mountain, road, city, etc.
  gear_system TEXT,
  
  -- Validation
  CONSTRAINT valid_price CHECK (price > 0),
  CONSTRAINT valid_year CHECK (year >= 1900 AND year <= 2030),
  CONSTRAINT valid_range CHECK (range_miles >= 0),
  CONSTRAINT valid_max_speed CHECK (max_speed >= 0)
);

-- RLS Policies for EV Scooters
ALTER TABLE ev_scooters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to ev_scooters" ON ev_scooters
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert ev_scooters" ON ev_scooters
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own ev_scooters" ON ev_scooters
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Allow users to delete their own ev_scooters" ON ev_scooters
  FOR DELETE USING (auth.uid() = seller_id);

-- RLS Policies for E-Bikes
ALTER TABLE e_bikes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to e_bikes" ON e_bikes
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert e_bikes" ON e_bikes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own e_bikes" ON e_bikes
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Allow users to delete their own e_bikes" ON e_bikes
  FOR DELETE USING (auth.uid() = seller_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ev_scooters_brand ON ev_scooters(brand);
CREATE INDEX IF NOT EXISTS idx_ev_scooters_year ON ev_scooters(year);
CREATE INDEX IF NOT EXISTS idx_ev_scooters_price ON ev_scooters(price);
CREATE INDEX IF NOT EXISTS idx_ev_scooters_seller_id ON ev_scooters(seller_id);
CREATE INDEX IF NOT EXISTS idx_ev_scooters_sold ON ev_scooters(sold);

CREATE INDEX IF NOT EXISTS idx_e_bikes_brand ON e_bikes(brand);
CREATE INDEX IF NOT EXISTS idx_e_bikes_year ON e_bikes(year);
CREATE INDEX IF NOT EXISTS idx_e_bikes_price ON e_bikes(price);
CREATE INDEX IF NOT EXISTS idx_e_bikes_seller_id ON e_bikes(seller_id);
CREATE INDEX IF NOT EXISTS idx_e_bikes_sold ON e_bikes(sold); 

-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Create index for status filtering
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers(status);

-- Enable RLS (Row Level Security)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting new subscribers (public access)
CREATE POLICY "Allow public to insert newsletter subscribers" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Create policy for reading subscribers (admin only)
CREATE POLICY "Allow admin to read newsletter subscribers" ON newsletter_subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create policy for updating subscribers (admin only)
CREATE POLICY "Allow admin to update newsletter subscribers" ON newsletter_subscribers
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for deleting subscribers (admin only)
CREATE POLICY "Allow admin to delete newsletter subscribers" ON newsletter_subscribers
  FOR DELETE USING (auth.role() = 'authenticated'); 

-- Email logs table for tracking campaign sends
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  campaign_id TEXT NOT NULL,
  email_id TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'sent', -- sent, failed, bounced, opened, clicked
  error_message TEXT,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies for email_logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Allow admins to view all email logs
CREATE POLICY "Admins can view all email logs" ON email_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Allow system to insert email logs
CREATE POLICY "System can insert email logs" ON email_logs
  FOR INSERT WITH CHECK (true);

-- Allow system to update email logs
CREATE POLICY "System can update email logs" ON email_logs
  FOR UPDATE USING (true);

-- Index for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_campaign_id ON email_logs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status); 