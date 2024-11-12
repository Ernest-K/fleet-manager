import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import EditEmailForm from "@/features/auth/components/edit-email-form";
import EditPasswordForm from "@/features/auth/components/edit-password-form";

function EditCredentialCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Update your credentials.</CardDescription>
      </CardHeader>
      <CardContent>
        <EditEmailForm />
        <EditPasswordForm />
      </CardContent>
    </Card>
  );
}

export default EditCredentialCard;
