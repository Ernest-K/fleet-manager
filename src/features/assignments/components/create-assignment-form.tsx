import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/providers/auth-provider";
import { useCreateAssignment } from "@/features/assignments/hooks/useCreateAssignment";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createAssignmentFormSchema } from "@/features/assignments/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetDrivers } from "@/features/drivers/hooks/useGetDrivers";
import { useGetVehicles } from "@/features/vehicles/hooks/useGetVehicles";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, MoveUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import DriverCard from "@/features/drivers/components/driver-card";
import VehicleCard from "@/features/vehicles/components/vehicle-card";
import { Badge } from "@/components/ui/badge";
import PlaceholderCard from "@/components/placeholder-card";

type CreateAssignmentFormProps = {
  onSubmit?: () => void;
  onCancel?: () => void;
};

function CreateAssignmentForm({ onSubmit: onFormSubmit, onCancel }: CreateAssignmentFormProps) {
  const { authUser } = useAuth();
  const { mutate: createAssignment, isPending } = useCreateAssignment({ managerUid: authUser!.uid });
  const form = useForm<z.infer<typeof createAssignmentFormSchema>>({
    resolver: zodResolver(createAssignmentFormSchema),
  });
  const { watch } = form;
  const { data: drivers } = useGetDrivers({ managerUid: authUser!.uid });
  const { data: vehicles } = useGetVehicles({ managerUid: authUser!.uid });

  const selectedDriver = drivers?.find((driver) => driver.uid === watch("driverUid"));
  const selectedVehicle = vehicles?.find((vehicle) => vehicle.uid === watch("vehicleUid"));

  const onSubmit = (values: z.infer<typeof createAssignmentFormSchema>) => {
    createAssignment(values, {
      onSuccess: () => {
        toast({
          description: "Assignment created successfully",
        });
        form.reset();
        onFormSubmit && onFormSubmit();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 overflow-">
          <div className="flex flex-col justify-between gap-6 w-full">
            <FormField
              control={form.control}
              name="driverUid"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {drivers &&
                        drivers.map((driver) => (
                          <SelectItem key={driver.uid} value={driver.uid} className="w-full">
                            <div className="w-full relative flex justify-between items-center gap-6 min-w-xs overflow-hidden">
                              <Avatar>
                                <AvatarImage src={driver?.photoURL} alt="Profile photo" />
                                <AvatarFallback>FM</AvatarFallback>
                              </Avatar>
                              <span>{`${driver.firstName} ${driver.lastName}`}</span>
                              <Badge>{driver.status}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedDriver ? <DriverCard driver={selectedDriver} /> : <PlaceholderCard text="Select driver" />}
          </div>
          <div className="flex flex-col justify-between gap-6 w-full">
            <FormField
              control={form.control}
              name="vehicleUid"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles &&
                        vehicles.map((vehicle) => (
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
            {selectedVehicle ? <VehicleCard vehicle={selectedVehicle} /> : <PlaceholderCard text="Select vehicle" />}
          </div>
        </div>
        <FormField
          control={form.control}
          name="dateRange"
          render={({ field }) => (
            <FormItem>
              <Popover>
                <PopoverTrigger asChild>
                  <Button id="date" variant={"outline"} className={cn("w-full justify-start text-left font-normal", !field.value && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value?.from ? (
                      field.value.to ? (
                        <>
                          <span className="text-muted-foreground mr-1">from </span>
                          {format(field.value.from, "d LLL y")}
                          <span className="text-muted-foreground mx-1"> to </span>
                          {format(field.value.to, "d LLL y")}
                        </>
                      ) : (
                        format(field.value.from, "d LLL y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={field.value?.from}
                    selected={{
                      from: field.value?.from,
                      to: field.value?.to,
                    }}
                    onSelect={field.onChange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
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
          <LoadingButton type="submit" isLoading={isPending} label="Create" className="ml-auto" loadingLabel="Creating" />
        </div>
      </form>
    </Form>
  );
}

export default CreateAssignmentForm;
