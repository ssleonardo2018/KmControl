import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  FileText,
  Download,
  Calendar,
  Gauge,
  Fuel,
  Filter,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const months = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

// Mock data
const mockKmRecords = [
  { date: "2025-01-30", plate: "ABC-1234", km_start: 125000, km_end: 125180, km_total: 180 },
  { date: "2025-01-29", plate: "DEF-5678", km_start: 98500, km_end: 98720, km_total: 220 },
  { date: "2025-01-28", plate: "ABC-1234", km_start: 124820, km_end: 125000, km_total: 180 },
  { date: "2025-01-27", plate: "GHI-9012", km_start: 50000, km_end: 50150, km_total: 150 },
  { date: "2025-01-26", plate: "ABC-1234", km_start: 124620, km_end: 124820, km_total: 200 },
];

const mockFuelingRecords = [
  { date: "2025-01-30", plate: "ABC-1234", location: "Posto Ipiranga", diesel: 120, arla: 10 },
  { date: "2025-01-28", plate: "DEF-5678", location: "Garagem", diesel: 80, arla: 5 },
];

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState(String(currentYear));

  const totalKm = mockKmRecords.reduce((acc, r) => acc + r.km_total, 0);
  const totalDiesel = mockFuelingRecords.reduce((acc, r) => acc + r.diesel, 0);
  const totalArla = mockFuelingRecords.reduce((acc, r) => acc + r.arla, 0);

  const monthName = months.find((m) => m.value === selectedMonth)?.label;

  const handleExportPDF = () => {
    toast.info("Exportação em PDF será implementada com a integração completa");
  };

  const handleExportExcel = () => {
    toast.info("Exportação em Excel será implementada com a integração completa");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8 text-success" />
            Relatório Mensal
          </h1>
          <p className="text-muted-foreground">
            Visualize e exporte seus registros do mês
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button className="bg-gradient-primary hover:opacity-90" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Período
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total KM Rodados
                </p>
                <p className="text-3xl font-bold font-display">
                  {totalKm.toLocaleString("pt-BR")}
                </p>
                <p className="text-sm text-muted-foreground">
                  em {mockKmRecords.length} registros
                </p>
              </div>
              <div className="rounded-xl bg-primary/10 p-3">
                <Gauge className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Diesel
                </p>
                <p className="text-3xl font-bold font-display">
                  {totalDiesel.toLocaleString("pt-BR")} L
                </p>
                <p className="text-sm text-muted-foreground">
                  em {mockFuelingRecords.length} abastecimentos
                </p>
              </div>
              <div className="rounded-xl bg-accent/10 p-3">
                <Fuel className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-success/20 bg-success/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Arla
                </p>
                <p className="text-3xl font-bold font-display">
                  {totalArla.toLocaleString("pt-BR")} L
                </p>
                <p className="text-sm text-muted-foreground">
                  consumo mensal
                </p>
              </div>
              <div className="rounded-xl bg-success/10 p-3">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kilometer Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5 text-primary" />
            Registros de Quilometragem - {monthName} {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead className="text-right">KM Saída</TableHead>
                  <TableHead className="text-right">KM Chegada</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockKmRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {format(new Date(record.date), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.plate}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {record.km_start.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      {record.km_end.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {record.km_total.toLocaleString("pt-BR")} km
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={4}>Total do Período</TableCell>
                  <TableCell className="text-right text-primary">
                    {totalKm.toLocaleString("pt-BR")} km
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Fueling Records */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fuel className="h-5 w-5 text-accent" />
            Registros de Abastecimento - {monthName} {selectedYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Local</TableHead>
                  <TableHead className="text-right">Diesel (L)</TableHead>
                  <TableHead className="text-right">Arla (L)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFuelingRecords.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {format(new Date(record.date), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.plate}</Badge>
                    </TableCell>
                    <TableCell>{record.location}</TableCell>
                    <TableCell className="text-right font-semibold text-accent">
                      {record.diesel.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-success">
                      {record.arla.toLocaleString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50 font-bold">
                  <TableCell colSpan={3}>Total do Período</TableCell>
                  <TableCell className="text-right text-accent">
                    {totalDiesel.toLocaleString("pt-BR")} L
                  </TableCell>
                  <TableCell className="text-right text-success">
                    {totalArla.toLocaleString("pt-BR")} L
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
