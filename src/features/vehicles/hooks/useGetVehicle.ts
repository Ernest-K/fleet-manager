import { doc, getDoc } from "firebase/firestore";
import { db } from "@/../firebase";
import { useQuery } from "@tanstack/react-query";
import { Vehicle } from "@/features/vehicles/types";

type GetVehicleOptions = {
  vehicleUid: string;
};

const getVehicle = async ({ vehicleUid }: GetVehicleOptions) => {
  const docSnapshot = await getDoc(doc(db, "vehicles", vehicleUid));
  return { uid: docSnapshot.id, ...docSnapshot.data() } as Vehicle;
};

export const useGetVehicle = ({ vehicleUid }: GetVehicleOptions) => {
  return useQuery({
    queryFn: () => getVehicle({ vehicleUid }),
    queryKey: ["vehicle", vehicleUid],
    enabled: !!vehicleUid,
  });
};
