import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@/providers/user-provider";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/../firebase";
import LoadingButton from "@/components/loading-button";
import { toast } from "@/components/ui/use-toast";
import { CollectionNames } from "@/types";

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

function ProfileForm() {
  const { user, refreshUser } = useUser();

  const profileForm = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
        }
      : undefined,
  });

  const updateProfileHandler = async (values: z.infer<typeof updateProfileSchema>) => {
    try {
      await updateDoc(doc(db, CollectionNames.Users, user!.uid), {
        firstName: values.firstName,
        lastName: values.lastName,
      });
      await refreshUser();
      toast({
        description: "Profile updated successfully!",
      });
      profileForm.reset(values);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update profile.",
        description: (error as Error).message,
      });
    }
  };

  return (
    <Form {...profileForm}>
      <form onSubmit={profileForm.handleSubmit(updateProfileHandler)} className="space-y-3">
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

        <LoadingButton type="submit" isLoading={profileForm.formState.isSubmitting} label="Update" loadingLabel="Updating" />
      </form>
    </Form>
  );
}

export default ProfileForm;
