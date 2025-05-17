-- Create tables for Battery Health Dashboard

-- USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BATTERIES TABLE
CREATE TABLE IF NOT EXISTS public.batteries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  serial_number TEXT NOT NULL UNIQUE,
  initial_capacity INTEGER NOT NULL,
  current_capacity INTEGER NOT NULL,
  health_percentage REAL NOT NULL,
  cycle_count INTEGER NOT NULL,
  expected_cycles INTEGER NOT NULL,
  status TEXT NOT NULL,
  initial_date TIMESTAMP NOT NULL,
  last_updated TIMESTAMP NOT NULL,
  degradation_rate REAL NOT NULL,
  user_id INTEGER REFERENCES public.users(id)
);

-- BATTERY HISTORY TABLE
CREATE TABLE IF NOT EXISTS public.battery_history (
  id SERIAL PRIMARY KEY,
  battery_id INTEGER NOT NULL REFERENCES public.batteries(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  capacity INTEGER NOT NULL,
  health_percentage REAL NOT NULL,
  cycle_count INTEGER NOT NULL
);

-- USAGE PATTERNS TABLE
CREATE TABLE IF NOT EXISTS public.usage_patterns (
  id SERIAL PRIMARY KEY,
  battery_id INTEGER NOT NULL REFERENCES public.batteries(id) ON DELETE CASCADE,
  charging_frequency REAL NOT NULL,
  discharge_depth REAL NOT NULL,
  charge_duration INTEGER NOT NULL,
  operating_temperature REAL NOT NULL,
  last_updated TIMESTAMP NOT NULL
);

-- RECOMMENDATIONS TABLE
CREATE TABLE IF NOT EXISTS public.recommendations (
  id SERIAL PRIMARY KEY,
  battery_id INTEGER NOT NULL REFERENCES public.batteries(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT FALSE
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batteries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battery_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for data access
-- For now, allow all operations (you can refine these later)
CREATE POLICY "Allow all operations for users" ON public.users FOR ALL USING (true);
CREATE POLICY "Allow all operations for batteries" ON public.batteries FOR ALL USING (true);
CREATE POLICY "Allow all operations for battery_history" ON public.battery_history FOR ALL USING (true);
CREATE POLICY "Allow all operations for usage_patterns" ON public.usage_patterns FOR ALL USING (true);
CREATE POLICY "Allow all operations for recommendations" ON public.recommendations FOR ALL USING (true);

-- Enable realtime subscriptions on these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.batteries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.battery_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.usage_patterns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.recommendations;