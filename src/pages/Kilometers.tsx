import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Search, Filter, Gauge, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { KilometerRecord } from "@/types/fleet";

// Mock data for demonstration
const mockRecords: KilometerRecord[] = [
  {
    id: "1",
    driver_id: "1",
    vehicle_id: "1",
    date: "2025-01-30",
    km_start: 125000,
    km_end: 125180,
    km_total: 180,
    observations: "Rota escolar matutina",
    created_at: "2025-01-30T08:00:00Z",
    vehicle: {
      id: "1",
      plate: "ABC-1234",
      car_number: "01",
      vehicle_type: "school_bus",
      status: "active",
      created_at: "",
    },
  },
  {
    id: "2",
    driver_id: "1",
    vehicle_id: "2",
    date: "2025-01-29",
    km_start: 98500,
    km_end: 98720,
    km_total: 220,
    observations: null,
    created_at: "2025-01-29T08:00:00Z",
    vehicle: {
      id: "2",
      plate: "DEF-5678",
      car_number: "02",
      vehicle_type: "university_bus",
      status: "active",
      created_at: "",
    },
  },
  {
    id: "3",
    driver_id: "1",
    vehicle_id: "1",
    date: "2025-01-28",
    km_start: 124820,
    km_end: 125000,
    km_total: 180,
    observations: "Rota vespertina",
    created_at: "2025-01-28T08:00:00Z",
    vehicle: {
      id: "1",
      plate: "ABC-1234",
      car_number: "01",
      vehicle_type: "school_bus",
      status: "active",
      created_at: "",
    },
  },
];

export default function Kilometers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records] = useState<KilometerRecord[]>(mockRecords);

  const filteredRecords = records.filter(
    (record) =>
      record.vehicle?.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.observations?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalKm = filteredRecords.reduce((acc, r) => acc + r.km_total, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <Gauge className="h-8 w-8 text-primary" />
            Quilometragem
          </h1>
          <p className="text-muted-foreground">
            Registre e acompanhe a quilometragem diária dos veículos
          </p>
        </div>

        <Button asChild className="bg-gradient-accent hover:opacity-90">
          <Link to="/kilometers/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Registro
          </Link>
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total do Mês
            </p>
            <p className="text-3xl font-bold font-display">
              {totalKm.toLocaleString("pt-BR")} km
            </p>
          </div>
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Gauge className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por placa ou observação..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Mais filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Records Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Registros de Quilometragem</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Nº Carro</TableHead>
                  <TableHead className="text-right">KM Saída</TableHead>
                  <TableHead className="text-right">KM Chegada</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Observações</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {format(new Date(record.date), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.vehicle?.plate}</Badge>
                      </TableCell>
                      <TableCell>{record.vehicle?.car_number}</TableCell>
                      <TableCell className="text-right">
                        {record.km_start.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        {record.km_end.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {record.km_total.toLocaleString("pt-BR")} km
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {record.observations || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="icon" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
