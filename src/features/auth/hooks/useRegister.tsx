import { useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/../firebase";
import { registerFormSchema, Role } from "@/features/auth/types";
import { z } from "zod";
import { doc, setDoc } from "firebase/firestore";
import { CollectionNames } from "@/types";

export function useRegister() {
  return useMutation({
    mutationFn: async ({ firstName, lastName, email, password }: z.infer<typeof registerFormSchema>) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, CollectionNames.Users, userCredential.user.uid), {
          uid: userCredential.user.uid,
          firstName,
          lastName,
          email,
          role: Role.Manager,
          managerUid: userCredential.user.uid,
        });

        return userCredential.user;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (user) => {},
    onError: (error) => {},
  });
}

export default useRegister;
