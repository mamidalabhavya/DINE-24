
-- Create today's specials table
CREATE TABLE IF NOT EXISTS public.todays_specials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  menu_item_id INTEGER REFERENCES public.menu_items(id) ON DELETE CASCADE,
  special_price NUMERIC,
  special_description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for todays_specials
ALTER TABLE public.todays_specials ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing today's specials (public access)
CREATE POLICY "Anyone can view active specials" 
  ON public.todays_specials 
  FOR SELECT 
  USING (is_active = true);

-- Create policy for admin to manage specials
CREATE POLICY "Admin can manage specials" 
  ON public.todays_specials 
  FOR ALL 
  USING (true);

-- Fix menu_items RLS policies for admin access
DROP POLICY IF EXISTS "Anyone can view menu items" ON public.menu_items;
DROP POLICY IF EXISTS "Admin can manage menu items" ON public.menu_items;

CREATE POLICY "Anyone can view menu items" 
  ON public.menu_items 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admin can manage menu items" 
  ON public.menu_items 
  FOR ALL 
  USING (true);

-- Fix reservations RLS policies
DROP POLICY IF EXISTS "Anyone can create reservations" ON public.reservations;
DROP POLICY IF EXISTS "Anyone can view reservations" ON public.reservations;

CREATE POLICY "Anyone can create reservations" 
  ON public.reservations 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view reservations" 
  ON public.reservations 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admin can manage reservations" 
  ON public.reservations 
  FOR ALL 
  USING (true);

-- Fix reservation_items RLS policies
DROP POLICY IF EXISTS "Anyone can create reservation items" ON public.reservation_items;
DROP POLICY IF EXISTS "Anyone can view reservation items" ON public.reservation_items;

CREATE POLICY "Anyone can create reservation items" 
  ON public.reservation_items 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can view reservation items" 
  ON public.reservation_items 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admin can manage reservation items" 
  ON public.reservation_items 
  FOR ALL 
  USING (true);
