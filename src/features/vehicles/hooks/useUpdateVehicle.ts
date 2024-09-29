import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/../firebase";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { vehicleFormSchema, Vehicle } from "@/features/vehicles/types";
import { z } from "zod";

type UpdateVehicleOptions = {
  vehicleUid: string;
  data: Partial<z.infer<typeof vehicleFormSchema>>;
};

const updateVehicle = async ({ vehicleUid, data }: UpdateVehicleOptions) => {
  const vehicleDocRef = doc(db, "vehicles", vehicleUid);
  return await updateDoc(vehicleDocRef, data);
};

export const useUpdateVehicle = () => {
  return useMutation({
    mutationFn: updateVehicle,
    onSuccess: (_, { vehicleUid }) => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleUid] });
    },
  });
};
