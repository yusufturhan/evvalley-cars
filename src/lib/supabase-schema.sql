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