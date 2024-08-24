import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/../firebase";
import { loginFormSchema } from "../types";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";

export function useLogin() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: z.infer<typeof loginFormSchema>) => {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    },
    onSuccess: (user) => {},
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: error.message,
      });
    },
  });
}

export default useLogin;
