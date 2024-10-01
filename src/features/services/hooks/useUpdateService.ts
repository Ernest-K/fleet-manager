import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { ServiceFormData } from "@/features/services/types";
import { UpdateDocOptions, updateDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseUpdateServiceOptions = {
  userUid: string;
};

type UpdateServiceOptions = {
  serviceUid: UpdateDocOptions<ServiceFormData>["docUid"];
  serviceData: UpdateDocOptions<ServiceFormData>["data"];
};

export function useUpdateService({ userUid }: UseUpdateServiceOptions) {
  return useMutation({
    mutationFn: ({ serviceUid, serviceData }: UpdateServiceOptions) => updateDocument<ServiceFormData>({ collectionName: CollectionNames.Services, docUid: serviceUid, data: serviceData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CollectionNames.Services, userUid] });
    },
  });
}
