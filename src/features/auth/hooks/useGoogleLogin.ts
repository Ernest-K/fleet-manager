import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/router";
import { auth, db } from "../../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { CollectionNames } from "@/types";
import { Role } from "../types";
import { useMutation } from "@tanstack/react-query";

export function useGoogleLogin() {
  return useMutation({
    mutationFn: async () => {
      const provider = new GoogleAuthProvider();

      try {
        // Sign in with Google
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if the user already exists in the Firestore database
        const userDocRef = doc(db, CollectionNames.Users, user.uid);
        const userDoc = await getDoc(userDocRef);

        // If the user doesn't exist, create a new record
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            firstName: user.displayName?.split(" ")[0] || "Unknown",
            lastName: user.displayName?.split(" ")[1] || "Unknown",
            email: user.email,
            role: Role.Manager, // Default role for Google users
          });
        }

        // Redirect to the dashboard after successful login
      } catch (error) {
        console.error("Google login failed: ", error);
      }
    },
    onSuccess: (user) => {},
    onError: (error) => {},
  });
}
