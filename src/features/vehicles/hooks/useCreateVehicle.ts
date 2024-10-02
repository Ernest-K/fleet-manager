import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { VehicleFormData } from "@/features/vehicles/types";
import { CreateDocOptions, createDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseCreateVehicleOptions = {
  managerUid: string;
};

export function useCreateVehicle({ managerUid }: UseCreateVehicleOptions) {
  return useMutation({
    mutationFn: (vehicleData: CreateDocOptions<VehicleFormData>["data"]) => createDocument<VehicleFormData>({ collectionName: CollectionNames.Vehicles, data: vehicleData, managerUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CollectionNames.Vehicles, managerUid] });
    },
  });
}
