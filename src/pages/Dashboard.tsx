import { useEffect, useState } from "react";
import {
  Gauge,
  Fuel,
  Bus,
  TrendingUp,
  Calendar,
  FileText,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole, DashboardStats } from "@/types/fleet";
import { Link } from "react-router-dom";

interface DashboardProps {
  userRole: UserRole;
  userName: string;
}

export default function Dashboard({ userRole, userName }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalKm: 0,
    totalDiesel: 0,
    totalArla: 0,
    recordsCount: 0,
    fuelingCount: 0,
    activeVehicles: 0,
  });

  // Mock data for demonstration
  useEffect(() => {
    setStats({
      totalKm: 12450,
      totalDiesel: 2340,
      totalArla: 156,
      recordsCount: 23,
      fuelingCount: 8,
      activeVehicles: 15,
    });
  }, []);

  const currentMonth = new Date().toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const roleLabels: Record<UserRole, string> = {
    driver: "Motorista",
    supervisor: "Supervisor",
    admin: "Administrador",
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Olá, {userName.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground">
            {roleLabels[userRole]} • {currentMonth}
          </p>
        </div>

        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link to="/reports">
              <FileText className="mr-2 h-4 w-4" />
              Ver relatórios
            </Link>
          </Button>
          <Button asChild className="bg-gradient-accent hover:opacity-90">
            <Link to="/kilometers/new">
              <Plus className="mr-2 h-4 w-4" />
              Novo registro
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="KM Total (Mês)"
          value={stats.totalKm.toLocaleString("pt-BR")}
          subtitle="km rodados"
          icon={Gauge}
          variant="primary"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="Diesel (Mês)"
          value={stats.totalDiesel.toLocaleString("pt-BR")}
          subtitle="litros"
          icon={Fuel}
          variant="accent"
        />
        <StatCard
          title="Arla (Mês)"
          value={stats.totalArla.toLocaleString("pt-BR")}
          subtitle="litros"
          icon={Fuel}
          variant="success"
        />
        <StatCard
          title="Registros"
          value={stats.recordsCount}
          subtitle="este mês"
          icon={Calendar}
          variant="warning"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group cursor-pointer transition-all hover:shadow-fleet-lg hover:border-primary/30">
          <Link to="/kilometers/new">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Gauge className="h-5 w-5" />
                </div>
                Registrar Quilometragem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Registre o km de saída e chegada do dia para o veículo utilizado.
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="group cursor-pointer transition-all hover:shadow-fleet-lg hover:border-accent/30">
          <Link to="/fueling/new">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="rounded-lg bg-accent/10 p-2 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <Fuel className="h-5 w-5" />
                </div>
                Registrar Abastecimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Registre abastecimento com diesel/arla e fotos do comprovante.
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="group cursor-pointer transition-all hover:shadow-fleet-lg hover:border-success/30">
          <Link to="/reports">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="rounded-lg bg-success/10 p-2 text-success group-hover:bg-success group-hover:text-success-foreground transition-colors">
                  <TrendingUp className="h-5 w-5" />
                </div>
                Relatório Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Visualize seu relatório completo do mês com opção de exportar PDF.
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            Atividade Recente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    {i % 2 === 0 ? (
                      <Fuel className="h-5 w-5 text-accent" />
                    ) : (
                      <Gauge className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {i % 2 === 0
                        ? "Abastecimento registrado"
                        : "Quilometragem registrada"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Placa ABC-{1234 + i} • Há {i * 2} horas
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {i % 2 === 0 ? `${45 + i * 10}L` : `${120 + i * 30}km`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admin/Supervisor specific content */}
      {(userRole === "admin" || userRole === "supervisor") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-muted-foreground" />
              Visão Geral da Frota
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg bg-success/10 p-4 text-center">
                <p className="text-3xl font-bold text-success">12</p>
                <p className="text-sm text-muted-foreground">Veículos Ativos</p>
              </div>
              <div className="rounded-lg bg-warning/10 p-4 text-center">
                <p className="text-3xl font-bold text-warning">2</p>
                <p className="text-sm text-muted-foreground">Em Manutenção</p>
              </div>
              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-3xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Inativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
