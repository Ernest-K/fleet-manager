import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import LoadingButton from "./loading-button";
import { db, storage } from "@/../firebase";

type ProfilePhotoUploaderProps = {
  uid: string;
  currentPhotoURL?: string;
  onUploadSuccess?: (downloadURL: string) => void;
  onUploadError?: (error: Error) => void;
};

const ProfilePhotoUploader = ({ uid, currentPhotoURL = "/default-profile-photo.jpg", onUploadSuccess, onUploadError }: ProfilePhotoUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const previewUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(previewUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const storageRef = ref(storage, `profile_photos/${uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: handle progress
      },
      (error) => {
        console.error("Upload error:", error);
        setUploading(false);
        if (onUploadError) onUploadError(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateDoc(doc(db, "users", uid), { photoURL: downloadURL });
          setUploading(false);
          setFile(null);

          if (onUploadSuccess) {
            onUploadSuccess(downloadURL);
          }
        } catch (error) {
          console.error("Error updating photo URL:", error);
          setUploading(false);
          if (onUploadError) onUploadError(error as Error);
        }
      }
    );
  };

  const getProfilePhotoURL = () => {
    return previewUrl || currentPhotoURL || "/default-profile-photo.jpg";
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-4">
      <Image src={getProfilePhotoURL()} alt="Profile Photo" width={200} height={200} className="rounded-full aspect-square object-cover self-center" />
      <Input id="picture" type="file" onChange={handleFileChange} accept="image/*" />
      <LoadingButton onClick={handleUpload} label="Upload Photo" loadingLabel="Uploading" isLoading={uploading} disabled={uploading || !file} />
    </div>
  );
};

export default ProfilePhotoUploader;
