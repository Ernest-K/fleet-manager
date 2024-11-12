import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "@/../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { CollectionNames } from "@/types";
import { Role } from "@/features/auth/types";
import { useMutation } from "@tanstack/react-query";

export function useGoogleLogin() {
  return useMutation({
    mutationFn: async () => {
      const provider = new GoogleAuthProvider();

      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        const userDocRef = doc(db, CollectionNames.Users, user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            firstName: user.displayName?.split(" ")[0] || "Unknown",
            lastName: user.displayName?.split(" ")[1] || "Unknown",
            email: user.email,
            role: Role.Manager,
          });
        }
      } catch (error) {
        console.error("Google login failed: ", error);
      }
    },
    onSuccess: (user) => {},
    onError: (error) => {},
  });
}
