import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { loginFormSchema, Role } from "@/features/auth/types";
import useLogin from "@/features/auth/hooks/useLogin";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import LoadingButton from "@/components/loading-button";
import { useUser } from "@/providers/user-provider";

function LoginForm() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();
  const { user, getUser } = useUser();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    login(values, {
      onSuccess: async (data) => {
        const userData = await getUser(data.uid);

        toast({
          description: "You are successfully logged in",
        });

        if (userData?.role == Role.Manager) {
          router.push("/dashboard");
        } else if (userData?.role == Role.Driver) {
          router.push("/driver");
        }
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@example.com" {...field} />
              </FormControl>
              <FormDescription>Please enter your email address.</FormDescription>
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
              <FormDescription>Please enter your password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton type="submit" isLoading={isPending} label="Sign in" className="w-full" />
      </form>
    </Form>
  );
}

export default LoginForm;
