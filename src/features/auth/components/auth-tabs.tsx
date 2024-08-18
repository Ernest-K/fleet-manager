import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginCard from "@/features/auth/components/login-card";
import RegisterCard from "@/features/auth/components/register-card";


function AuthTabs() {
  return (
    <Tabs defaultValue="signIn" className="basis-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signIn">Sign In</TabsTrigger>
        <TabsTrigger value="signUp">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signIn">
        <LoginCard />
      </TabsContent>
      <TabsContent value="signUp">
        <RegisterCard />
      </TabsContent>
    </Tabs>
  );
}

export default AuthTabs;
