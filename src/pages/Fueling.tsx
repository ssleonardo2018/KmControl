import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Plus,
  Search,
  Filter,
  Fuel,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Image,
} from "lucide-react";
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
import { FuelingRecord } from "@/types/fleet";

// Mock data for demonstration
const mockRecords: FuelingRecord[] = [
  {
    id: "1",
    driver_id: "1",
    vehicle_id: "1",
    date: "2025-01-30",
    location_type: "gas_station",
    gas_station_name: "Posto Ipiranga Centro",
    current_km: 125180,
    liters_diesel: 120,
    liters_arla: 10,
    photos: ["photo1.jpg", "photo2.jpg"],
    created_at: "2025-01-30T10:00:00Z",
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
    date: "2025-01-28",
    location_type: "garage",
    gas_station_name: null,
    current_km: 98720,
    liters_diesel: 80,
    liters_arla: 5,
    photos: ["photo3.jpg"],
    created_at: "2025-01-28T14:00:00Z",
    vehicle: {
      id: "2",
      plate: "DEF-5678",
      car_number: "02",
      vehicle_type: "university_bus",
      status: "active",
      created_at: "",
    },
  },
];

export default function Fueling() {
  const [searchTerm, setSearchTerm] = useState("");
  const [records] = useState<FuelingRecord[]>(mockRecords);

  const filteredRecords = records.filter(
    (record) =>
      record.vehicle?.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.gas_station_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalDiesel = filteredRecords.reduce((acc, r) => acc + r.liters_diesel, 0);
  const totalArla = filteredRecords.reduce((acc, r) => acc + r.liters_arla, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <Fuel className="h-8 w-8 text-accent" />
            Abastecimento
          </h1>
          <p className="text-muted-foreground">
            Registre e acompanhe os abastecimentos realizados
          </p>
        </div>

        <Button asChild className="bg-gradient-accent hover:opacity-90">
          <Link to="/fueling/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Abastecimento
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Diesel (Mês)
              </p>
              <p className="text-3xl font-bold font-display">
                {totalDiesel.toLocaleString("pt-BR")} L
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
              <Fuel className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-success/5">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Arla (Mês)
              </p>
              <p className="text-3xl font-bold font-display">
                {totalArla.toLocaleString("pt-BR")} L
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
              <Fuel className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

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
                placeholder="Buscar por placa ou posto..."
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
          <CardTitle className="text-lg">Registros de Abastecimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead className="text-right">KM Atual</TableHead>
                  <TableHead className="text-right">Diesel (L)</TableHead>
                  <TableHead className="text-right">Arla (L)</TableHead>
                  <TableHead className="text-center">Fotos</TableHead>
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
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          {record.location_type === "garage" ? (
                            <span>Garagem</span>
                          ) : (
                            <span>{record.gas_station_name}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {record.current_km.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-accent">
                        {record.liters_diesel.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        {record.liters_arla.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Image className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{record.photos.length}</span>
                        </div>
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
