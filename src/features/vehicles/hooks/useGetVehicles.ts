import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/../firebase";
import { Vehicle } from "@/features/vehicles/types";

type GetVehiclesOptions = {
  managerUid: string;
};

export const getVehicles = async ({ managerUid }: GetVehiclesOptions) => {
  const vehiclesQuery = query(collection(db, "vehicles"), where("createdBy", "==", managerUid));
  const querySnapshot = await getDocs(vehiclesQuery);
  return querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as Vehicle));
};

type GetVehiclesByUidOptions = {
  vehicleUids: string[];
};

export const getVehiclesByUid = async ({ vehicleUids }: GetVehiclesByUidOptions): Promise<Vehicle[]> => {
  const vehiclesRef = collection(db, "vehicles");

  if (vehicleUids.length === 0) return [];

  const vehiclesQuery = query(vehiclesRef, where("__name__", "in", vehicleUids));
  const vehiclesSnapshot = await getDocs(vehiclesQuery);
  return vehiclesSnapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  })) as Vehicle[];
};

export const useGetVehicles = ({ managerUid }: GetVehiclesOptions) => {
  return useQuery({
    queryFn: () => getVehicles({ managerUid }),
    queryKey: ["vehicles", managerUid],
    enabled: !!managerUid,
  });
};
