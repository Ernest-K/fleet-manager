import { useQuery } from "@tanstack/react-query";
import { Vehicle } from "@/features/vehicles/types";
import { getDocumentsByManagerUid } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseGetVehiclesOptions = {
  managerUid: string;
};

export const useGetVehicles = ({ managerUid }: UseGetVehiclesOptions) => {
  return useQuery({
    queryFn: () => getDocumentsByManagerUid<Vehicle>({ collectionName: CollectionNames.Vehicles, managerUid }),
    queryKey: [CollectionNames.Vehicles, managerUid],
    enabled: !!managerUid,
  });
};
