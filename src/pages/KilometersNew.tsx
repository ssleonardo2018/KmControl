import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Gauge,
  ArrowLeft,
  Calendar as CalendarIcon,
  Car,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z
  .object({
    date: z.date({ required_error: "Selecione a data" }),
    vehicle_id: z.string().min(1, { message: "Selecione um veículo" }),
    km_start: z.coerce
      .number()
      .min(0, { message: "KM de saída deve ser maior que 0" }),
    km_end: z.coerce
      .number()
      .min(0, { message: "KM de chegada deve ser maior que 0" }),
    observations: z.string().max(500).optional(),
  })
  .refine((data) => data.km_end > data.km_start, {
    message: "KM de chegada deve ser maior que KM de saída",
    path: ["km_end"],
  });

type FormData = z.infer<typeof formSchema>;

// Mock vehicles for demonstration
const mockVehicles = [
  { id: "1", plate: "ABC-1234", car_number: "01" },
  { id: "2", plate: "DEF-5678", car_number: "02" },
  { id: "3", plate: "GHI-9012", car_number: "03" },
];

export default function KilometersNew() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      vehicle_id: "",
      km_start: 0,
      km_end: 0,
      observations: "",
    },
  });

  const kmStart = form.watch("km_start");
  const kmEnd = form.watch("km_end");
  const kmTotal = kmEnd > kmStart ? kmEnd - kmStart : 0;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // TODO: Save to database
      console.log("Submitting:", { ...data, km_total: kmTotal });
      toast.success("Quilometragem registrada com sucesso!");
      navigate("/kilometers");
    } catch (error) {
      toast.error("Erro ao registrar quilometragem");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-3">
            <Gauge className="h-8 w-8 text-primary" />
            Registrar Quilometragem
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados da quilometragem do dia
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dados do Registro</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy", {
                                    locale: ptBR,
                                  })
                                ) : (
                                  <span>Selecione a data</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("2020-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Vehicle */}
                  <FormField
                    control={form.control}
                    name="vehicle_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Veículo</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o veículo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockVehicles.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                <div className="flex items-center gap-2">
                                  <Car className="h-4 w-4" />
                                  <span>{vehicle.plate}</span>
                                  <span className="text-muted-foreground">
                                    (Nº {vehicle.car_number})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* KM Start */}
                  <FormField
                    control={form.control}
                    name="km_start"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KM Saída</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 125000"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* KM End */}
                  <FormField
                    control={form.control}
                    name="km_end"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KM Chegada</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 125180"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Observations */}
                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações (opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ex: Rota escolar matutina, desvio por obras..."
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-primary hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Salvando..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Registro
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="h-fit border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-primary" />
              Resumo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-card p-4 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                KM Total
              </p>
              <p className="text-4xl font-bold font-display text-primary">
                {kmTotal.toLocaleString("pt-BR")}
              </p>
              <p className="text-sm text-muted-foreground">quilômetros</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">KM Saída:</span>
                <span className="font-medium">
                  {kmStart.toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">KM Chegada:</span>
                <span className="font-medium">
                  {kmEnd.toLocaleString("pt-BR")}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
