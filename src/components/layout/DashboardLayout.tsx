import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { UserRole } from "@/types/fleet";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

export function DashboardLayout({
  userRole,
  userName,
  onLogout,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole={userRole} userName={userName} onLogout={onLogout} />
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          "lg:ml-72" // Matches sidebar width
        )}
      >
        <div className="container mx-auto px-4 py-8 pt-20 lg:pt-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
