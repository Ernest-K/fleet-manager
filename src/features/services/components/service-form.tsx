import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, PlusIcon, X } from "lucide-react";
import { Timestamp } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/components/ui/use-toast";
import PlaceholderCard from "@/components/placeholder-card";
import VehicleCard from "@/features/vehicles/components/vehicle-card";
import LoadingButton from "@/components/loading-button";

import { useAuth } from "@/providers/auth-provider";
import { useUser } from "@/providers/user-provider";
import { useGetVehicles } from "@/features/vehicles/hooks/useGetVehicles";
import { useCreateService } from "@/features/services/hooks/useCreateService";
import { useUpdateService } from "../hooks/useUpdateService";

import { AuditFields } from "@/types";
import { Service, ServiceFormData, ServiceStatus, ServiceType, Part, serviceFormSchema } from "@/features/services/types";
import { Role } from "@/features/auth/types";
import { Vehicle } from "@/features/vehicles/types";

type ServiceFormProps = {
  service?: Service;
  vehicleUid?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};

function ServiceForm({ service, vehicleUid, onSubmit: onFormSubmit, onCancel }: ServiceFormProps) {
  const { authUser } = useAuth();
  const { user } = useUser();

  const serviceValues = service ? { vehicleUid: service.vehicleUid, type: service.type, status: service.status, date: service.date.toDate(), parts: service.parts, notes: service.notes } : undefined;

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: service
      ? serviceValues
      : {
          vehicleUid: vehicleUid ? vehicleUid : undefined,
          notes: "",
        },
  });
  const { watch } = form;
  const { data: vehicles } = useGetVehicles({ managerUid: authUser!.uid });
  const selectedVehicle = vehicleUid ? vehicles?.find((vehicle) => vehicle.uid === vehicleUid) : vehicles?.find((vehicle) => vehicle.uid === watch("vehicleUid"));
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "parts",
  });

  const { mutate: createService, isPending: isCreating } = useCreateService({ userUid: authUser!.uid, managerUid: user!.role === Role.Manager ? authUser!.uid : user!.managerUid! });
  const { mutate: updateService, isPending: isUpdating } = useUpdateService({ userUid: authUser!.uid });

  const onSubmit = (values: ServiceFormData) => {
    if (service) {
      updateService(
        {
          serviceUid: service.uid,
          serviceData: values,
        },
        {
          onSuccess: (data) => {
            toast({
              description: "Service updated successfully",
            });
            onFormSubmit && onFormSubmit();
          },
        }
      );
    } else {
      if (authUser) {
        const auditData: AuditFields = { createdBy: authUser.uid, createdAt: Timestamp.now() };
        const preparedValues = { ...values, ...auditData };

        createService(preparedValues, {
          onSuccess: (data) => {
            toast({
              description: "Service scheduled successfully",
            });
            form.reset();
            onFormSubmit && onFormSubmit();
          },
        });
      }
    }
  };

  if (!user) return "User not found";

  if (!vehicles) return "Vehicles not found";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col justify-between gap-6 w-full">
          <VehicleSelection form={form} vehicles={vehicles} />
          {selectedVehicle ? <VehicleCard vehicle={selectedVehicle} /> : <PlaceholderCard text="Select vehicle" />}
        </div>

        <ServiceDetails form={form} label="Type" name="type" options={ServiceType.options} />
        <ServiceDetails form={form} label="Status" name="status" options={ServiceStatus.options} />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Service date</FormLabel>
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

        <PartsList form={form} fields={fields} append={append} remove={remove} />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes" className="resize-none" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          {onCancel && (
            <Button type="reset" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <LoadingButton type="submit" isLoading={service ? isUpdating : isCreating} label={service ? "Update" : "Create"} className="ml-auto" loadingLabel={service ? "Updating" : "Creating"} />
        </div>
      </form>
    </Form>
  );
}

const VehicleSelection = ({ form, vehicles }: { form: any; vehicles: Vehicle[] }) => (
  <FormField
    control={form.control}
    name="vehicleUid"
    render={({ field }) => (
      <FormItem>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger>
            <SelectValue placeholder="Select vehicle" />
          </SelectTrigger>
          <SelectContent>
            {vehicles?.map((vehicle) => (
              <SelectItem key={vehicle.uid} value={vehicle.uid}>
                <div className="w-full flex justify-between items-center gap-6">
                  <span className="text-md capitalize">{vehicle.vehicleType}</span>
                  <div className="flex flex-col items-start">
                    <span>{`${vehicle.make} ${vehicle.model}`}</span>
                    <span className="text-xs text-muted-foreground">{vehicle.licensePlateNumber}</span>
                  </div>
                  <Badge className="ml-auto">{vehicle.status}</Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

const ServiceDetails = ({ form, label, name, options }: { form: any; label: string; name: string; options: string[] }) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);

const PartsList = ({ form, fields, append, remove }: { form: any; fields: any[]; append: (item: Part) => void; remove: (index: number) => void }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Parts</h3>
    {fields.map((field, index) => (
      <div key={field.id} className="flex items-end gap-2">
        <FormField
          control={form.control}
          name={`parts.${index}.name`}
          render={({ field }) => (
            <FormItem className="grow">
              <FormLabel className={index !== 0 ? "sr-only" : undefined}>Part Name</FormLabel>
              <FormControl>
                <Input placeholder="Part name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`parts.${index}.quantity`}
          render={({ field }) => (
            <FormItem className="w-20">
              <FormLabel className={index !== 0 ? "sr-only" : undefined}>Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Qty" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove part">
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({ name: "", quantity: 1 })}>
      <PlusIcon className="h-4 w-4 mr-2" />
      Add Part
    </Button>
  </div>
);

export default ServiceForm;
