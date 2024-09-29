import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import queryClient from "@/lib/queryClient";
import { vehicleFormSchema } from "@/features/vehicles/types";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/../firebase";

type createVehicleOptions = {
  vehicleData: z.infer<typeof vehicleFormSchema>;
  managerUid: string;
};

async function createVehicle({ vehicleData, managerUid }: createVehicleOptions) {
  await addDoc(collection(db, "vehicles"), {
    ...vehicleData,
    createdBy: managerUid,
  });
}

type useCreateVehicleOptions = {
  managerUid: string;
};

export function useCreateVehicle({ managerUid }: useCreateVehicleOptions) {
  return useMutation({
    mutationFn: (vehicleData: createVehicleOptions["vehicleData"]) => createVehicle({ vehicleData, managerUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles", managerUid] });
    },
  });
}
