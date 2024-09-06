import { doc, getDoc } from "firebase/firestore";
import { db } from "@/../firebase";
import { useQuery } from "@tanstack/react-query";
import { Driver } from "../types";

type GetDriverOptions = {
  driverUid: string;
};

const getDriver = async ({ driverUid }: GetDriverOptions) => {
  const docSnapshot = await getDoc(doc(db, "users", driverUid));
  return (await docSnapshot.data()) as Driver;
};

export const useGetDriver = ({ driverUid }: GetDriverOptions) => {
  return useQuery({
    queryFn: () => getDriver({ driverUid }),
    queryKey: ["driver", driverUid],
    enabled: !!driverUid,
  });
};
