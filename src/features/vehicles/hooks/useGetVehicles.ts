import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/../firebase";
import { Vehicle } from "@/features/vehicles/types";

type getVehiclesOptions = {
  managerUid: string;
};

const getVehicles = async ({ managerUid }: getVehiclesOptions) => {
  const vehiclesQuery = query(collection(db, "vehicles"), where("createdBy", "==", managerUid));
  const querySnapshot = await getDocs(vehiclesQuery);
  return querySnapshot.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as Vehicle));
};

export const useGetVehicles = ({ managerUid }: getVehiclesOptions) => {
  return useQuery({
    queryFn: () => getVehicles({ managerUid }),
    queryKey: ["vehicles", managerUid],
    enabled: !!managerUid,
  });
};
