import React, { useEffect, useState } from "react";
import { Colors, vehicleFormSchema, FuelType, Vehicle, VehicleStatus, VehicleType } from "@/features/vehicles/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { cn, colorMap } from "@/lib/utils";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";
import { useCreateVehicle } from "@/features/vehicles/hooks/useCreateVehicle";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { Textarea } from "@/components/ui/textarea";
import vehicleData from "@/../public/make-model-list.json";
import { useUpdateVehicle } from "@/features/vehicles/hooks/useUpdateVehicle";

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => (CURRENT_YEAR - i).toString());

type VehicleFormProps = {
  vehicle?: Vehicle;
};

type FormValues = z.infer<typeof vehicleFormSchema>;

function VehicleForm({ vehicle }: VehicleFormProps) {
  const { authUser } = useAuth();
  const { mutate: createVehicle, isPending: isCreating } = useCreateVehicle({ managerUid: authUser!.uid });
  const { mutate: updateVehicle, isPending: isUpdating } = useUpdateVehicle();

  const router = useRouter();
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: vehicle
      ? {
          vehicleType: vehicle.vehicleType,
          make: vehicleData.find((v) => v.make === vehicle.make) ? vehicle.make : "Other",
          model: vehicleData.find((v) => v.models.includes(vehicle.model)) ? vehicle.model : "Other",
          customMake: vehicleData.find((v) => v.make === vehicle.make) ? undefined : vehicle.make,
          customModel: vehicleData.find((v) => v.models.includes(vehicle.model)) ? undefined : vehicle.model,
          year: vehicle.year,
          vin: vehicle.vin,
          fuelType: vehicle.fuelType,
          color: vehicle.color,
          licensePlateNumber: vehicle.licensePlateNumber,
          registration: vehicle.registration,
          odometerReading: vehicle.odometerReading,
          technicalInspectionDate: vehicle.technicalInspectionDate.toDate(),
          insurancePolicyDate: vehicle.insurancePolicyDate.toDate(),
          status: vehicle.status,
          notes: vehicle.notes,
        }
      : undefined,
  });
  const { watch, setValue } = form;
  const selectedMake = watch("make");
  const selectedModel = watch("model");

  useEffect(() => {
    const selectedMakeData = vehicleData.find((v) => v.make === selectedMake);

    if (selectedMake && selectedMake !== "Other" && selectedMakeData) {
      setAvailableModels(selectedMakeData.models);
    } else {
      setAvailableModels([]);
    }
  }, [selectedMake]);

  const prepareVehicleValues = (vehicleValues: FormValues) => {
    return {
      vehicleType: vehicleValues.vehicleType,
      make: vehicleValues.make === "Other" ? vehicleValues.customMake || "" : vehicleValues.make,
      model: vehicleValues.model === "Other" ? vehicleValues.customModel || "" : vehicleValues.model,
      year: vehicleValues.year,
      vin: vehicleValues.vin,
      fuelType: vehicleValues.fuelType,
      color: vehicleValues.color,
      licensePlateNumber: vehicleValues.licensePlateNumber,
      registration: vehicleValues.registration,
      odometerReading: vehicleValues.odometerReading,
      technicalInspectionDate: vehicleValues.technicalInspectionDate,
      insurancePolicyDate: vehicleValues.insurancePolicyDate,
      status: vehicleValues.status,
      notes: vehicleValues.notes || "",
    };
  };

  const onSubmit = (data: FormValues) => {
    const finalVehicleValues = prepareVehicleValues(data);

    if (vehicle) {
      updateVehicle(
        {
          vehicleUid: vehicle.uid,
          vehicleData: finalVehicleValues,
        },
        {
          onSuccess: (data) => {
            toast({
              description: "Vehicle updated successfully",
            });
            router.back();
          },
        }
      );
    } else {
      createVehicle(finalVehicleValues, {
        onSuccess: (data) => {
          toast({
            description: "Vehicle created successfully",
          });
          router.back();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <header>
            <h3 className="text-lg font-medium">Basic Information</h3>
            <p className="text-sm text-muted-foreground">Enter the fundamental details of the vehicle.</p>
          </header>

          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {VehicleType.options.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="flex-1 space-y-3">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select make" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleData.map((vehicle) => (
                          <SelectItem key={vehicle.make} value={vehicle.make}>
                            {vehicle.make}
                          </SelectItem>
                        ))}
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedMake === "Other" && (
                <FormField
                  control={form.control}
                  name="customMake"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>Custom Make</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter custom make" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex-1 space-y-3">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="grow">
                    <FormLabel>Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedMake}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableModels.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedModel === "Other" && (
                <FormField
                  control={form.control}
                  name="customModel"
                  render={({ field }) => (
                    <FormItem className="grow">
                      <FormLabel>Custom Model</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter custom model" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Year</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Color</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Colors.options.map((color) => (
                        <SelectItem key={color} value={color}>
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-border border-2" aria-label={color} style={{ backgroundColor: colorMap[color] || "#CCCCCC" }}></div>
                            <span>{color.charAt(0).toUpperCase() + color.slice(1)}</span>
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
        </div>
        <Separator />
        <div className="space-y-3">
          <header>
            <h3 className="text-lg font-medium">Vehicle Specifications</h3>
            <p className="text-sm text-muted-foreground">Provide detailed specifications of the vehicle.</p>
          </header>
          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIN</FormLabel>
                <FormControl>
                  <Input placeholder="Enter VIN" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <FormField
              control={form.control}
              name="fuelType"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Fuel Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FuelType.options.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="odometerReading"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Odometer Reading</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} placeholder="Enter odometer reading" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />

        <div className="space-y-3">
          <header>
            <h3 className="text-lg font-medium">Registration and Insurance</h3>
            <p className="text-sm text-muted-foreground">Enter legal and insurance information for the vehicle.</p>
          </header>

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <FormField
              control={form.control}
              name="licensePlateNumber"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>License Plate</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter license plate" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="registration"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Registration Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter registration number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <FormField
              control={form.control}
              name="technicalInspectionDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Technical Inspection Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="insurancePolicyDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Insurance Policy Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Separator />
        <div className="space-y-3">
          <header>
            <h3 className="text-lg font-medium">Status</h3>
            <p className="text-sm text-muted-foreground">Provide information about the vehicle&apos;s current status</p>
          </header>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {VehicleStatus.options.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Separator />
        <div className="space-y-3">
          <header>
            <h3 className="text-lg font-medium">Additional Information</h3>
            <p className="text-sm text-muted-foreground">Add any other relevant details or notes about the vehicle.</p>
          </header>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter notes about the vehicle" className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <LoadingButton type="submit" isLoading={isCreating || isUpdating} label={vehicle ? "Update" : "Create"} className="w-full" loadingLabel={vehicle ? "Updating" : "Creating"} />
      </form>
    </Form>
  );
}

export default VehicleForm;
