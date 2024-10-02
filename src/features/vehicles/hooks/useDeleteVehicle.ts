import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { DeleteDocOptions, deleteDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseDeleteVehicleOptions = {
  managerUid: string;
};

export const useDeleteVehicle = ({ managerUid }: UseDeleteVehicleOptions) => {
  return useMutation({
    mutationFn: (vehicleUid: DeleteDocOptions["docUid"]) => deleteDocument({ collectionName: CollectionNames.Vehicles, docUid: vehicleUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CollectionNames.Vehicles, managerUid] });
    },
  });
};
