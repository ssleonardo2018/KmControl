import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User, Session } from "@supabase/supabase-js";
import { UserRole } from "@/types/fleet";

// Pages
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Kilometers from "./pages/Kilometers";
import KilometersNew from "./pages/KilometersNew";
import Fueling from "./pages/Fueling";
import FuelingNew from "./pages/FuelingNew";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

// Layout
import { DashboardLayout } from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>("driver");
  const [userName, setUserName] = useState("Usuário");

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Get user metadata
        const metadata = session.user.user_metadata;
        setUserName(metadata?.full_name || session.user.email || "Usuário");
        setUserRole((metadata?.role as UserRole) || "driver");
      }

      setIsLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const metadata = session.user.user_metadata;
        setUserName(metadata?.full_name || session.user.email || "Usuário");
        setUserRole((metadata?.role as UserRole) || "driver");
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Index />}
        />
        <Route
          path="/auth"
          element={user ? <Navigate to="/dashboard" replace /> : <Auth />}
        />

        {/* Protected routes */}
        {user ? (
          <Route
            element={
              <DashboardLayout
                userRole={userRole}
                userName={userName}
                onLogout={handleLogout}
              />
            }
          >
            <Route
              path="/dashboard"
              element={<Dashboard userRole={userRole} userName={userName} />}
            />
            <Route path="/kilometers" element={<Kilometers />} />
            <Route path="/kilometers/new" element={<KilometersNew />} />
            <Route path="/fueling" element={<Fueling />} />
            <Route path="/fueling/new" element={<FuelingNew />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/auth" replace />} />
        )}

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
