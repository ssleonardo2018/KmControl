import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Bus,
  LayoutDashboard,
  Gauge,
  Fuel,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { UserRole } from "@/types/fleet";

interface SidebarProps {
  userRole: UserRole;
  userName: string;
  onLogout: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["driver", "supervisor", "admin"],
  },
  {
    label: "Quilometragem",
    href: "/kilometers",
    icon: Gauge,
    roles: ["driver", "supervisor", "admin"],
  },
  {
    label: "Abastecimento",
    href: "/fueling",
    icon: Fuel,
    roles: ["driver", "supervisor", "admin"],
  },
  {
    label: "Relatórios",
    href: "/reports",
    icon: FileText,
    roles: ["driver", "supervisor", "admin"],
  },
  {
    label: "Motoristas",
    href: "/drivers",
    icon: Users,
    roles: ["supervisor", "admin"],
  },
  {
    label: "Veículos",
    href: "/vehicles",
    icon: Bus,
    roles: ["admin"],
  },
  {
    label: "Usuários",
    href: "/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Configurações",
    href: "/settings",
    icon: Settings,
    roles: ["admin"],
  },
];

export function Sidebar({ userRole, userName, onLogout }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const handleLogout = () => {
    onLogout();
    navigate("/auth");
  };

  const roleLabels: Record<UserRole, string> = {
    driver: "Motorista",
    supervisor: "Supervisor",
    admin: "Administrador",
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-sidebar p-2 text-sidebar-foreground shadow-lg lg:hidden"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-dark transition-all duration-300",
          isCollapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-accent">
                <Bus className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold text-sidebar-foreground">
                  FleetControl
                </h1>
                <p className="text-xs text-sidebar-foreground/60">
                  Gestão de Frota
                </p>
              </div>
            </div>
          )}

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden rounded-lg p-2 text-sidebar-foreground hover:bg-sidebar-accent lg:block"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* User info */}
        <div
          className={cn(
            "border-b border-sidebar-border p-4",
            isCollapsed && "px-2"
          )}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-medium text-sidebar-foreground">
                  {userName}
                </p>
                <p className="text-xs text-sidebar-foreground/60">
                  {roleLabels[userRole]}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="border-t border-sidebar-border p-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              isCollapsed && "justify-center px-2"
            )}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && <span>Sair</span>}
          </Button>
        </div>
      </aside>
    </>
  );
}
