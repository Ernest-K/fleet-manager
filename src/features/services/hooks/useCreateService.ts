import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { ServiceFormData } from "@/features/services/types";
import { CreateDocOptions, createDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseCreateServiceOptions = {
  userUid: string;
  managerUid: string;
};

export function useCreateService({ userUid, managerUid }: UseCreateServiceOptions) {
  return useMutation({
    mutationFn: (serviceData: CreateDocOptions<ServiceFormData>["data"]) => createDocument<ServiceFormData>({ collectionName: CollectionNames.Services, data: serviceData, managerUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CollectionNames.Services, userUid] });
    },
  });
}
