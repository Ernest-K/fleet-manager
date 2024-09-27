import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import EditEmailForm from "./edit-email-form";
import EditPasswordForm from "./edit-password-form";

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
