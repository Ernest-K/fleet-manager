import { useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/../firebase";
import { registerFormSchema } from "../types";
import { z } from "zod";
import { doc, setDoc } from "firebase/firestore";
import { toast, useToast } from "@/components/ui/use-toast";

export function useRegister() {
  return useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      email,
      password,
    }: z.infer<typeof registerFormSchema>) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          firstName,
          lastName,
          email,
          role: "manager",
        });

        return userCredential.user;
      } catch (error) {
        throw error;
      }
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

export default useRegister;
