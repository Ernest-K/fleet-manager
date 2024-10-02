import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { DeleteDocOptions, deleteDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseDeleteAssignmentOptions = {
  managerUid: string;
};

export const useDeleteAssignment = ({ managerUid }: UseDeleteAssignmentOptions) => {
  return useMutation({
    mutationFn: (assignmentUid: DeleteDocOptions["docUid"]) => deleteDocument({ collectionName: CollectionNames.Assignments, docUid: assignmentUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CollectionNames.Assignments, managerUid] });
    },
  });
};
