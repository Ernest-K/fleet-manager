import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/../firebase";
import { Driver } from "@/features/drivers/types";
import { CollectionNames } from "@/types";
import { Role } from "@/features/auth/types";

type GetDriversOptions = {
  managerUid: string;
};

export const getDrivers = async ({ managerUid }: GetDriversOptions): Promise<Driver[]> => {
  const driverQuery = query(collection(db, CollectionNames.Users), where("role", "==", Role.Driver), where("managerUid", "==", managerUid));
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
