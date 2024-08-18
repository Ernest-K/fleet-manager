import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import LoginForm from '@/features/auth/components/login-form'
import { UserRound } from 'lucide-react';

function LoginCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
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
          <Button type="submit" variant="outline" className="flex-1">
            <UserRound size={16} className="mr-2" />
            Guest Login
          </Button>
          <Button variant="outline" className="flex-1">
            {/* <Icons.google className="mr-2 h-4 w-4" /> */}
            Google
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

export default LoginCard