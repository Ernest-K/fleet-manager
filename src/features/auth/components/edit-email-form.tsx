import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/providers/user-provider";
import { useAuth } from "@/providers/auth-provider";
import { doc, updateDoc } from "firebase/firestore";
import { updateEmail } from "@firebase/auth";
import { db } from "@/../firebase";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/loading-button";

const updateEmailSchema = z.object({
  email: z.string().email(),
});

function EditEmailForm() {
  const { authUser } = useAuth();
  const { user, refreshUser } = useUser();
  const emailForm = useForm<z.infer<typeof updateEmailSchema>>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: user?.email ?? "",
    },
  });

  const updateEmailHandler = async (values: z.infer<typeof updateEmailSchema>) => {
    try {
      if (authUser) {
        await updateEmail(authUser, values.email);
        await updateDoc(doc(db, "users", user!.uid), { email: values.email });
        await refreshUser();

        toast({
          description: "Email updated successfully!",
        });
        emailForm.reset({ email: values.email });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update email.",
        description: (error as Error).message,
      });
    }
  };

  return (
    <Form {...emailForm}>
      <form onSubmit={emailForm.handleSubmit(updateEmailHandler)} className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-6">
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Email is used for login.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton className="sm:mt-8" type="submit" isLoading={emailForm.formState.isSubmitting} label="Update Email" loadingLabel="Updating" />
        </div>
      </form>
    </Form>
  );
}

export default EditEmailForm;
