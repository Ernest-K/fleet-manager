import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/../firebase";
import { Driver } from "../types";

type getDriversOptions = {
  managerUid: string;
};

const getDrivers = async ({ managerUid }: getDriversOptions) => {
  const driverQuery = query(collection(db, "users"), where("role", "==", "driver"), where("createdBy", "==", managerUid));
  const querySnapshot = await getDocs(driverQuery);
  return querySnapshot.docs.map((doc) => doc.data() as Driver);
};

export const useGetDrivers = ({ managerUid }: getDriversOptions) => {
  return useQuery({
    queryFn: () => getDrivers({ managerUid }),
    queryKey: ["drivers", managerUid],
    enabled: !!managerUid,
  });
};
