import React from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUser } from "@/providers/user-provider";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import LoadingButton from "@/components/loading-button";
import { useAuth } from "@/providers/auth-provider";
import { updateEmail, updatePassword } from "@firebase/auth";
import { toast } from "@/components/ui/use-toast";

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});

const updateEmailSchema = z.object({
  email: z.string().email(),
});

const updatePasswordSchema = z.object({
  password: z.string().min(6, { message: "Password must contain at least 6 characters" }),
});

function ProfileForm() {
  const { user, refreshUser } = useUser();
  const { authUser } = useAuth();

  const profileForm = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
        }
      : undefined,
  });

  const emailForm = useForm<z.infer<typeof updateEmailSchema>>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: user?.email ?? "",
    },
  });

  const passwordForm = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const updateProfileHandler = async (values: z.infer<typeof updateProfileSchema>) => {
    try {
      await updateDoc(doc(db, "users", user!.uid), {
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
    <>
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(updateProfileHandler)} className="space-y-4">
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

      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(updateEmailHandler)} className="space-y-4">
          <div className="flex gap-6">
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

            <LoadingButton className="mt-8" type="submit" isLoading={emailForm.formState.isSubmitting} label="Update Email" loadingLabel="Updating" />
          </div>
        </form>
      </Form>

      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(updatePasswordHandler)} className="space-y-4">
          <div className="flex gap-6">
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

            <LoadingButton className="mt-8" type="submit" isLoading={passwordForm.formState.isSubmitting} label="Update Password" loadingLabel="Updating" />
          </div>
        </form>
      </Form>
    </>
  );
}

export default ProfileForm;
