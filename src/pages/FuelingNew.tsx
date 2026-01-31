import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Fuel,
  ArrowLeft,
  Calendar as CalendarIcon,
  Car,
  Save,
  Upload,
  X,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  date: z.date({ required_error: "Selecione a data" }),
  vehicle_id: z.string().min(1, { message: "Selecione um veículo" }),
  location_type: z.enum(["garage", "gas_station"]),
  gas_station_name: z.string().optional(),
  current_km: z.coerce.number().min(0, { message: "KM deve ser maior que 0" }),
  liters_diesel: z.coerce.number().min(0),
  liters_arla: z.coerce.number().min(0),
});

type FormData = z.infer<typeof formSchema>;

// Mock data
const mockVehicles = [
  { id: "1", plate: "ABC-1234", car_number: "01" },
  { id: "2", plate: "DEF-5678", car_number: "02" },
  { id: "3", plate: "GHI-9012", car_number: "03" },
];

const mockGasStations = [
  "Posto Ipiranga Centro",
  "Posto Shell BR-101",
  "Posto Petrobras Av. Brasil",
];

export default function FuelingNew() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      vehicle_id: "",
      location_type: "garage",
      gas_station_name: "",
      current_km: 0,
      liters_diesel: 0,
      liters_arla: 0,
    },
  });

  const locationType = form.watch("location_type");

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && photos.length < 4) {
      const newPhotos = Array.from(files)
        .slice(0, 4 - photos.length)
        .map((file) => URL.createObjectURL(file));
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      console.log("Submitting:", { ...data, photos });
      toast.success("Abastecimento registrado com sucesso!");
      navigate("/fueling");
    } catch (error) {
      toast.error("Erro ao registrar abastecimento");
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
            <Fuel className="h-8 w-8 text-accent" />
            Registrar Abastecimento
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados do abastecimento realizado
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dados do Abastecimento</CardTitle>
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
                </div>

                {/* Location Type */}
                <FormField
                  control={form.control}
                  name="location_type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Local do Abastecimento</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="garage" id="garage" />
                            <Label htmlFor="garage">Garagem</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="gas_station"
                              id="gas_station"
                            />
                            <Label htmlFor="gas_station">Posto</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gas Station Name */}
                {locationType === "gas_station" && (
                  <FormField
                    control={form.control}
                    name="gas_station_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Posto</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione ou digite o nome do posto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockGasStations.map((station) => (
                              <SelectItem key={station} value={station}>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{station}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div className="grid gap-6 md:grid-cols-3">
                  {/* Current KM */}
                  <FormField
                    control={form.control}
                    name="current_km"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>KM Atual</FormLabel>
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

                  {/* Diesel */}
                  <FormField
                    control={form.control}
                    name="liters_diesel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Litros Diesel</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 120"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Arla */}
                  <FormField
                    control={form.control}
                    name="liters_arla"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Litros Arla</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Ex: 10"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Photos */}
                <div className="space-y-3">
                  <Label>Fotos do Comprovante (até 4)</Label>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg border bg-muted overflow-hidden"
                      >
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-destructive-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {photos.length < 4 && (
                      <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 hover:bg-muted transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-sm text-muted-foreground">
                          Adicionar
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>

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
                    className="bg-gradient-accent hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      "Salvando..."
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Abastecimento
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="h-fit border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5 text-accent" />
              Resumo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-card p-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Diesel
                </p>
                <p className="text-2xl font-bold font-display text-accent">
                  {form.watch("liters_diesel") || 0} L
                </p>
              </div>
              <div className="rounded-lg bg-card p-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">
                  Arla
                </p>
                <p className="text-2xl font-bold font-display text-success">
                  {form.watch("liters_arla") || 0} L
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">KM Atual:</span>
                <span className="font-medium">
                  {(form.watch("current_km") || 0).toLocaleString("pt-BR")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fotos:</span>
                <span className="font-medium">{photos.length}/4</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
