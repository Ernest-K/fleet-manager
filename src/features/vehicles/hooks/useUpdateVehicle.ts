import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { VehicleFormData } from "@/features/vehicles/types";
import { UpdateDocOptions, updateDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UpdateVehicleOptions = {
  vehicleUid: UpdateDocOptions<VehicleFormData>["docUid"];
  vehicleData: UpdateDocOptions<VehicleFormData>["data"];
};

export const useUpdateVehicle = () => {
  return useMutation({
    mutationFn: ({ vehicleUid, vehicleData }: UpdateVehicleOptions) => updateDocument<VehicleFormData>({ collectionName: CollectionNames.Vehicles, docUid: vehicleUid, data: vehicleData }),
    onSuccess: (_, { vehicleUid }) => {
      queryClient.invalidateQueries({ queryKey: ["vehicle", vehicleUid] });
    },
  });
};
