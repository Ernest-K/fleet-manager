import { doc, updateDoc } from "firebase/firestore";
import { Driver } from "@/features/drivers/types";
import { db } from "@/../firebase";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";

type UpdateDriverOptions = {
  driverUid: string;
  data: Partial<Driver>;
};

const updateDriver = async ({ driverUid, data }: UpdateDriverOptions) => {
  const driverDocRef = doc(db, "users", driverUid);
  return await updateDoc(driverDocRef, data);
};

export const useUpdateDriver = () => {
  return useMutation({
    mutationFn: updateDriver,
    onSuccess: (_, { driverUid }) => {
      queryClient.invalidateQueries({ queryKey: ["driver", driverUid] });
    },
  });
};
