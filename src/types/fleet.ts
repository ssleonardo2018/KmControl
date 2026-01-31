// Tipos do sistema FleetControl

export type UserRole = 'driver' | 'supervisor' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  work_location: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  car_number: string;
  vehicle_type: 'school_bus' | 'university_bus';
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
}

export interface KilometerRecord {
  id: string;
  driver_id: string;
  vehicle_id: string;
  date: string;
  km_start: number;
  km_end: number;
  km_total: number;
  observations: string | null;
  created_at: string;
  vehicle?: Vehicle;
  driver?: User;
}

export interface FuelingRecord {
  id: string;
  driver_id: string;
  vehicle_id: string;
  date: string;
  location_type: 'garage' | 'gas_station';
  gas_station_name: string | null;
  current_km: number;
  liters_diesel: number;
  liters_arla: number;
  photos: string[];
  created_at: string;
  vehicle?: Vehicle;
  driver?: User;
}

export interface MonthlyReport {
  month: string;
  year: number;
  total_km: number;
  total_diesel: number;
  total_arla: number;
  records_count: number;
  fueling_count: number;
}

export interface DashboardStats {
  totalKm: number;
  totalDiesel: number;
  totalArla: number;
  recordsCount: number;
  fuelingCount: number;
  activeVehicles: number;
}

export interface SupervisorDashboardStats extends DashboardStats {
  driversCount: number;
  driversWithRecords: number;
}

export interface AdminDashboardStats extends SupervisorDashboardStats {
  totalUsers: number;
  totalVehicles: number;
}
