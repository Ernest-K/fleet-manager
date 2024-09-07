import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingButton from "@/components/loading-button";
import { toast } from "@/components/ui/use-toast";
import { Driver, editDriverFormSchema } from "@/features/drivers/types";
import { useUpdateDriver } from "@/features/drivers/hooks/useUpdateDriver";

type EditDriverFormProps = {
  driver: Driver;
};

function EditDriverForm({ driver }: EditDriverFormProps) {
  const profileForm = useForm<z.infer<typeof editDriverFormSchema>>({
    resolver: zodResolver(editDriverFormSchema),
    defaultValues: driver
      ? {
          firstName: driver.firstName,
          lastName: driver.lastName,
          phone: driver.phone,
          licenseNumber: driver.licenseNumber,
        }
      : undefined,
  });
  const { mutate: updateDriver, isPending } = useUpdateDriver();

  const editDriverHandler = async (values: z.infer<typeof editDriverFormSchema>) => {
    updateDriver(
      {
        driverUid: driver.uid,
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          licenseNumber: values.licenseNumber,
        },
      },
      {
        onSuccess: () => {
          toast({
            description: "Driver updated successfully!",
          });
        },
      }
    );
  };

  return (
    <Form {...profileForm}>
      <form onSubmit={profileForm.handleSubmit(editDriverHandler)} className="space-y-4">
        <FormField
          control={profileForm.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={profileForm.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={profileForm.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={profileForm.control}
          name="licenseNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Driver&apos;s License Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <LoadingButton type="submit" isLoading={isPending} label="Update" loadingLabel="Updating" />
      </form>
    </Form>
  );
}

export default EditDriverForm;
