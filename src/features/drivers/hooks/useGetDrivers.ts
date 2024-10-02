import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/../firebase";
import { Driver } from "../types";

type GetDriversOptions = {
  managerUid: string;
};

export const getDrivers = async ({ managerUid }: GetDriversOptions): Promise<Driver[]> => {
  const driverQuery = query(collection(db, "users"), where("role", "==", "driver"), where("managerUid", "==", managerUid));
  const querySnapshot = await getDocs(driverQuery);
  return querySnapshot.docs.map((doc) => doc.data() as Driver);
};

export const useGetDrivers = ({ managerUid }: GetDriversOptions) => {
  return useQuery({
    queryFn: () => getDrivers({ managerUid }),
    queryKey: ["drivers", managerUid],
    enabled: !!managerUid,
  });
};
