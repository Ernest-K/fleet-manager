import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/../firebase";
import { useMutation } from "@tanstack/react-query";
import { deleteObject, ref } from "firebase/storage";
import queryClient from "@/lib/queryClient";

type deletePhotoOptions = {
  photoURL: string;
  vehicleUid: string;
};

const deletePhoto = async ({ photoURL, vehicleUid }: deletePhotoOptions) => {
  try {
    const photoRef = ref(storage, photoURL);
    await deleteObject(photoRef);

    const vehicleDocRef = doc(db, "vehicles", vehicleUid);
    await updateDoc(vehicleDocRef, {
      photosURL: arrayRemove(photoURL),
    });
  } catch (deleteError) {
    throw deleteError;
  }
};

type useDeletePhotoOptions = {
  vehicleUid: string;
};

export const useDeletePhoto = ({ vehicleUid }: useDeletePhotoOptions) => {
  return useMutation({
    mutationFn: (photoURL: deletePhotoOptions["photoURL"]) => deletePhoto({ photoURL, vehicleUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleUid] });
    },
  });
};
