import React from 'react'
import RegisterForm from '@/features/auth/components/register-form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';


function RegisterCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>Enter name, email and password to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm/>
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
        <Button variant="outline" className="w-full">
          {/* <Icons.google className="mr-2 h-4 w-4" /> */}
          Google
        </Button>
      </CardFooter>
    </Card>
  )
}

export default RegisterCard