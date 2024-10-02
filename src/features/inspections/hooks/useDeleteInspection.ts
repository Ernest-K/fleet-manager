import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { DeleteDocOptions, deleteDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseDeleteInspectionOptions = {
  userUid: string;
};

export const useDeleteInspection = ({ userUid }: UseDeleteInspectionOptions) => {
  return useMutation({
    mutationFn: (inspectionUid: DeleteDocOptions["docUid"]) => deleteDocument({ collectionName: CollectionNames.Inspections, docUid: inspectionUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CollectionNames.Inspections, userUid] });
    },
  });
};
