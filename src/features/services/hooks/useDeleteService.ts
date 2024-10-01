import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { DeleteDocOptions, deleteDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseDeleteServiceOptions = {
  userUid: string;
};

export const useDeleteService = ({ userUid }: UseDeleteServiceOptions) => {
  return useMutation({
    mutationFn: (serviceUid: DeleteDocOptions["docUid"]) => deleteDocument({ collectionName: CollectionNames.Services, docUid: serviceUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CollectionNames.Services, userUid] });
    },
  });
};
