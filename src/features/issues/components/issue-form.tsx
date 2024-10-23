import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Timestamp } from "firebase/firestore";

import { Issue, IssueFormData, issueFormSchema, IssueStatus, IssueType, Severity, SeverityColors } from "@/features/issues/types";
import { useGetVehicles } from "@/features/vehicles/hooks/useGetVehicles";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import VehicleCard from "@/features/vehicles/components/vehicle-card";
import LoadingButton from "@/components/loading-button";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import PlaceholderCard from "@/components/placeholder-card";

import { useAuth } from "@/providers/auth-provider";
import { useUpdateIssue } from "@/features/issues/hooks/useUpdateIssue";
import { useCreateIssue } from "@/features/issues/hooks/useCreateIssue";
import { useUser } from "@/providers/user-provider";

import { Vehicle } from "@/features/vehicles/types";
import { Role } from "@/features/auth/types";
import { AuditFields, CollectionNames } from "@/types";
import queryClient from "@/lib/queryClient";

type IssueFormProps = {
  issue?: Issue;
  vehicleUid?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
};

function IssueForm({ issue, vehicleUid, onSubmit: onFormSubmit, onCancel }: IssueFormProps) {
  const { authUser } = useAuth();
  const { user } = useUser();

  const issueValues = issue
    ? { vehicleUid: issue.vehicleUid, type: issue.type, severity: issue.severity, status: issue.status, description: issue.description }
    : undefined;

  const form = useForm<IssueFormData>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: issue
      ? issueValues
      : {
          vehicleUid: vehicleUid ? vehicleUid : undefined,
          description: "",
        },
  });
  const { watch } = form;
  const { data: vehicles } = useGetVehicles({ managerUid: user?.managerUid! });
  const selectedVehicle = vehicleUid
    ? vehicles?.find((vehicle) => vehicle.uid === vehicleUid)
    : vehicles?.find((vehicle) => vehicle.uid === watch("vehicleUid"));

  const { mutate: createIssue, isPending: isCreating } = useCreateIssue({
    userUid: authUser!.uid,
    managerUid: user!.role === Role.Manager ? authUser!.uid : user!.managerUid!,
  });
  const { mutate: updateIssue, isPending: isUpdating } = useUpdateIssue({ userUid: authUser!.uid });

  const onSubmit = (values: IssueFormData) => {
    if (issue) {
      updateIssue(
        {
          issueUid: issue.uid,
          issueData: values,
        },
        {
          onSuccess: (data) => {
            toast({
              description: "Issue updated successfully",
            });
            onFormSubmit && onFormSubmit();
          },
        }
      );
    } else {
      if (authUser) {
        const auditData: AuditFields = { createdBy: authUser.uid, createdAt: Timestamp.now() };
        const preparedValues = { ...values, ...auditData };

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

        <IssueDetails form={form} label="Type" name="type" options={IssueType.options} />

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

        <IssueDetails form={form} label="Status" name="status" options={IssueStatus.options} />

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
          <LoadingButton
            type="submit"
            isLoading={issue ? isUpdating : isCreating}
            label={issue ? "Update" : "Create"}
            className="ml-auto"
            loadingLabel={issue ? "Updating" : "Creating"}
          />
        </div>
      </form>
    </Form>
  );
}

const IssueDetails = ({ form, label, name, options }: { form: any; label: string; name: string; options: string[] }) => (
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

export default IssueForm;
