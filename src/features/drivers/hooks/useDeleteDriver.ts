import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { DeleteDocOptions, deleteDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseDeleteDriverOptions = {
  userUid: string;
};

export const useDeleteDriver = ({ userUid }: UseDeleteDriverOptions) => {
  return useMutation({
    mutationFn: (driverUid: DeleteDocOptions["docUid"]) => deleteDocument({ collectionName: CollectionNames.Users, docUid: driverUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers", userUid] });
    },
  });
};
