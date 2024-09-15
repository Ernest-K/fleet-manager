import React, { useEffect, useState } from "react";
import { Colors, createVehicleFormSchema, FuelType, VehicleStatus, VehicleType } from "@/features/vehicles/types";
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
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";
import { useCreateVehicle } from "@/features/vehicles/hooks/useCreateVehicle";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { Textarea } from "@/components/ui/textarea";
import vehicleData from "@/../public/make-model-list.json";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());

function CreateVehicleForm() {
  const { authUser } = useAuth();
  const { mutate: createVehicle, isPending } = useCreateVehicle({ managerUid: authUser!.uid });
  const router = useRouter();
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const form = useForm<z.infer<typeof createVehicleFormSchema>>({
    resolver: zodResolver(createVehicleFormSchema),
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

  const prepareVehicleValues = (vehicleValues: z.infer<typeof createVehicleFormSchema>) => {
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

  const onSubmit = (data: z.infer<typeof createVehicleFormSchema>) => {
    const finalVehicleValues = prepareVehicleValues(data);

    createVehicle(finalVehicleValues, {
      onSuccess: (data) => {
        toast({
          description: "Vehicle created successfully",
        });
        router.push("/dashboard/vehicles");
      },
    });
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
                        {/* {Object.keys(vehicleData).map((make) => (
                          <SelectItem key={make} value={make}>
                            {make}
                          </SelectItem>
                        ))} */}
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
                      {years.map((year) => (
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
                          {color.charAt(0).toUpperCase() + color.slice(1)}
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

        <LoadingButton type="submit" isLoading={isPending} label="Create" className="w-full" loadingLabel="Creating" />
      </form>
    </Form>
  );
}

export default CreateVehicleForm;
