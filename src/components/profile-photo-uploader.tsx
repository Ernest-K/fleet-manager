import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, storage } from "../../firebase";
import { useAuth } from "@/providers/auth-provider";
import { useUser } from "@/providers/user-provider";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import LoadingButton from "./loading-button";

const ProfilePhotoUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { authUser } = useAuth();
  const { user, refreshUser } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const previewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(previewUrl);
    }
  };

  const handleUpload = async () => {
    if (!file || !authUser) return;
    setUploading(true);

    const storageRef = ref(storage, `profile_photos/${authUser.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: handle progress
      },
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await updateDoc(doc(db, "users", authUser.uid), {
          photoURL: downloadURL,
        });
        await updateProfile(authUser, { photoURL: downloadURL });
        setUploading(false);
        refreshUser();
      }
    );
  };

  const getProfilePhotoURL = () => {
    let profilePhotoUrl: string = "/default-profile-photo.jpg";

    if (previewUrl) {
      profilePhotoUrl = previewUrl;
    } else if (user && user.photoURL) {
      profilePhotoUrl = user.photoURL;
    }

    return profilePhotoUrl;
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-6">
      <Image src={getProfilePhotoURL()} alt="Profile Photo" width={200} height={200} className="rounded-full aspect-square object-cover self-center" />
      <Input id="picture" type="file" onChange={handleFileChange} accept="image/*" />
      <LoadingButton onClick={handleUpload} label="Upload Photo" loadingLabel="Uploading" isLoading={uploading} disabled={uploading || !file} />
    </div>
  );
};

export default ProfilePhotoUploader;
