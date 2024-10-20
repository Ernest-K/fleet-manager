import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoginForm from "@/features/auth/components/login-form";
import { UserRound } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import useLogin from "../hooks/useLogin";
import { useRouter } from "next/router";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth, db } from "../../../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { CollectionNames } from "@/types";
import { Role, User } from "../types";
import { useUser } from "@/providers/user-provider";
import { useGoogleLogin } from "../hooks/useGoogleLogin";

function LoginCard() {
  // TODO
  const { mutate: login } = useLogin();
  const router = useRouter();
  const { user, refreshUser } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mutate: googleLogin } = useGoogleLogin();

  const handleGuestLogin = () => {
    login(
      { email: "m@m.com", password: "123456" },
      {
        onSuccess: (data) => {
          router.push("/dashboard");
        },
      }
    );
  };

  const handleGoogleLogin = () => {
    googleLogin(undefined, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  // const handleGoogleLogin = async () => {
  //   const provider = new GoogleAuthProvider();

  //   try {
  //     // Sign in with Google
  //     setIsLoading(true);
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;

  //     // Check if the user already exists in the Firestore database
  //     const userDocRef = doc(db, CollectionNames.Users, user.uid);
  //     const userDoc = await getDoc(userDocRef);

  //     // If the user doesn't exist, create a new record
  //     if (!userDoc.exists()) {
  //       const result = await setDoc(userDocRef, {
  //         uid: user.uid,
  //         firstName: user.displayName?.split(" ")[0] || "Unknown",
  //         lastName: user.displayName?.split(" ")[1] || "Unknown",
  //         email: user.email,
  //         role: Role.Manager, // Default role for Google users
  //       });
  //     }

  //     // Redirect to the dashboard after successful login
  //     setIsLoading(false);
  //     router.push("/dashboard");
  //   } catch (error) {
  //     console.error("Google login failed: ", error);
  //   }
  // };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log in</CardTitle>
        <CardDescription>Enter email and password to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <LoginForm />
        <div className="relative mt-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex gap-6 w-full justify-between">
          <Button type="submit" variant="outline" className="flex-1" onClick={handleGuestLogin}>
            <UserRound size={16} className="mr-2" />
            Guest Login
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleGoogleLogin} disabled={isLoading}>
            {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.google className="mr-2 h-4 w-4" />}
            Google
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default LoginCard;
