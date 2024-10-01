import { useMutation } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { DeleteDocOptions, deleteDocument } from "@/lib/helpers";
import { CollectionNames } from "@/types";

type UseDeleteIssueOptions = {
  userUid: string;
};

export const useDeleteIssue = ({ userUid }: UseDeleteIssueOptions) => {
  return useMutation({
    mutationFn: (issueUid: DeleteDocOptions["docUid"]) => deleteDocument({ collectionName: CollectionNames.Issues, docUid: issueUid }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CollectionNames.Issues, userUid] });
    },
  });
};
