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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import PlaceholderCard from "@/components/placeholder-card";
import VehicleCard from "@/features/vehicles/components/vehicle-card";
import LoadingButton from "@/components/loading-button";

import { useAuth } from "@/providers/auth-provider";
import { useUser } from "@/providers/user-provider";
import { useGetVehicles } from "@/features/vehicles/hooks/useGetVehicles";
import { useCreateInspection } from "@/features/inspections/hooks/useCreateInspection";
import { useUpdateInspection } from "@/features/inspections/hooks/useUpdateInspection";

import { AuditFields } from "@/types";
import { ChecklistItem, Inspection, InspectionFormData, InspectionType, inspectionFormSchema } from "@/features/inspections/types";
import { Role } from "@/features/auth/types";
import { Vehicle } from "@/features/vehicles/types";

type InspectionFormProps = {
  inspection?: Inspection;
  vehicleUid?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};

function InspectionForm({ inspection, vehicleUid, onSubmit: onFormSubmit, onCancel }: InspectionFormProps) {
  const { authUser } = useAuth();
  const { user } = useUser();

  const inspectionValues = inspection ? { vehicleUid: inspection.vehicleUid, type: inspection.type, date: inspection.date.toDate(), checklist: inspection.checklist, notes: inspection.notes } : undefined;

  const form = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionFormSchema),
    defaultValues: inspection
      ? inspectionValues
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
    name: "checklist",
  });

  const { mutate: createInspection, isPending: isCreating } = useCreateInspection({ userUid: authUser!.uid, managerUid: user!.role === Role.Manager ? authUser!.uid : user!.managerUid! });
  const { mutate: updateInspection, isPending: isUpdating } = useUpdateInspection({ userUid: authUser!.uid });

  const onSubmit = (values: InspectionFormData) => {
    if (inspection) {
      updateInspection(
        {
          inspectionUid: inspection.uid,
          inspectionData: values,
        },
        {
          onSuccess: (data) => {
            toast({
              description: "Inspection updated successfully",
            });
            onFormSubmit && onFormSubmit();
          },
        }
      );
    } else {
      if (authUser) {
        const auditData: AuditFields = { createdBy: authUser.uid, createdAt: Timestamp.now() };
        const preparedValues = { ...values, ...auditData };

        createInspection(preparedValues, {
          onSuccess: (data) => {
            toast({
              description: "Inspection scheduled successfully",
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

        <InspectionDetails form={form} label="Type" name="type" options={InspectionType.options} />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Inspection date</FormLabel>
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

        <Checklist form={form} fields={fields} append={append} remove={remove} />

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
          <LoadingButton type="submit" isLoading={inspection ? isUpdating : isCreating} label={inspection ? "Update" : "Create"} className="ml-auto" loadingLabel={inspection ? "Updating" : "Creating"} />
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

const InspectionDetails = ({ form, label, name, options }: { form: any; label: string; name: string; options: string[] }) => (
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

const Checklist = ({ form, fields, append, remove }: { form: any; fields: any[]; append: (item: ChecklistItem) => void; remove: (index: number) => void }) => (
  <div>
    <h3 className="text-lg font-semibold mb-2">Inspection Checklist</h3>
    {fields.map((field, index) => (
      <div key={field.id} className="flex items-center space-x-2 mb-2">
        <FormField
          control={form.control}
          name={`checklist.${index}.checked`}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`checklist.${index}.name`}
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormControl>
                <Input placeholder="Checklist item" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} aria-label="Remove checklist item">
          <X className="h-4 w-4" />
        </Button>
      </div>
    ))}
    <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", checked: false })}>
      <PlusIcon className="h-4 w-4 mr-2" />
      Add
    </Button>
  </div>
);

export default InspectionForm;
