import React from "react";
import RegisterForm from "@/features/auth/components/register-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useGoogleLogin } from "@/features/auth/hooks/useGoogleLogin";
import { useRouter } from "next/router";

function RegisterCard() {
  const router = useRouter();
  const { mutate: googleLogin, isPending } = useGoogleLogin();

  const handleGoogleLogin = () => {
    googleLogin(undefined, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Enter name, email and password to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
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
        <Button variant="outline" className="flex-1" onClick={handleGoogleLogin} disabled={isPending}>
          {isPending ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.google className="mr-2 h-4 w-4" />}
          Google
        </Button>
      </CardFooter>
    </Card>
  );
}

export default RegisterCard;
