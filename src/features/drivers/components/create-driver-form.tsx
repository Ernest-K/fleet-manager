import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import LoadingButton from "@/components/loading-button";
import { createDriverFormSchema, DriverStatus } from "@/features/drivers/types";
import { useCreateDriver } from "@/features/drivers/hooks/useCreateDriver";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useAuth } from "@/providers/auth-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

function CreateDriverForm() {
  const { authUser } = useAuth();
  const { mutate: createDriver, isPending } = useCreateDriver({ managerUid: authUser!.uid });
  const router = useRouter();
  const form = useForm<z.infer<typeof createDriverFormSchema>>({
    resolver: zodResolver(createDriverFormSchema),
  });

  const onSubmit = (values: z.infer<typeof createDriverFormSchema>) => {
    createDriver(values, {
      onSuccess: (data) => {
        toast({
          description: "Driver created successfully",
        });
        router.push("/dashboard/drivers");
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-3">
          <header>
            <h3 className="text-lg font-medium">Basic Information</h3>
            <p className="text-sm text-muted-foreground">Enter the fundamental details of the driver.</p>
          </header>

          <div className="flex flex-col md:flex-row justify-between gap-3 md:gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="md:flex-1">
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone </FormLabel>
                <FormControl>
                  <Input placeholder="+919367788755" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licenseNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Driver&apos;s License Number</FormLabel>
                <FormControl>
                  <Input placeholder="ABC123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DriverStatus.options.map((type) => (
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
            <h3 className="text-lg font-medium">Account Information</h3>
            <p className="text-sm text-muted-foreground">Set up the driver&apos;s account credentials.</p>
          </header>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="example@example.com" type="email" {...field} />
                </FormControl>
                <FormDescription>Email will be used for login.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
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

export default CreateDriverForm;
