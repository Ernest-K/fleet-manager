import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/../firebase";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";

type deleteVehicleOptions = {
  vehicleUid: string;
};

const deleteVehicle = async ({ vehicleUid }: deleteVehicleOptions) => {
  await deleteDoc(doc(db, "vehicles", vehicleUid));
};

type useDeleteVehicleOptions = {
  managerUid: string;
};

export const useDeleteVehicle = ({ managerUid }: useDeleteVehicleOptions) => {
  return useMutation({
    mutationFn: (vehicleUid: deleteVehicleOptions["vehicleUid"]) => deleteVehicle({ vehicleUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles", managerUid] });
    },
  });
};
