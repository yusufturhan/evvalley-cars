-- Enable RLS for EV Scooters
ALTER TABLE ev_scooters ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for EV Scooters
CREATE POLICY "Allow public read access to ev_scooters" ON ev_scooters
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert ev_scooters" ON ev_scooters
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own ev_scooters" ON ev_scooters
  FOR UPDATE USING (auth.uid()::text = seller_id::text);

CREATE POLICY "Allow users to delete their own ev_scooters" ON ev_scooters
  FOR DELETE USING (auth.uid()::text = seller_id::text);

-- Enable RLS for E-Bikes
ALTER TABLE e_bikes ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for E-Bikes
CREATE POLICY "Allow public read access to e_bikes" ON e_bikes
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert e_bikes" ON e_bikes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow users to update their own e_bikes" ON e_bikes
  FOR UPDATE USING (auth.uid()::text = seller_id::text);

CREATE POLICY "Allow users to delete their own e_bikes" ON e_bikes
  FOR DELETE USING (auth.uid()::text = seller_id::text);

-- Enable Realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE ev_scooters;
ALTER PUBLICATION supabase_realtime ADD TABLE e_bikes; 