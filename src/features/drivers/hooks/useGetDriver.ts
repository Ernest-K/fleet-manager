import { doc, getDoc } from "firebase/firestore";
import { db } from "@/../firebase";
import { useQuery } from "@tanstack/react-query";
import { Driver } from "@/features/drivers/types";
import { CollectionNames } from "@/types";

type GetDriverOptions = {
  driverUid: string;
};

const getDriver = async ({ driverUid }: GetDriverOptions) => {
  const docSnapshot = await getDoc(doc(db, CollectionNames.Users, driverUid));
  return docSnapshot.data() as Driver;
};

export const useGetDriver = ({ driverUid }: GetDriverOptions) => {
  return useQuery({
    queryFn: () => getDriver({ driverUid }),
    queryKey: ["drivers", driverUid],
    enabled: !!driverUid,
  });
};
