import { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { CollectionNames } from "@/types";

type UploadDocumentOptions = {
  entityUid: string;
  label: string;
  file: File;
  onSuccess?: () => void;
  onError?: () => void;
};

type useUploadDocumentOptions = {
  entityType: "users" | "vehicles";
};

export const useUploadDocument = ({ entityType }: useUploadDocumentOptions) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<Number>();
  const [error, setError] = useState<any>();

  const uploadDocument = ({ entityUid, label, file, onSuccess, onError }: UploadDocumentOptions) => {
    setUploading(true);
    const storageRef = ref(storage, `documents/${entityUid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressValue);
      },
      (error) => {
        console.error("Upload error:", error);
        setError(error);
        setUploading(false);
        onError && onError();
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, CollectionNames.Documents), {
            entityUid,
            label,
            fileName: file.name,
            fileSize: file.size,
            url: downloadURL,
            createdAt: serverTimestamp(),
          });
          onSuccess && onSuccess();
        } catch (urlError) {
          setError(urlError);
          onError && onError();
        } finally {
          setUploading(false);
        }
      }
    );
  };

  return { uploadDocument, uploading, progress, error };
};
