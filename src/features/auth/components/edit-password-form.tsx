import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import LoadingButton from "@/components/loading-button";
import { useAuth } from "@/providers/auth-provider";
import { updatePassword } from "@firebase/auth";
import { toast } from "@/components/ui/use-toast";

const updatePasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must contain at least 6 characters" }),
});

function EditPasswordForm() {
  const { authUser } = useAuth();
  const passwordForm = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const updatePasswordHandler = async (values: z.infer<typeof updatePasswordSchema>) => {
    try {
      if (authUser) {
        await updatePassword(authUser, values.password);

        toast({
          description: "Password updated successfully!",
        });
        passwordForm.reset({ password: "" });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update password.",
        description: (error as Error).message,
      });
    }
  };

  return (
    <Form {...passwordForm}>
      <form onSubmit={passwordForm.handleSubmit(updatePasswordHandler)} className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <FormField
            control={passwordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton className="sm:mt-8" type="submit" isLoading={passwordForm.formState.isSubmitting} label="Update Password" loadingLabel="Updating" />
        </div>
      </form>
    </Form>
  );
}

export default EditPasswordForm;
