import { useAuth } from "@/providers/auth-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createIssueFormSchema, IssueStatus, Severity, SeverityColors } from "@/features/issues/types";
import { useGetVehicles } from "@/features/vehicles/hooks/useGetVehicles";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import VehicleCard from "@/features/vehicles/components/vehicle-card";
import { MoveUp } from "lucide-react";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateIssue } from "@/features/issues/hooks/useCreateIssue";
import { toast } from "@/components/ui/use-toast";
import PlaceholderCard from "@/components/placeholder-card";

type CreateIssueFormProps = {
  vehicleUid?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};

function CreateIssueForm({ vehicleUid, onSubmit: onFormSubmit, onCancel }: CreateIssueFormProps) {
  const { authUser } = useAuth();
  const form = useForm<z.infer<typeof createIssueFormSchema>>({
    resolver: zodResolver(createIssueFormSchema),
    defaultValues: {
      vehicleUid: vehicleUid ? vehicleUid : undefined,
      description: "",
    },
  });
  const { watch } = form;
  const { data: vehicles } = useGetVehicles({ managerUid: authUser!.uid });
  const { mutate: createIssue, isPending } = useCreateIssue({ managerUid: authUser!.uid });

  const selectedVehicle = vehicleUid ? vehicles?.find((vehicle) => vehicle.uid === vehicleUid) : vehicles?.find((vehicle) => vehicle.uid === watch("vehicleUid"));

  const onSubmit = (values: z.infer<typeof createIssueFormSchema>) => {
    if (authUser) {
      const preparedValues = { ...values, reportedBy: authUser.uid, reportedAt: new Date() };

      createIssue(preparedValues, {
        onSuccess: (data) => {
          toast({
            description: "Issue reported successfully",
          });
          form.reset();
          onFormSubmit && onFormSubmit();
        },
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col justify-between gap-6 w-full">
          <FormField
            control={form.control}
            name="vehicleUid"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={vehicleUid}>
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
        <FormField
          control={form.control}
          name="severity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Severity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Severity.options.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${SeverityColors[type]}`} aria-label={type}></div>
                        <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      </div>
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {IssueStatus.options.map((type) => (
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
          name="description"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the issue" className="resize-none" {...field} />
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
          <LoadingButton type="submit" isLoading={isPending} label="Create" className="ml-auto" loadingLabel="Creating" />
        </div>
      </form>
    </Form>
  );
}

export default CreateIssueForm;
