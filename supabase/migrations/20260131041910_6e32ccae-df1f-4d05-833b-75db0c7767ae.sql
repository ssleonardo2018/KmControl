-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('driver', 'supervisor', 'admin');

-- Create enum for vehicle types
CREATE TYPE public.vehicle_type AS ENUM ('school_bus', 'university_bus');

-- Create enum for vehicle status
CREATE TYPE public.vehicle_status AS ENUM ('active', 'inactive', 'maintenance');

-- Create enum for fueling location type
CREATE TYPE public.fueling_location AS ENUM ('garage', 'gas_station');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  work_location TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (secure roles storage)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'driver',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create supervisor assignments table (which drivers a supervisor manages)
CREATE TABLE public.supervisor_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supervisor_id UUID NOT NULL,
  driver_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (supervisor_id, driver_id)
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plate TEXT NOT NULL UNIQUE,
  car_number TEXT NOT NULL,
  vehicle_type vehicle_type NOT NULL DEFAULT 'school_bus',
  status vehicle_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gas_stations table (for reference data)
CREATE TABLE public.gas_stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create kilometer_records table
CREATE TABLE public.kilometer_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE RESTRICT NOT NULL,
  date DATE NOT NULL,
  km_start INTEGER NOT NULL CHECK (km_start >= 0),
  km_end INTEGER NOT NULL CHECK (km_end >= 0),
  km_total INTEGER GENERATED ALWAYS AS (km_end - km_start) STORED,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT km_end_greater_than_start CHECK (km_end > km_start)
);

-- Create fueling_records table
CREATE TABLE public.fueling_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE RESTRICT NOT NULL,
  date DATE NOT NULL,
  location_type fueling_location NOT NULL,
  gas_station_id UUID REFERENCES public.gas_stations(id),
  current_km INTEGER NOT NULL CHECK (current_km >= 0),
  liters_diesel DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (liters_diesel >= 0),
  liters_arla DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (liters_arla >= 0),
  photos TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_kilometer_records_driver_id ON public.kilometer_records(driver_id);
CREATE INDEX idx_kilometer_records_date ON public.kilometer_records(date);
CREATE INDEX idx_kilometer_records_vehicle_id ON public.kilometer_records(vehicle_id);
CREATE INDEX idx_fueling_records_driver_id ON public.fueling_records(driver_id);
CREATE INDEX idx_fueling_records_date ON public.fueling_records(date);
CREATE INDEX idx_fueling_records_vehicle_id ON public.fueling_records(vehicle_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supervisor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gas_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kilometer_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fueling_records ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'admin'
  )
$$;

-- Security definer function to check if supervisor manages driver
CREATE OR REPLACE FUNCTION public.supervisor_manages_driver(_supervisor_id UUID, _driver_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.supervisor_assignments
    WHERE supervisor_id = _supervisor_id
      AND driver_id = _driver_id
  )
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kilometer_records_updated_at
  BEFORE UPDATE ON public.kilometer_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fueling_records_updated_at
  BEFORE UPDATE ON public.fueling_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Supervisors can view assigned driver profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'supervisor') AND public.supervisor_manages_driver(auth.uid(), user_id));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for vehicles (all authenticated users can view, only admins can modify)
CREATE POLICY "Authenticated users can view active vehicles"
  ON public.vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage vehicles"
  ON public.vehicles FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for gas_stations
CREATE POLICY "Authenticated users can view gas stations"
  ON public.gas_stations FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage gas stations"
  ON public.gas_stations FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for kilometer_records
CREATE POLICY "Drivers can view their own km records"
  ON public.kilometer_records FOR SELECT
  USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can insert their own km records"
  ON public.kilometer_records FOR INSERT
  WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can update their own km records"
  ON public.kilometer_records FOR UPDATE
  USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can delete their own km records"
  ON public.kilometer_records FOR DELETE
  USING (auth.uid() = driver_id);

CREATE POLICY "Admins can view all km records"
  ON public.kilometer_records FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Supervisors can view assigned drivers km records"
  ON public.kilometer_records FOR SELECT
  USING (public.has_role(auth.uid(), 'supervisor') AND public.supervisor_manages_driver(auth.uid(), driver_id));

-- RLS Policies for fueling_records
CREATE POLICY "Drivers can view their own fueling records"
  ON public.fueling_records FOR SELECT
  USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can insert their own fueling records"
  ON public.fueling_records FOR INSERT
  WITH CHECK (auth.uid() = driver_id);

CREATE POLICY "Drivers can update their own fueling records"
  ON public.fueling_records FOR UPDATE
  USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can delete their own fueling records"
  ON public.fueling_records FOR DELETE
  USING (auth.uid() = driver_id);

CREATE POLICY "Admins can view all fueling records"
  ON public.fueling_records FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Supervisors can view assigned drivers fueling records"
  ON public.fueling_records FOR SELECT
  USING (public.has_role(auth.uid(), 'supervisor') AND public.supervisor_manages_driver(auth.uid(), driver_id));

-- RLS Policies for supervisor_assignments
CREATE POLICY "Supervisors can view their assignments"
  ON public.supervisor_assignments FOR SELECT
  USING (auth.uid() = supervisor_id);

CREATE POLICY "Admins can manage supervisor assignments"
  ON public.supervisor_assignments FOR ALL
  USING (public.is_admin(auth.uid()));

-- Function to create profile and role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  
  -- Create user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'driver'));
  
  RETURN NEW;
END;
$$;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample vehicles
INSERT INTO public.vehicles (plate, car_number, vehicle_type, status) VALUES
  ('ABC-1234', '01', 'school_bus', 'active'),
  ('DEF-5678', '02', 'school_bus', 'active'),
  ('GHI-9012', '03', 'university_bus', 'active'),
  ('JKL-3456', '04', 'school_bus', 'maintenance'),
  ('MNO-7890', '05', 'university_bus', 'active');

-- Insert sample gas stations
INSERT INTO public.gas_stations (name, address, is_active) VALUES
  ('Posto Ipiranga Centro', 'Av. Central, 100', true),
  ('Posto Shell BR-101', 'BR-101, km 50', true),
  ('Posto Petrobras Av. Brasil', 'Av. Brasil, 500', true);