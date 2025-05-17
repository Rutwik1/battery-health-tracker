-- Create tables for Battery Health Dashboard
-- Run this in your Supabase SQL Editor to set up the database

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Batteries table
CREATE TABLE IF NOT EXISTS public.batteries (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    serial_number TEXT NOT NULL,
    initial_capacity INTEGER NOT NULL,
    current_capacity INTEGER NOT NULL,
    health_percentage NUMERIC(5, 2) NOT NULL,
    cycle_count INTEGER NOT NULL,
    expected_cycles INTEGER NOT NULL,
    status TEXT NOT NULL,
    initial_date TEXT NOT NULL,
    last_updated TEXT NOT NULL,
    degradation_rate NUMERIC(5, 2) NOT NULL,
    user_id INTEGER REFERENCES public.users(id)
);

-- Battery history table
CREATE TABLE IF NOT EXISTS public.battery_history (
    id SERIAL PRIMARY KEY,
    battery_id INTEGER NOT NULL REFERENCES public.batteries(id) ON DELETE CASCADE,
    date TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    health_percentage NUMERIC(5, 2) NOT NULL,
    cycle_count INTEGER NOT NULL
);

-- Usage patterns table
CREATE TABLE IF NOT EXISTS public.usage_patterns (
    id SERIAL PRIMARY KEY,
    battery_id INTEGER NOT NULL REFERENCES public.batteries(id) ON DELETE CASCADE,
    charging_frequency NUMERIC(5, 2) NOT NULL,
    discharge_depth NUMERIC(5, 2) NOT NULL,
    charge_duration NUMERIC(5, 2) NOT NULL,
    operating_temperature NUMERIC(5, 2) NOT NULL,
    last_updated TEXT NOT NULL
);

-- Recommendations table
CREATE TABLE IF NOT EXISTS public.recommendations (
    id SERIAL PRIMARY KEY,
    battery_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL,
    resolved BOOLEAN NOT NULL DEFAULT false
);

-- Enable Row Level Security
ALTER TABLE public.batteries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battery_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for public access during development
-- Note: In production, you'd want to restrict access based on user authentication
CREATE POLICY "Allow public access to batteries" ON public.batteries FOR ALL USING (true);
CREATE POLICY "Allow public access to battery history" ON public.battery_history FOR ALL USING (true);
CREATE POLICY "Allow public access to usage patterns" ON public.usage_patterns FOR ALL USING (true);
CREATE POLICY "Allow public access to recommendations" ON public.recommendations FOR ALL USING (true);

-- Enable realtime subscriptions for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.batteries;
ALTER PUBLICATION supabase_realtime ADD TABLE public.battery_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.recommendations;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_battery_history_battery_id ON public.battery_history(battery_id);
CREATE INDEX IF NOT EXISTS idx_usage_patterns_battery_id ON public.usage_patterns(battery_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_battery_id ON public.recommendations(battery_id);