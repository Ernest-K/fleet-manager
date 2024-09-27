import React from "react";
import { useUser } from "@/providers/user-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileForm from "@/components/profile-form";
import ProfilePhotoUploader from "@/components/profile-photo-uploader";

function EditProfileCard() {
  const { user, refreshUser } = useUser();

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your profile information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ProfilePhotoUploader uid={user.uid} currentPhotoURL={user.photoURL} onUploadSuccess={() => refreshUser()} />
        <ProfileForm />
      </CardContent>
    </Card>
  );
}

export default EditProfileCard;
