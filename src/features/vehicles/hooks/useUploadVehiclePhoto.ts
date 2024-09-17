import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/../firebase";
import { useState } from "react";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { Vehicle } from "@/features/vehicles/types";

type UploadVehiclePhotoOptions = {
  photos: FileList;
  onSuccess?: () => void;
  onError?: () => void;
};

type UseUploadPhotoOptions = {
  vehicleUid: Vehicle["uid"];
};

export const useUploadVehiclePhoto = ({ vehicleUid }: UseUploadPhotoOptions) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState<any>(null);

  const uploadImages = async ({ photos, onSuccess, onError }: UploadVehiclePhotoOptions) => {
    if (!photos.length) {
      setError("No files selected");
      return;
    }

    setUploading(true);
    setError(null);

    const uploadPromises = Array.from(photos).map(async (photo, index) => {
      const storageRef = ref(storage, `vehicle_photos/${vehicleUid}/${photo.name}`);
      const uploadTask = uploadBytesResumable(storageRef, photo);

      return new Promise<void>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress((prev) => ({
              ...prev,
              [index]: progress,
            }));
          },
          (uploadError) => {
            setError(uploadError.message);
            onError && onError();
            reject(uploadError);
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

              const vehicleDocRef = doc(db, "vehicles", vehicleUid);
              await updateDoc(vehicleDocRef, {
                photosURL: arrayUnion(downloadUrl),
              });
              onSuccess && onSuccess();
              resolve();
            } catch (urlError) {
              setError(urlError);
              onError && onError();
              reject(urlError);
            }
          }
        );
      });
    });

    try {
      await Promise.all(uploadPromises);
    } catch (err) {
      setError("Failed to upload some files");
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImages,
    uploading,
    uploadProgress,
    error,
  };
};
