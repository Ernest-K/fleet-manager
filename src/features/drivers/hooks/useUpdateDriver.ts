import { Driver } from "@/features/drivers/types";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { UpdateDocOptions, updateDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UpdateDriverOptions = {
  driverUid: UpdateDocOptions<Driver>["docUid"];
  driverData: UpdateDocOptions<Driver>["data"];
};

export function useUpdateDriver() {
  return useMutation({
    mutationFn: ({ driverUid, driverData }: UpdateDriverOptions) => updateDocument<Driver>({ collectionName: CollectionNames.Users, docUid: driverUid, data: driverData }),
    onSuccess: (_, { driverUid }) => {
      queryClient.invalidateQueries({ queryKey: ["driver", driverUid] });
    },
  });
}
