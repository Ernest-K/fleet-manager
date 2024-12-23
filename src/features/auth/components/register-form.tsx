import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { registerFormSchema } from "@/features/auth/types";
import useRegister from "@/features/auth/hooks/useRegister";
import { useToast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/loading-button";
import useLogin from "@/features/auth/hooks/useLogin";
import { useRouter } from "next/router";
import { Icons } from "@/components/ui/icons";

function RegisterForm() {
  const { mutate: register, isPending } = useRegister();
  const { mutate: login, isPending: isLogging } = useLogin();
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerFormSchema>) {
    register(values, {
      onSuccess: (user) => {
        login(
          { email: values.email, password: values.password },
          {
            onSuccess: () => {
              router.push("/dashboard");
            },
          }
        );
        toast({
          title: "Your registration has been successful.",
          description: "You can log in",
        });
      },
    });
    form.reset();
  }

  if (isLogging) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Icons.spinner className="mr-2 animate-spin" />
        Loading
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" {...field} />
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
        <LoadingButton type="submit" isLoading={isPending} label="Sign up" className="w-full" />
      </form>
    </Form>
  );
}

export default RegisterForm;
